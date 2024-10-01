<script lang="ts">
  import { type Snippet } from 'svelte'
  import AppBar from './AppBar.svelte'

  type Props = { children: Snippet; title: string; onclose?: () => void }

  let { children, title }: Props = $props()
</script>

<AppBar class="color-neutral-darkest surface" name="topbar2">
  {#snippet start()}
    <div class="typescale-title line-clamp-1">{title}</div>
  {/snippet}

  {#snippet end()}
    {@render children()}
  {/snippet}
</AppBar>
