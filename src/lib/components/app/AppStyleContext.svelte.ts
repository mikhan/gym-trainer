type StyleGetter = (element: HTMLElement, entry: ResizeObserverEntry) => Record<string, string>

export class AppStylesContext {
  #entryHandlerMap = new Map<Element, StyleGetter>()
  #entryStylesMap = new Map<Element, Record<string, string>>()
  #resizeObserver: ResizeObserver | undefined
  #style = $state.raw<Record<string, string>>({})

  public readonly style = $derived(
    Object.entries(this.#style)
      .map(([property, value]) => `${property}:${value}`)
      .join(';'),
  )

  getStyleFrom(element: HTMLElement, getter: StyleGetter) {
    this.#entryHandlerMap.set(element, getter)
    this.#resizeObserver ??= new ResizeObserver((entries) => {
      for (const entry of entries) {
        const handler = this.#entryHandlerMap.get(entry.target)
        if (!handler) continue
        const style = handler(entry.target as HTMLElement, entry)
        this.#entryStylesMap.set(entry.target, style)
      }

      this.#update()
    })

    this.#resizeObserver.observe(element, { box: 'border-box' })

    return {
      destroy: () => {
        this.#entryHandlerMap.delete(element)
        this.#entryStylesMap.delete(element)
        this.#resizeObserver?.unobserve(element)
        this.#update()
      },
    }
  }

  #update() {
    this.#style = Object.fromEntries(
      Array.from(this.#entryStylesMap.values(), (style) => Object.entries(style)).flat(),
    )
  }
}
