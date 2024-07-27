<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { AppShellContext } from './app-shell-context.svelte'

  type Props = { children: Snippet }

  let { children }: Props = $props()

  const appShellContext = AppShellContext.get()

  onMount(() => {
    appShellContext.addActions(children)

    return () => {
      appShellContext.removeActions(children)
    }
  })
</script>
