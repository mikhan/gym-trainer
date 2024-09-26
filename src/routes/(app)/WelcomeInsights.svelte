<script lang="ts">
  import { faCalendarDays, faClock, type IconDefinition } from '@fortawesome/free-regular-svg-icons'
  import { faDumbbell, faPersonRunning } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'
  import Fa from 'svelte-fa'
  import { TrainerContext, type TrainerContextState } from './trainer/TrainerContext.svelte'

  type Insight = {
    icon: IconDefinition
    label: string
    value: string
    important?: boolean
  }

  const trainerContext = TrainerContext.getContext()

  const data: Insight[] = $state(getInsights(trainerContext.state))

  function getInsights(state: TrainerContextState): Insight[] {
    const insights: Insight[] = []
    if (state.status === 'unset') return insights

    insights.push({
      icon: faPersonRunning,
      label: 'Último entrenamiento',
      value: `${state.training.name} • ${state.currentRoutine.name}`,
      important: true,
    })

    insights.push({
      icon: faCalendarDays,
      label: 'Hace',
      value: '2 días',
    })

    insights.push({
      icon: faClock,
      label: 'Duración',
      value: '96 minutos',
    })

    insights.push({
      icon: faDumbbell,
      label: 'Siguiente rutina',
      value: 'Leg',
      important: true,
    })

    return insights
  }
</script>

<div class="flex flex-auto items-center justify-around p-8 md:flex-col md:items-start">
  {#each data as insight, index}
    {#if index > 0}
      <div
        class={clsx(
          'mx-2 bg-default-line max-md:h-4 max-md:w-0.5 md:ml-8 md:h-0.5 md:w-12',
          !insight.important && 'max-md:hidden',
        )}>
      </div>
    {/if}
    <div class={clsx('flex items-start gap-2', !insight.important && 'max-md:hidden')}>
      <div class="my-1 mt-4 grid size-6 place-content-center">
        <Fa class="opacity-75" size="lg" icon={insight.icon}></Fa>
      </div>
      <div>
        <div class="typescale-label opacity-75">{insight.label}</div>
        <div class="line-clamp-1">{insight.value}</div>
      </div>
    </div>
  {/each}
</div>
