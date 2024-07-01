<script lang="ts">
  import TrainerViewport from '$lib/components/trainer/trainer-viewport.svelte'
  import { getSession, setSession } from '$data/trainer/session'
  import { getTrainings, type Training } from '$data/trainer/trainings'

  const session = getSession()
  const trainings = getTrainings()
  const currentTraining = pickCurrentTraining(trainings, session.currentTrainingId)
  const routines = currentTraining?.routines
  let currentRoutineId = $state(session.currentRoutineId)

  $effect(() => {
    if (session.currentRoutineId === currentRoutineId) return

    session.currentRoutineId = currentRoutineId
    setSession(session)
  })

  function pickCurrentTraining(trainings?: Training[], currentTrainingId?: string) {
    if (currentTrainingId) return trainings?.find(({ id }) => id === currentTrainingId)
  }
</script>

{#if routines}
  <TrainerViewport {routines} bind:currentRoutineId></TrainerViewport>
{/if}
