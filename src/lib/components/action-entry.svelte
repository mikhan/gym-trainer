<script lang="ts">
  import type { Action } from '$lib/types'
  import { onMount } from 'svelte'
  import { createTrainerActionContext, getTrainerViewportContext } from './trainer-viewport.context'

  type Props = {
    action: Action
    onclick?: (action: Action) => void
  }

  let { action }: Props = $props()

  let active = $state(false)

  const trainerViewportContext = getTrainerViewportContext()
  const trainerActionContext = createTrainerActionContext(action)

  function setAnimationRange(element: HTMLElement) {
    const height = element.offsetHeight
    const marginTop = 8 + 40 + 8 + 200 + 8 + 20 + 8
    const start = element.offsetTop - marginTop
    const end = start + height
    element.style.setProperty('--start', `${start}px`)
    element.style.setProperty('--end', `${end}px`)
  }

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

<div class="wrapper" use:setAnimationRange style:--color-hue={action.group.color.hue}>
  <button class="action-item" class:active onclick={setActive}>
    <!-- <div class="action-item-color">{action.step}</div> -->
    <div class="action-item-name">{action.name}</div>
    <div class="action-item-muscle">{action.muscle.name}</div>
    <!-- <div class="action-item-name">{entry?.isIntersecting} {entry?.intersectionRatio}</div> -->
    <div class="action-item-description">{action.description}</div>
  </button>
  <button class="active-indicator" class:active onclick={setActive}></button>
</div>

<style lang="postcss">
  .wrapper {
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: 0.5rem;
    scroll-snap-align: start;
    scroll-margin: calc(8px + 40px + 8px + 200px + 8px + 20px + 8px) 0 0 0;
    animation: op;
    animation-timeline: scroll();
    animation-range-start: var(--start);
    animation-range-end: var(--end);
    animation-fill-mode: forwards;
  }

  .action-item {
    /* font-size: 1rem; */
    --background-color: transparent;
    /* display: flex; */
    /* grid-template-columns: 1fr auto;
    align-items: center;
    text-align: start; */
    /* gap: 8px; */
    /* padding: 0.5rem 1rem; */
    font-size: 1rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    text-align: start;
    gap: 8px;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    width: 100%;
    height: 40px;
    background-color: var(--background-color);
    color: oklch(90% 0 var(--color-hue));
    /* border: none; */
    /* border: 1px solid oklch(80% 0.15 var(--color-hue) / var(--color-alpha)); */
    border-radius: 8px;
    transition: background-color 250ms;

    &:hover {
      /* border: 1px solid oklch(90% 0.15 var(--color-hue) / var(--color-alpha)); */
      --background-color: oklch(35% 0.01 var(--color-hue));
    }

    &:focus-visible {
      outline: 2px solid oklch(90% 0.15 var(--color-hue));
      outline-offset: 2px;
    }

    &.active {
      color: oklch(95% 0.04 var(--color-hue));
      --background-color: oklch(45% 0.04 var(--color-hue));
      /* height: 120px; */
    }
  }

  @keyframes op {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .action-item-name {
    font-size: 90%;
  }

  .action-item-muscle {
    font-size: 75%;
    opacity: 0.75;
  }

  .action-item-description {
    font-size: 75%;
    opacity: 0.75;
  }

  .active-indicator {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: none;
    background-color: transparent;
    border-radius: 100%;

    &:focus-visible {
      outline: 2px solid oklch(90% 0.15 var(--color-hue));
      outline-offset: 2px;
    }

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
      border: 2px solid hsl(0 0% 30%);
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
      background-color: oklch(60% 0.06 var(--color-hue));
      opacity: 0;
      transition: opacity 250ms;
    }
  }
</style>
