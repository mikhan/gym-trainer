import { type Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

function futureFlagEnabled(config: Config, flag: string): boolean {
  return config.future === 'all' || (config.future?.[flag as keyof typeof config.future] ?? false)
}

function addModifierIfNeeded(modifier: string | null, prefix: string): string {
  return modifier ? `${prefix}\\/${modifier}` : prefix
}

export function hocusPlugin() {
  return plugin(({ addVariant, matchVariant, config }) => {
    const hoverOnlyWhenSupported = futureFlagEnabled(config(), 'hoverOnlyWhenSupported')
    const wrapSelectorForHoverIfNeeded = (selector: string) =>
      hoverOnlyWhenSupported
        ? `@media (hover: hover) and (pointer: fine) { ${selector} }`
        : selector

    const hoverSelector = wrapSelectorForHoverIfNeeded('&:hover')

    addVariant('hocus', [hoverSelector, '&:focus'])
    addVariant('hocus-within', [hoverSelector, '&:focus-within'])
    addVariant('hocus-visible', [hoverSelector, '&:focus-visible'])

    if (matchVariant) {
      const variantFocusSelectors = {
        'hocus': 'focus',
        'hocus-within': 'focus-within',
        'hocus-visible': 'focus-visible',
      }

      const variantsEndParts = {
        group: ' &',
        peer: ' ~ &',
      }

      for (const [name, selectorEnd] of Object.entries(variantsEndParts)) {
        matchVariant(
          name,
          (value, { modifier }) => {
            const hoverSelector = wrapSelectorForHoverIfNeeded(
              `:merge(.${addModifierIfNeeded(modifier, name)}):hover${selectorEnd}`,
            )
            const focusSelector = `:merge(.${addModifierIfNeeded(
              modifier,
              name,
            )}):${value}${selectorEnd}`

            return [hoverSelector, focusSelector]
          },
          { values: variantFocusSelectors },
        )
      }

      return
    }

    const groupHoverSelector = wrapSelectorForHoverIfNeeded(':merge(.group):hover &')
    const peerHoverSelector = wrapSelectorForHoverIfNeeded(':merge(.peer):hover ~ &')

    addVariant('group-hocus', [groupHoverSelector, ':merge(.group):focus &'])
    addVariant('group-hocus-within', [groupHoverSelector, ':merge(.group):focus-within &'])
    addVariant('group-hocus-visible', [groupHoverSelector, ':merge(.group):focus-visible &'])
    addVariant('peer-hocus', [peerHoverSelector, ':merge(.peer):focus ~ &'])
    addVariant('peer-hocus-within', [peerHoverSelector, ':merge(.peer):focus-within ~ &'])
    addVariant('peer-hocus-visible', [peerHoverSelector, ':merge(.peer):focus-visible ~ &'])
  })
}
