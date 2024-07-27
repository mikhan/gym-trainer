<script lang="ts">
  import AppActions from '$lib/components/app/app-actions.svelte'
  import UiCheckbox from '$lib/components/ui/ui-checkbox.svelte'
  import clsx from 'clsx'

  const theme = {
    colors: [
      { name: 'canvas', shades: [''] },
      { name: 'neutral', shades: ['darkest', 'darker', '', 'lighter', 'lightest'] },
      { name: 'primary', shades: ['darker', '', 'lighter'] },
      { name: 'accent', shades: ['darker', '', 'lighter'] },
      { name: 'popover', shades: [''] },
    ],
  }

  let showFocusAndSelection = $state(false)

  function getValue(color: string, shade: string, component?: string) {
    const name = color + (shade ? `-${shade}` : '') + (component ? `-${component}` : '')
    return `var(--color-${name})`
  }
</script>

<AppActions>
  <label>
    <UiCheckbox bind:checked={showFocusAndSelection}></UiCheckbox>
    <span class="text-sm">Show focus and selection</span>
  </label>
</AppActions>

<div class="h-full overflow-auto">
  <article class="container mx-auto p-layout-gap">
    {#each theme.colors as color}
      <h1 class="my-4 font-bold capitalize">{color.name}</h1>
      <ul class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {#each color.shades as shade}
          <li
            style:--color-surface={getValue(color.name, shade)}
            style:--color-surface-fg={getValue(color.name, shade, 'fg')}
            style:--color-surface-border={getValue(color.name, shade, 'border')}
            style:--color-surface-hover={getValue(color.name, shade, 'hover')}>
            <div
              class="bg-surface text-surface-fg divide-surface-border grid cursor-default divide-y rounded-card shadow">
              <div class="space-y-2 p-4">
                <p>
                  <b>The brown fox</b> jumps over the
                  <span class={clsx(showFocusAndSelection && 'bg-selection text-selection-fg')}
                    >lazy dog</span
                  >.
                </p>
                <p>
                  <small><b>Sphinx of black</b> quartz, judge my vow</small>
                </p>
              </div>
              <div class="flex gap-2 p-2">
                <button
                  class="border-surface-border hover:bg-surface-hover focusable grow rounded-button border p-2"
                  type="button">Button</button>
                <button
                  class="border-surface-border bg-surface-hover focusable grow rounded-button border p-2"
                  type="button">Button</button>
                <button
                  class={clsx(
                    'border-surface-border bg-surface-hover focusable grow rounded-button border p-2',
                    showFocusAndSelection && 'outline outline-2 -outline-offset-2 outline-ring',
                  )}
                  type="button">Button</button>
              </div>
            </div>
            <div class="mt-2 text-center text-sm">{color.name + (shade ? '-' + shade : '')}</div>
          </li>
        {/each}
      </ul>
    {/each}
  </article>
</div>
