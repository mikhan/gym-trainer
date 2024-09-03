<script lang="ts">
  import TrainingListNavigation from '$lib/components/training/TrainingListNavigation.svelte'
  import type { ChartData } from './LineChart.svelte'
  import TrainingListItem from './TrainingListItem.svelte'
  import { page } from '$app/stores'

  type Props = {
    training: Types.Training
    chartData: Record<string, ChartData[]>
  }

  const { training, chartData }: Props = $props()

  const hash = $page.url.hash.replace(/^#routine-/, '')
  let expandedStatus: Record<string, boolean> = $state(
    Object.fromEntries(training.routines.map(({ id }) => [id, hash ? id === hash : false])),
  )
</script>

<div
  class="container mx-auto grid grid-cols-1 gap-layout-gap px-layout-gap lg:grid-cols-[256px,1fr]">
  <TrainingListNavigation {training}></TrainingListNavigation>
  <div class="flex flex-col gap-layout-gap py-layout-gap">
    {#each training.routines as routine, routineIndex (routine.id)}
      <TrainingListItem
        {training}
        {routineIndex}
        bind:expanded={expandedStatus[routine.id]}
        chartData={chartData[routine.id]}></TrainingListItem>
    {/each}
  </div>
</div>
