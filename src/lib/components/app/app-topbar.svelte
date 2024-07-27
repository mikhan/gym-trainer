<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { AppShellContext } from './app-shell-context.svelte'

  type Props = { children: Snippet; actions?: Snippet }

  let { children, actions }: Props = $props()

  const appShellContext = AppShellContext.get()

  onMount(() => {
    appShellContext.addTitle(children)
    if (actions) appShellContext.addActions(actions)

    return () => {
      appShellContext.removeTitle(children)
      if (actions) appShellContext.removeActions(actions)
    }
  })
</script>
