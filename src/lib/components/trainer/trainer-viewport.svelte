<script lang="ts">
  import { createTrainerViewportContext } from './trainer-viewport.context'
  import { setTrainerViewportContext } from './trainer-viewport.context'
  import ActionList from './action-list.svelte'
  import RoutineSwitcher from './routine-switcher.svelte'
  import { type Routine } from '$data/trainer/trainings'
  import ActionCurrent from './action-current.svelte'
  import TrainerTimer from './trainer-timer.svelte'
  import AppTopbar from '../app/app-topbar.svelte'

  let viewportRoot: HTMLElement

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

<div class="trainer-viewport" bind:this={viewportRoot}>
  <AppTopbar>
    {#if routines && currentRoutine}
      <RoutineSwitcher {routines} bind:currentRoutineId></RoutineSwitcher>
    {/if}
  </AppTopbar>
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

<style lang="postcss">
  .trainer-viewport {
    display: grid;
    grid-template:
      '. . .' auto
      '. h .' auto
      '. a .' auto
      '. l .' 1fr
      '. p .' auto
      '. . .' auto
      / auto 1fr auto;
    gap: var(--layout-gap);
    align-items: flex-start;
    width: 100%;
    height: 100%;

    @media (orientation: landscape) or (min-width: 40rem) {
      grid-template:
        '. . 0 .' auto
        '. h h .' auto
        '. a l .' auto
        '. p l .' 1fr
        '. . . .' auto
        / 0 minmax(0, 30rem) minmax(0, 30rem) 1fr;
      /* place-content: start start; */
    }

    & > :global(*:nth-child(1)) {
      grid-area: h;
    }

    & > :global(*:nth-child(2)) {
      grid-area: a;
    }

    & > :global(*:nth-child(3)) {
      grid-area: l;
    }

    & > :global(*:nth-child(4)) {
      grid-area: p;
    }
  }
</style>
