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
  use:getStyle={(e) => ({
    '--layout-width': `${e.clientWidth}px`,
    '--layout-height': `${e.clientHeight}px`,
  })}>
  {#if appShellContext.aside}
    {#key appShellContext.asideLevel}
      <aside
        class="app-aside"
        use:getStyle={(e) => ({
          '--layout-aside-width': `${e.offsetWidth}px`,
          '--layout-aside-height': 'var(--layout-height)',
        })}>
        {@render appShellContext.aside()}
      </aside>
    {/key}
  {/if}

  <div
    class="grid flex-1 scroll-pt-layout-header-height grid-cols-1 grid-rows-[auto,1fr,auto] overflow-y-scroll scroll-smooth scrollbar scrollbar-track-black scrollbar-stable"
    use:getStyle={(e) => ({
      '--layout-header-width': `${e.clientWidth}px`,
      '--layout-footer-width': `${e.clientWidth}px`,
    })}>
    {#if appShellContext.header}
      {#key appShellContext.headerLevel}
        <header
          class="app-header"
          transition:fly={{ duration: 200, y: '-100%' }}
          use:getStyle={(e) => ({
            '--layout-header-height': `${e.offsetHeight}px`,
          })}>
          {@render appShellContext.header()}
        </header>
      {/key}
    {/if}

    <main class="app-viewport" use:viewTransitionName={'app-viewport'}>
      {@render children()}
    </main>

    {#if appShellContext.footer}
      {#key appShellContext.footerLevel}
        <footer
          class="app-footer"
          use:getStyle={(e) => ({
            '--layout-footer-height': `${e.offsetHeight}px`,
          })}>
          {@render appShellContext.footer()}
        </footer>
      {/key}
    {/if}
  </div>
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

      @apply flex size-full;
    }

    .app-aside {
      @apply sticky left-0 top-0 z-2 h-layout-height flex-none bg-default;
    }

    .app-header {
      @apply sticky left-0 top-0 z-1 col-start-1 row-start-1;
    }

    .app-viewport {
      @apply isolate col-start-1 row-start-2 contain-inline-size;
    }

    .app-footer {
      @apply sticky bottom-0 left-0 z-1 col-start-1 row-start-3;
    }

    ::view-transition-group(app-viewport) {
      overflow: clip;
    }

    ::view-transition-old(app-viewport) {
      height: 100%;
      object-position: top left;
      object-fit: none;
      animation:
        90ms cubic-bezier(0.4, 0, 1, 1) both --fade-out,
        theme('transitionDuration.medium') cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
    }

    ::view-transition-new(app-viewport) {
      height: 100%;
      object-position: top left;
      object-fit: none;
      animation:
        210ms cubic-bezier(0, 0, 0.2, 1) 90ms both --fade-in,
        theme('transitionDuration.medium') cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
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
  }
</style>
