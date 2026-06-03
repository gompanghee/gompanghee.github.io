import { Client } from '@notionhq/client'
import { rootNotionPageId } from './site-config'
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

function plainPageTitle(page) {
  const key = titlePropKey(page?.properties)
  if (key) return rt(page.properties[key].title)
  return ''
}

// ---- low-level block fetching -------------------------------------------

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

async function fetchBlockTree(blockId, depth = 0) {
  const blocks = await listAllChildren(blockId)
  if (depth < 3) {
    for (const b of blocks) {
      // child_page / child_database are links, not content to expand here
      if (b.has_children && b.type !== 'child_page' && b.type !== 'child_database') {
        b.children = await fetchBlockTree(b.id, depth + 1)
      }
    }
  }
  return blocks
}

// ---- discovery via search ------------------------------------------------

async function findPostsDatabase() {
  const res = await notion.search({
    filter: { property: 'object', value: 'database' },
    page_size: 50
  })
  const dbs = res.results || []
  if (!dbs.length) return null

  const named = dbs.find((d) => /post|글|blog|블로그/i.test(rt(d.title)))
  if (named) return named

  // Fallback: a DB that has both a multi_select (category) and a number (order)
  const rich = dbs.find((d) => {
    const props = d.properties || {}
    const types = Object.values(props).map((p) => p.type)
    return types.includes('multi_select') && types.includes('number')
  })
  return rich || dbs[0]
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

export async function getPosts() {
  const db = await findPostsDatabase()
  if (!db) return []

  const props = db.properties || {}
  const titleKey = titlePropKey(props)
  const catKey = Object.keys(props).find((k) => props[k].type === 'multi_select')
  const numKey = Object.keys(props).find((k) => props[k].type === 'number')

  const sorts = numKey
    ? [{ property: numKey, direction: 'descending' }]
    : [{ timestamp: 'created_time', direction: 'descending' }]

  const rows = []
  let cursor
  do {
    const res = await notion.databases.query({
      database_id: db.id,
      sorts,
      page_size: 100,
      start_cursor: cursor
    })
    rows.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)

  const posts = rows.map((p) => {
    const pr = p.properties || {}
    return {
      id: p.id,
      title: (titleKey ? rt(pr[titleKey]?.title) : '').trim(),
      category: catKey ? (pr[catKey]?.multi_select || []).map((o) => o.name) : [],
      order: numKey ? (pr[numKey]?.number ?? null) : null,
      cover: coverUrl(p.cover),
      date: p.created_time
    }
  })

  // Match the Notion "All" view: real posts have the order number set.
  return posts.filter((p) => (numKey ? p.order != null : true) && p.title)
}

export async function getPage(pageId) {
  const page = await notion.pages.retrieve({ page_id: toDashId(pageId) })
  const blocks = await fetchBlockTree(pageId)
  const props = page.properties || {}
  const catKey = Object.keys(props).find((k) => props[k].type === 'multi_select')
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
