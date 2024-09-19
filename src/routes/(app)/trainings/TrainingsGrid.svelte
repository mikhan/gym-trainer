<script lang="ts">
  import { faPlus } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'
  import TrainingsGridItem from './TrainingsGridItem.svelte'

  type Props = {
    trainings: Types.Training[]
  }
  const { trainings }: Props = $props()

  async function addTraining() {
    console.log('Add training')
  }
</script>

<ul class="flex flex-wrap gap-layout-gap *:flex-auto">
  {#each trainings as training}
    <TrainingsGridItem {training}></TrainingsGridItem>
  {/each}
  <li class="min-h-20 min-w-20 max-w-96 @container">
    <button
      class="group grid size-full place-content-center gap-2 rounded-card p-4 transition-colors surface surface-editable surface-hoverable surface-outlined surface-focusable"
      type="button"
      title="Crear entrenamiento"
      onclick={async () => addTraining()}>
      <span
        class="flex items-center gap-4 text-left opacity-50 transition-opacity group-hover:opacity-100">
        <Fa icon={faPlus} size="lg"></Fa>
        <span class="hidden text-lg @xs:inline">Crear entrenamiento</span>
      </span>
    </button>
  </li>
</ul>
