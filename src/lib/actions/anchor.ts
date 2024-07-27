import type { Action } from 'svelte/action'

function getAnchorName(element: HTMLElement) {
  return (
    element
      .computedStyleMap()
      .get('anchor-name')
      ?.toString()
      .split(',')
      .map((e) => e.trim())[0] ?? 'none'
  )
}

function isIdentifier(string: string) {
  return /^--[a-z0-9-]+$/.test(string)
}

function link(element: HTMLElement, target: string | HTMLElement) {
  const anchorElement = typeof target === 'string' ? document.getElementById(target) : target
  let anchorName = 'none'

  if (anchorElement) {
    anchorName = getAnchorName(anchorElement)

    if (!isIdentifier(anchorName)) {
      anchorName = `--${crypto.randomUUID()}`
      anchorElement.style.setProperty('anchor-name', anchorName)
    }
  }

  if (isIdentifier(anchorName)) {
    element.style.setProperty('position-anchor', anchorName)
  } else {
    element.style.removeProperty('position-anchor')
  }
}

export const anchor: Action<HTMLElement, string | HTMLElement> = (element, target) => {
  link(element, target)

  return {
    update(target) {
      link(element, target)
    },
  }
}
