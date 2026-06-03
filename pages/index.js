import Head from 'next/head'
import { getHomeData } from '../lib/notion-api'
import {
  siteName,
  siteNameKo,
  siteTagline,
  siteTaglineEn,
  siteDescription
} from '../lib/site-config'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CategorySection from '../components/CategorySection'

export async function getStaticProps() {
  let categories = []
  let error = null
  try {
    categories = await getHomeData()
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
          <h2 className="section-label">Writing</h2>

          {error ? (
            <p className="notice">
              글 목록을 불러오지 못했어요.
              <br />
              <span className="notice-detail">{error}</span>
            </p>
          ) : categories.length === 0 ? (
            <p className="notice">아직 카테고리가 없습니다.</p>
          ) : (
            categories.map((c) => <CategorySection key={c.id} category={c} />)
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
