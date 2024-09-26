<script lang="ts">
  import clsx from 'clsx'

  type Props = {
    direction: 'in' | 'out'
    message: string
  }

  const { direction, message }: Props = $props()
</script>

<p
  class={clsx(
    'chat-entry chat-message-box w-fit max-w-[75%] px-2 py-1 relative surface color-secondary rounded-[8px] [filter:drop-shadow(2px_2px_2px_#0006)]',
    direction === 'in' ? 'chat-entry-in text-left' : 'chat-entry-out text-right',
  )}>
  {message}
</p>

<style lang="postcss">
  :global {
    .chat-entry-out + .chat-entry-in.chat-message-box,
    .chat-entry-in.chat-message-box:first-child {
      border-top-left-radius: 0px;

      &::before {
        content: '';
        position: absolute;
        width: 12px;
        height: 8px;
        top: -8px;
        left: 0;
        background-color: inherit;
        clip-path: path('M12 8C0 0 0 0 0 6V8z');
      }
    }

    .chat-entry-in + .chat-entry-out.chat-message-box,
    .chat-entry-out.chat-message-box:first-child {
      border-top-right-radius: 0px;

      &::before {
        content: '';
        position: absolute;
        width: 12px;
        height: 8px;
        top: -8px;
        right: 0;
        background-color: inherit;
        clip-path: path('M0 8C12 0 12 0 12 6V8z');
      }
    }

    .chat-entry:not(:last-child) {
      margin-block-end: var(--entry-gap, theme('spacing.1'));
    }

    .chat-entry-in {
      align-self: start;
    }

    .chat-entry-out {
      align-self: end;
    }

    .chat-entry-in:not(:has(+ .chat-entry-in)),
    .chat-entry-out:not(:has(+ .chat-entry-out)) {
      --entry-gap: theme('spacing.4');
    }
  }
</style>
