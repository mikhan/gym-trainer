<script lang="ts">
  import ActionList from '$lib/components/action-list.svelte'
  import RoutineSwitcher from '$lib/components/routine-switcher.svelte'
  import TrainerViewport from '$lib/components/trainer-viewport.svelte'
  import { getSession, setSession } from '$data/trainer/session'
  import { getTrainings, type Routine, type Training } from '$data/trainer/trainings'
  import './app.css'

  const session = getSession()
  const trainings = getTrainings()
  const currentTraining = pickCurrentTraining(trainings, session.currentTrainingId)
  const routines = currentTraining?.routines
  let currentRoutine = pickCurrentRoutine(routines, session.currentRoutineId)

  function pickCurrentTraining(trainings?: Training[], currentTrainingId?: string) {
    if (currentTrainingId) return trainings?.find(({ id }) => (id = currentTrainingId))
  }

  function pickCurrentRoutine(routines?: Routine[], currentRoutineId?: string) {
    if (currentRoutineId) return routines?.find(({ id }) => id === currentRoutineId)
  }

  function updateCurrentRoutine(id?: string): void {
    session.currentRoutineId = id
    currentRoutine = pickCurrentRoutine(routines, id)
    setSession(session)
  }
</script>

<TrainerViewport>
  <div slot="header">
    {#if routines && currentRoutine}
      <RoutineSwitcher
        {routines}
        bind:currentRoutineId={session.currentRoutineId}
        onchange={({ id }) => updateCurrentRoutine(id)}
      ></RoutineSwitcher>
    {/if}
  </div>
  {#if currentRoutine}
    <ActionList routine={currentRoutine}></ActionList>
  {/if}
  <div slot="footer"></div>
</TrainerViewport>

<style lang="postcss"></style>
