<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import { clsx } from 'clsx'

  type Props = {
    children: Snippet
  } & HTMLButtonAttributes

  let { children, class: className, id, ...props }: Props = $props()
</script>

<button class={clsx('ui-button focusable', className)} type="button" {id} {...props}>
  {@render children()}
</button>
