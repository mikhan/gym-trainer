<script lang="ts" context="module">
  import { SvelteMap } from 'svelte/reactivity'

  let observer: ResizeObserver | undefined = undefined
  const linesMap = new SvelteMap<Element, number>()
</script>

<script lang="ts">
  import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
  import { onMount, type Snippet } from 'svelte'
  import Fa from 'svelte-fa'

  type Props = {
    children: Snippet
    toggler?: Snippet<[{ collapsed: boolean }]>
    maxLines: number
  }

  let { children, toggler, maxLines }: Props = $props()

  let containerElement = $state() as HTMLSpanElement
  let contentLines = $derived(linesMap.get(containerElement) ?? 0)
  let collapsed = $state(true)

  onMount(() => {
    observer ??= new ResizeObserver((entries) => {
      for (const entry of entries) {
        const child = entry.target.children.item(0)
        if (child) {
          linesMap.set(entry.target, child.getClientRects().length)
        }
      }
    })

    observer.observe(containerElement, { box: 'content-box' })

    return () => observer?.unobserve(containerElement)
  })
</script>

<div
  class="line-clamp-[--lines]"
  style:--lines={collapsed ? maxLines : 0}
  bind:this={containerElement}>
  <span>{@render children()}</span>
</div>
{#if contentLines > maxLines}
  <button class="mt-2 block rounded-button focusable-ring" onclick={() => (collapsed = !collapsed)}>
    {#if toggler}
      {@render toggler({ collapsed })}
    {:else}
      <div class="flex items-center gap-1 text-sm font-bold text-primary-lighter">
        <span>{collapsed ? 'Mostrar más' : 'Mostrar menos'}</span>
        <Fa icon={collapsed ? faChevronDown : faChevronUp} size="xs"></Fa>
      </div>
    {/if}
  </button>
{/if}

<!-- <style lang="postcss">
  button div {
    @apply pr-3;
    background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
      linear-gradient(135deg, currentColor 50%, transparent 50%);
    background-position:
      calc(100% - 4px) 50%,
      100% 50%;
    background-size:
      4px 4px,
      4px 4px;
    background-repeat: no-repeat;
  }
</style> -->
