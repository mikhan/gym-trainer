<script lang="ts">
  import type { Action } from '$lib/types'
  import { onMount } from 'svelte'
  import {
    createTrainerActionContext,
    getTrainerViewportContext,
  } from '../trainer-viewport.context'

  type Props = {
    action: Action
    onclick?: (action: Action) => void
  }

  let { action }: Props = $props()

  let active = $state(false)

  const trainerViewportContext = getTrainerViewportContext()
  const trainerActionContext = createTrainerActionContext(action)

  function setActive() {
    trainerViewportContext.currentAction$.set(action)
  }

  onMount(() => {
    trainerViewportContext.addAction(action)

    const unsubscribe = trainerViewportContext.currentAction$.subscribe((current) => {
      active = current === action
      trainerActionContext.isActive$.set(active)
    })

    return () => {
      trainerViewportContext.removeAction(action)
      unsubscribe()
    }
  })
</script>

<div class="action-list-entry" class:active>
  <button class="entry-item" onclick={setActive}>
    {action.name}
  </button>
</div>

<style lang="postcss">
  .action-list-entry {
    scroll-snap-align: start;
    display: grid;
    grid-template-columns: 1fr min-content;
    background-color: var(--color-canvas-bg);
    color: var(--color-canvas-fg);
    border-radius: 8px;
    transition: background-color 250ms;
    min-height: 40px;

    &:hover {
      background-color: var(--color-canvas-hover);
    }

    &.active {
      background-color: var(--color-accent-bg);
      color: var(--color-accent-fg);
    }
  }

  .entry-item {
    font-size: 1rem;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    text-align: start;
    gap: 8px;
    padding: 0.5rem 1rem;
  }
</style>
