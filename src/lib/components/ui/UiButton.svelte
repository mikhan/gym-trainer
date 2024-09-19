<script lang="ts">
  import { clsx } from 'clsx'
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'

  type IsButton = HTMLButtonAttributes
  type IsLink = HTMLAnchorAttributes & { is: 'a' }
  type Props = {
    children?: Snippet
    is?: 'button' | 'a'
    size?: keyof typeof sizeClasses
    outlined?: boolean
    filled?: boolean
  } & (IsButton | IsLink)

  let {
    children,
    is = 'button',
    size,
    class: className,
    outlined,
    filled,
    ...props
  }: Props = $props()

  const sizeClasses = {
    xs: 'ui-button-xs',
    sm: 'ui-button-sm',
    lg: 'ui-button-lg',
  }
</script>

<svelte:element
  this={is}
  class={clsx(
    'ui-button',
    size && sizeClasses[size],
    outlined && 'ui-button-outlined',
    filled && 'ui-button-filled',
    className,
  )}
  type={is === 'button' ? 'button' : undefined}
  {...props}>
  {#if children}
    {@render children()}
  {/if}
</svelte:element>
