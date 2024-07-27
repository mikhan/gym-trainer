<script lang="ts">
  import type { HTMLDialogAttributes } from 'svelte/elements'
  import { faTimes } from '@fortawesome/free-solid-svg-icons'
  import { Fa } from 'svelte-fa'
  import type { Snippet } from 'svelte'
  import { clsx } from 'clsx'
  import UiIconbutton from './ui-iconbutton.svelte'

  type Props = {
    children?: Snippet
    title?: string | Snippet
    actions?: Snippet
    open?: boolean
  } & Omit<HTMLDialogAttributes, 'title'>

  let {
    children,
    title,
    actions,
    open = $bindable(false),
    class: className,
    ...props
  }: Props = $props()

  let dialog: HTMLDialogElement | null = $state(null)

  export function showModal() {
    open = true
  }

  export function close() {
    open = false
  }

  $effect(() => {
    if (open) dialog?.showModal()
    else dialog?.close()
  })
</script>

<dialog
  class={clsx(
    'max-w-screen-lg grid-rows-[auto,1fr,auto] overflow-visible rounded-card bg-neutral text-neutral-fg shadow-over backdrop:bg-canvas/50 open:grid',
    'ui-dialog',
    className,
  )}
  bind:this={dialog}
  {...props}>
  <div class="flex items-center gap-2 p-6 pb-4">
    <div class="grow truncate text-2xl">
      {#if typeof title === 'function'}
        {@render title()}
      {:else}
        {title}
      {/if}
    </div>
    {#if !actions}
      <UiIconbutton onclick={() => dialog?.close()} label="Close">
        <Fa icon={faTimes}></Fa>
      </UiIconbutton>
    {/if}
  </div>
  <div class="scrollable-shadow overflow-auto">
    {#if children}
      <div class="px-6">
        {@render children()}
      </div>
    {/if}
  </div>
  <div class="p-6 pt-0">
    {#if actions}
      <div class="flex items-center justify-end gap-2 pt-4">
        {@render actions()}
      </div>
    {/if}
  </div>
</dialog>

<style lang="postcss">
  .ui-dialog {
    transform: translateY(20%);

    &[open] {
      transform: translateY(0);

      @starting-style {
        transform: translateY(-20%);
      }
    }
  }
</style>
