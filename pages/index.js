import Head from 'next/head'
import { getNotionPage } from '../lib/notion'
import { rootNotionPageId, siteName, siteDescription } from '../lib/site-config'
import NotionPage from '../components/NotionPage'

export async function getStaticProps() {
  try {
    const recordMap = await getNotionPage(rootNotionPageId)
    return { props: { recordMap }, revalidate: 30 }
  } catch (err) {
    console.error('Failed to fetch Notion root page:', err)
    return { props: { recordMap: null }, revalidate: 10 }
  }
}

export default function Home({ recordMap }) {
  return (
    <>
      <Head>
        <title>{siteName}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <NotionPage recordMap={recordMap} />
    </>
  )
}
