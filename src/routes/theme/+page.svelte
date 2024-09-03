<script lang="ts">
  import ThemeColor from './ThemeColor.svelte'
  import ThemeTypography from './ThemeTypography.svelte'
  import CSSValue from './CSSValue.svelte'
  import UiButton from '$lib/components/ui/ui-button.svelte'
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import Fa from 'svelte-fa'
  import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
  import { getSessionState } from '$lib/states/persisted-state.svelte'
  import { onMount } from 'svelte'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import AppAside from '$lib/components/app/AppAside.svelte'
  import AppMetadata from '$lib/components/app/AppMetadata.svelte'

  const { data } = $props()

  const themeState = getSessionState('Theme.state', {
    showFocusAndSelection: false,
    layout: 'showcase' as 'showcase' | 'swatch',
    openPanels: {} as Record<string, boolean>,
    typescale: { showGridlines: true },
  }).value

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

<AppMetadata title="Theme Editor"></AppMetadata>

<AppTopbar title="Theme Editor"></AppTopbar>

<AppShellSection name="aside">
  <AppAside class="color-neutral surface" title="Variables">
    <form method="POST">
      <div class="flex flex-col gap-8">
        <h1 class="px-3 font-bold uppercase">Hues</h1>
        <div class="divide-y divide-default-line">
          {#each themeConfig.hues as hue}
            <div class="space-y-3 p-3">
              {#each hue.variants as variant}
                {@const varName = getVarName(hue.name, variant, '')}
                <CSSValue
                  name={varName}
                  value={theme.tokens[varName]}
                  onchange={(value) => update(varName, value)}></CSSValue>
              {/each}
            </div>
          {/each}
        </div>

        <h1 class="px-3 font-bold uppercase">Colors</h1>

        <div class="divide-y divide-default-line border-y border-default-line">
          {#each themeConfig.colors as color}
            {#each color.variants as variant}
              <details bind:open={themeState.openPanels[getVarName(color.name, variant, '')]}>
                <summary
                  class="flex cursor-pointer select-none list-none items-center p-3 hover:bg-default-hover">
                  <h2 class="grow capitalize">{color.name} {variant}</h2>
                  <Fa icon={faChevronDown}></Fa>
                </summary>
                <div class="space-y-3 p-3">
                  {#each components as component}
                    {@const varName = getVarName(color.name, variant, component)}
                    <CSSValue
                      name={varName}
                      value={theme.tokens[varName]}
                      onchange={(value) => update(varName, value)}></CSSValue>
                  {/each}
                </div>
              </details>
            {/each}
          {/each}
        </div>
      </div>
      {#if !pristine}
        <div
          class="sticky bottom-0 z-1 flex gap-2 border-t border-default-line bg-default px-4 py-2">
          <UiButton class="grow" onclick={reset}>Reset</UiButton>
          <UiButton class="grow color-primary" type="submit">Save</UiButton>
        </div>
      {/if}
    </form>
  </AppAside>
</AppShellSection>

<div class="space-y-layout-gap" bind:this={container}>
  <ThemeTypography></ThemeTypography>
  <ThemeColor></ThemeColor>
</div>
