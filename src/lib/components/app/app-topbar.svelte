<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = { children?: Snippet }

  let { children }: Props = $props()
</script>

<div class="app-topbar">
  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="postcss">
  .app-topbar {
    display: flex;
    min-height: 40px;
    box-shadow: var(--card-shadow);
  }
</style>
