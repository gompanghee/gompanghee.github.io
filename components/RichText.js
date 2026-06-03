// Renders a Notion rich-text array into styled inline React nodes.

const COLOR = {
  gray: '#787774',
  brown: '#9f6b53',
  orange: '#d9730d',
  yellow: '#cb912f',
  green: '#448361',
  blue: '#337ea9',
  purple: '#9065b0',
  pink: '#c14c8a',
  red: '#d44c47'
}

function colorStyle(color) {
  if (!color || color === 'default') return undefined
  if (color.endsWith('_background')) {
    const base = color.replace('_background', '')
    const c = COLOR[base]
    return c ? { backgroundColor: c + '22', padding: '0.05em 0.25em', borderRadius: '3px' } : undefined
  }
  return COLOR[color] ? { color: COLOR[color] } : undefined
}

function decorate(text, a) {
  let node = text
  if (a.code) node = <code className="rt-code">{node}</code>
  if (a.bold) node = <strong>{node}</strong>
  if (a.italic) node = <em>{node}</em>
  if (a.strikethrough) node = <s>{node}</s>
  if (a.underline) node = <u>{node}</u>
  return node
}

export default function RichText({ value }) {
  if (!Array.isArray(value) || value.length === 0) return null
  return (
    <>
      {value.map((t, i) => {
        if (!t) return null
        const a = t.annotations || {}
        const node = decorate(t.plain_text, a)
        const style = colorStyle(a.color)
        if (t.href) {
          const external = /^https?:\/\//.test(t.href)
          return (
            <a
              key={i}
              href={t.href}
              className="rt-link"
              style={style}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {node}
            </a>
          )
        }
        return (
          <span key={i} style={style}>
            {node}
          </span>
        )
      })}
    </>
  )
}
