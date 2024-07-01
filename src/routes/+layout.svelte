<script lang="ts">
  import type { Snippet } from 'svelte'
  import AppShell from '$lib/components/app/app-shell.svelte'
  import './app.css'

  type Props = { children: Snippet }

  let { children }: Props = $props()
</script>

<AppShell>
  {@render children()}
</AppShell>

<style lang="postcss">
</style>
