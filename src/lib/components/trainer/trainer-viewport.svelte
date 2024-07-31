<script lang="ts">
  import { createTrainerViewportContext } from './trainer-viewport.context'
  import { setTrainerViewportContext } from './trainer-viewport.context'
  import ActionList from './action-list.svelte'
  import RoutineSwitcher from './routine-switcher.svelte'
  import { type Routine } from '$data/trainer/trainings'
  import ActionCurrent from './action-current.svelte'
  // import TrainerTimer from './trainer-timer.svelte'
  import AppTopbar from '../app/app-topbar.svelte'

  type Props = {
    routines: Routine[]
    currentRoutineId: string | undefined
  }

  let { routines, currentRoutineId = $bindable() }: Props = $props()
  let currentRoutine: Routine | undefined = $derived(pickCurrentRoutine(routines, currentRoutineId))

  const trainerViewportContext = setTrainerViewportContext(createTrainerViewportContext())

  const currentAction$ = trainerViewportContext.currentAction$

  function pickCurrentRoutine(routines?: Routine[], currentRoutineId?: string) {
    if (currentRoutineId) return routines?.find(({ id }) => id === currentRoutineId)
  }
</script>

<AppTopbar>
  {#if routines && currentRoutine}
    <RoutineSwitcher {routines} bind:currentRoutineId></RoutineSwitcher>
  {/if}
</AppTopbar>

<div>
  {#if $currentAction$}
    <ActionCurrent action={$currentAction$}></ActionCurrent>
  {/if}
  {#if currentRoutine}
    <ActionList routine={currentRoutine}></ActionList>
  {/if}
  <!-- {#if $currentAction$}
    <TrainerTimer action={$currentAction$}></TrainerTimer>
  {/if} -->
</div>
