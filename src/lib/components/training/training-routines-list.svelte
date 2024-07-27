<script lang="ts">
  import { TrainingViewportContext } from './training-viewport-context.svelte'
  import TrainingRoutine from './training-routine.svelte'

  const trainingViewportContext = TrainingViewportContext.get()
  const training$ = $derived(structuredClone(trainingViewportContext.training$))
</script>

<h2 class="text-xl font-bold tracking-tight">Rutinas</h2>

{#each training$.routines as routine (routine.id)}
  <TrainingRoutine routineId={routine.id}></TrainingRoutine>
{/each}
