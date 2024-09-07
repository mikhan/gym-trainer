<script lang="ts">
  import { viewTransitionName } from '$lib/actions/transition.action'
  import { type Snippet } from 'svelte'
  import { AppShellContext } from '$lib/components/app/AppShellContext.svelte'
  import { fly } from 'svelte/transition'
  import { createStyler } from '$lib/actions/styler.action'

  type Props = { children: Snippet }

  let { children }: Props = $props()

  const appShellContext = AppShellContext.create()

  const { getStyle, setStyle } = createStyler()

  // function autohideHeader(element: HTMLElement) {
  //   const container = element.parentElement!
  //   if (!container) return

  //   let prev = container.scrollTop
  //   let top = 0

  //   function onscroll() {
  //     const next = container.scrollTop
  //     const delta = next - prev
  //     top = Math.max(-element.offsetHeight, Math.min(0, top - delta))
  //     prev = next
  //     containerStyles['--layout-header-top'] = `${top}px`
  //   }

  //   container.addEventListener('scroll', onscroll)

  //   return {
  //     destroy() {
  //       container.removeEventListener('scroll', onscroll)
  //       delete containerStyles['--layout-header-top']
  //     },
  //   }
  // }
</script>

<div
  class="app-shell"
  use:setStyle
  use:viewTransitionName={'app-viewport'}
  use:getStyle={(e) => ({
    '--layout-width': `${e.clientWidth}px`,
    '--layout-height': `${e.clientHeight}px`,
  })}>
  {#if appShellContext.header}
    {#key appShellContext.headerLevel}
      <header
        class="app-header"
        use:viewTransitionName={'app-header'}
        transition:fly={{ duration: 200, y: '-100%' }}
        use:getStyle={(e) => ({
          '--layout-header-width': 'calc(var(--layout-width) - var(--layout-aside-width))',
          '--layout-header-height': `${e.offsetHeight}px`,
        })}>
        {@render appShellContext.header()}
      </header>
    {/key}
  {/if}

  {#if appShellContext.aside}
    {#key appShellContext.asideLevel}
      <aside
        class="app-aside"
        use:viewTransitionName={'app-aside'}
        use:getStyle={(e) => ({
          '--layout-aside-width': `${e.offsetWidth}px`,
          '--layout-aside-height': 'var(--layout-height)',
        })}>
        {@render appShellContext.aside()}
      </aside>
    {/key}
  {/if}

  <main class="app-viewport">
    {@render children()}
  </main>

  {#if appShellContext.footer}
    {#key appShellContext.footerLevel}
      <footer
        class="app-footer"
        use:viewTransitionName={'app-footer'}
        use:getStyle={(e) => ({
          '--layout-footer-width': 'calc(var(--layout-width) - var(--layout-aside-width))',
          '--layout-footer-height': `${e.offsetHeight}px`,
        })}>
        {@render appShellContext.footer()}
      </footer>
    {/key}
  {/if}
</div>

<style lang="postcss">
  :global {
    :root {
      --layout-padding-default: var(--layout-padding, 0px);
      --layout-gap-default: var(--layout-gap, 0px);
    }

    .app-shell {
      --layout-gap: var(--layout-gap-default);
      --layout-height: 0px;
      --layout-header-height: 0px;
      --layout-header-top: 0px;
      --layout-footer-height: 0px;
      --layout-viewport-height: calc(
        100cqb - var(--layout-header-height) - var(--layout-footer-height)
      );
      --layout-viewport-top: calc(var(--layout-header-top) + var(--layout-header-height));

      @media (min-width: theme('screens.lg')) {
        --layout-gap: calc(var(--layout-gap-default) * 1.5);
        --layout-padding: calc(var(--layout-padding-default) * 1.5);
      }

      @media (min-width: theme('screens.3xl')) {
        --layout-gap: calc(var(--layout-gap-default) * 2);
        --layout-padding: calc(var(--layout-padding-default) * 2);
      }

      @apply grid size-full;
      @apply scroll-pt-layout-header-height overflow-y-scroll scroll-smooth scrollbar scrollbar-track-black scrollbar-stable;
      grid-template:
        'aside head' auto
        'aside view' 1fr
        'aside foot' auto
        / auto 1fr;
    }

    .app-header {
      grid-area: head;
      @apply sticky left-layout-aside-width top-layout-header-top z-1 w-layout-header-width;
    }

    .app-aside {
      grid-area: aside;
      @apply sticky left-0 top-0 z-2 h-layout-height bg-default;
    }

    .app-viewport {
      @apply isolate;
      grid-area: view;
    }

    .app-footer {
      grid-area: foot;
      @apply sticky bottom-0 left-layout-aside-width z-1 w-layout-footer-width;
    }

    ::view-transition-group(app-viewport) {
      overflow: clip;
    }

    ::view-transition-old(app-viewport) {
      animation:
        90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
        theme('transitionDuration.medium') cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
    }

    ::view-transition-new(app-viewport) {
      animation:
        210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
        theme('transitionDuration.medium') cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
    }

    /* ::view-transition-group(app-header),
    ::view-transition-group(app-footer) {
      animation-duration: theme('transitionDuration.medium');
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      contain: paint;
      z-index: 1;
    }

    ::view-transition-old(app-header),
    ::view-transition-new(app-header),
    ::view-transition-old(app-footer),
    ::view-transition-new(app-footer) {
      height: 100%;
      object-fit: none;
    } */

    ::view-transition-old(app-aside):only-child {
      animation: theme('transitionDuration.medium') cubic-bezier(0.4, 0, 0.2, 1) both slide-out;
    }

    ::view-transition-new(app-aside):only-child {
      animation: theme('transitionDuration.medium') cubic-bezier(0.4, 0, 0.2, 1) both slide-in;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
    }

    @keyframes fade-out {
      to {
        opacity: 0;
      }
    }

    @keyframes slide-from-right {
      from {
        transform: translateX(60px);
      }
    }

    @keyframes slide-to-left {
      to {
        transform: translateX(-60px);
      }
    }

    @keyframes slide-in {
      from {
        transform: translateX(-100%);
      }
    }

    @keyframes slide-out {
      to {
        transform: translateX(-100%);
      }
    }
  }
</style>
