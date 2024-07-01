<script lang="ts">
  import type { Routine } from '$data/trainer/trainings'
  import UiMenu from '../ui/ui-menu.svelte'

  type Props = {
    routines: Routine[]
    currentRoutineId: string | undefined
  }

  let { routines, currentRoutineId = $bindable() }: Props = $props()
  let currentRoutine = $derived(routines.find(({ id }) => id === currentRoutineId))
</script>

<button class="menu-anchor" type="button" popovertarget="routine-switcher">
  {currentRoutine?.name}
</button>
<UiMenu id="routine-switcher">
  {#each routines as routine}
    <li>
      <button
        class="menu-item"
        class:active={currentRoutineId === routine.id}
        type="button"
        onclick={() => (currentRoutineId = routine.id)}
        popovertarget="routine-switcher">{routine.name}</button
      >
    </li>
  {/each}
</UiMenu>

<style lang="postcss">
  button {
    padding: 0 16px;
    height: 40px;
    text-align: left;
  }

  .menu-anchor {
    anchor-name: --routine-switcher;
    background-color: var(--surface-2-bg);
    color: var(--surface-2-fg);
    min-width: 20ch;
    border-radius: var(--card-roundness);
    transition: background-color 150ms;

    &:hover {
      background-color: var(--surface-2-hover);
    }
  }

  .menu-item {
    flex: 1 1 auto;
    width: 100%;
    color: var(--surface-2-fg);
    outline-offset: -2px;

    &:hover {
      background-color: var(--surface-popover-hover);
    }

    &.active {
      background-color: var(--surface-accent-bg);
      color: var(--surface-accent-fg);

      &:hover {
        background-color: var(--surface-accent-hover);
      }
    }
  }
</style>
