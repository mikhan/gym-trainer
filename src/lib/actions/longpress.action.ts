import type { Action } from 'svelte/action'

type LongclickAttributes = {
  onlongpress?: (event: CustomEvent) => void
}

export const longpress: Action<HTMLElement, number, LongclickAttributes> = (element, duration) => {
  let isLongpress = false
  let timeout: number | null = null

  element.addEventListener('mousedown', onMousedown)
  element.addEventListener('click', onClick)

  return {
    destroy() {
      if (timeout !== null) clearTimeout(timeout)
      document.removeEventListener('mouseup', onDocumentMouseup)
    },
  }

  function onMousedown() {
    isLongpress = false
    if (timeout) clearTimeout(timeout)

    timeout = window.setTimeout(() => {
      timeout = null
      isLongpress = true

      const longpressEvent = new CustomEvent('longpress')
      element.dispatchEvent(longpressEvent)
    }, duration)

    document.addEventListener('mouseup', onDocumentMouseup, { once: true })
  }

  function onClick(event: MouseEvent) {
    if (isLongpress) {
      event.stopImmediatePropagation()
      event.preventDefault()
    }
  }

  function onDocumentMouseup() {
    if (timeout) clearTimeout(timeout)
    timeout = null
  }
}
