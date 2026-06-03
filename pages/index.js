import Head from 'next/head'
import { getCategories } from '../lib/notion-api'
import {
  siteName,
  siteNameKo,
  siteTagline,
  siteTaglineEn,
  siteDescription
} from '../lib/site-config'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CategoryCard from '../components/CategoryCard'

export async function getStaticProps() {
  let categories = []
  let error = null
  try {
    categories = await getCategories()
  } catch (e) {
    error = String((e && e.message) || e)
  }
  return { props: { categories, error }, revalidate: 60 }
}

export default function Home({ categories, error }) {
  return (
    <>
      <Head>
        <title>{`${siteNameKo} · ${siteName}`}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <SiteHeader />

      <main className="container">
        <section className="hero">
          <h1 className="hero-title">
            {siteNameKo}
            <span className="hero-en">{siteName}</span>
          </h1>
          <p className="hero-tagline">{siteTagline}</p>
          <p className="hero-tagline-en">{siteTaglineEn}</p>
        </section>

        <section className="writing">
          <h2 className="section-label">Categories</h2>

          {error ? (
            <p className="notice">
              카테고리를 불러오지 못했어요.
              <br />
              <span className="notice-detail">{error}</span>
            </p>
          ) : categories.length === 0 ? (
            <p className="notice">아직 카테고리가 없습니다.</p>
          ) : (
            <div className="ccard-grid">
              {categories.map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
