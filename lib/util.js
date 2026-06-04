export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

export function idNoDash(id) {
  return (id || '').replace(/-/g, '')
}

// Route Notion-hosted images through Notion's resizing/CDN proxy at a target
// width, so we don't download multi-megabyte originals. Mirrors how Notion's
// own published sites serve images (also avoids expiring S3 signature issues).
export function notionImage(url, blockId, width) {
  if (!url) return url
  if (url.includes('notion.so/image/')) {
    const base = url.split('#')[0]
    if (/[?&]width=/.test(base)) return base
    return base + (base.includes('?') ? '&' : '?') + 'width=' + width
  }
  if (
    blockId &&
    (url.includes('amazonaws.com') || url.includes('secure.notion-static.com'))
  ) {
    const base = url.split('?')[0]
    return `https://www.notion.so/image/${encodeURIComponent(base)}?table=block&id=${blockId}&cache=v2&width=${width}`
  }
  return url
}

export function toDashId(id) {
  const s = idNoDash(id)
  if (s.length !== 32) return id
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`
}
