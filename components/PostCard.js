import Link from 'next/link'
import { formatDate, idNoDash } from '../lib/util'

export default function PostCard({ post }) {
  return (
    <li className="post-item">
      <Link href={`/p/${idNoDash(post.id)}`} className="post-link">
        {post.cover ? (
          <div className="post-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt="" loading="lazy" />
          </div>
        ) : (
          <div className="post-thumb post-thumb-empty" aria-hidden="true" />
        )}
        <div className="post-text">
          {post.category?.length ? (
            <span className="post-cat">{post.category.join(' · ')}</span>
          ) : null}
          <h3 className="post-title">{post.title}</h3>
          <time className="post-date">{formatDate(post.date)}</time>
        </div>
      </Link>
    </li>
  )
}
