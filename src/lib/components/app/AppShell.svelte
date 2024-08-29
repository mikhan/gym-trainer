<script lang="ts">
  import { transitionName } from '$lib/actions/transition.action'
  import { type Snippet } from 'svelte'
  import { AppShellContext } from '$lib/components/app/app-shell-context.svelte'
  import { fly } from 'svelte/transition'

  type Props = { children: Snippet }

  let { children }: Props = $props()

  const appShellContext = AppShellContext.create()
  let containerElement = $state() as HTMLElement
  let containerStyles = $state({}) as Record<string, string>

  $effect(() => {
    for (const [name, value] of Object.entries(containerStyles)) {
      containerElement.style.setProperty(name, value)
    }
  })

  let resizeObserver: ResizeObserver
  const elementNameMap = new Map<Element, string>()
  function setContainerStyle(element: HTMLElement, name: string) {
    const style = getComputedStyle(element)
    if (style.getPropertyValue('position') !== 'sticky') return

    resizeObserver ??= new ResizeObserver((entries) => {
      for (const entry of entries) {
        const name = elementNameMap.get(entry.target)
        if (!name) continue
        containerStyles[name] = `${(entry.target as HTMLElement).offsetHeight}px`
      }
    })

    elementNameMap.set(element, name)
    resizeObserver.observe(element, { box: 'border-box' })

    return {
      destroy() {
        elementNameMap.delete(element)
        resizeObserver.unobserve(element)
      },
    }
  }

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

<div class="app-shell" bind:this={containerElement}>
  {#if appShellContext.header}
    {#key appShellContext.headerLevel}
      <header
        class="app-header"
        transition:fly={{ duration: 200, y: '-100%' }}
        use:setContainerStyle={'--layout-header-height'}
        use:transitionName={{ type: 'navigation', name: 'app-header' }}>
        {@render appShellContext.header()}
      </header>
    {/key}
  {/if}

  <main class="app-viewport" use:transitionName={{ type: 'navigation', name: 'app-viewport' }}>
    {@render children()}
  </main>

  {#if appShellContext.footer}
    {#key appShellContext.footerLevel}
      <footer
        class="app-footer"
        transition:fly={{ duration: 200, y: '100%' }}
        use:setContainerStyle={'--layout-footer-height'}
        use:transitionName={{ type: 'navigation', name: 'app-footer' }}>
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
      --layout-header-height: 0px;
      --layout-header-top: 0px;
      --layout-footer-height: 0px;
      --layout-viewport-height: calc(
        100cqb - var(--layout-header-height) - var(--layout-footer-height)
      );
      --layout-viewport-top: calc(var(--layout-header-top) + var(--layout-header-height));

      @apply grid size-full select-none;
      @apply scroll-pt-layout-header-height overflow-y-scroll scroll-smooth scrollbar scrollbar-track-black scrollbar-stable;
      grid-template:
        'head' auto
        'view' 1fr
        'foot' auto
        / 100%;

      @media (min-width: theme('screens.md')) {
        --layout-padding: calc(var(--layout-padding-default) * 2);
        --layout-gap: calc(var(--layout-gap-default) * 2);
      }

      @media (min-width: theme('screens.xl')) {
        --layout-padding: calc(var(--layout-padding-default) * 3);
      }
    }

    .app-header {
      grid-area: head;
      @apply top-layout-header-top sticky z-2;
    }

    .app-viewport {
      grid-area: view;
    }

    .app-footer {
      grid-area: foot;
      @apply sticky bottom-0 z-2;
    }

    ::view-transition-old(app-viewport) {
      animation:
        90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
        300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
    }

    ::view-transition-new(app-viewport) {
      animation:
        210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
        300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
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
  }
</style>
