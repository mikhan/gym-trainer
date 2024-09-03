<script lang="ts">
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import { clsx } from 'clsx'

  type IsButton = HTMLButtonAttributes
  type IsLink = HTMLAnchorAttributes & { is: 'a' }
  type Props = {
    children?: Snippet
    is?: 'button' | 'a'
    size?: keyof typeof sizeClasses
    variant?: keyof typeof variantClasses
  } & (IsButton | IsLink)

  let { children, is = 'button', variant, size, class: className, ...props }: Props = $props()

  const sizeClasses = {
    xs: 'ui-button-xs',
    sm: 'ui-button-sm',
    lg: 'ui-button-lg',
  }

  const variantClasses = {
    outlined: 'ui-button-outlined',
  }
</script>

<svelte:element
  this={is}
  class={clsx(
    'ui-button',
    size && sizeClasses[size],
    variant && variantClasses[variant],
    className,
  )}
  type={is === 'button' ? 'button' : undefined}
  {...props}>
  {#if children}
    {@render children()}
  {/if}
</svelte:element>
