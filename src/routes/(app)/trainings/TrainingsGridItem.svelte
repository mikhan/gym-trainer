<script lang="ts">
  import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
  import { faClone, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'
  import UiIconbutton from '$lib/components/ui/UiIconbutton.svelte'
  import UiMenu from '$lib/components/ui/UiMenu.svelte'
  import UiMenuitem from '$lib/components/ui/UiMenuitem.svelte'
  import UiMenutitle from '$lib/components/ui/UiMenutitle.svelte'

  type Props = {
    training: Types.Training
  }
  const { training }: Props = $props()

  async function deleteTraining(id: string) {
    console.log('delete', id)
  }

  async function cloneTraining(id: string) {
    console.log('clone training', id)
  }
</script>

<li class="isolate grid min-h-40 min-w-40 max-w-96 color-neutral *:col-start-1 *:row-start-1">
  <a
    class="flex gap-2 rounded-card p-4 shadow transition-colors surface surface-hoverable surface-activable surface-focusable"
    href={`/trainings/${training.id}`}>
    <div class="grow content-end">
      <div class="typescale-title line-clamp-2 text-balance">{training.name}</div>
      <div class="typescale-label">{training.routines.length} rutinas</div>
    </div>
    <div class="grid size-10 flex-none place-content-center"></div>
  </a>
  <UiIconbutton
    class="m-4 place-self-end"
    label="Más acciones"
    id={`training-${training.id}-actions`}>
    <Fa icon={faEllipsisV}></Fa></UiIconbutton>
</li>
<UiMenu target={`training-${training.id}-actions`}>
  <UiMenutitle>Acciones</UiMenutitle>
  <UiMenuitem onclick={() => cloneTraining(training.id)}>
    {#snippet icon()}
      <Fa icon={faClone}></Fa>
    {/snippet}
    Duplicar entrenamiento
  </UiMenuitem>
  <UiMenuitem onclick={() => deleteTraining(training.id)}>
    {#snippet icon()}
      <Fa icon={faTrashAlt}></Fa>
    {/snippet}
    Eliminar entrenamiento
  </UiMenuitem>
</UiMenu>
