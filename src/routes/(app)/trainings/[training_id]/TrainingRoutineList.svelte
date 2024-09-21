<script lang="ts">
  import UiButton from '$lib/components/ui/UiButton.svelte'
  // import { page } from '$app/stores'
  import UiCollapsibleText from '$lib/components/ui/UiCollapsibleText.svelte'
  import type { ChartData } from './LineChart.svelte'
  import { TrainingViewportContext } from './TrainingViewportContext.svelte'

  // import TrainingListItem from './TrainingListItem.svelte'
  // import TrainingListNavigation from './TrainingListNavigation.svelte'

  type Props = {
    training: Types.Training
    chartData: Record<string, ChartData[]>
  }

  // const { training, chartData }: Props = $props()
  const { training }: Props = $props()
  const trainingViewportContext = TrainingViewportContext.get()

  // const hash = $page.url.hash.replace(/^#routine-/, '')
  // let expandedStatus: Record<string, boolean> = $state(
  //   Object.fromEntries(training.routines.map(({ id }) => [id, hash ? id === hash : false])),
  // )

  function createRoutine() {
    const name = prompt('Nombre de la rutina')
    if (name) {
      const t = structuredClone(training)
      t.routines.push({
        id: crypto.randomUUID(),
        name,
        description: '',
        series: [],
      })
      trainingViewportContext.update(t)
    }
  }
</script>

<div class="container mx-auto grid grid-cols-1 gap-layout-gap p-layout-gap">
  <!-- <TrainingListNavigation {training}></TrainingListNavigation> -->

  <div class="grid max-w-prose gap-layout-gap">
    <p>
      <UiCollapsibleText maxLines={2}
        >{'Laborum excepteur dolore do proident ullamco excepteur adipisicing dolor anim culpa eu nostrud deserunt. Aliquip nostrud ullamco eu ex et mollit occaecat commodo quis qui ea tempor adipisicing occaecat. Do anim nulla anim amet Lorem occaecat minim sit. Sit esse est amet amet pariatur aliqua nostrud aliquip eiusmod labore adipisicing. Labore ea elit Lorem consequat do aliquip occaecat sit. Incididunt Lorem excepteur qui minim culpa ullamco quis nostrud ut.'}</UiCollapsibleText>
    </p>
    <UiButton outlined onclick={createRoutine}>Agregar rutina</UiButton>
    <ul>
      {#each training.routines as routine (routine.id)}
        <li>
          <a
            class="flex h-12 items-center rounded-card px-layout-gap surface-hoverable surface-activable focusable-ring"
            href={`/trainings/${training.id}/routines/${routine.id}`}>{routine.name}</a>
        </li>
      {/each}
    </ul>
  </div>
</div>
