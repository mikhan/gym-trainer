<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import { clsx } from 'clsx'

  type Props = {
    children: Snippet
    variant?: 'primary'
  } & HTMLButtonAttributes

  let { children, variant, class: className, id, ...props }: Props = $props()
</script>

<button
  class={clsx('ui-button focusable', variant && `ui-button-${variant}`, className)}
  type="button"
  {id}
  {...props}>
  {@render children()}
</button>
