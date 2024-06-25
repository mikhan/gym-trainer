<script lang="ts">
  import { getMuscleGroups, getMuscles, type Muscle, type MuscleGroup } from '$data/trainer/config'
  import type { Routine } from '$data/trainer/trainings'
  import type { ActionGroup } from '$lib/types'
  import ActionListEntry from './action-list/action-list-entry.svelte'
  import ActionListGroupLabel from './action-list/action-list-group-label.svelte'

  type Props = { routine: Routine }

  let { routine }: Props = $props()
  let schedule = $derived(createSchedule(routine))
  const muscleGroups = getMuscleGroups().reduce(
    (groups, group) => ({ ...groups, [group.id]: group }),
    {},
  ) as Record<string, MuscleGroup>

  const muscles = getMuscles().reduce(
    (groups, group) => ({ ...groups, [group.id]: group }),
    {},
  ) as Record<string, Muscle>

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

        break
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

  let x = {
    mobile: {
      pointer: {
        none: false,
        coarse: true,
        fine: false,
      },
      hover: {
        none: true,
        hover: false,
      },
    },
    mobileNoTouch: {
      pointer: {
        none: false,
        coarse: false,
        fine: true,
      },
      hover: {
        none: false,
        hover: true,
      },
    },
    desktop: {
      pointer: {
        none: false,
        coarse: false,
        fine: true,
      },
      hover: {
        none: false,
        hover: true,
      },
    },
    desktopTouch: {
      pointer: {
        none: false,
        coarse: false,
        fine: true,
      },
      hover: {
        none: false,
        hover: true,
      },
    },
  }
</script>

<div class="action-list scrollable">
  {#each schedule as group, index (index)}
    <!-- <div class="action-list-group"> -->
    <ActionListGroupLabel {group}></ActionListGroupLabel>
    {#each group.actions as action (action.id)}
      <ActionListEntry {action}></ActionListEntry>
    {/each}
    <!-- </div> -->
  {/each}
</div>

<style lang="postcss">
  .action-list {
    display: grid;
    /* gap: 1rem; */
    /* height: calc(var(--layout-gap) + 100% + var(--layout-gap)); */
    background: var(--surface-1-bg);
    color: var(--surface-1-fg);
    box-shadow: var(--shadow-base);
    border-radius: var(--card-roundness);
    max-height: 100%;

    /* color: var(--surface-1-fg); */
    /* padding-block: 2rem; */
    /* margin-block: calc(var(--layout-gap) * -1); */
    padding-inline: var(--layout-gap);
    scroll-snap-type: y proximity;

    &::before {
      content: '';
      position: sticky;
      top: 0;
      width: 100%;
      height: 2rem;
      margin-bottom: -2rem;
      background-image: linear-gradient(to bottom, var(--surface-1-bg), 60%, transparent);
      pointer-events: none;
    }

    &::after {
      content: '';
      position: sticky;
      bottom: 0;
      width: 100%;
      height: 2rem;
      /* margin-bottom: -2rem; */
      background-image: linear-gradient(to bottom, transparent, 60%, var(--surface-1-bg));
      pointer-events: none;
    }
  }

  /* .action-list-group {
    display: grid;
    gap: 0.5rem;
  } */
</style>
