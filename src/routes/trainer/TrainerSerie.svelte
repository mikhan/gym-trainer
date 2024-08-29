<script lang="ts">
  import { autoselect } from '$lib/actions/autoselect.action'
  import clsx from 'clsx'
  import { TrainerContext } from './TrainerContext.svelte'
  import { convertUnit } from '$lib/utils/unit-converter'

  type Props = {
    serie: Types.RoutineSerie
    serieIndex: number
    total: number
    isCurrent: boolean
  }

  let { serie, serieIndex, total, isCurrent }: Props = $props()
  const trainerContext = TrainerContext.getContext()

  function updateWeightUnit(stepIndex: number, unit: string) {
    const step = serie.steps.at(stepIndex)
    if (step) {
      const value = Math.round(convertUnit(step.weight.value, step.weight.unit, unit))
      trainerContext.setStepWeight(serieIndex, stepIndex, { value, unit })
    }
  }

  function updateWeightValue(stepIndex: number, value: number) {
    const step = serie.steps.at(stepIndex)
    if (step) {
      trainerContext.setStepWeight(serieIndex, stepIndex, { ...step.weight, value })
    }
  }

  function updateSerieNotes(value: string) {
    trainerContext.updateSerieNotes(serieIndex, value)
  }
</script>

<li
  class="mx-auto grid size-full max-w-screen-sm p-layout-gap"
  role="group"
  aria-roledescription="Slide"
  aria-label={serie.name}
  aria-current={isCurrent}
  data-id={serie.id}
  inert={!isCurrent}>
  <article
    class={clsx(
      'flex size-full flex-col overflow-y-auto rounded-card pb-6 shadow transition-colors scrollbar-thin surface',
      isCurrent ? 'color-secondary-darker' : 'color-neutral',
    )}>
    <header class="sticky top-0 z-1 mb-6 flex items-start bg-inherit p-6 pb-4">
      <h1 class="typescale-headline grow">{serie.name}</h1>
      <div class="flex items-center gap-1">
        <span class="text-6xl font-light leading-10">{serieIndex + 1}</span>
        <span class="text-lg leading-5 opacity-75">DE<br />{total}</span>
      </div>
      <div
        class="pointer-events-none absolute -bottom-6 left-0 h-6 w-full bg-inherit"
        style="mask-image: linear-gradient(to bottom, black, transparent)">
      </div>
    </header>
    <div class="px-6">
      <label class="ui-field">
        <span class="ui-label">Notas</span>
        <div class="ui-input">
          <textarea
            class="max-h-[6lh] min-h-[2lh]"
            value={serie.notes}
            placeholder="Agrega un comentario personal a este ejercicio"
            onchange={(e) => updateSerieNotes(e.currentTarget.value)}></textarea>
        </div>
      </label>
    </div>
    <div class="mt-auto space-y-2 px-6">
      {#each serie.steps as step, stepIndex}
        <div class="flex items-center gap-2">
          <div class="mr-auto opacity-50">{stepIndex + 1}</div>
          <div>{step.value}</div>
          <div>{step.type}</div>
          <div class="ui-input">
            <input
              class="w-[3ch]"
              type="number"
              required
              use:autoselect
              value={step.weight.value}
              onchange={(e) => updateWeightValue(stepIndex, e.currentTarget.valueAsNumber)} />
          </div>
          <div class="ui-input">
            <select
              class="w-[3ch]"
              value={step.weight.unit}
              onchange={(e) => updateWeightUnit(stepIndex, e.currentTarget.value)}>
              <option value="kg">Kg.</option>
              <option value="lb">Lb.</option>
            </select>
          </div>
        </div>
      {/each}
    </div>
  </article>
</li>

<style lang="postcss">
  article {
    animation-name: fade-in-out;
    animation-timeline: view(x);
  }

  @keyframes fade-in-out {
    0%,
    100% {
      scale: 0.85;
      opacity: 0;
    }

    40%,
    60% {
      scale: 1;
      opacity: 1;
    }
  }
</style>
