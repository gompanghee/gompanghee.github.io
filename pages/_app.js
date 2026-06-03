import '../styles/globals.css'
import { LangProvider } from '../lib/i18n'

export default function App({ Component, pageProps }) {
  return (
    <LangProvider>
      <div className="site-bg" aria-hidden="true" />
      <Component {...pageProps} />
    </LangProvider>
  )
}
