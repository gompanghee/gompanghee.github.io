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

const rootId = (rootNotionPageId || '').replace(/-/g, '')

// Map Notion page ids to clean internal routes so links stay on this site.
function mapPageUrl(pageId) {
  const id = (pageId || '').replace(/-/g, '')
  if (id === rootId) return '/'
  return `/${id}`
}

export default function NotionPage({ recordMap, debug }) {
  // An unpublished page returns an empty recordMap (no exception). Rendering it
  // would make react-notion-x dereference an undefined block id and crash the
  // build, so bail out to a friendly message instead.
  const hasContent =
    recordMap &&
    recordMap.block &&
    Object.keys(recordMap.block).length > 0

  if (!hasContent) {
    return (
      <div style={{ padding: 48, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>잠시만요…</h1>
        <p>
          Notion 페이지를 불러오지 못했습니다. Notion에서 해당 페이지를
          <strong> “웹에 게시(Publish to web)” </strong>로 공개했는지 확인해 주세요.
        </p>
        {debug ? (
          <pre
            style={{
              marginTop: 24,
              padding: 12,
              background: '#f3f3f3',
              color: '#444',
              fontSize: 12,
              borderRadius: 8,
              display: 'inline-block',
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}
          >
            {debug}
          </pre>
        ) : null}
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
