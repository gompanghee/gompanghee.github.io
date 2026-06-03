import { siteName, siteNameKo, social } from '../lib/site-config'
import { useLang } from '../lib/i18n'

export default function SiteFooter() {
  const { lang } = useLang()
  const year = new Date().getFullYear()
  const name = lang === 'ko' ? siteNameKo : siteName
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span>
          © {year} {name}
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
