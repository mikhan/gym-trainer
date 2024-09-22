<script lang="ts">
  import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'
  import type { Snippet } from 'svelte'
  import Fa from 'svelte-fa'
  import { page } from '$app/stores'
  import UiButton from '$lib/components/ui/UiButton.svelte'
  import UiCollapsibleText from '$lib/components/ui/UiCollapsibleText.svelte'
  import type { ChartData } from './LineChart.svelte'
  import { TrainingViewportContext } from './TrainingViewportContext.svelte'

  type Props = {
    training: Types.Training
    chartData: Record<string, ChartData[]>
    children: Snippet
  }

  const { training, children }: Props = $props()
  const trainingViewportContext = TrainingViewportContext.get()
  let open = $state(false)

  const routineIndex: number | undefined = $derived($page.data.routineIndex)

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

  const daysOfWeek = {
    '1': 'lunes',
    '2': 'martes',
    '3': 'miércoles',
    '4': 'jueves',
    '5': 'viernes',
    '6': 'sábado',
    '7': 'domingo',
  }

  function getWeekDay(day: string | number) {
    return daysOfWeek[day as keyof typeof daysOfWeek]
  }
</script>

{#snippet list()}
  {#each training.routines as routine, index (routine.id)}
    <li
      class={clsx(
        'h-[--widget-height] transition-colors surface-hoverable surface-activable focusable-within-ring',
        index === routineIndex && 'color-primary surface',
      )}>
      <a
        class="flex h-full items-center gap-2 px-layout-gap outline-none contain-inline-size"
        href={`/trainings/${training.id}/routines/${routine.id}`}
        onclick={() => (open = false)}>
        <div class="flex-1 truncate">{routine.name}</div>
        <div class="typescale-label">{getWeekDay(index + 1)}</div>
      </a>
    </li>
  {/each}
{/snippet}

<div
  class="container mx-auto grid grid-cols-1 items-start gap-layout-gap p-layout-gap md:grid-cols-[2fr,3fr] xl:grid-cols-[3fr,9fr]">
  <div class="grid gap-layout-gap">
    <p>
      <UiCollapsibleText maxLines={2}
        >{'Laborum excepteur dolore do proident ullamco excepteur adipisicing dolor anim culpa eu nostrud deserunt. Aliquip nostrud ullamco eu ex et mollit occaecat commodo quis qui ea tempor adipisicing occaecat. Do anim nulla anim amet Lorem occaecat minim sit. Sit esse est amet amet pariatur aliqua nostrud aliquip eiusmod labore adipisicing. Labore ea elit Lorem consequat do aliquip occaecat sit. Incididunt Lorem excepteur qui minim culpa ullamco quis nostrud ut.'}</UiCollapsibleText>
    </p>
    <details
      bind:open
      class={clsx(
        'rounded-card shadow contain-paint color-neutral surface',
        typeof routineIndex === 'number' ? 'block md:hidden' : 'hidden',
      )}>
      <summary
        class="flex h-[--widget-height] cursor-pointer items-center justify-center gap-2 px-8 transition-colors surface-hoverable focusable-ring">
        <div class="font-bold">Seleccionar rutina</div>
        <Fa icon={faChevronDown}></Fa>
      </summary>
      <ul class="">
        {@render list()}
      </ul>
    </details>
    <ul
      class={clsx(
        'space-y-2 *:rounded-card',
        typeof routineIndex === 'undefined' ? 'block' : 'hidden md:block',
      )}>
      {@render list()}
    </ul>
    <UiButton class="" outlined onclick={createRoutine}>Agregar rutina</UiButton>
  </div>
  {@render children()}
</div>

<style lang="postcss">
  details > summary {
    list-style: none;
  }

  details summary::-webkit-details-marker {
    display: none;
  }
</style>
