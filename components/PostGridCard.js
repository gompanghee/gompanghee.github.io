import Link from 'next/link'
import { formatDate, idNoDash } from '../lib/util'

export default function PostGridCard({ post }) {
  return (
    <li className="pcard">
      <Link href={`/p/${idNoDash(post.id)}`} className="pcard-link">
        <div className={`pcard-cover${post.cover ? '' : ' pcard-cover-empty'}`}>
          {post.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover} alt="" loading="lazy" />
          ) : null}
        </div>
        <h4 className="pcard-title">{post.title}</h4>
        <time className="pcard-date">{formatDate(post.date)}</time>
      </Link>
    </li>
  )
}
