<script lang="ts">
  import { clsx } from 'clsx'
  import { onMount, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { anchor } from '$lib/actions/anchor.action'
  import { popover } from '$lib/actions/popover'
  import { getElement } from '$lib/utils/element'
  import { UiMenuContext } from './UiMenuContext.svelte'

  type Props = {
    target: string | HTMLElement
    children: Snippet
  } & HTMLAttributes<HTMLDivElement>

  let { target, children, class: className, ...props }: Props = $props()
  const context = UiMenuContext.create()

  onMount(() => {
    const anchorElement = getElement(target)
    if (!anchorElement) return
    anchorElement.setAttribute('popovertarget', context.id)

    return () => anchorElement.removeAttribute('popovertarget')
  })
</script>

<div
  class={clsx('ui-popup', className)}
  id={context.id}
  popover="auto"
  use:popover
  use:anchor={target}
  {...props}>
  {@render children()}
</div>
