import Head from 'next/head'
import Link from 'next/link'
import { getCategory } from '../../lib/notion-api'
import { siteName } from '../../lib/site-config'
import SiteHeader from '../../components/SiteHeader'
import SiteFooter from '../../components/SiteFooter'
import PostGridCard from '../../components/PostGridCard'
import { useLang } from '../../lib/i18n'

// Categories with many posts fetch a thumbnail per post; give ISR room.
export const config = { maxDuration: 60 }

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  try {
    const category = await getCategory(params.id)
    if (!category) return { notFound: true, revalidate: 30 }
    return { props: { category }, revalidate: 60 }
  } catch (e) {
    return { notFound: true, revalidate: 30 }
  }
}

export default function CategoryPage({ category }) {
  const { t } = useLang()
  const count = category.posts?.length || 0
  return (
    <>
      <Head>
        <title>{`${category.title} · ${siteName}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SiteHeader />

      <main className="container category-page">
        <Link href="/" className="back-link">
          {t.backCategories}
        </Link>

        <div className="category-head">
          {category.cover ? (
            <div className="category-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={category.cover} alt="" />
            </div>
          ) : null}
          <h1 className="category-title">{category.title}</h1>
          <span className="category-count">{t.postsCount(count)}</span>
        </div>

        {count > 0 ? (
          <ul className="post-grid">
            {category.posts.map((p) => (
              <PostGridCard key={p.id} post={p} />
            ))}
          </ul>
        ) : (
          <p className="cat-empty">{t.emptyPosts}</p>
        )}
      </main>

      <SiteFooter />
    </>
  )
}
