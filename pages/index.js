import Head from 'next/head'
import { getPosts } from '../lib/notion-api'
import {
  siteName,
  siteNameKo,
  siteTagline,
  siteTaglineEn,
  siteDescription
} from '../lib/site-config'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import PostCard from '../components/PostCard'

export async function getStaticProps() {
  let posts = []
  let error = null
  try {
    posts = await getPosts()
  } catch (e) {
    error = String((e && e.message) || e)
  }
  return { props: { posts, error }, revalidate: 60 }
}

export default function Home({ posts, error }) {
  return (
    <>
      <Head>
        <title>{`${siteNameKo} · ${siteName}`}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <SiteHeader />

      <main className="container">
        <section className="hero">
          <h1 className="hero-title">
            {siteNameKo}
            <span className="hero-en">{siteName}</span>
          </h1>
          <p className="hero-tagline">{siteTagline}</p>
          <p className="hero-tagline-en">{siteTaglineEn}</p>
        </section>

        <section className="writing">
          <h2 className="section-label">Writing</h2>

          {error ? (
            <p className="notice">
              글 목록을 불러오지 못했어요. (NOTION_TOKEN 설정 및 페이지 공유를 확인해
              주세요.)
              <br />
              <span className="notice-detail">{error}</span>
            </p>
          ) : posts.length === 0 ? (
            <p className="notice">아직 발행된 글이 없습니다.</p>
          ) : (
            <ul className="post-list">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </ul>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
