<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import { clsx } from 'clsx'
  import UiTooltip from './ui-tooltip.svelte'

  type Props = {
    children: Snippet
    label: string
    id?: string
  } & HTMLButtonAttributes

  let { children, label, class: className, id = crypto.randomUUID(), ...props }: Props = $props()
  let element = $state() as HTMLButtonElement
</script>

<button
  class={clsx('ui-iconbutton focusable', className)}
  type="button"
  {...props}
  aria-label={label}
  {id}
  bind:this={element}>
  {@render children()}
</button>

<UiTooltip target={element}>{label}</UiTooltip>
