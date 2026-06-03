import Link from 'next/link'
import { idNoDash } from '../lib/util'

export default function CategoryCard({ category }) {
  return (
    <Link href={`/c/${idNoDash(category.id)}`} className="ccard">
      <div className={`ccard-cover${category.cover ? '' : ' ccard-cover-empty'}`}>
        {category.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.cover} alt="" loading="lazy" />
        ) : null}
      </div>
      <div className="ccard-foot">
        <span className="ccard-title">{category.title}</span>
        <span className="ccard-arrow">→</span>
      </div>
    </Link>
  )
}
