<script lang="ts">
  import { faSlash, faWarning, faWifi } from '@fortawesome/free-solid-svg-icons'
  import type { Snippet } from 'svelte'
  import Fa, { FaLayers } from 'svelte-fa'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

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

  const error: App.Error = online
    ? { code, name, message }
    : {
        name: 'Sin Conexión',
        message:
          'No hay conexión a internet. Actualice la página una vez que se haya restablecido el servicio.',
      }

  const actions = online
    ? [{ label: 'Ir al inicio', handler: () => goto('/') }]
    : [{ label: 'Actualizar', handler: () => window.location.reload() }]

  const title = (error.code ? `Error ${error.code}` : `Error`) + `: ${error.name}`
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<main class="container min-h-full mx-auto grid items-center p-layout-gap">
  <article
    class="surface color-neutral p-6 space-y-6 w-full mx-auto max-w-screen-sm rounded-card shadow zoom-lg">
    <header class="flex items-center gap-4">
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
      <h1 class="text-xl text-balance">{error.name}</h1>
    </header>
    <div class="space-y-4">
      <p class="text-pretty">{error.message}</p>
      {#if children}
        {@render children()}
      {/if}
    </div>
    <footer class="flex gap-4">
      {#each actions as action}
        <button class="ui-button ui-button-outlined grow" onclick={action.handler}
          >{action.label}</button>
      {/each}
    </footer>
  </article>
</main>
