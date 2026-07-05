import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {
  SHARE_IMAGE_FILE,
  SHARE_IMAGE_REVISION,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from './src/config/social.ts'

function buildShareImageVersion(): string {
  try {
    const gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
    return `${SHARE_IMAGE_REVISION}-${gitHash}`
  } catch {
    return `${SHARE_IMAGE_REVISION}-${Date.now()}`
  }
}

function shareImageUrl(): string {
  const version = buildShareImageVersion()
  return `${SITE_URL}/${SHARE_IMAGE_FILE}?v=${version}`
}

function injectSocialMeta(html: string): string {
  const imageUrl = shareImageUrl()
  const tags = `
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="investrategy" />
    <meta property="og:url" content="${SITE_URL}/" />
    <meta property="og:title" content="${SITE_TITLE}" />
    <meta property="og:description" content="${SITE_DESCRIPTION}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:alt" content="investrategy — Strategies for Growth" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${SITE_TITLE}" />
    <meta name="twitter:description" content="${SITE_DESCRIPTION}" />
    <meta name="twitter:image" content="${imageUrl}" />`

  return html.replace('</head>', `${tags}\n  </head>`)
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    {
      name: 'inject-social-meta',
      transformIndexHtml: injectSocialMeta,
    },
  ],
  base: mode === 'production' ? '/investrategy/' : '/',
}))
