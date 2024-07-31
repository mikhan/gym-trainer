<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { anchor } from '$lib/actions/anchor'
  import { clsx } from 'clsx'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getElement } from '$lib/utils/element'

  type Props = {
    children: Snippet
    target: string | HTMLElement
    align?: 'block-start' | 'block-end' | 'inline-start' | 'inline-end'
  } & HTMLAttributes<HTMLElement>

  let { children, target, align = 'block-end', class: className }: Props = $props()
  let anchorElement: HTMLElement | null
  let element = $state() as HTMLElement

  export function show() {
    const anchorPopover = getElement(anchorElement?.getAttribute('popovertarget'))
    if (anchorPopover && anchorPopover.matches(':popover-open')) return
    element.showPopover()
  }

  export function hide() {
    element.hidePopover()
  }

  onMount(() => {
    anchorElement = getElement(target)

    if (!anchorElement) return

    const controller = new AbortController()
    anchorElement.addEventListener('mouseover', show, { signal: controller.signal })
    anchorElement.addEventListener('mouseout', hide, { signal: controller.signal })
    anchorElement.addEventListener('mousedown', hide, { signal: controller.signal })

    const anchorPopover = getElement(anchorElement?.getAttribute('popovertarget'))
    if (anchorPopover) {
      anchorPopover.addEventListener('beforetoggle', hide, { signal: controller.signal })
    }

    return () => controller.abort()
  })
</script>

<div
  class={clsx(
    'fixed rounded-card border border-popover-border bg-popover/60 px-4 py-1 text-sm text-popover-fg shadow-over backdrop-blur-lg',
    'ui-tooltip',
    className,
  )}
  data-align={align}
  popover="manual"
  bind:this={element}
  use:anchor={target}>
  {@render children()}
</div>

<style lang="postcss">
  .ui-tooltip {
    position-visibility: anchors-visible;
    position-try-options:
      flip-block,
      flip-inline,
      flip-block flip-inline;
    inset-area: block-end;
    transition-delay: 0s;
    margin: 8px;

    &[data-align='block-start'] {
      inset-area: block-start;
    }

    &[data-align='block-end'] {
      inset-area: block-end;
    }

    &[data-align='inline-start'] {
      inset-area: inline-start;
    }

    &[data-align='inline-end'] {
      inset-area: inline-end;
    }

    &:popover-open {
      transition-delay: 500ms;
    }
  }
</style>
