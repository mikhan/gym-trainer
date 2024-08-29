<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import { clsx } from 'clsx'

  type Props = {
    children?: Snippet
    label: string
  } & HTMLAnchorAttributes

  let { children, label, class: className, ...props }: Props = $props()
</script>

<a
  class={clsx('ui-button ui-button-circle', className)}
  {...props}
  aria-label={label}
  title={label}>
  {#if children}
    {@render children()}
  {/if}
</a>
