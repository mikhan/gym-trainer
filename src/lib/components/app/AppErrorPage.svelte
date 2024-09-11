<script lang="ts">
  import { page } from '$app/stores'
  import { faChevronLeft, faSlash, faWarning, faWifi } from '@fortawesome/free-solid-svg-icons'
  import type { Snippet } from 'svelte'
  import Fa, { FaLayers } from 'svelte-fa'

  type Props = {
    children?: Snippet
    code?: string | number
    name?: string
    message?: string
  }

  const {
    children,
    code = $page.status,
    name = 'Error',
    message = 'Ha ocurrido un error inesperado.',
  }: Props = $props()

  const online = typeof navigator !== 'undefined' ? navigator.onLine : true

  const error = online
    ? { code, name, message }
    : {
        name: 'Sin Conexión',
        message:
          'No hay conexión a internet. Actualice la página una vez que se haya restablecido el servicio.',
      }

  const title = (error.code ? `Error ${error.code}` : `Error`) + `: ${error.name}`
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<main class="container mx-auto size-full items-start p-layout-gap">
  <article
    class="mx-auto max-w-screen-md space-y-4 rounded-card p-4 color-secondary surface surface-outlined">
    <header class="flex items-center gap-2">
      <div class="grid size-6 shrink-0 place-content-center">
        {#if online}
          <Fa icon={faWarning} />
        {:else}
          <FaLayers>
            <Fa icon={faWifi} />
            <Fa icon={faSlash} />
          </FaLayers>
        {/if}
      </div>
      <h1 class="typescale-title text-balance">{error.name}</h1>
    </header>
    <div>
      <p class="text-pretty">{error.message}</p>
      {#if children}
        {@render children()}
      {/if}
    </div>
    <footer class="flex gap-4">
      <button class="ui-button color-secondary-lighter" onclick={() => history.back()}>
        <Fa icon={faChevronLeft} fw />
        <span>Regresar</span>
      </button>
      <a class="ui-button" href="/">Inicio</a>
    </footer>
  </article>
</main>
