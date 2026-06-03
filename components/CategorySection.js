import PostGridCard from './PostGridCard'

export default function CategorySection({ category }) {
  const count = category.posts?.length || 0
  return (
    <section className="cat-section">
      <div className="cat-header">
        {category.cover ? (
          <div className="cat-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={category.cover} alt="" loading="lazy" />
          </div>
        ) : null}
        <div className="cat-headtext">
          <h3 className="cat-title">{category.title}</h3>
          <span className="cat-count">{count}개의 글</span>
        </div>
      </div>

      {count > 0 ? (
        <ul className="post-grid">
          {category.posts.map((p) => (
            <PostGridCard key={p.id} post={p} />
          ))}
        </ul>
      ) : (
        <p className="cat-empty">아직 발행된 글이 없습니다.</p>
      )}
    </section>
  )
}
