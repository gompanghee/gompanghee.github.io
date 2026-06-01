# gompanghee.com — Notion-powered personal site

An Oopy-style personal site for **Gwanghee Lee (이광희)**. It renders the Notion
**“Home”** page (and its subpages) as a real website using
[`react-notion-x`](https://github.com/NotionX/react-notion-x), deployed on
**Vercel** with the custom domain **gompanghee.com**.

Edit your content in Notion → the site updates automatically (ISR, ~30s).

## How it works

- `lib/site-config.js` — the root Notion page id and site metadata.
- `lib/notion.js` — unofficial Notion client (reads **publicly shared** pages, no token).
- `components/NotionPage.js` — `<NotionRenderer>` wrapper (code, collections, equations, modals).
- `pages/index.js` — renders the root Notion page at `/`.
- `pages/[pageId].js` — renders any subpage at `/<notion-page-id>` (generated on demand).

## Prerequisites

1. **Node.js 18+** installed locally (for `npm run dev`).
2. In Notion, open the **Home** page → **Share** → enable **“Publish to web”**
   (anyone with the link). All subpages must be reachable from it.

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to https://vercel.com → **Add New… → Project** → import this repo
   (sign in with GitHub). Framework auto-detects as **Next.js** — keep defaults
   and **Deploy**.
3. In the Vercel project → **Settings → Domains** → add `gompanghee.com`
   (and `www.gompanghee.com`).
4. Update DNS at your registrar as Vercel instructs:
   - Apex `gompanghee.com` → **A** record `76.76.21.21`
   - `www` → **CNAME** `cname.vercel-dns.com`

## Changing the source page

Edit `rootNotionPageId` in `lib/site-config.js`.

---

The previous static homepage is preserved at `legacy/static-homepage.html`.
The old 2021 Jekyll blog files remain in the repo history and are unused by this app.
