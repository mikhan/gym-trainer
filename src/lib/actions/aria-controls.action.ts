import type { Action } from 'svelte/action'

export const ariaControls: Action<HTMLElement, string> = (element, id) => {
  let expanded = false

  element.setAttribute('aria-controls', id)

  if (element.hasAttribute('aria-expanded')) {
    expanded = element.getAttribute('aria-expanded') === 'true'
  } else {
    element.setAttribute('aria-expanded', 'false')
  }

  function onclick() {
    expanded = !expanded
    element.setAttribute('aria-expanded', String(expanded))
  }

  element.addEventListener('click', onclick)

  return {
    destroy() {
      element.removeEventListener('click', onclick)
    },
  }
}
