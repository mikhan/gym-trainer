import plugin from 'tailwindcss/plugin'

export function pointerPlugin() {
  return plugin(function ({ addVariant }) {
    addVariant('pointer-fine', ['@media (pointer: fine)'])
    addVariant('pointer-coarse', ['@media (pointer: coarse)'])
  })
}
