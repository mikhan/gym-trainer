<script lang="ts">
  import type { Snippet } from 'svelte'
  import { setAppTopbarContext } from '$lib/components/app/app-topbar-context.svelte'

  type Props = { children: Snippet }

  let { children }: Props = $props()

  const appTopbarContext = setAppTopbarContext()
</script>

<div class="app-shell">
  <header part="topbar" class="app-topbar">
    {#if appTopbarContext.title}
      {@render appTopbarContext.title()}
    {/if}
  </header>

  <main class="app-viewport">
    {@render children()}
  </main>

  <footer class="app-footer"></footer>
</div>

<style lang="postcss">
  .app-shell {
    display: grid;
    grid-template-rows: auto 1fr auto;
    width: 100%;
    height: 100%;
  }

  .app-topbar {
    display: flex;
    align-items: center;
    gap: var(--layout-gap);
    height: 4rem;
    padding-inline: var(--layout-gap);
  }

  .app-viewport {
    overflow: auto;
  }
</style>
