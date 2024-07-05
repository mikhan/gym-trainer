<script lang="ts">
  import type { Snippet } from 'svelte'
  import { setAppTopbarContext } from '$lib/components/app/app-topbar-context.svelte'

  type Props = { children: Snippet }

  let { children }: Props = $props()

  const appTopbarContext = setAppTopbarContext()
</script>

<div class="app-shell grid grid-rows-[auto,1fr,auto] w-full h-full">
  <header
    class="app-topbar flex items-center overflow-hidden gap-[--layout-gap] h-16 px-[--layout-gap] border-b border-[--color-canvas-border]"
  >
    <div>
      {#if appTopbarContext.title}
        {@render appTopbarContext.title()}
      {/if}
    </div>
  </header>

  <main class="overflow-hidden app-viewport">
    {@render children()}
  </main>

  <footer class="overflow-hidden app-footer"></footer>
</div>
