<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import { clsx } from 'clsx'
  // import UiTooltip from './ui-tooltip.svelte'

  type Props = {
    children?: Snippet
    label: string
  } & HTMLButtonAttributes

  let { children, label, class: className, ...props }: Props = $props()
  let element = $state() as HTMLButtonElement
</script>

<button
  class={clsx('ui-button ui-button-circle focusable', className)}
  type="button"
  {...props}
  aria-label={label}
  title={label}
  bind:this={element}>
  {#if children}
    {@render children()}
  {/if}
</button>

<!-- <UiTooltip target={element}>{label}</UiTooltip> -->
