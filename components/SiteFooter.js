import { siteName, social } from '../lib/site-config'

export default function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span>
          © {year} {siteName} · 이광희
        </span>
        <span className="site-footer-links">
          <a href={`mailto:${social.email}`}>Email</a>
          <a href={social.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={social.kakao} target="_blank" rel="noopener noreferrer">
            Kakao
          </a>
        </span>
      </div>
    </footer>
  )
}
