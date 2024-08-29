<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { anchor } from '$lib/actions/anchor.action'
  import { UiMenuContext } from './ui-menu-context.svelte'
  import { clsx } from 'clsx'
  import type { HTMLMenuAttributes } from 'svelte/elements'
  import { getElement } from '$lib/utils/element'

  type Props = {
    target: string | HTMLElement
    children: Snippet
  } & HTMLMenuAttributes

  let { target, children, class: className, ...props }: Props = $props()
  const context = UiMenuContext.create()

  onMount(() => {
    const anchorElement = getElement(target)
    if (!anchorElement) return
    anchorElement.setAttribute('popovertarget', context.id)

    return () => anchorElement.removeAttribute('popovertarget')
  })
</script>

<menu
  class={clsx('ui-menu', className)}
  id={context.id}
  popover="auto"
  use:anchor={target}
  {...props}>
  {@render children()}
</menu>

<style lang="postcss">
  :global {
    .ui-menu {
      @apply w-max border bg-opacity-85 scrollbar color-popover surface;
      @apply fixed rounded-card p-1 shadow-over backdrop-blur;
      min-width: anchor-size(inline);
      position-visibility: anchors-visible;
      /* inset-area: bottom span-right;
      position-try-options:
        flip-block,
        flip-inline,
        flip-block flip-inline; */
      left: anchor(left);
      top: anchor(bottom);
      position-try:
        most-width --flip-block,
        --flip-inline,
        --flip-block-inline;

      &:popover-open {
        @apply grid grid-cols-[auto,auto];
      }
    }

    @position-try --flip-block {
      top: auto;
      bottom: anchor(top);
    }

    @position-try --flip-inline {
      left: auto;
      right: anchor(right);
    }

    @position-try --flip-block-inline {
      top: auto;
      bottom: anchor(top);
      left: auto;
      right: anchor(right);
    }
  }
</style>
