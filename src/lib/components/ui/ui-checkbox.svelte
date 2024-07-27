<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { clsx } from 'clsx'

  type Props = {
    checked?: boolean
  } & HTMLInputAttributes

  let { checked = $bindable(false), class: className, ...props }: Props = $props()
</script>

<input class={clsx('ui-checkbox focusable', className)} type="checkbox" bind:checked {...props} />

<style lang="postcss">
  :global {
    .ui-checkbox {
      appearance: none;
      flex-shrink: 0;
      width: theme('spacing.4');
      height: theme('spacing.4');
      cursor: pointer;
      border-radius: theme('borderRadius.button');
      border-width: 2px;
      border-color: theme('colors.neutral.border');

      &:checked {
        --tw-border-opacity: 1;
        border-color: var(--fallback-p, oklch(var(--p) / var(--tw-border-opacity)));
        --tw-bg-opacity: 1;
        background-color: var(--fallback-p, oklch(var(--p) / var(--tw-bg-opacity)));
        --tw-text-opacity: 1;
        color: var(--fallback-pc, oklch(var(--pc) / var(--tw-text-opacity)));
      }
    }
  }
</style>
