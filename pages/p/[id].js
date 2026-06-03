import Head from 'next/head'
import { getPage } from '../../lib/notion-api'
import { siteName } from '../../lib/site-config'
import SiteHeader from '../../components/SiteHeader'
import SiteFooter from '../../components/SiteFooter'
import Article from '../../components/Article'

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  try {
    const page = await getPage(params.id)
    if (!page || !page.blocks) return { notFound: true, revalidate: 30 }
    return { props: { page }, revalidate: 60 }
  } catch (e) {
    return { notFound: true, revalidate: 30 }
  }
}

export default function PostPage({ page }) {
  return (
    <>
      <Head>
        <title>{`${page.title} · ${siteName}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SiteHeader />
      <Article page={page} />
      <SiteFooter />
    </>
  )
}
