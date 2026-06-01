import dynamic from 'next/dynamic'
import { NotionRenderer } from 'react-notion-x'
import { rootNotionPageId } from '../lib/site-config'

// Heavy / optional renderers are loaded only when a page actually uses them.
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection)
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  { ssr: false }
)

const rootId = rootNotionPageId.replace(/-/g, '')

// Map Notion page ids to clean internal routes so links stay on this site.
function mapPageUrl(pageId) {
  const id = (pageId || '').replace(/-/g, '')
  if (id === rootId) return '/'
  return `/${id}`
}

export default function NotionPage({ recordMap }) {
  if (!recordMap) {
    return (
      <div style={{ padding: 48, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>잠시만요…</h1>
        <p>
          Notion 페이지를 불러오지 못했습니다. Notion에서 해당 페이지가
          “웹에 게시(Share to web)” 되어 있는지 확인해 주세요.
        </p>
      </div>
    )
  }

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={true}
      darkMode={false}
      rootPageId={rootNotionPageId}
      mapPageUrl={mapPageUrl}
      components={{ Code, Collection, Equation, Modal }}
    />
  )
}
