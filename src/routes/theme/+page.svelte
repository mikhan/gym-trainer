<script lang="ts">
  import UiButton from '$lib/components/ui/ui-button.svelte'
  import Showcase from './Showcase.svelte'
  import AppTopbar from '$lib/components/app/app-topbar.svelte'
  import UiCheckbox from '$lib/components/ui/ui-checkbox.svelte'
  import ColorInput from './ColorInput.svelte'
  import Fa from 'svelte-fa'
  import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
  import { PersistedState } from '$lib/states/persisted-state.svelte'
  import { onMount } from 'svelte'

  const { data } = $props()

  const themeState = new PersistedState(
    'theme:state',
    {
      showFocusAndSelection: false,
      layout: 'showcase' as 'showcase' | 'swatch',
      openPanels: {} as Record<string, boolean>,
    },
    'session',
  )

  const themeConfig = {
    hues: [
      { name: 'neutral', varName: '--color-neutral-hue' },
      { name: 'primary', varName: '--color-primary-hue' },
      { name: 'secondary', varName: '--color-secondary-hue' },
      { name: 'accent', varName: '--color-accent-hue' },
    ],
    colors: [
      { name: 'canvas', shades: [''] },
      { name: 'neutral', shades: ['darkest', 'darker', '', 'lighter', 'lightest'] },
      { name: 'primary', shades: ['darker', '', 'lighter'] },
      { name: 'secondary', shades: ['darker', '', 'lighter'] },
      { name: 'accent', shades: ['darker', '', 'lighter'] },
      { name: 'popover', shades: [''] },
    ],
  }

  const components = ['', 'fg', 'line']
  let container: HTMLElement
  let theme = $state(structuredClone(data.theme))
  let pristine = $state(true)

  function getVarName(color: string, shade: string, component: string) {
    return `--color-${color}` + (shade ? `-${shade}` : '') + (component ? `-${component}` : '')
  }

  function getValue(color: string, shade: string, component: string) {
    return `var(${getVarName(color, shade, component)})`
  }

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
      container.style.setProperty(varName, value)
    }
  })
</script>

<svelte:head>
  <title>Theme Editor</title>
</svelte:head>

<AppTopbar>
  Theme Editor

  {#snippet actions()}
    <label>
      <UiCheckbox bind:checked={themeState.value.showFocusAndSelection}></UiCheckbox>
      <span class="text-sm">Show focus and selection</span>
    </label>
    <label class="flex">
      <select class="ui-input text-sm" bind:value={themeState.value.layout}>
        <option value="showcase">Showcase</option>
        <option value="swatch">Swatch</option>
      </select>
    </label>
  {/snippet}
</AppTopbar>

<div class="grid size-full grid-cols-[400px,1fr] grid-rows-1 contain-size">
  <form
    class="overflow-y-auto border-l border-canvas-line scrollbar-thin scrollbar-thumb-neutral-lighter scrollbar-track-neutral"
    method="POST">
    <div class="flex flex-col gap-8 py-8">
      <h1 class="px-3 text-xl">Hues</h1>
      <div class="divide-y divide-canvas-line">
        {#each themeConfig.hues as hue}
          <label class="grid gap-1 p-3">
            <span class="text-sm">{hue.varName} :</span>
            <input type="hidden" name={hue.varName} bind:value={theme.tokens[hue.varName]} />
            <ColorInput
              type="hue"
              bind:value={theme.tokens[hue.varName]}
              onchange={(value) => update(hue.varName, value)}></ColorInput>
          </label>
        {/each}
      </div>

      <h1 class="px-3 text-xl">Colors</h1>

      <div class="divide-y divide-canvas-line border-y border-canvas-line">
        {#each themeConfig.colors as color}
          {#each color.shades as shade}
            <details bind:open={themeState.value.openPanels[getVarName(color.name, shade, '')]}>
              <summary
                class="flex cursor-pointer select-none list-none items-center p-3 hover:bg-canvas-hover">
                <h2 class="grow capitalize">{color.name} {shade}</h2>
                <Fa icon={faChevronDown}></Fa>
              </summary>
              <div class="divide-y divide-canvas-line">
                {#each components as component}
                  {@const varName = getVarName(color.name, shade, component)}
                  <input type="hidden" name={varName} bind:value={theme.tokens[varName]} />
                  <label class="grid gap-1 p-3">
                    <span class="font-mono text-xs">{varName}:</span>
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
        <UiButton class="grow" type="submit" variant="primary">Save</UiButton>
      </div>
    {/if}
  </form>

  <div class="overflow-auto bg-canvas text-canvas-fg scrollbar-thin" bind:this={container}>
    <article class="container mx-auto p-layout-gap">
      <div class="space-y-2">
        <p class="typescale-display">
          Tempor dolor dolore et sit. Qui ut minim aliquip est nisi fugiat adipisicing aliquip id
          exercitation.
        </p>
        <p class="typescale-headline">
          In eiusmod irure magna elit dolore sint minim fugiat aliquip ex veniam elit tempor. Esse
          proident sit ea dolore elit ad veniam ea officia ex.
        </p>
        <p class="typescale-title">
          Laborum aute aute minim minim est aute mollit reprehenderit ad ullamco magna sunt cillum
          eiusmod. Dolor commodo amet nisi reprehenderit ut.
        </p>
        <p class="typescale-body">
          Sint mollit nisi exercitation irure adipisicing elit. Ad commodo duis anim adipisicing et
          culpa irure fugiat quis culpa pariatur. Nisi laboris magna eiusmod irure ut ex et. Amet
          eiusmod cupidatat nisi labore voluptate nisi minim. Nulla sit id nostrud pariatur non.
          Dolore sit minim laborum nulla irure id eiusmod. Eiusmod commodo culpa ex laboris.
        </p>
        <p class="typescale-label">
          Labore Lorem id cupidatat commodo id commodo est cillum ullamco anim adipisicing. Veniam
          quis enim aute enim voluptate pariatur. Ex ad ad culpa consequat. Dolor excepteur deserunt
          ad quis. Deserunt veniam nisi aliqua consequat cillum mollit irure culpa voluptate. Dolor
          commodo ut non ut qui labore excepteur pariatur voluptate eu culpa incididunt mollit esse.
        </p>
      </div>
      {#each themeConfig.colors as color}
        <h1 class="my-4 font-bold capitalize">{color.name}</h1>
        <ul class="flex flex-wrap gap-4">
          {#each color.shades as shade}
            <li
              style:--color-surface={getValue(color.name, shade, '')}
              style:--color-surface-fg={getValue(color.name, shade, 'fg')}
              style:--color-surface-line={getValue(color.name, shade, 'line')}
              style:--color-surface-hover={getValue(color.name, shade, 'hover')}>
              {#if themeState.value.layout === 'showcase'}
                <Showcase
                  {color}
                  {shade}
                  showFocusAndSelection={themeState.value.showFocusAndSelection}></Showcase>
              {:else if themeState.value.layout === 'swatch'}
                <div class="h-24 w-32 rounded-card bg-surface shadow"></div>
              {/if}
              <div class="mt-2 text-center text-sm">{color.name + (shade ? '-' + shade : '')}</div>
            </li>
          {/each}
        </ul>
      {/each}
    </article>
  </div>
</div>
