<script lang="ts">
  import { clsx } from 'clsx'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type Props = {
    children?: Snippet
    label: string
    size?: keyof typeof sizeClasses
    outlined?: boolean
    filled?: boolean
  } & HTMLButtonAttributes

  let { children, label, class: className, size, outlined, filled, ...props }: Props = $props()

  const sizeClasses = {
    xs: 'ui-button-xs',
    sm: 'ui-button-sm',
    lg: 'ui-button-lg',
  }
</script>

<button
  class={clsx(
    'ui-button ui-button-circle',
    size && sizeClasses[size],
    outlined && 'ui-button-outlined',
    filled && 'ui-button-filled',
    className,
  )}
  {...props}
  aria-label={label}
  title={label}>
  {#if children}
    {@render children()}
  {/if}
</button>
