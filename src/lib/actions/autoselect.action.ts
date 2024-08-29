import type { Action } from 'svelte/action'

export const autoselect: Action<HTMLInputElement> = (element) => {
  element.addEventListener('focus', onFocus)

  function onFocus() {
    element.select()
  }

  return {
    destroy() {
      element.removeEventListener('focus', onFocus)
    },
  }
}
