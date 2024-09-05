import type { Action } from 'svelte/action'

type LongclickAttributes = {
  onlongpress?: (event: CustomEvent) => void
}

export const longpress: Action<HTMLElement, number, LongclickAttributes> = (
  element,
  duration: number,
) => {
  let isLongpress = false
  let timeout: number | null = null
  let controller: AbortController | undefined

  element.addEventListener('pointerdown', onPointerdown)
  element.addEventListener('click', onClick)

  return {
    destroy() {
      if (timeout !== null) clearTimeout(timeout)
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

    controller = new AbortController()
    element.addEventListener('pointerup', onPointerup, { signal: controller.signal })
    element.addEventListener('pointercancel', onPointerup, { signal: controller.signal })
    element.addEventListener('contextmenu', onContextmenu, { signal: controller.signal })
    document.addEventListener('mouseup', onPointerup, { signal: controller.signal })
  }

  function onClick(event: MouseEvent) {
    if (isLongpress) {
      event.stopImmediatePropagation()
      event.preventDefault()
    }
  }

  function onPointerup() {
    if (timeout) clearTimeout(timeout)
    timeout = null
    controller?.abort()
  }

  function onContextmenu(event: MouseEvent) {
    event.preventDefault()
    return false
  }
}
