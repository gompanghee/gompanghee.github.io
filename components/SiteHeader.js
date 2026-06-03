import { useState } from 'react'
import Link from 'next/link'
import { siteBrand, social } from '../lib/site-config'
import { useLang } from '../lib/i18n'

export default function SiteHeader() {
  const { toggle, t } = useLang()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="site-brand" onClick={close}>
          {siteBrand}
          <span className="site-brand-dot">.</span>
        </Link>

        <button
          type="button"
          className={`nav-toggle${open ? ' is-open' : ''}`}
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav${open ? ' open' : ''}`}>
          <Link href="/" onClick={close}>
            {t.navWriting}
          </Link>
          <Link href="/about" onClick={close}>
            {t.navAbout}
          </Link>
          <a href={social.github} target="_blank" rel="noopener noreferrer" onClick={close}>
            GitHub
          </a>
          <a href={social.scholar} target="_blank" rel="noopener noreferrer" onClick={close}>
            Scholar
          </a>
          <button type="button" className="lang-toggle" onClick={toggle}>
            {t.toggleLabel}
          </button>
        </nav>
      </div>
    </header>
  )
}
