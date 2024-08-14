import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Actions, PageServerLoad } from './$types'

const regexp = /^ *(?<name>--[a-z0-9-]+) *: *(?<value>[^;]+);/gim

const modules = import.meta.glob<{ default: string }>('$lib/styles/themes/*.css', { query: '?raw' })
const themes = Object.entries(modules).map(([path, module]) => ({
  name: path.match(/[-a-z]+(?=\.css$)/)?.[0] ?? '',
  path: join(process.cwd(), path),
  module,
}))

export const load = (async ({ url }) => {
  const themeName = url.searchParams.get('name') ?? 'dark'
  const theme = themeName && themes.find((theme) => theme.name === themeName)
  if (!theme) throw new Error('No theme found.')

  const themeContent = (await theme.module()).default
  const name = theme.name
  const tokens = Object.fromEntries(
    Array.from(themeContent.matchAll(regexp), (match) => [
      match.groups?.['name'],
      match.groups?.['value'],
    ]),
  ) as Record<string, string>

  return { theme: { name, tokens } }
}) satisfies PageServerLoad

export const actions = {
  default: async ({ request, url }) => {
    const themeName = url.searchParams.get('name') ?? 'dark'
    const theme = themeName && themes.find((theme) => theme.name === themeName)
    if (!theme) throw new Error('No theme found.')

    const themeContent = (await theme.module()).default
    const data = await request.formData()

    const content = themeContent.replaceAll(regexp, (text, varName, value) => {
      const newValue = data.get(varName)
      return typeof newValue === 'string' ? text.replace(value, newValue) : text
    })
    console.log(theme.path)

    await writeFile(theme.path, content)
  },
} satisfies Actions
