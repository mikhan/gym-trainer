<script lang="ts">
  import TrainingListNavigation from '$lib/components/training/TrainingListNavigation.svelte'
  import type { ChartData } from './LineChart.svelte'
  import TrainingListItem from './TrainingListItem.svelte'

  type Props = {
    training: Types.Training
    chartData: Record<string, ChartData[]>
  }

  const { training, chartData }: Props = $props()
</script>

<div class="container mx-auto grid grid-cols-1 gap-layout-gap px-layout-gap lg:grid-cols-[3fr,9fr]">
  <TrainingListNavigation {training}></TrainingListNavigation>
  <div class="space-y-layout-gap py-layout-gap">
    {#each training.routines as routine (routine.id)}
      <TrainingListItem {training} {routine} chartData={chartData[routine.id]}></TrainingListItem>
    {/each}
  </div>
</div>
