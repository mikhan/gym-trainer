import { json } from '@sveltejs/kit'
import { website } from '$lib/config/website'
import type { RequestHandler } from './$types'

export const prerender = true

export const GET: RequestHandler = async () => {
  const { backgroundColor, description, siteShortTitle, siteTitle, themeColor, icons } = website

  const manifest = {
    id: '/',
    name: siteTitle,
    short_name: siteShortTitle,
    description,
    start_url: '/',
    display: 'standalone',
    theme_color: themeColor,
    background_color: backgroundColor,
    icons: icons.map((size) => ({
      src: `/images/icons/icon-${size}x${size}.png`,
      type: 'image/png',
      sizes: `${size}x${size}`,
    })),
  }

  return json(manifest)
}
