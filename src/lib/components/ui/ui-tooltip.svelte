<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { anchor } from '$lib/actions/anchor'
  import { clsx } from 'clsx'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getElement } from '$lib/utils/element'

  type Props = {
    target: string | HTMLElement
    children: Snippet
  } & HTMLAttributes<HTMLElement>

  let { target, children, class: className }: Props = $props()
  const id = crypto.randomUUID()

  function show() {
    document.getElementById(id)?.showPopover()
  }

  function hide() {
    document.getElementById(id)?.hidePopover()
  }

  onMount(() => {
    const anchorElement = getElement(target)

    if (!anchorElement) return

    const controller = new AbortController()
    anchorElement.addEventListener('mouseover', show, { signal: controller.signal })
    anchorElement.addEventListener('mouseout', hide, { signal: controller.signal })
    anchorElement.addEventListener('mousedown', hide, { signal: controller.signal })

    return () => controller.abort()
  })
</script>

<div
  class={clsx(
    'fixed rounded-card border border-popover-border bg-popover/60 px-4 py-1 text-sm text-popover-fg shadow-over backdrop-blur-lg',
    'ui-tooltip',
    className,
  )}
  {id}
  popover="manual"
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
    inset-area: bottom;
    transition-delay: 0s;

    &:popover-open {
      transition-delay: 500ms;
    }
  }
</style>
