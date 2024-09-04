import type { Action } from 'svelte/action'

type LongclickAttributes = {
  onlongpress?: (event: CustomEvent) => void
}

export const longpress: Action<HTMLElement, number, LongclickAttributes> = (element, duration) => {
  let isLongpress = false
  let timeout: number | null = null

  element.addEventListener('pointerdown', onPointerdown)
  element.addEventListener('click', onClick)

  return {
    destroy() {
      if (timeout !== null) clearTimeout(timeout)
      document.removeEventListener('pointerup', onDocumentPointerup)
    },
  }

  function onPointerdown() {
    isLongpress = false
    if (timeout) clearTimeout(timeout)

    timeout = window.setTimeout(() => {
      timeout = null
      isLongpress = true

      const longpressEvent = new CustomEvent('longpress')
      element.dispatchEvent(longpressEvent)
    }, duration)

    document.addEventListener('pointerup', onDocumentPointerup, { once: true })
  }

  function onClick(event: MouseEvent) {
    if (isLongpress) {
      event.stopImmediatePropagation()
      event.preventDefault()
    }
  }

  function onDocumentPointerup() {
    if (timeout) clearTimeout(timeout)
    timeout = null
  }
}
