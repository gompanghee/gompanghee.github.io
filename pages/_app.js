// Core react-notion-x styles
import 'react-notion-x/src/styles.css'
// Code block syntax highlighting
import 'prismjs/themes/prism-tomorrow.css'
// Math / equations
import 'katex/dist/katex.min.css'
// Site overrides
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
