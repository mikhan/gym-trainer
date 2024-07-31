<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { AppShellContext } from './app-shell-context.svelte'

  type Props = { children: Snippet; previous?: string | URL }

  let { children, previous }: Props = $props()

  const appShellContext = AppShellContext.get()

  onMount(() => {
    appShellContext.addTitle(children)
    appShellContext.previous = previous

    return () => {
      appShellContext.removeTitle(children)
      appShellContext.previous = undefined
    }
  })
</script>
