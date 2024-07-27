export function getElement<T extends HTMLElement>(value: T | string): T | null {
  if (value instanceof HTMLElement) return value

  return document.getElementById(value) as T | null
}
