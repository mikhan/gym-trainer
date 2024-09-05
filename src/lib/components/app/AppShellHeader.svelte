<script lang="ts">
  import { type Snippet } from 'svelte'
  import { viewTransitionName } from '$lib/actions/transition.action'
  import clsx from 'clsx'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = { start?: Snippet; end?: Snippet } & HTMLAttributes<HTMLDivElement>

  let { start, end, class: className, ...other }: Props = $props()
</script>

<div class={clsx('app-shell-header', className)} {...other}>
  <div>
    <div use:viewTransitionName={'app-shell-header-start'}>
      {#if start}
        {@render start()}
      {/if}
    </div>
    <div use:viewTransitionName={'app-shell-header-end'}>
      {#if end}
        {@render end()}
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  :where(.app-shell-header) {
    @apply flex items-center transition surface;

    & > div {
      @apply container mx-auto flex h-16 justify-between gap-2 px-layout-gap;

      & > div {
        @apply flex items-center gap-2;
      }
    }
  }

  ::view-transition-group(app-shell-header-start),
  ::view-transition-group(app-shell-header-end) {
    animation-duration: theme('transitionDuration.medium');
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }

  ::view-transition-old(app-shell-header-start),
  ::view-transition-new(app-shell-header-start) {
    height: 100%;
    object-fit: none;
    object-position: left;
  }

  ::view-transition-old(app-shell-header-end),
  ::view-transition-new(app-shell-header-end) {
    height: 100%;
    object-fit: none;
    object-position: right;
  }
</style>
