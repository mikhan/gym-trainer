import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import themeContent from '$lib/styles/theme.css?raw'
import type { Actions, PageServerLoad } from './$types'

const regexp = /^ *(?<name>--[a-z0-9-]+) *: *(?<value>[^;]+);/gim
const themePath = join(process.cwd(), '/src/lib/styles/theme.css')

export const load = (async () => {
  const values: Record<string, string> = Object.fromEntries(
    Array.from(themeContent.matchAll(regexp), (match) => [
      match.groups?.['name'],
      match.groups?.['value'],
    ]),
  )

  return { values }
}) satisfies PageServerLoad

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData()

    const content = themeContent.replaceAll(regexp, (text, varName, value) => {
      const newValue = data.get(varName)
      return typeof newValue === 'string' ? text.replace(value, newValue) : text
    })

    await writeFile(themePath, content)
  },
} satisfies Actions
