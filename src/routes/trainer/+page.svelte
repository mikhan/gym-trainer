<script lang="ts">
  import AppTopbar from '$lib/components/app/app-topbar.svelte'
  import AppFooter from '$lib/components/app/app-footer.svelte'
  import UiButton from '$lib/components/ui/ui-button.svelte'
  import UiCarousel from '$lib/components/ui/ui-carousel.svelte'

  let length = $state(5)
  const items = $derived(Array.from({ length }, (_, i) => i + 1))
  const elements: HTMLElement[] = $state([])
  let current: HTMLElement | null = $state(null)

  $effect(() => {
    elements.length = items.length
  })

  let carousel: UiCarousel
</script>

<AppTopbar>{current?.dataset.id}</AppTopbar>

<div class="h-full w-full overflow-hidden">
  <UiCarousel
    direction="horizontal"
    snap="start"
    onchange={(e) => (current = e)}
    bind:this={carousel}>
    {#each items as item, index}
      <li
        class="flex flex-col overflow-y-auto bg-neutral-darker"
        style="--scrollbar-size: 0px "
        data-id={item}
        bind:this={elements[index]}>
        <div class="mx-auto flex h-[85%] max-w-screen-md shrink-0 flex-col p-layout-gap">
          <div
            class="m-auto aspect-square w-full max-w-80 rounded-card border border-neutral-border bg-neutral">
          </div>
          <article class="mt-auto rounded-card border border-neutral-border bg-neutral p-4">
            Enim ea ex consequat aliqua fugiat veniam. Ea velit do veniam ut velit velit tempor
            nulla proident Lorem aute. Adipisicing dolore sint nisi aliquip cupidatat voluptate
            exercitation. Sint sunt commodo dolor proident officia.
          </article>
        </div>
        <div class="mx-auto max-w-screen-md space-y-4 p-layout-gap">
          <article class="space-y-4 p-4">
            Do eu nulla ex adipisicing anim ipsum consectetur non pariatur cupidatat consectetur est
            proident consectetur. Lorem reprehenderit dolor anim esse aliquip labore laboris sunt
            qui officia aliqua id. Officia fugiat esse Lorem aliqua proident proident ut laboris
            nostrud. Pariatur aute et amet enim id veniam sit nisi eu irure.
          </article>
          <article class="space-y-4 rounded-card border border-neutral-border bg-neutral p-4">
            Enim ea ex consequat aliqua fugiat veniam. Ea velit do veniam ut velit velit tempor
            nulla proident Lorem aute. Adipisicing dolore sint nisi aliquip cupidatat voluptate
            exercitation. Sint sunt commodo dolor proident officia. Pariatur laborum nulla elit
            dolore irure eu ea do laborum non veniam consequat. Duis exercitation culpa dolore aute
            eiusmod mollit eiusmod. Ex veniam elit velit aliqua ad.
          </article>
          <article class="space-y-4 p-4">
            Cupidatat dolor enim aute laboris ullamco ad ex commodo dolor voluptate dolore. Ad
            pariatur fugiat nostrud ex voluptate consequat pariatur. Ipsum ea aliquip culpa velit
            veniam duis.
          </article>
        </div>
        <div
          class="from-neutral-darkest to-transparent sticky bottom-0 left-0 mt-auto h-[15%] w-full shrink-0 bg-gradient-to-t">
        </div>
      </li>
    {/each}
  </UiCarousel>
</div>

<AppFooter>
  <div class="bg-neutral-darkest flex items-center justify-between gap-2 px-layout-gap py-4">
    <UiButton onclick={() => carousel.previous()}>-</UiButton>
    {#each elements as element, index}
      <button
        class="size-6 rounded-full border text-xs"
        class:bg-neutral={current === element}
        onclick={() => element.scrollIntoView()}>{index + 1}</button>
    {/each}
    <UiButton onclick={() => carousel.next()}>+</UiButton>
  </div>
</AppFooter>

<!-- <style lang="postcss">
  li {
    animation-name: fade-in-out;
    animation-timeline: view(x);
  }

  @keyframes fade-in-out {
    0% {
      scale: 0.5;
      opacity: 0.5;
    }

    50% {
      scale: 1;
      opacity: 1;
    }

    100% {
      scale: 0.5;
      opacity: 0.5;
    }
  }
</style> -->
