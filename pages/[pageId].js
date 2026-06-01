import Head from 'next/head'
import { getNotionPage } from '../lib/notion'
import { siteName } from '../lib/site-config'
import NotionPage from '../components/NotionPage'

export async function getStaticPaths() {
  // Subpages are generated on first request and then cached.
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps(context) {
  const { pageId } = context.params
  try {
    const recordMap = await getNotionPage(pageId)
    return { props: { recordMap }, revalidate: 30 }
  } catch (err) {
    console.error('Failed to fetch Notion page:', pageId, err)
    return { notFound: true, revalidate: 10 }
  }
}

export default function NotionSubPage({ recordMap }) {
  return (
    <>
      <Head>
        <title>{siteName}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <NotionPage recordMap={recordMap} />
    </>
  )
}
