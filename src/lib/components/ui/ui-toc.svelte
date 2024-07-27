<script lang="ts">
  import { currentTocTarget } from '$lib/actions/toc.action'
  import { onMount, type Snippet } from 'svelte'

  type Props = {
    children: Snippet<[active: HTMLElement | null]>
  }

  const { children }: Props = $props()
  let active: HTMLElement | null = $state(null)

  onMount(() => {
    const unsubscribe = currentTocTarget.subscribe((current) => (active = current.element))

    return () => unsubscribe()
  })
</script>

{@render children(active)}
