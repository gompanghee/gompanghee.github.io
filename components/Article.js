import Link from 'next/link'
import NotionBlocks from './NotionBlocks'
import { formatDate } from '../lib/util'

export default function Article({ page, showMeta = true }) {
  return (
    <main className="container article">
      <Link href="/" className="back-link">
        ← 목록으로
      </Link>

      {showMeta && page.category?.length ? (
        <div className="article-cat">{page.category.join(' · ')}</div>
      ) : null}

      <h1 className="article-title">
        {page.icon ? <span className="article-icon">{page.icon}</span> : null}
        {page.title}
      </h1>

      {showMeta && page.date ? (
        <time className="article-date">{formatDate(page.date)}</time>
      ) : null}

      {page.cover ? (
        <div className="article-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={page.cover} alt="" />
        </div>
      ) : null}

      <article className="article-body">
        <NotionBlocks blocks={page.blocks} />
      </article>
    </main>
  )
}
