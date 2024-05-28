<script lang="ts">
  import { getMuscleGroups, getMuscles, type Muscle, type MuscleGroup } from '$data/trainer/config'
  import type { Routine } from '$data/trainer/trainings'
  import type { ActionGroup } from '$lib/types'
  import ActionCurrent from './action-current.svelte'
  import ActionEntry from './action-entry.svelte'
  import ActionListGroup from './action-list-group.svelte'
  import { getTrainerViewportContext } from './trainer-viewport.context'

  export let routine: Routine
  const trainerViewportContext = getTrainerViewportContext()
  const currentAction$ = trainerViewportContext.currentAction$
  const muscleGroups = getMuscleGroups().reduce(
    (groups, group) => ({ ...groups, [group.id]: group }),
    {},
  ) as Record<string, MuscleGroup>

  const muscles = getMuscles().reduce(
    (groups, group) => ({ ...groups, [group.id]: group }),
    {},
  ) as Record<string, Muscle>

  $: schedule = createSchedule(routine)
  $: $currentAction$ = schedule[0].actions[0]

  function createSchedule(routine: Routine): ActionGroup[] {
    const schedule: ActionGroup[] = []

    let currentName = ''
    let currentSerie = 0
    let currentStep = 0
    let currentGroup: ActionGroup | undefined

    for (const { name, group, muscle, steps } of routine.series) {
      if (currentName !== name) {
        currentName = name
        currentSerie = currentSerie + 1
        currentStep = 0
      }

      for (const step of steps) {
        const muscleGroup = muscleGroups[group]
        if (!muscleGroup) throw new Error(`Unknown muscle group '${group}'`)

        if (currentGroup?.name !== muscleGroup.name) {
          currentGroup = {
            name: muscleGroup.name,
            color: { hue: muscleGroup.color.hue },
            actions: [],
          }
          schedule.push(currentGroup)
        }

        currentGroup.actions.push({
          id: crypto.randomUUID(),
          name,
          serie: currentSerie,
          step: ++currentStep,
          steps: steps.length,
          muscle: muscles[muscle],
          group: {
            id: muscleGroup.id,
            name: muscleGroup.name,
            color: muscleGroup.color,
          },
          description: getDescription(step.type, step.value),
          delay: step.delay,
        })
      }
    }

    function getDescription(type: string, value: string) {
      if (type === 'repetitions') {
        return `${value} reps`
      } else if (type === 'seconds') {
        return `${value} secs`
      } else if (type === 'failure') {
        return `failure (${value} reps)`
      } else {
        return `${value} ${type}`
      }
    }

    return schedule
  }
</script>

<ActionCurrent action={$currentAction$}></ActionCurrent>
<div class="action-list">
  {#each schedule as group, index (index)}
    <div style="display: grid; gap: 8px;">
      <ActionListGroup {group}></ActionListGroup>
      {#each group.actions as action (action.id)}
        <ActionEntry {action}></ActionEntry>
      {/each}
    </div>
  {/each}
</div>

<style lang="postcss">
  .action-list {
    display: grid;
    gap: 0.5rem;
    padding-bottom: 100%;
  }
</style>
