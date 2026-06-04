import Link from 'next/link'
import RichText from './RichText'
import { idNoDash, notionImage } from '../lib/util'

// ---- individual block ----------------------------------------------------

function Block({ block }) {
  const { type } = block
  const data = block[type] || {}

  switch (type) {
    case 'paragraph': {
      if (!data.rich_text?.length) return <p className="nx-p nx-empty" />
      return (
        <p className="nx-p">
          <RichText value={data.rich_text} />
        </p>
      )
    }
    case 'heading_1':
      return (
        <h2 className="nx-h nx-h1">
          <RichText value={data.rich_text} />
        </h2>
      )
    case 'heading_2':
      return (
        <h3 className="nx-h nx-h2">
          <RichText value={data.rich_text} />
        </h3>
      )
    case 'heading_3':
      return (
        <h4 className="nx-h nx-h3">
          <RichText value={data.rich_text} />
        </h4>
      )
    case 'quote':
      return (
        <blockquote className="nx-quote">
          <RichText value={data.rich_text} />
          {block.children ? <Blocks blocks={block.children} /> : null}
        </blockquote>
      )
    case 'callout':
      return (
        <div className="nx-callout">
          {data.icon?.emoji ? <span className="nx-callout-ico">{data.icon.emoji}</span> : null}
          <div className="nx-callout-body">
            <RichText value={data.rich_text} />
            {block.children ? <Blocks blocks={block.children} /> : null}
          </div>
        </div>
      )
    case 'code':
      return (
        <pre className="nx-code" data-lang={data.language || ''}>
          <code>{rtPlain(data.rich_text)}</code>
        </pre>
      )
    case 'divider':
      return <hr className="nx-hr" />
    case 'image': {
      const raw =
        data.type === 'external' ? data.external?.url : data.file?.url
      if (!raw) return null
      const url = notionImage(raw, block.id, 1400)
      const caption = rtPlain(data.caption)
      return (
        <figure className="nx-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={caption || ''} loading="lazy" decoding="async" />
          {caption ? <figcaption>{caption}</figcaption> : null}
        </figure>
      )
    }
    case 'video':
    case 'embed':
    case 'file':
    case 'pdf': {
      const url = data.external?.url || data.file?.url || data.url
      if (!url) return null
      return (
        <p className="nx-p">
          <a className="rt-link" href={url} target="_blank" rel="noopener noreferrer">
            {rtPlain(data.caption) || url}
          </a>
        </p>
      )
    }
    case 'bookmark': {
      const url = data.url
      if (!url) return null
      return (
        <a className="nx-bookmark" href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      )
    }
    case 'to_do':
      return (
        <div className="nx-todo">
          <input type="checkbox" checked={!!data.checked} readOnly />
          <span className={data.checked ? 'nx-todo-done' : ''}>
            <RichText value={data.rich_text} />
          </span>
        </div>
      )
    case 'toggle':
      return (
        <details className="nx-toggle">
          <summary>
            <RichText value={data.rich_text} />
          </summary>
          {block.children ? <Blocks blocks={block.children} /> : null}
        </details>
      )
    case 'column_list':
      return (
        <div className="nx-columns">
          {(block.children || []).map((col) => (
            <div className="nx-column" key={col.id}>
              <Blocks blocks={col.children || []} />
            </div>
          ))}
        </div>
      )
    case 'column':
      return <Blocks blocks={block.children || []} />
    case 'table':
      return (
        <div className="nx-table-wrap">
          <table className="nx-table">
            <tbody>
              {(block.children || []).map((row) => (
                <tr key={row.id}>
                  {(row.table_row?.cells || []).map((cell, ci) => (
                    <td key={ci}>
                      <RichText value={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'child_page':
      return (
        <Link className="nx-pagelink" href={`/p/${idNoDash(block.id)}`}>
          {block.child_page?.title || 'Untitled'}
        </Link>
      )
    case 'child_database':
      return null // listed separately on the home page
    case 'equation':
      return <p className="nx-p nx-equation">{data.expression}</p>
    default:
      return null
  }
}

function rtPlain(arr) {
  if (!Array.isArray(arr)) return ''
  return arr.map((t) => (t && t.plain_text) || '').join('')
}

// ---- block list (groups consecutive list items) -------------------------

function Blocks({ blocks }) {
  if (!Array.isArray(blocks)) return null
  const out = []
  let i = 0
  while (i < blocks.length) {
    const b = blocks[i]
    const t = b.type
    if (t === 'bulleted_list_item' || t === 'numbered_list_item') {
      const items = []
      while (i < blocks.length && blocks[i].type === t) {
        items.push(blocks[i])
        i++
      }
      const lis = items.map((it) => (
        <li key={it.id}>
          <RichText value={it[it.type]?.rich_text} />
          {it.children ? <Blocks blocks={it.children} /> : null}
        </li>
      ))
      out.push(
        t === 'bulleted_list_item' ? (
          <ul className="nx-ul" key={b.id}>
            {lis}
          </ul>
        ) : (
          <ol className="nx-ol" key={b.id}>
            {lis}
          </ol>
        )
      )
      continue
    }
    out.push(<Block key={b.id} block={b} />)
    i++
  }
  return <>{out}</>
}

export default function NotionBlocks({ blocks }) {
  return <Blocks blocks={blocks} />
}
