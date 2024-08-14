<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { AppShellContext } from './app-shell-context.svelte'

  type Props = { children: Snippet; previous?: string | URL; actions?: Snippet }

  let { children, previous, actions }: Props = $props()

  const appShellContext = AppShellContext.get()

  onMount(() => {
    appShellContext.addTitle(children)
    appShellContext.previous = previous
    if (actions) appShellContext.addActions(actions)

    return () => {
      appShellContext.removeTitle(children)
      appShellContext.previous = undefined
      if (actions) appShellContext.removeActions(actions)
    }
  })
</script>
