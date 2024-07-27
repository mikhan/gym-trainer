<script lang="ts">
  import type { Snippet } from 'svelte'
  import { AppShellContext } from '$lib/components/app/app-shell-context.svelte'

  type Props = { children: Snippet }

  let { children }: Props = $props()

  const appShellContext = AppShellContext.create()
</script>

<div class="app-shell grid h-full w-full grid-cols-1 grid-rows-[auto,1fr,auto]">
  {#if appShellContext.title || appShellContext.actions.length}
    <header
      class="app-header flex h-16 items-center overflow-hidden border-b border-neutral-darker-border bg-neutral-darker shadow">
      <div class="container mx-auto flex items-center gap-2 px-layout-gap">
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
      </div>
    </header>
  {:else}
    <div></div>
  {/if}

  <main class="app-viewport overflow-hidden @container-[size]/viewport">
    {@render children()}
  </main>

  {#if appShellContext.footer}
    <footer class="app-footer overflow-hidden">
      {@render appShellContext.footer()}
    </footer>
  {:else}
    <div></div>
  {/if}
</div>
