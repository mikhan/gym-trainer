<script lang="ts">
  import UiButton from '$lib/components/ui/ui-button.svelte'
  import Showcase from './Showcase.svelte'
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import UiCheckbox from '$lib/components/ui/ui-checkbox.svelte'
  import ColorInput from './ColorInput.svelte'
  import Fa from 'svelte-fa'
  import { faAnglesLeft, faAnglesRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
  import { SessionStorageState } from '$lib/states/persisted-state.svelte'
  import { onMount } from 'svelte'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'

  const { data } = $props()

  const themeState = new SessionStorageState('theme:state', {
    sidebar: { open: true },
    showFocusAndSelection: false,
    layout: 'showcase' as 'showcase' | 'swatch',
    openPanels: {} as Record<string, boolean>,
    typescale: { showGridlines: true },
  }).value

  themeState.typescale = { showGridlines: true }

  const themeConfig = {
    hues: [
      { name: 'neutral', variants: ['hue'] },
      { name: 'primary', variants: ['hue'] },
      { name: 'secondary', variants: ['hue'] },
      { name: 'accent', variants: ['hue'] },
    ],
    colors: [
      { name: 'canvas', variants: [''] },
      { name: 'neutral', variants: ['darkest', 'darker', '', 'lighter', 'lightest'] },
      { name: 'primary', variants: ['darker', '', 'lighter'] },
      { name: 'secondary', variants: ['darker', '', 'lighter'] },
      { name: 'accent', variants: ['darker', '', 'lighter'] },
      { name: 'popover', variants: [''] },
    ],
  }
  const components = ['', 'fg', 'line']

  const varNamesSafeList = [...themeConfig.hues, ...themeConfig.colors]
    .map(({ name, variants }) =>
      variants.map((variant) =>
        components.map((component) => getVarName(name, variant, component)),
      ),
    )
    .flat(2)

  let container: HTMLElement
  let theme = $state(structuredClone(data.theme))
  let pristine = $state(true)

  function getName(color: string, shade: string) {
    return color + (shade ? `-${shade}` : '')
  }

  function getVarName(color: string, shade: string, component: string) {
    return `--color-${getName(color, shade)}` + (component ? `-${component}` : '')
  }

  // function getVar(color: string, shade: string, component: string) {
  //   return `var(${getVarName(color, shade, component)})`
  // }

  function reset() {
    theme = structuredClone(data.theme)
    container.removeAttribute('style')
    pristine = true
  }

  function update(varName: string, value: string) {
    pristine = false
    container.style.setProperty(varName, value)
  }

  onMount(() => {
    for (const [varName, value] of Object.entries(theme.tokens)) {
      if (varNamesSafeList.includes(varName)) {
        container.style.setProperty(varName, value)
      } else {
        delete theme.tokens[varName]
      }
    }
  })
</script>

<svelte:head>
  <title>Theme Editor</title>
</svelte:head>

<AppTopbar title="Theme Editor"></AppTopbar>

<div class="grid grid-cols-[max-content,1fr]">
  {#if themeState.sidebar.open}
    <form
      class="sticky top-layout-header-height h-layout-viewport-height w-96 overflow-y-auto border-r scrollbar-thin surface"
      method="POST">
      <div class="flex p-4">
        <UiIconbutton label="Contraer barra" onclick={() => (themeState.sidebar.open = false)}>
          <Fa icon={faAnglesLeft}></Fa>
        </UiIconbutton>
      </div>
      <div class="flex flex-col gap-8 py-8">
        <h1 class="px-3 text-xl">Hues</h1>
        <div class="divide-y divide-canvas-line">
          {#each themeConfig.hues as hue}
            {#each hue.variants as variant}
              {@const varName = getVarName(hue.name, variant, '')}
              <label class="grid gap-1 p-3">
                <span class="font-mono text-xs">{varName}:</span>
                <input type="hidden" name={varName} bind:value={theme.tokens[varName]} />
                <ColorInput
                  type="hue"
                  bind:value={theme.tokens[varName]}
                  onchange={(value) => update(varName, value)}></ColorInput>
              </label>
            {/each}
          {/each}
        </div>

        <h1 class="px-3 text-xl">Colors</h1>

        <div class="divide-y divide-canvas-line border-y border-canvas-line">
          {#each themeConfig.colors as color}
            {#each color.variants as variant}
              <details bind:open={themeState.openPanels[getVarName(color.name, variant, '')]}>
                <summary
                  class="flex cursor-pointer select-none list-none items-center p-3 hover:bg-canvas-hover">
                  <h2 class="grow capitalize">{color.name} {variant}</h2>
                  <Fa icon={faChevronDown}></Fa>
                </summary>
                <div class="">
                  {#each components as component}
                    {@const varName = getVarName(color.name, variant, component)}
                    <label class="grid gap-1 p-3">
                      <span class="font-mono text-xs">{varName}:</span>
                      <input type="hidden" name={varName} bind:value={theme.tokens[varName]} />
                      <ColorInput
                        type="lch"
                        bind:value={theme.tokens[varName]}
                        onchange={(value) => update(varName, value)}></ColorInput>
                    </label>
                  {/each}
                </div>
              </details>
            {/each}
          {/each}
        </div>
      </div>
      {#if !pristine}
        <div class="sticky bottom-0 z-1 flex gap-2 border-t border-canvas-line bg-canvas px-4 py-2">
          <UiButton class="grow" onclick={reset}>Reset</UiButton>
          <UiButton class="grow color-primary" type="submit">Save</UiButton>
        </div>
      {/if}
    </form>
  {:else}
    <div class="border-r border-canvas-line">
      <div class="flex p-4">
        <UiIconbutton
          class="ml-auto"
          label="Contraer barra"
          onclick={() => (themeState.sidebar.open = true)}>
          <Fa icon={faAnglesRight}></Fa>
        </UiIconbutton>
      </div>
    </div>
  {/if}

  <div
    class="space-y-8 overflow-auto bg-canvas text-canvas-fg scrollbar-thin"
    bind:this={container}>
    <article class="container mx-auto space-y-layout-gap p-layout-gap">
      <header>
        <h1 class="typescale-headline">Typography</h1>
      </header>
      <section class="ui-toolbar" aria-label="Herramientas">
        <div class="ui-field">
          <label class="ui-label">
            <UiCheckbox bind:checked={themeState.typescale.showGridlines}></UiCheckbox>
            <span class="cursor-pointer">Mostrar cuadrícula</span>
          </label>
        </div>
      </section>
      <section class="grid max-w-prose grid-cols-[auto,1fr] items-baseline">
        <div class="pr-4 text-right font-bold">Display</div>
        <div class="border-l-2 p-4">
          <p
            class="typescale-display"
            class:line-height-gridlines={themeState.typescale.showGridlines}>
            Tempor dolor dolore et sit. Qui ut minim aliquip est nisi fugiat adipisicing aliquip id
            exercitation.
          </p>
        </div>
        <div class="pr-4 text-right font-bold">Headline</div>
        <div class="border-l-2 p-4">
          <p
            class="typescale-headline"
            class:line-height-gridlines={themeState.typescale.showGridlines}>
            In eiusmod irure magna elit dolore sint minim fugiat aliquip ex veniam elit tempor. Esse
            proident sit ea dolore elit ad veniam ea officia ex.
          </p>
        </div>
        <div class="pr-4 text-right font-bold">Title</div>

        <div class="border-l-2 p-4">
          <p
            class="typescale-title"
            class:line-height-gridlines={themeState.typescale.showGridlines}>
            Laborum aute aute minim minim est aute mollit reprehenderit ad ullamco magna sunt cillum
            eiusmod. Dolor commodo amet nisi reprehenderit ut.
          </p>
        </div>
        <div class="pr-4 text-right font-bold">Body</div>
        <div class="border-l-2 p-4">
          <p
            class="typescale-body"
            class:line-height-gridlines={themeState.typescale.showGridlines}>
            Sint mollit nisi exercitation irure adipisicing elit. Ad commodo duis anim adipisicing
            et culpa irure fugiat quis culpa pariatur. Nisi laboris magna eiusmod irure ut ex et.
            Amet eiusmod cupidatat nisi labore voluptate nisi minim. Nulla sit id nostrud pariatur
            non. Dolore sit minim laborum nulla irure id eiusmod. Eiusmod commodo culpa ex laboris.
          </p>
        </div>
        <div class="pr-4 text-right font-bold">Label</div>
        <div class="border-l-2 p-4">
          <p
            class="typescale-label"
            class:line-height-gridlines={themeState.typescale.showGridlines}>
            Labore Lorem id cupidatat commodo id commodo est cillum ullamco anim adipisicing. Veniam
            quis enim aute enim voluptate pariatur. Ex ad ad culpa consequat. Dolor excepteur
            deserunt ad quis. Deserunt veniam nisi aliqua consequat cillum mollit irure culpa
            voluptate. Dolor commodo ut non ut qui labore excepteur pariatur voluptate eu culpa
            incididunt mollit esse.
          </p>
        </div>
      </section>
    </article>

    <article class="container mx-auto space-y-layout-gap p-layout-gap">
      <header>
        <h1 class="typescale-headline mb-4">Color</h1>
      </header>
      <section class="ui-toolbar" aria-label="Herramientas">
        <div class="ui-field">
          <label class="ui-label">
            <UiCheckbox bind:checked={themeState.showFocusAndSelection}></UiCheckbox>
            <span class="cursor-pointer">Show focus and selection</span>
          </label>
        </div>
        <label class="ui-field">
          <select class="ui-input" bind:value={themeState.layout}>
            <option value="showcase">Showcase</option>
            <option value="swatch">Swatch</option>
          </select>
        </label>
        <label class="ui-field">
          <select class="ui-input" bind:value={themeState.layout}>
            <option value="showcase">Showcase</option>
            <option value="swatch">Swatch</option>
          </select>
        </label>
      </section>
      {#each themeConfig.colors as color}
        <h1 class="font-bold capitalize">{color.name}</h1>
        <ul class="flex flex-wrap gap-4">
          {#each color.variants as shade}
            <li>
              {#if themeState.layout === 'showcase'}
                <Showcase
                  class={`color-${getName(color.name, shade)}`}
                  showFocusAndSelection={themeState.showFocusAndSelection}></Showcase>
              {:else if themeState.layout === 'swatch'}
                <div class="bg-surface h-24 w-32 rounded-card shadow"></div>
              {/if}
              <div class="mt-2 text-center text-sm">{getName(color.name, shade)}</div>
            </li>
          {/each}
        </ul>
      {/each}
    </article>
  </div>
</div>

<style lang="postcss">
  .line-height-gridlines {
    @apply outline outline-1 outline-canvas-line;
    background-image: repeating-linear-gradient(
      transparent,
      transparent 1lh,
      theme('colors.canvas.line') 1lh,
      theme('colors.canvas.line') calc(1lh + 1px)
    );
  }
</style>
