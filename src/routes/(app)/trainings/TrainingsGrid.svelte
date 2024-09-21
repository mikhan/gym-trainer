<script lang="ts">
  import { faPlus } from '@fortawesome/free-solid-svg-icons'
  import { createTraining } from '$data/trainings'
  import Fa from 'svelte-fa'
  import { getAppDatabaseContext } from '$lib/components/app/AppDatabaseContext.svelte'
  import TrainingsGridItem from './TrainingsGridItem.svelte'

  type Props = {
    trainings: Types.Training[]
  }
  const { trainings }: Props = $props()
  const database = getAppDatabaseContext()

  async function addTraining() {
    const name = prompt('Nombre del entrenamiento')
    if (name) {
      await createTraining(database, { id: crypto.randomUUID(), name, routines: [] })
    }
  }
</script>

{#each trainings as training}
  <div class="max-w-96 flex-auto">
    <TrainingsGridItem {training}></TrainingsGridItem>
  </div>
{/each}

<div class="min-h-20 min-w-20 max-w-96 flex-auto @container">
  <button
    class="group grid size-full place-content-center gap-2 rounded-card p-4 transition-colors surface surface-editable surface-hoverable surface-outlined surface-focusable"
    type="button"
    title="Crear entrenamiento"
    onclick={async () => addTraining()}>
    <span
      class="flex items-center gap-4 text-left opacity-50 transition-opacity group-hover:opacity-100">
      <Fa icon={faPlus} size="lg"></Fa>
      <span class="hidden text-lg @[18rem]:inline">Crear entrenamiento</span>
    </span>
  </button>
</div>
