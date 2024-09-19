<script lang="ts">
  import { clsx } from 'clsx'
  import { onMount, type Snippet } from 'svelte'
  import type { HTMLMenuAttributes } from 'svelte/elements'
  import { anchor } from '$lib/actions/anchor.action'
  import { getElement } from '$lib/utils/element'
  import { UiMenuContext } from './UiMenuContext.svelte'

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

<ul
  role="menu"
  class={clsx('ui-menu', className)}
  id={context.id}
  popover="auto"
  use:anchor={target}
  {...props}>
  {@render children()}
</ul>

<style lang="postcss">
  :global {
    .ui-menu {
      @apply w-max border bg-opacity-75 scrollbar color-popover surface;
      @apply fixed rounded-card p-1 shadow-over backdrop-blur;
      min-width: anchor-size(inline);
      position-visibility: anchors-visible;
      inset: auto;
      left: anchor(left);
      top: anchor(bottom);
      margin: theme('spacing.1') 0;
      position-try:
        most-width --flip-block,
        --flip-inline,
        --flip-block-inline;

      &:popover-open {
        @apply grid grid-cols-[min-content,auto];
      }
    }

    @position-try --flip-block {
      margin: 0 theme('spacing.1');
      top: auto;
      bottom: anchor(top);
    }

    @position-try --flip-inline {
      left: auto;
      right: anchor(right);
    }

    @position-try --flip-block-inline {
      margin: 0 theme('spacing.1');
      top: auto;
      bottom: anchor(top);
      left: auto;
      right: anchor(right);
    }
  }
</style>
