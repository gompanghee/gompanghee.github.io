import Head from 'next/head'
import { getAboutPage } from '../lib/notion-api'
import { siteName } from '../lib/site-config'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Article from '../components/Article'

export async function getStaticProps() {
  try {
    const page = await getAboutPage()
    if (!page) return { notFound: true, revalidate: 60 }
    return { props: { page }, revalidate: 60 }
  } catch (e) {
    return { notFound: true, revalidate: 30 }
  }
}

export default function AboutPage({ page }) {
  return (
    <>
      <Head>
        <title>{`About · ${siteName}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SiteHeader />
      <Article page={page} showMeta={false} />
      <SiteFooter />
    </>
  )
}
