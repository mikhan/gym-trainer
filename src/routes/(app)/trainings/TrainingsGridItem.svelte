<script lang="ts">
  import Fa from 'svelte-fa'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
  import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
  import UiMenu from '$lib/components/ui/ui-menu.svelte'
  import UiMenuitem from '$lib/components/ui/ui-menuitem.svelte'
  import UiMenutitle from '$lib/components/ui/ui-menutitle.svelte'

  type Props = {
    training: Types.Training
  }
  const { training }: Props = $props()

  function deleteTraining(id: string) {
    console.log('delete', id)
  }
</script>

<li
  class="group relative flex h-40 flex-col rounded-card border p-4 shadow contain-paint color-neutral surface">
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
  <UiMenutitle>Acciones</UiMenutitle>
  <UiMenuitem onclick={() => deleteTraining(training.id)}>
    {#snippet icon()}
      <Fa icon={faTrashAlt}></Fa>
    {/snippet}
    Eliminar entrenamiento
  </UiMenuitem>
</UiMenu>
