<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<article class="space-y-4 rounded-card p-4 shadow color-neutral surface">
  <h1 class="typescale-title">Instrucciones</h1>
  <div>{@render children()}</div>
</article>
