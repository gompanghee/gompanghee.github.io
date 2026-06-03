import { Client } from '@notionhq/client'
import { toDashId } from './util'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

// ---- helpers -------------------------------------------------------------

export function rt(richText) {
  if (!Array.isArray(richText)) return ''
  return richText.map((t) => (t && t.plain_text) || '').join('')
}

function coverUrl(cover) {
  if (!cover) return null
  if (cover.type === 'external') return cover.external?.url || null
  if (cover.type === 'file') return cover.file?.url || null
  return null
}

function titlePropKey(props) {
  if (!props) return null
  return Object.keys(props).find((k) => props[k]?.type === 'title') || null
}

function typeKey(props, type) {
  if (!props) return null
  return Object.keys(props).find((k) => props[k]?.type === type) || null
}

function plainPageTitle(page) {
  const key = titlePropKey(page?.properties)
  return key ? rt(page.properties[key].title) : ''
}

// ---- low-level -----------------------------------------------------------

async function listAllChildren(blockId) {
  const blocks = []
  let cursor
  do {
    const res = await notion.blocks.children.list({
      block_id: toDashId(blockId),
      start_cursor: cursor,
      page_size: 100
    })
    blocks.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return blocks
}

async function queryAll(databaseId, sorts) {
  const rows = []
  let cursor
  do {
    const res = await notion.databases.query({
      database_id: toDashId(databaseId),
      page_size: 100,
      start_cursor: cursor,
      ...(sorts ? { sorts } : {})
    })
    rows.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return rows
}

async function fetchBlockTree(blockId, depth = 0) {
  const blocks = await listAllChildren(blockId)
  if (depth < 3) {
    for (const b of blocks) {
      if (b.has_children && b.type !== 'child_page' && b.type !== 'child_database') {
        b.children = await fetchBlockTree(b.id, depth + 1)
      }
    }
  }
  return blocks
}

// ---- discovery -----------------------------------------------------------

// The top-level "Posts" database whose rows are the categories.
async function findCategoriesDatabase() {
  const res = await notion.search({
    filter: { property: 'object', value: 'database' },
    page_size: 50
  })
  const dbs = res.results || []
  return (
    dbs.find((d) => /^\s*posts\s*$/i.test(rt(d.title))) ||
    dbs.find((d) => /post/i.test(rt(d.title))) ||
    null
  )
}

async function findAboutPageId() {
  const res = await notion.search({
    filter: { property: 'object', value: 'page' },
    page_size: 50
  })
  const pages = res.results || []
  const about = pages.find((p) => /intro|소개|about/i.test(plainPageTitle(p)))
  return about?.id || null
}

// ---- public API ----------------------------------------------------------

export async function getCategories() {
  const db = await findCategoriesDatabase()
  if (!db) return []

  const rows = await queryAll(db.id)
  const sample = rows[0]?.properties || db.properties || {}
  const titleKey = titlePropKey(sample) || titlePropKey(db.properties)
  const numKey = typeKey(sample, 'number') || typeKey(db.properties, 'number')

  let cats = rows.map((p) => {
    const pr = p.properties || {}
    return {
      id: p.id,
      title: (titleKey ? rt(pr[titleKey]?.title) : '').trim(),
      order: numKey ? (pr[numKey]?.number ?? null) : null,
      cover: coverUrl(p.cover)
    }
  })
  cats = cats.filter((c) => c.title)
  // Preserve the order shown in Notion (높은 순서가 먼저).
  cats.sort((a, b) => (b.order ?? -1e9) - (a.order ?? -1e9))
  return cats
}

// Real posts live in an inline database inside each category page.
async function getCategoryPosts(categoryPageId) {
  const children = await listAllChildren(categoryPageId)
  const dbBlock = children.find((b) => b.type === 'child_database')
  if (!dbBlock) return []

  const rows = await queryAll(dbBlock.id)
  if (!rows.length) return []

  const sample = rows[0].properties || {}
  const titleKey = titlePropKey(sample)
  const pubKey = typeKey(sample, 'checkbox') // 공개
  const numKey = typeKey(sample, 'number') // 순서

  let posts = rows.map((p) => {
    const pr = p.properties || {}
    return {
      id: p.id,
      title: (titleKey ? rt(pr[titleKey]?.title) : '').trim(),
      published: pubKey ? !!pr[pubKey]?.checkbox : true,
      order: numKey ? (pr[numKey]?.number ?? null) : null,
      cover: coverUrl(p.cover),
      date: p.created_time
    }
  })

  posts = posts.filter((p) => p.title && p.published)
  posts.sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9))
  return posts
}

export async function getHomeData() {
  const categories = await getCategories()
  const result = []
  for (const c of categories) {
    let posts = []
    try {
      posts = await getCategoryPosts(c.id)
    } catch (e) {
      posts = []
    }
    result.push({ ...c, posts })
  }
  return result
}

export async function getPage(pageId) {
  const page = await notion.pages.retrieve({ page_id: toDashId(pageId) })
  const blocks = await fetchBlockTree(pageId)
  const props = page.properties || {}
  const catKey = typeKey(props, 'multi_select')
  return {
    id: pageId,
    title: plainPageTitle(page) || 'Untitled',
    category: catKey ? (props[catKey]?.multi_select || []).map((o) => o.name) : [],
    cover: coverUrl(page.cover),
    icon: page.icon?.type === 'emoji' ? page.icon.emoji : null,
    date: page.created_time,
    blocks
  }
}

export async function getAboutPage() {
  const id = await findAboutPageId()
  if (!id) return null
  return getPage(id)
}
