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

<div class={clsx('app-shell-footer', className)} {...other}>
  <div class="container mx-auto flex gap-2 px-layout-gap py-2 *:flex *:items-center *:gap-2">
    {#if start}
      <div class="grow justify-start" use:viewTransitionClass={'app-shell-footer-start'}>
        {@render start()}
      </div>
    {/if}
    {#if children}
      <div use:viewTransitionClass={'app-shell-footer-center'}>
        {@render children()}
      </div>
    {/if}
    {#if end}
      <div class="grow justify-end" use:viewTransitionClass={'app-shell-footer-end'}>
        {@render end()}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  :where(.app-shell-footer) {
    @apply flex overflow-hidden transition surface;
  }

  ::view-transition-group(.app-shell-footer-start),
  ::view-transition-group(.app-shell-footer-end) {
    animation-duration: theme('transitionDuration.medium');
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }

  ::view-transition-old(.app-shell-footer-start),
  ::view-transition-new(.app-shell-footer-start) {
    height: 100%;
    object-fit: none;
    object-position: left;
  }

  ::view-transition-old(.app-shell-footer-center),
  ::view-transition-new(.app-shell-footer-center) {
    height: 100%;
    object-fit: none;
    object-position: center;
  }

  ::view-transition-old(.app-shell-footer-end),
  ::view-transition-new(.app-shell-footer-end) {
    height: 100%;
    object-fit: none;
    object-position: right;
  }
</style>
