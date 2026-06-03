import Link from 'next/link'
import { siteBrand, social } from '../lib/site-config'
import { useLang } from '../lib/i18n'

export default function SiteHeader() {
  const { toggle, t } = useLang()
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="site-brand">
          {siteBrand}
          <span className="site-brand-dot">.</span>
        </Link>
        <nav className="site-nav">
          <Link href="/">{t.navWriting}</Link>
          <Link href="/about">{t.navAbout}</Link>
          <a href={social.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={social.scholar} target="_blank" rel="noopener noreferrer">
            Scholar
          </a>
          <button
            type="button"
            className="lang-toggle"
            onClick={toggle}
            aria-label="Toggle language"
          >
            {t.toggleLabel}
          </button>
        </nav>
      </div>
    </header>
  )
}
