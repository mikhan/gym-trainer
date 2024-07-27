<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { anchor } from '$lib/actions/anchor'
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
  class={clsx(
    'fixed rounded-card border border-popover-border bg-popover/60 p-1 text-popover-fg shadow-over backdrop-blur-lg',
    'ui-menu',
    className,
  )}
  id={context.id}
  popover="auto"
  use:anchor={target}
  {...props}>
  {@render children()}
</menu>

<style lang="postcss">
  .ui-menu {
    position-visibility: anchors-visible;
    position-try-options:
      flip-block,
      flip-inline,
      flip-block flip-inline;
    inset-area: bottom span-right;
    min-width: anchor-size(inline);
    transform: translateY(1rem);

    &:popover-open {
      transform: translateY(0);

      @starting-style {
        transform: translateY(1rem);
      }
    }
  }
</style>
