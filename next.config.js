/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Notion serves page/cover/file images from these hosts.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.notion.so' },
      { protocol: 'https', hostname: 'notion.so' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  }
}

module.exports = nextConfig
