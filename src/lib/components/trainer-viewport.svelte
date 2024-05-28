<script lang="ts">
  import { createTrainerViewportContext } from './trainer-viewport.context'
  import { onMount } from 'svelte'
  import { setTrainerViewportContext } from './trainer-viewport.context'
  import { writable } from 'svelte/store'

  const observables = new Map<Element, (enty: IntersectionObserverEntry) => void>()
  let viewportRoot: HTMLElement

  let observer: IntersectionObserver | null = null

  setTrainerViewportContext(createTrainerViewportContext())
  // const current = writable<HTMLElement>()

  // const visible: HTMLElement[] = []

  // function onIntersectionChange(entries: IntersectionObserverEntry[]) {
  //   for (const entry of entries) {
  //     const target = entry.target as HTMLElement

  //     observables.get(target)?.(entry)

  //     if (entry.intersectionRatio === 1) {
  //       visible.push(target)
  //     } else if (visible.includes(target)) {
  //       visible.splice(visible.indexOf(target), 1)
  //     }
  //   }

  //   visible.sort((a, b) =>
  //     a.compareDocumentPosition(b) === Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1,
  //   )

  //   // const target = entries.find((entry) => entry.intersectionRatio === 1)?.target as HTMLElement;
  //   const target = visible[0]
  //   if (target) current.set(target)
  // }

  onMount(() => {
    // observer = new IntersectionObserver(onIntersectionChange, {
    //   root: viewportRoot,
    //   threshold: [0, 1],
    //   rootMargin: '-56px 0px 0px 0px',
    // })
    // for (const element of observables.keys()) {
    //   observer.observe(element)
    // }
  })
</script>

<div class="trainer-viewport" bind:this={viewportRoot}>
  <div class="header">
    <slot name="header"></slot>
  </div>
  <slot></slot>
  <div class="footer">
    <slot name="footer"></slot>
  </div>
</div>

<style lang="postcss">
  .trainer-viewport {
    display: grid;
    grid-template-columns: minmax(0, 512px);
    grid-template-rows: auto 1fr auto;
    place-content: start center;
    overflow-y: scroll;
    padding: 0.5rem;
    gap: 0.5rem;
    height: 100vh;
    scroll-snap-type: y mandatory;
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 2;
  }

  .footer {
    position: sticky;
    bottom: 0;
    z-index: 2;
  }
</style>
