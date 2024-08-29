<script lang="ts">
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import { clsx } from 'clsx'

  type IsButton = HTMLButtonAttributes
  type IsLink = HTMLAnchorAttributes & { is: 'a' }
  type Props = {
    children?: Snippet
    is?: 'button' | 'a'
    variant?: keyof typeof variants
  } & (IsButton | IsLink)

  let { children, is = 'button', variant, class: className, ...props }: Props = $props()

  const variants = {
    primary: 'color-primary',
  }
</script>

<svelte:element
  this={is}
  class={clsx('ui-button', variant && variants[variant], className)}
  type={is === 'button' ? 'button' : undefined}
  {...props}>
  {#if children}
    {@render children()}
  {/if}
</svelte:element>
