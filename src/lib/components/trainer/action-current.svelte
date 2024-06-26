<script lang="ts">
  import { getMuscleGroups } from '$data/trainer/config'
  import type { Action } from '$lib/types'
  import { getTrainerViewportContext } from './trainer-viewport.context'

  type Props = { action: Action }

  const trainerViewportContext = getTrainerViewportContext()
  const muscleGroups = getMuscleGroups()

  let { action }: Props = $props()
  let muscleGroup = $derived(muscleGroups.find(({ id }) => id === action.group.id)!)
  let steps = $derived(Array.from({ length: action.steps }, (_, i) => i + 1))
  let currentStep = $state(action.step)

  function changeAction(serie: number, step: number) {
    if (!action) return

    const actions = trainerViewportContext.getActions()
    const newAction = actions.find((action) => action.serie === serie && action.step === step)
    trainerViewportContext.currentAction$.set(newAction)
  }
</script>

<div
  class="action-current"
  style:--background={`url(${muscleGroup.image.src})`}
  style:--color-hue={muscleGroup.color.hue}
>
  <div class="title">{action.name}</div>
  <div>{action.steps} x {action.description}</div>
  <div>{action.delay} seg</div>
  <!-- <div class="indicators">
    {#each steps as step}
      <label class="indicator">
        <input
          type="radio"
          name="step"
          value={step}
          checked={action.step === step}
          onchange={() => changeAction(action.serie, step)}
        />
        <div class="indicator-border"></div>
      </label>
    {/each}
  </div> -->
</div>

<style lang="postcss">
  .action-current {
    display: grid;
    gap: 4px;
    align-content: end;
    border-radius: var(--card-roundness);
    color: var(--surface-accent-fg);
    background-image: linear-gradient(
        to bottom,
        transparent,
        color-mix(in oklch, var(--surface-accent-bg) 10%, transparent)
      ),
      linear-gradient(
        to bottom,
        color-mix(in oklch, var(--surface-canvas-bg) 10%, transparent),
        color-mix(in oklch, var(--surface-canvas-bg) 90%, transparent)
      ),
      var(--background);
    background-size: cover;
    background-position: center;
    padding: 2rem 2rem;
    box-shadow: var(--shadow-base);
    width: 100%;
    aspect-ratio: 1/1;
    max-height: 33vh;

    .title {
      font-size: 150%;
      font-weight: bold;
    }
  }

  .indicators {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-block-start: 8px;
    padding-block: 8px;
  }

  .indicator {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    padding: 8px;
    margin: -8px;

    input {
      opacity: 0;
      position: absolute;
    }
  }

  .indicator-border {
    border-radius: 999px;
    border: 1px solid currentColor;
    width: 100%;
    height: 100%;
    padding: 2px;

    &::before {
      content: '';
      display: block;
      border-radius: 999px;
      background-color: currentColor;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  .indicator:has(input:checked) .indicator-border::before {
    opacity: 1;
  }
</style>
