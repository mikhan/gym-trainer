<script lang="ts">
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import Fa from 'svelte-fa'
  import AppMetadata from '../app/AppMetadata.svelte'
  import UiIconbutton from '../ui/ui-iconbutton.svelte'
  import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
  import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
  import UiMenu from '../ui/ui-menu.svelte'
  import UiMenuitem from '../ui/ui-menuitem.svelte'

  type Props = {
    trainings: Types.Training[]
  }
  const { trainings }: Props = $props()

  function deleteTraining(id: string) {
    console.log('delete', id)
  }
</script>

<AppMetadata title="Entrenamientos"></AppMetadata>

<AppTopbar title="Entrenamientos"></AppTopbar>

<div class="size-full overflow-y-auto">
  <ul class="container mx-auto grid gap-layout-gap p-layout-gap grid-cols-fill-64">
    {#each trainings as training}
      <li
        class="group relative flex h-64 flex-col rounded-card border p-6 shadow contain-paint color-neutral surface">
        <div class="flex gap-2">
          <a class="grow" href={`/trainings/${training.id}`}>
            <div class="absolute inset-0 -z-1 transition-colors group-hover:bg-default-hover"></div>
            <div class="typescale-title">{training.name}</div>
            <div>{training.routines.length} rutinas</div>
          </a>
          <UiIconbutton label="Más acciones" id={`training-${training.id}-actions`}>
            <Fa icon={faEllipsisV}></Fa></UiIconbutton>
        </div>
      </li>
      <UiMenu target={`training-${training.id}-actions`}>
        <UiMenuitem onclick={() => deleteTraining(training.id)}>
          {#snippet icon()}
            <Fa icon={faTrashAlt}></Fa>
          {/snippet}
          Eliminar entrenamiento
        </UiMenuitem>
      </UiMenu>
    {/each}
  </ul>
</div>
