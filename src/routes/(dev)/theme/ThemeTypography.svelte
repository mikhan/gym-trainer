<script lang="ts">
  import clsx from 'clsx'
  import UiCheckbox from '$lib/components/ui/UiCheckbox.svelte'
  import { getPersistedState } from '$lib/states/persisted-state.svelte'

  const themeState = getPersistedState('session', 'ThemeTypography.state', {
    showGridlines: true,
  })

  const textSample = `Minim fugiat laboris id dolor Lorem veniam.
  Sunt do magna eu enim amet anim commodo aliquip nulla consequat nostrud tempor laboris.
  Qui nisi labore amet laboris commodo Lorem anim.
  Non laborum excepteur duis aliqua officia irure Lorem in esse adipisicing Lorem.
  Elit non laborum reprehenderit nostrud do ad magna irure voluptate.
  Pariatur enim reprehenderit nulla minim.
  Lorem sit incididunt Lorem mollit sunt nisi est pariatur ipsum.`

  const typescales = [
    { name: 'Display', class: 'typescale-display' },
    { name: 'Headline', class: 'typescale-headline' },
    { name: 'Title', class: 'typescale-title' },
    { name: 'Body', class: 'typescale-body' },
    { name: 'Label', class: 'typescale-label' },
  ]

  const elements: HTMLElement[] = $state([])
  let measures: { fontSize: string; lineHeight: string }[] = $state([])

  function recalculate() {
    measures = elements.map((element) => {
      const style = window.getComputedStyle(element)
      return {
        fontSize: style.getPropertyValue('font-size'),
        lineHeight: style.getPropertyValue('line-height'),
      }
    })
  }

  let containerWidth: number = $state(0)

  $effect(() => {
    containerWidth
    recalculate()
  })

  function resizable(element: HTMLElement, handlerId: string) {
    const handler = document.getElementById(handlerId)
    if (!handler) return
    let controller: AbortController | undefined
    let width = 0
    let x = 0

    function start({ screenX }: { screenX: number }) {
      width = element.clientWidth
      x = screenX
      controller = new AbortController()
      document.body.style.setProperty('cursor', 'ew-resize')
      document.body.addEventListener('mousemove', resize, { signal: controller.signal })
      document.body.addEventListener('mouseup', terminate, { once: true })
    }

    function resize({ screenX }: { screenX: number }) {
      const dx = screenX - x
      x = screenX
      width += dx
      element.style.setProperty('width', `${width}px`)
    }

    function terminate() {
      document.body.style.removeProperty('cursor')
      controller?.abort()
    }

    handler.addEventListener('mousedown', (event) => start(event))
  }
</script>

<article class="container mx-auto space-y-layout-gap p-layout-gap">
  <header>
    <h1 class="typescale-headline">Typography</h1>
  </header>
  <section
    class="ui-toolbar sticky top-layout-header-height z-1 bg-default"
    aria-label="Herramientas">
    <div class="ui-field">
      <label class="ui-label">
        <UiCheckbox bind:checked={themeState.showGridlines}></UiCheckbox>
        <span class="cursor-pointer">Mostrar cuadrícula</span>
      </label>
    </div>
  </section>

  <section
    class="relative grid min-w-min max-w-max grid-cols-[max-content,minmax(480px,1024px)] overflow-hidden"
    use:resizable={'resize-handler'}>
    <div class="relative isolate col-start-2 my-2 grid border-l-2 border-r-2 border-accent py-3">
      <div class="absolute top-1/2 h-px w-full border-b border-accent">
        <div
          class="typescale-label mx-auto w-max -translate-y-1/2 rounded-[4px] px-2 font-mono shadow color-accent surface">
          {containerWidth}px
        </div>
      </div>
    </div>
    <div class="row-span-5 row-start-2 grid grid-rows-subgrid">
      {#each typescales as typescale, index}
        <div class="pr-4 pt-4 text-right">
          <div class="mb-4 font-bold">{typescale.name}</div>
          <div class="typescale-label font-mono opacity-75">
            Font size: {measures[index]?.fontSize}
          </div>
          <div class="typescale-label font-mono opacity-75">
            Line height: {measures[index]?.lineHeight}
          </div>
        </div>
      {/each}
    </div>
    <div class="row-span-5 row-start-2 grid grid-rows-subgrid" bind:clientWidth={containerWidth}>
      {#each typescales as typescale, index}
        <div class="@container">
          <div class="h-full border-x-2 p-4">
            <p
              class={clsx(
                typescale.class,
                'line-clamp-3',
                themeState.showGridlines && 'line-height-gridlines',
              )}
              bind:this={elements[index]}>
              {textSample}
            </p>
          </div>
        </div>
      {/each}
    </div>
    <div
      class="absolute right-0 top-0 h-full w-2 cursor-ew-resize border-l-4 border-l-transparent bg-clip-content transition-colors color-primary surface-hoverable surface-activable"
      id="resize-handler">
    </div>
  </section>
</article>

<style lang="postcss">
  .line-height-gridlines {
    @apply outline outline-2 outline-default-line;
    background-image: repeating-linear-gradient(
      transparent,
      transparent 1lh,
      theme('colors.default.line') 1lh,
      theme('colors.default.line') calc(1lh + 2px)
    );
  }
</style>
