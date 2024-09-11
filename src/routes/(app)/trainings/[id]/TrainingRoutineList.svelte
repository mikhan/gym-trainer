<script lang="ts">
  import TrainingListNavigation from './TrainingListNavigation.svelte'
  import type { ChartData } from './LineChart.svelte'
  import TrainingListItem from './TrainingListItem.svelte'
  import { page } from '$app/stores'
  import UiCollapsibleText from '$lib/components/ui/UiCollapsibleText.svelte'

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

  <div class="grid content-start gap-layout-gap py-layout-gap">
    <p class="max-w-prose">
      <UiCollapsibleText maxLines={2}
        >{'Laborum excepteur dolore do proident ullamco excepteur adipisicing dolor anim culpa eu nostrud deserunt. Aliquip nostrud ullamco eu ex et mollit occaecat commodo quis qui ea tempor adipisicing occaecat. Do anim nulla anim amet Lorem occaecat minim sit. Sit esse est amet amet pariatur aliqua nostrud aliquip eiusmod labore adipisicing. Labore ea elit Lorem consequat do aliquip occaecat sit. Incididunt Lorem excepteur qui minim culpa ullamco quis nostrud ut.'}</UiCollapsibleText>
    </p>
    {#each training.routines as routine, routineIndex (routine.id)}
      <TrainingListItem
        {training}
        {routineIndex}
        bind:expanded={expandedStatus[routine.id]}
        chartData={chartData[routine.id]}></TrainingListItem>
    {/each}
  </div>
</div>
