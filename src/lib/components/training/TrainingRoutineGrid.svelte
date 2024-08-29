<script lang="ts">
  import type { ChartData } from './LineChart.svelte'
  import TrainingGridItem from './TrainingGridItem.svelte'

  type Props = {
    training: Types.Training
    chartData: Record<string, ChartData[]>
  }

  const { training, chartData }: Props = $props()
</script>

<div class="container mx-auto grid items-start gap-layout-gap p-layout-gap grid-cols-fill-64">
  {#each training.routines as routine (routine.id)}
    <TrainingGridItem {training} {routine} chartData={chartData[routine.id]}></TrainingGridItem>
  {/each}
</div>
