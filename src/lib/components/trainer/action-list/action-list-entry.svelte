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

<div class="action-list-entry" class:active style:--color-hue={action.group.color.hue}>
  <button class="entry-item" onclick={setActive}>
    <div class="entry-item-name">{action.name}</div>
  </button>
  <!-- <button class="entry-active-switcher focusable" class:active onclick={setActive}></button> -->
</div>

<style lang="postcss">
  .action-list-entry {
    scroll-snap-align: start;
    scroll-margin-block-start: calc(var(--layout-gap) + 1.5rem + var(--layout-gap));
    display: grid;
    grid-template-columns: 1fr min-content;
    background-color: var(--surface-1-bg);
    color: var(--surface-1-fg);
    border-radius: 8px;
    transition: background-color 250ms;
    min-height: 40px;

    &:hover {
      background-color: var(--surface-1-hover);
    }

    &.active {
      background-color: var(--surface-accent-bg);
      color: var(--surface-accent-fg);
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

  .entry-item-name {
    font-size: 90%;
  }

  .entry-active-switcher {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: none;
    background-color: transparent;
    border-radius: 100%;

    &.active {
      &::after {
        opacity: 1;
      }
    }

    &::before {
      content: '';
      display: block;
      width: 20px;
      height: 20px;
      border: 2px solid var(--surface-accent-border);
      border-radius: 100%;
      grid-area: 1 / -1;
    }

    &::after {
      content: '';
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 100%;
      grid-area: 1 / -1;
      background-color: var(--surface-accent-border);
      opacity: 0;
      transition: opacity 250ms;
    }
  }
</style>