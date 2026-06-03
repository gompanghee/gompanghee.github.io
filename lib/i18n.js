import { createContext, useContext, useEffect, useState } from 'react'

// UI strings. Notion content (post titles, bodies, categories) is shown as
// authored — only the site chrome switches language.
const STRINGS = {
  en: {
    navWriting: 'Writing',
    navAbout: 'About',
    tagline: 'Ph.D. candidate researching Artificial Intelligence',
    sectionCategories: 'Categories',
    backCategories: '← Categories',
    backList: '← Back',
    postsCount: (n) => `${n} ${n === 1 ? 'post' : 'posts'}`,
    emptyPosts: 'No posts yet.',
    noCategories: 'No categories yet.',
    loadError: 'Failed to load content.',
    toggleLabel: '한국어'
  },
  ko: {
    navWriting: '글',
    navAbout: '소개',
    tagline: '인공지능을 연구하는 박사과정',
    sectionCategories: '카테고리',
    backCategories: '← 카테고리',
    backList: '← 목록으로',
    postsCount: (n) => `${n}개의 글`,
    emptyPosts: '아직 발행된 글이 없습니다.',
    noCategories: '아직 카테고리가 없습니다.',
    loadError: '콘텐츠를 불러오지 못했습니다.',
    toggleLabel: 'EN'
  }
}

const LangContext = createContext({ lang: 'en', toggle: () => {}, t: STRINGS.en })

export function LangProvider({ children }) {
  // English is the default; a returning visitor's choice is restored on mount.
  const [lang, setLang] = useState('en')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang')
      if (saved === 'ko' || saved === 'en') setLang(saved)
    } catch (e) {}
  }, [])

  function toggle() {
    setLang((prev) => {
      const next = prev === 'en' ? 'ko' : 'en'
      try {
        localStorage.setItem('lang', next)
      } catch (e) {}
      return next
    })
  }

  return (
    <LangContext.Provider value={{ lang, toggle, t: STRINGS[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
