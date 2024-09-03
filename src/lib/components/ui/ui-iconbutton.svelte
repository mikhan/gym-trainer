<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import { clsx } from 'clsx'

  type Props = {
    children?: Snippet
    label: string
    size?: keyof typeof sizeClasses
    variant?: keyof typeof variants
  } & HTMLButtonAttributes

  let { children, label, class: className, size, variant, ...props }: Props = $props()

  const sizeClasses = {
    xs: 'ui-button-xs',
    sm: 'ui-button-sm',
    lg: 'ui-button-lg',
  }

  const variants = {
    outlined: 'ui-button-outlined',
  }
</script>

<button
  class={clsx(
    'ui-button ui-button-circle',
    size && sizeClasses[size],
    variant && variants[variant],
    className,
  )}
  {...props}
  aria-label={label}
  title={label}>
  {#if children}
    {@render children()}
  {/if}
</button>
