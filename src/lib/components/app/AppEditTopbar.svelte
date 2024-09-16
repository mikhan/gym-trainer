<script lang="ts">
  import { type Snippet } from 'svelte'
  import AppShellSection from './AppShellSection.svelte'
  import AppShellHeader from './AppBar.svelte'

  type Props = { children: Snippet; title: string; onclose?: () => void }

  let { children, title }: Props = $props()
</script>

<AppShellSection name="header">
  <AppShellHeader class="color-neutral-darkest">
    {#snippet start()}
      <div class="typescale-title line-clamp-1">{title}</div>
    {/snippet}

    {#snippet end()}
      {@render children()}
    {/snippet}
  </AppShellHeader>
</AppShellSection>
