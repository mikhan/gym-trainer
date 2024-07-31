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
      --chkbg: theme('colors.accent.DEFAULT');
      --chkfg: theme('colors.accent.fg');
      appearance: none;
      flex-shrink: 0;
      width: theme('spacing.4');
      height: theme('spacing.4');
      cursor: pointer;
      border-radius: theme('borderRadius.button');
      border: 2px solid theme('colors.neutral.border');
      vertical-align: middle;

      &:checked {
        border-color: var(--chkbg);
        background-color: var(--chkbg);
        background-repeat: no-repeat;
        animation: checkmark var(--animation-input, 0.2s) ease-out;
        background-color: var(--chkbg);
        background-image: linear-gradient(-45deg, transparent 65%, var(--chkbg) 65.99%),
          linear-gradient(45deg, transparent 75%, var(--chkbg) 75.99%),
          linear-gradient(-45deg, var(--chkbg) 40%, transparent 40.99%),
          linear-gradient(
            45deg,
            var(--chkbg) 30%,
            var(--chkfg) 30.99%,
            var(--chkfg) 40%,
            transparent 40.99%
          ),
          linear-gradient(-45deg, var(--chkfg) 50%, var(--chkbg) 50.99%);
      }
    }

    @keyframes checkmark {
      0% {
        background-position-y: 5px;
      }
      50% {
        background-position-y: -2px;
      }
      100% {
        background-position-y: 0;
      }
    }
  }
</style>
