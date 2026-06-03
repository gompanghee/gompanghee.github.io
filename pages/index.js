import Head from 'next/head'
import { getCategories } from '../lib/notion-api'
import {
  siteName,
  siteNameKo,
  siteTagline,
  siteTaglineEn,
  siteDescription
} from '../lib/site-config'
import { useLang } from '../lib/i18n'
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
  const { lang, t } = useLang()
  const name = lang === 'ko' ? siteNameKo : siteName

  return (
    <>
      <Head>
        <title>{`${name}`}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <SiteHeader />

      <main className="container">
        <section className="hero">
          <h1 className="hero-title">{name}</h1>
          <p className="hero-tagline">{lang === 'ko' ? siteTagline : siteTaglineEn}</p>
        </section>

        <section className="writing">
          <h2 className="section-label">{t.sectionCategories}</h2>

          {error ? (
            <p className="notice">
              {t.loadError}
              <br />
              <span className="notice-detail">{error}</span>
            </p>
          ) : categories.length === 0 ? (
            <p className="notice">{t.noCategories}</p>
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
