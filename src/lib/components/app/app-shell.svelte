<script lang="ts">
  import type { Snippet } from 'svelte'
  import { AppShellContext } from '$lib/components/app/app-shell-context.svelte'
  import UiIconbutton from '../ui/ui-iconbutton.svelte'
  import Fa from 'svelte-fa'
  import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons'
  import { goto } from '$app/navigation'

  type Props = { children: Snippet }

  let { children }: Props = $props()

  const appShellContext = AppShellContext.create()
  let container = $state() as HTMLElement
  let containerStyles = $state({
    '--layout-header-height': '0px',
    '--layout-footer-height': '0px',
  }) as Record<string, string>

  $effect(() => {
    for (const [name, value] of Object.entries(containerStyles)) {
      container.style.setProperty(name, value)
    }
  })

  let resizeObserver: ResizeObserver
  const elementNameMap = new Map<Element, string>()
  function setContainerStyle(element: HTMLElement, name: string) {
    resizeObserver ??= new ResizeObserver((entries) => {
      for (const entry of entries) {
        const name = elementNameMap.get(entry.target)
        if (!name) continue
        containerStyles[name] = `${entry.contentRect.height}px`
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
</script>

<div class="app-shell" bind:this={container}>
  {#if appShellContext.title || appShellContext.actions.length}
    <header class="app-header" use:setContainerStyle={'--layout-header-height'}>
      <div class="container flex w-full items-center gap-4 px-layout-gap">
        {#if appShellContext.previous}
          <UiIconbutton
            class="bg-transparent"
            label="Previous"
            onclick={() => appShellContext.previous && goto(appShellContext.previous)}>
            <Fa icon={faArrowLeft}></Fa>
          </UiIconbutton>
        {/if}
        <div class="grow">
          {#if appShellContext.title}
            {@render appShellContext.title()}
          {/if}
        </div>
        {#if appShellContext.actions.length}
          <div class="flex items-center gap-2">
            {#each appShellContext.actions as actions}
              {@render actions()}
            {/each}
          </div>
        {/if}
        <div
          class="grid size-12 shrink-0 items-end justify-center overflow-clip rounded-full bg-primary">
          <Fa icon={faUser} size="2.5x"></Fa>
        </div>
      </div>
    </header>
  {/if}

  <main class="app-viewport">
    {@render children()}
  </main>

  {#if appShellContext.footer}
    <footer class="app-footer" use:setContainerStyle={'--layout-footer-height'}>
      {@render appShellContext.footer()}
    </footer>
  {/if}
</div>

<style lang="postcss">
  :global {
    .app-shell {
      display: grid;
      grid-template:
        'head' max-content
        'view' 1fr
        'foot' max-content
        / 100%;
      width: 100%;
      min-height: 100%;
    }

    .app-header {
      grid-area: head;
      display: flex;
      justify-content: center;
      width: 100%;
      min-height: theme('spacing.16');
      background-color: theme('colors.neutral.darkest.DEFAULT');
      box-shadow: theme('boxShadow.DEFAULT');
      position: sticky;
      top: 0;
      z-index: theme('zIndex.2');
      view-transition-name: header;
    }

    .app-viewport {
      grid-area: view;
    }

    .app-footer {
      grid-area: foot;
      width: 100%;
      min-height: theme('spacing.16');
      position: sticky;
      bottom: 0;
      z-index: theme('zIndex.2');
    }
  }
</style>
