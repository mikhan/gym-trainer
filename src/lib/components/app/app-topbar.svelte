<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte'
  import { getAppTopbarContext } from './app-topbar-context.svelte'

  type Props = { children: Snippet }

  let { children }: Props = $props()

  const appTopbarContext = getAppTopbarContext()

  if (children) appTopbarContext.addTitle(children)

  onDestroy(() => children && appTopbarContext.removeTitle(children))
</script>
