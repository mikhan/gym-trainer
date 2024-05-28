<script lang="ts">
  import { getMuscleGroups } from '$data/trainer/config'
  import type { Action } from '$lib/types'
  import { getTrainerViewportContext } from './trainer-viewport.context'

  export let action: Action | undefined

  const trainerViewportContext = getTrainerViewportContext()

  const muscleGroups = getMuscleGroups()

  function changeAction(serie: number, step: number) {
    if (!action) return

    const actions = trainerViewportContext.getActions()
    const newAction = actions.find((action) => action.serie === serie && action.step === step)
    trainerViewportContext.currentAction$.set(newAction)
  }
</script>

<div class="wrapper">
  {#if action}
    {@const muscleGroup = muscleGroups.find(({ id }) => id === action.group.id)!}
    <div
      class="current-set"
      style:--background={`url(${muscleGroup.image.src})`}
      style:--color-hue={muscleGroup.color.hue}
    >
      <div class="title">{action.name}</div>
      <div>{action.description}</div>
      <div class="indicators">
        {#each Array.from({ length: action.steps }, (_, i) => i + 1) as step}
          <label class="indicator">
            <input
              type="radio"
              name="step"
              value={step}
              checked={action.step === step}
              on:change={() => changeAction(action.serie, step)}
            />
          </label>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .wrapper {
    height: 200px;
    position: sticky;
    top: calc(8px + 42px);
    z-index: 2;
  }

  .current-set {
    height: 100%;
    align-content: end;
    /* scroll-snap-align: start; */
    border-radius: 8px;
    color: oklch(90% 0 var(--color-hue));
    background: linear-gradient(
        to bottom,
        hsl(0 0% 15% / 50%),
        oklch(30% 0.02 var(--color-hue) / 90%)
      ),
      var(--background);
    background-size: cover;
    padding: 1rem 2rem;
    box-shadow:
      0 2px 4px hsl(0 0% 0% / 20%),
      0 4px 8px hsl(0 0% 0% / 20%);

    .title {
      font-size: 150%;
      font-weight: bold;
    }
  }

  .indicators {
    display: flex;
    margin-top: 8px;
    /* color: oklch(90% 0.05 var(--color-hue)); */
    /* background-color: hsl(0 0% 15% / 80%); */
    /* padding: 4px; */
    /* border-radius: 99999px; */
  }

  .indicator {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;

    input {
      opacity: 0;
      position: absolute;
    }

    &::before,
    &::after {
      content: '';
      display: block;
      grid-area: 1 / -1;
      border-radius: 100%;
      aspect-ratio: 1/1;
    }

    &::before {
      border: 1px solid currentColor;
      width: 10px;
    }

    &::after {
      background-color: currentColor;
      width: 6px;
      opacity: 0;
    }

    &:has(input:checked)::after {
      opacity: 1;
    }
  }
</style>
