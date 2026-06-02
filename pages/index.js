import Head from 'next/head'
import { getNotionPage } from '../lib/notion'
import { rootNotionPageId, siteName, siteDescription } from '../lib/site-config'
import NotionPage from '../components/NotionPage'

export async function getStaticProps() {
  try {
    const recordMap = await getNotionPage(rootNotionPageId)
    const blockCount = recordMap && recordMap.block ? Object.keys(recordMap.block).length : 0
    const debug = `fetched ${blockCount} blocks for id=${rootNotionPageId}`
    return { props: { recordMap, debug }, revalidate: 30 }
  } catch (err) {
    const msg = (err && err.message) ? err.message : String(err)
    console.error('Failed to fetch Notion root page:', err)
    return { props: { recordMap: null, debug: `error: ${msg} (id=${rootNotionPageId})` }, revalidate: 10 }
  }
}

export default function Home({ recordMap, debug }) {
  return (
    <>
      <Head>
        <title>{siteName}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <NotionPage recordMap={recordMap} debug={debug} />
    </>
  )
}
