import type { Action } from 'svelte/action'

type Handler = (element: HTMLElement, entry: ResizeObserverEntry) => Record<string, string>

export function createStyler() {
  const entryHandlerMap = new Map<Element, Handler>()
  const entryStylesMap = new Map<Element, Record<string, string>>()

  let containerElement: HTMLElement | null = null
  let resizeObserver: ResizeObserver

  function onResize(entries: ResizeObserverEntry[]) {
    for (const entry of entries) {
      const handler = entryHandlerMap.get(entry.target)

      if (!handler) continue

      const style = handler(entry.target as HTMLElement, entry)
      entryStylesMap.set(entry.target, style)
    }

    update()
  }

  function update() {
    if (!containerElement) return

    containerElement.removeAttribute('style')

    for (const style of entryStylesMap.values()) {
      for (const [name, value] of Object.entries(style)) {
        containerElement.style.setProperty(name, value)
      }
    }
  }

  const setStyle: Action<HTMLElement> = (element) => {
    containerElement = element
    update()

    return {
      destroy() {
        containerElement = null
      },
    }
  }

  const getStyle: Action<HTMLElement, Handler> = (element, handler) => {
    entryHandlerMap.set(element, handler)

    resizeObserver ??= new ResizeObserver(onResize)
    resizeObserver.observe(element, { box: 'border-box' })

    return {
      destroy() {
        entryHandlerMap.delete(element)
        entryStylesMap.delete(element)
        resizeObserver.unobserve(element)
        update()
      },
    }
  }

  return { setStyle, getStyle }
}
