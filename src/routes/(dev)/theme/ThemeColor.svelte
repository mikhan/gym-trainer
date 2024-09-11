<script lang="ts">
  import Showcase from './Showcase.svelte'
  import UiCheckbox from '$lib/components/ui/ui-checkbox.svelte'
  import { getPersistedState } from '$lib/states/persisted-state.svelte'

  const themeState = getPersistedState('session', 'ThemeColor.state', {
    layout: 'showcase' as 'showcase' | 'swatch',
    showFocus: false,
    showSelection: false,
  })

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

  function getName(color: string, shade: string) {
    return color + (shade ? `-${shade}` : '')
  }
</script>

<article class="container mx-auto space-y-layout-gap p-layout-gap">
  <header>
    <h1 class="typescale-headline mb-4">Color</h1>
  </header>
  <section class="ui-toolbar" aria-label="Herramientas">
    <label class="ui-field">
      <select class="ui-input" bind:value={themeState.layout}>
        <option value="showcase">Showcase</option>
        <option value="swatch">Swatch</option>
      </select>
    </label>
    {#if themeState.layout === 'showcase'}
      <div class="ui-field">
        <label class="ui-label">
          <UiCheckbox bind:checked={themeState.showFocus}></UiCheckbox>
          <span class="cursor-pointer">Show focus</span>
        </label>
      </div>
      <div class="ui-field">
        <label class="ui-label">
          <UiCheckbox bind:checked={themeState.showSelection}></UiCheckbox>
          <span class="cursor-pointer">Show selection</span>
        </label>
      </div>
    {/if}
  </section>
  {#each themeConfig.colors as color}
    <h1 class="font-bold capitalize">{color.name}</h1>
    <ul class="flex flex-wrap gap-4">
      {#each color.variants as shade}
        {@const varName = getName(color.name, shade)}
        <li>
          {#if themeState.layout === 'showcase'}
            <Showcase
              class={`color-${varName}`}
              showFocus={themeState.showFocus}
              showSelection={themeState.showSelection}></Showcase>
          {:else if themeState.layout === 'swatch'}
            <div class={`color-${varName} h-24 w-32 rounded-card bg-default shadow`}></div>
          {/if}
          <div class="mt-2 text-center text-sm">{varName}</div>
        </li>
      {/each}
    </ul>
  {/each}
</article>
