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
    'rounded-card border border-popover-line bg-popover/60 px-4 py-1 text-sm text-popover-fg shadow-over backdrop-blur-lg',
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
    position: fixed;
    position-visibility: anchors-visible;
    position-try:
      flip-block,
      flip-inline,
      flip-block flip-inline;
    transition-delay: 0s;

    &[data-align='block-start'] {
      inset-area: block-start;
      margin-block-end: 8px;
    }

    &[data-align='block-end'] {
      inset-area: block-end;
      margin-block-start: 8px;
    }

    &[data-align='inline-start'] {
      inset-area: inline-start;
      margin-inline-end: 8px;
    }

    &[data-align='inline-end'] {
      inset-area: inline-end;
      margin-inline-start: 8px;
    }

    &:popover-open {
      transition-delay: 500ms;
    }
  }
</style>
