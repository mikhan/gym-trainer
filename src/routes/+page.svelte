<script lang="ts">
  import { getTrainings } from '$data/trainings'
  import { getAppDatabaseContext } from '$lib/components/app/app-database-context.svelte'
  import TrainerViewport from '$lib/components/trainer/trainer-viewport.svelte'
  import { getSession } from '$data/trainer/session'

  const supabase = getAppDatabaseContext()
  const session = getSession()
  const trainings = getTrainings(supabase)

  let currentRoutineId: string | undefined = $state()

  const routines = Promise.all([session, trainings]).then(([session, trainings]) => {
    const currentTraining = pickTraining(trainings, session.currentTrainingId) || trainings[0]
    session.currentTrainingId = currentTraining?.id
    const currentRoutine =
      pickRoutine(currentTraining?.routines, session.currentRoutineId) ||
      currentTraining?.routines[0]
    currentRoutineId = currentRoutine?.id
    return currentTraining?.routines
  })

  routines.then(console.log)

  // $effect(() => {
  //   if (session.currentRoutineId === currentRoutineId) return

  //   session.currentRoutineId = currentRoutineId
  //   setSession(session)
  // })

  function pickTraining(trainings: Types.Training[], id?: string) {
    if (id) return trainings.find((t) => t.id === id)
  }

  function pickRoutine(routines?: Types.Routine[], id?: string) {
    if (id) return routines?.find((r) => r.id === id)
  }
</script>

{#await routines then routines}
  {#if routines}
    <TrainerViewport {routines} bind:currentRoutineId></TrainerViewport>
  {/if}
{/await}
