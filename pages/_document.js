import { Html, Head, Main, NextScript } from 'next/document'
import { bgColor, siteName, siteDescription, siteDomain } from '../lib/site-config'

const SITE_URL = `https://www.${siteDomain}`
const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export default function Document() {
  return (
    <Html lang="ko" style={{ '--bg': bgColor }}>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {/* Link preview / share card (Open Graph + Twitter) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={siteName} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="800" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteName} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={OG_IMAGE} />
        {/* Pretendard — clean, highly readable Korean/Latin web font */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nanum+Gothic+Coding:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
