<script lang="ts">
  import UiButton from '$lib/components/ui/ui-button.svelte'
  import Showcase from './Showcase.svelte'
  import AppActions from '$lib/components/app/app-actions.svelte'
  import AppTopbar from '$lib/components/app/app-topbar.svelte'
  import UiCheckbox from '$lib/components/ui/ui-checkbox.svelte'
  import ColorInput from './ColorInput.svelte'

  const { data } = $props()

  let values = $state(data.values)

  const theme = {
    hues: [
      { name: 'neutral', varName: '--color-neutral-hue' },
      { name: 'primary', varName: '--color-primary-hue' },
      { name: 'accent', varName: '--color-accent-hue' },
    ],
    colors: [
      { name: 'canvas', shades: [''] },
      { name: 'neutral', shades: ['darkest', 'darker', '', 'lighter', 'lightest'] },
      { name: 'primary', shades: ['darker', '', 'lighter'] },
      { name: 'accent', shades: ['darker', '', 'lighter'] },
      { name: 'popover', shades: [''] },
    ],
  }

  const components = ['', 'fg', 'border', 'hover']

  let showFocusAndSelection = $state(false)
  let grid = $state('showcase')
  let styleSheet = $state() as HTMLStyleElement

  function getVarName(color: string, shade: string, component: string) {
    return `--color-${color}` + (shade ? `-${shade}` : '') + (component ? `-${component}` : '')
  }

  function getValue(color: string, shade: string, component: string) {
    return `var(${getVarName(color, shade, component)})`
  }

  function update(varName: string, value: string) {
    if (!styleSheet.sheet) return

    for (const rule of styleSheet.sheet.cssRules) {
      if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
        if (typeof value !== 'undefined') rule.style.setProperty(varName, value)
        break
      }
    }
  }
</script>

<svelte:head>
  <title>Theme Editor</title>
</svelte:head>

<AppTopbar>Theme Editor</AppTopbar>

<AppActions>
  <label>
    <UiCheckbox bind:checked={showFocusAndSelection}></UiCheckbox>
    <span class="text-sm">Show focus and selection</span>
  </label>
  <label>
    <span class="text-sm">Grid</span>
    <select bind:value={grid}>
      <option value="showcase">Showcase</option>
      <option value="swatch">Swatch</option>
    </select>
  </label>
</AppActions>

<div class="grid size-full grid-cols-[1fr,400px] grid-rows-1 contain-size">
  <style bind:this={styleSheet}>
    :root {
    }
  </style>
  <div class="overflow-auto">
    <article class="container mx-auto p-layout-gap">
      <!-- <pre>{JSON.stringify(values, null, 2)}</pre> -->
      {#each theme.colors as color}
        <h1 class="my-4 font-bold capitalize">{color.name}</h1>
        <ul class="flex flex-wrap gap-4">
          {#each color.shades as shade}
            <li
              style:--color-surface={getValue(color.name, shade, '')}
              style:--color-surface-fg={getValue(color.name, shade, 'fg')}
              style:--color-surface-border={getValue(color.name, shade, 'border')}
              style:--color-surface-hover={getValue(color.name, shade, 'hover')}>
              {#if grid === 'showcase'}
                <Showcase {color} {shade} {showFocusAndSelection}></Showcase>
              {:else if grid === 'swatch'}
                <div class="h-24 w-32 rounded-card bg-surface shadow"></div>
              {/if}
              <div class="mt-2 text-center text-sm">{color.name + (shade ? '-' + shade : '')}</div>
            </li>
          {/each}
        </ul>
      {/each}
    </article>
  </div>

  <form class="overflow-y-auto border-l border-canvas-border" method="POST">
    <div class="sticky top-0 z-1 border-b border-canvas-border bg-canvas px-4 py-2">
      <UiButton type="submit">Save</UiButton>
      <UiButton type="button" onclick={() => (values = { ...values })}>Update</UiButton>
    </div>

    <div class="flex flex-col gap-8 px-4 py-8">
      <h1 class="text-xl">Hues</h1>
      <div class="flex flex-col gap-4">
        {#each theme.hues as hue}
          <label class="grid gap-1">
            <div class="text-sm">{hue.varName} :</div>
            <input type="hidden" name={hue.varName} bind:value={values[hue.varName]} />
            <ColorInput
              type="hue"
              bind:value={values[hue.varName]}
              onchange={(value) => update(hue.varName, value)}></ColorInput>
          </label>
        {/each}
      </div>
      <h1 class="text-xl">Colors</h1>
      <div class="flex flex-col gap-4">
        {#each theme.colors as color}
          {#each color.shades as shade}
            <h2 class="capitalize">{color.name} {shade}</h2>
            {#each components as component}
              {@const varName = getVarName(color.name, shade, component)}
              <label class="grid w-full gap-1">
                <div class="text-sm">{varName}:</div>
                <input type="hidden" name={varName} bind:value={values[varName]} />
                <ColorInput
                  type="lch"
                  bind:value={values[varName]}
                  onchange={(value) => update(varName, value)}></ColorInput>
              </label>
            {/each}
          {/each}
        {/each}
      </div>
    </div>
  </form>
</div>
