<script lang="ts">
  import UiCheckbox from '$lib/components/ui/ui-checkbox.svelte'
  import { getPersistedState } from '$lib/states/persisted-state.svelte'

  const themeState = getPersistedState('session', 'ThemeTypography.state', {
    showGridlines: true,
  })
</script>

<article class="container mx-auto space-y-layout-gap p-layout-gap">
  <header>
    <h1 class="typescale-headline">Typography</h1>
  </header>
  <section class="ui-toolbar" aria-label="Herramientas">
    <div class="ui-field">
      <label class="ui-label">
        <UiCheckbox bind:checked={themeState.showGridlines}></UiCheckbox>
        <span class="cursor-pointer">Mostrar cuadrícula</span>
      </label>
    </div>
  </section>
  <section class="grid max-w-prose grid-cols-[auto,1fr] items-baseline">
    <div class="pr-4 text-right font-bold">Display</div>
    <div class="border-l-2 p-4">
      <p class="typescale-display" class:line-height-gridlines={themeState.showGridlines}>
        Tempor dolor dolore et sit. Qui ut minim aliquip est nisi fugiat adipisicing aliquip id
        exercitation.
      </p>
    </div>
    <div class="pr-4 text-right font-bold">Headline</div>
    <div class="border-l-2 p-4">
      <p class="typescale-headline" class:line-height-gridlines={themeState.showGridlines}>
        In eiusmod irure magna elit dolore sint minim fugiat aliquip ex veniam elit tempor. Esse
        proident sit ea dolore elit ad veniam ea officia ex.
      </p>
    </div>
    <div class="pr-4 text-right font-bold">Title</div>

    <div class="border-l-2 p-4">
      <p class="typescale-title" class:line-height-gridlines={themeState.showGridlines}>
        Laborum aute aute minim minim est aute mollit reprehenderit ad ullamco magna sunt cillum
        eiusmod. Dolor commodo amet nisi reprehenderit ut.
      </p>
    </div>
    <div class="pr-4 text-right font-bold">Body</div>
    <div class="border-l-2 p-4">
      <p class="typescale-body" class:line-height-gridlines={themeState.showGridlines}>
        Sint mollit nisi exercitation irure adipisicing elit. Ad commodo duis anim adipisicing et
        culpa irure fugiat quis culpa pariatur. Nisi laboris magna eiusmod irure ut ex et. Amet
        eiusmod cupidatat nisi labore voluptate nisi minim. Nulla sit id nostrud pariatur non.
        Dolore sit minim laborum nulla irure id eiusmod. Eiusmod commodo culpa ex laboris.
      </p>
    </div>
    <div class="pr-4 text-right font-bold">Label</div>
    <div class="border-l-2 p-4">
      <p class="typescale-label" class:line-height-gridlines={themeState.showGridlines}>
        Labore Lorem id cupidatat commodo id commodo est cillum ullamco anim adipisicing. Veniam
        quis enim aute enim voluptate pariatur. Ex ad ad culpa consequat. Dolor excepteur deserunt
        ad quis. Deserunt veniam nisi aliqua consequat cillum mollit irure culpa voluptate. Dolor
        commodo ut non ut qui labore excepteur pariatur voluptate eu culpa incididunt mollit esse.
      </p>
    </div>
  </section>
</article>

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
