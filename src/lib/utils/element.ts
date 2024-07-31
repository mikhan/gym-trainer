export function getElement<T extends HTMLElement>(value: unknown): T | null {
  if (value instanceof HTMLElement) return value as T
  if (typeof value === 'string' && value) return document.getElementById(value) as T | null
  return null
}
