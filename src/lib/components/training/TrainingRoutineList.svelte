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
  const expandedStatus = $derived(
    Object.fromEntries(training.routines.map(({ id }) => [id, hash ? id === hash : true])),
  )
</script>

<div
  class="container mx-auto grid grid-cols-1 gap-layout-gap px-layout-gap lg:grid-cols-[256px,1fr]">
  <TrainingListNavigation {training}></TrainingListNavigation>
  <div class="space-y-layout-gap py-layout-gap">
    {#each training.routines as routine (routine.id)}
      <TrainingListItem
        {training}
        {routine}
        expanded={expandedStatus[routine.id]}
        chartData={chartData[routine.id]}></TrainingListItem>
    {/each}
  </div>
</div>
