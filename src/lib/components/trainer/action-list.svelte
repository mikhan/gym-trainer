<script lang="ts">
  import { getMuscleGroups, getMuscles, type Muscle, type MuscleGroup } from '$data/trainer/config'
  import type { Routine } from '$data/trainer/trainings'
  import type { ActionGroup } from '$lib/types'
  import ActionListEntry from './action-list/action-list-entry.svelte'
  import ActionListGroupLabel from './action-list/action-list-group-label.svelte'

  type Props = { routine: Routine }

  let { routine }: Props = $props()
  const muscleGroups = getMuscleGroups().reduce(
    (groups, group) => ({ ...groups, [group.id]: group }),
    {},
  ) as Record<string, MuscleGroup>

  const muscles = getMuscles().reduce(
    (groups, group) => ({ ...groups, [group.id]: group }),
    {},
  ) as Record<string, Muscle>

  let schedule = $derived(createSchedule(routine))

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

      const step = steps[0]

      const muscleGroup = muscleGroups[muscle]
      if (!muscleGroup) throw new Error(`Unknown muscle group '${muscle}'`)

      if (currentGroup?.name !== muscleGroup.name) {
        currentGroup = {
          name: muscleGroup.name,
          color: { hue: muscleGroup.color.hue },
          actions: [],
        }
        schedule.push(currentGroup)
      }

      const values = steps
        .map(({ value }) => value)
        .filter((item, index, array) => array.indexOf(item) === index)
      const value = values.length === 1 ? values[0] : values.join(', ')

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
        description: getDescription(step.type, value),
        delay: step.delay,
      })
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

<div class="action-list">
  <div class="list">
    {#each schedule as group, index (index)}
      <div class="list-group">
        <ActionListGroupLabel {group}></ActionListGroupLabel>
        {#each group.actions as action (action.id)}
          <ActionListEntry {action}></ActionListEntry>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
  .action-list {
    scroll-snap-type: y mandatory;
    scroll-padding: theme('space.layout-gap');
  }

  .list {
    display: grid;
    gap: theme('space.layout-gap');
    padding: theme('space.layout-gap');
  }

  .list-group {
    display: grid;
    gap: theme('space.layout-gap');
  }
</style>
