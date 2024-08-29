<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { clsx } from 'clsx'

  type Props = {
    checked?: boolean
  } & HTMLInputAttributes

  let { checked = $bindable(false), class: className, ...props }: Props = $props()
</script>

<input class={clsx('ui-checkbox focusable', className)} type="checkbox" bind:checked {...props} />
