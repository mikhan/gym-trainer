<script lang="ts">
  import type { Snippet } from 'svelte'
  import { setAppDatabaseContext, type DatabaseClient } from './app-database-context.svelte'

  type Props = {
    client: DatabaseClient
    children: Snippet
  }

  const { client, children }: Props = $props()

  setAppDatabaseContext(client)
</script>

{@render children()}
