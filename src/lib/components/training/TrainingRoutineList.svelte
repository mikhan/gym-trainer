<script lang="ts">
  // import TrainingHeader from './training-header.svelte'
  import TrainingNavigation from '$lib/components/training/training-navigation.svelte'
  import TrainingRoutine from './training-routine.svelte'

  type Props = {
    training: Types.Training
  }

  const { training }: Props = $props()
</script>

<div
  class="container mx-auto grid grid-cols-1 gap-layout-gap px-layout-gap lg:grid-cols-[minmax(min-content,30ch),1fr]">
  <TrainingNavigation {training}></TrainingNavigation>
  <article class="container flex h-full flex-col gap-layout-gap py-10">
    <!-- <TrainingHeader {training}></TrainingHeader>

    <h2 class="text-xl font-bold tracking-tight">Rutinas</h2> -->
    {#each training.routines as routine (routine.id)}
      <TrainingRoutine {routine}></TrainingRoutine>
    {/each}
  </article>
</div>
