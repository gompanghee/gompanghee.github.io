import Link from 'next/link'
import { siteNameKo, social } from '../lib/site-config'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="site-brand">
          {siteNameKo}<span className="site-brand-dot">.</span>
        </Link>
        <nav className="site-nav">
          <Link href="/">Writing</Link>
          <Link href="/about">About</Link>
          <a href={social.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
