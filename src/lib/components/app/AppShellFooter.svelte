<script lang="ts">
  import { type Snippet } from 'svelte'
  import { viewTransitionName } from '$lib/actions/transition.action'
  import clsx from 'clsx'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = { start?: Snippet; end?: Snippet } & HTMLAttributes<HTMLDivElement>

  let { start, end, class: className, ...other }: Props = $props()
</script>

<div class={clsx('app-shell-footer', className)} {...other}>
  <div>
    <div use:viewTransitionName={'app-shell-footer-start'}>
      {#if start}
        {@render start()}
      {/if}
    </div>
    <div use:viewTransitionName={'app-shell-footer-end'}>
      {#if end}
        {@render end()}
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  :where(.app-shell-footer) {
    @apply transition surface;

    & > div {
      @apply container mx-auto flex h-16 justify-between gap-2 px-layout-gap;

      & > div {
        @apply flex items-center gap-2;
      }
    }
  }

  ::view-transition-group(app-shell-footer-start),
  ::view-transition-group(app-shell-footer-end) {
    animation-duration: theme('transitionDuration.medium');
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  ::view-transition-old(app-shell-footer-start),
  ::view-transition-new(app-shell-footer-start) {
    height: 100%;
    object-fit: none;
    object-position: left;
  }

  ::view-transition-old(app-shell-footer-end),
  ::view-transition-new(app-shell-footer-end) {
    height: 100%;
    object-fit: none;
    object-position: right;
  }
</style>
