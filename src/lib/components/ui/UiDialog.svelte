<script lang="ts">
  import type { HTMLDialogAttributes } from 'svelte/elements'
  import { faTimes } from '@fortawesome/free-solid-svg-icons'
  import { Fa } from 'svelte-fa'
  import type { Snippet } from 'svelte'
  import { clsx } from 'clsx'
  import UiIconbutton from './UiIconbutton.svelte'

  type Props = {
    children?: Snippet
    title?: string | Snippet
    align?: 'top' | 'bottom' | 'left' | 'right' | 'center'
    actions?: Snippet
    open?: boolean
  } & Omit<HTMLDialogAttributes, 'title'>

  let {
    children,
    title,
    align = 'center',
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

<dialog class={clsx('ui-dialog', className)} {...props} bind:this={dialog} data-align={align}>
  <div class="flex items-center gap-2 p-6 pb-4">
    <div class="typescale-title grow truncate">
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
  <div class="scrollable-shadow max-h-full overflow-auto scrollbar">
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
  :global {
    .ui-dialog {
      @apply shadow-over color-neutral surface focusable-ring;
      grid-template-rows: auto 1fr auto;
      overflow: visible;
      margin: 0;
      max-width: 100%;
      max-height: 100%;
      transform: translateY(20%);

      &[open] {
        display: grid;
        transform: translateY(0);

        @starting-style {
          transform: translateY(-20%);
        }
      }

      &[data-align='center'] {
        margin: auto;
        max-width: min(theme('screens.lg'), calc(100% - calc(theme('spacing.layout-gap') * 2)));
        max-height: min(theme('screens.lg'), calc(100% - calc(theme('spacing.layout-gap') * 2)));
        border-radius: theme('borderRadius.card');
      }

      &[data-align='top'] {
        margin-block-end: auto;
        width: 100dvw;
        max-height: theme('screens.lg');
        transform: translateY(-100%);

        &[open] {
          transform: translateY(0);

          @starting-style {
            transform: translateY(-100%);
          }
        }
      }

      &[data-align='bottom'] {
        margin-block-start: auto;
        width: 100dvw;
        max-height: theme('screens.lg');
        transform: translateY(100%);

        &[open] {
          transform: translateY(0);

          @starting-style {
            transform: translateY(100%);
          }
        }
      }

      &[data-align='left'] {
        margin-inline-end: auto;
        max-width: theme('screens.lg');
        height: 100dvh;
        transform: translatex(-100%);

        &[open] {
          transform: translateX(0);

          @starting-style {
            transform: translateX(-100%);
          }
        }
      }

      &[data-align='right'] {
        margin-inline-start: auto;
        width: theme('screens.md');
        height: 100dvh;
        max-width: 100dvw;
        transform: translatex(100%);
        top: 0;
        bottom: 0;

        &[open] {
          transform: translateX(0);

          @starting-style {
            transform: translateX(100%);
          }
        }
      }

      &::backdrop {
        background-color: theme('colors.canvas.DEFAULT/50%');
      }
    }
  }
</style>
