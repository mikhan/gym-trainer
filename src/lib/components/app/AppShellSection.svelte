<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { AppShellContext } from './AppShellContext.svelte'

  type Props = { name: keyof typeof sectionLoaders; children: Snippet }

  let { name, children }: Props = $props()

  const appShellContext = AppShellContext.get()

  const sectionLoaders = {
    header: () => appShellContext.addHeader(children),
    aside: () => appShellContext.addAside(children),
    footer: () => appShellContext.addFooter(children),
  }

  onMount(sectionLoaders[name])
</script>
