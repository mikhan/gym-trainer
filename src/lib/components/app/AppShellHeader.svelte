<script lang="ts">
  import { type Snippet } from 'svelte'
  import { viewTransitionClass } from '$lib/actions/transition.action'
  import clsx from 'clsx'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    start?: Snippet
    children?: Snippet
    end?: Snippet
  } & HTMLAttributes<HTMLDivElement>

  let { start, children, end, class: className, ...other }: Props = $props()
</script>

<div class={clsx('app-shell-header', className)} {...other}>
  <div
    class="container mx-auto flex min-h-16 gap-2 px-layout-gap py-2 *:flex *:items-center *:gap-2">
    {#if start}
      <div class="grow justify-start" use:viewTransitionClass={'app-shell-header-start'}>
        {@render start()}
      </div>
    {/if}
    {#if children}
      <div use:viewTransitionClass={'app-shell-header-center'}>
        {@render children()}
      </div>
    {/if}
    {#if end}
      <div class="grow justify-end" use:viewTransitionClass={'app-shell-header-end'}>
        {@render end()}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  :where(.app-shell-header) {
    @apply flex overflow-hidden transition surface;
  }

  ::view-transition-group(.app-shell-header),
  ::view-transition-group(.app-shell-header-start),
  ::view-transition-group(.app-shell-header-center),
  ::view-transition-group(.app-shell-header-end) {
    animation-duration: theme('transitionDuration.medium');
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }

  ::view-transition-old(.app-shell-header),
  ::view-transition-new(.app-shell-header),
  ::view-transition-old(.app-shell-header-start),
  ::view-transition-new(.app-shell-header-start),
  ::view-transition-old(.app-shell-header-center),
  ::view-transition-new(.app-shell-header-center),
  ::view-transition-old(.app-shell-header-end),
  ::view-transition-new(.app-shell-header-end) {
    height: 100%;
    object-fit: none;
  }

  ::view-transition-old(.app-shell-header-start),
  ::view-transition-new(.app-shell-header-start) {
    object-position: top left;
  }

  ::view-transition-old(.app-shell-header-center),
  ::view-transition-new(.app-shell-header-center) {
    object-position: top center;
  }

  ::view-transition-old(.app-shell-header-end),
  ::view-transition-new(.app-shell-header-end) {
    object-position: top right;
  }
</style>
