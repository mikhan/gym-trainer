<script lang="ts">
  import { autoselect } from '$lib/actions/autoselect.action'
  import { TrainerContext } from './TrainerContext.svelte'
  import { convertUnit } from '$lib/utils/unit-converter'
  import Fa from 'svelte-fa'
  import { faCheck } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'

  type Props = {
    serieIndex: number
    stepIndex: number
    record: Types.TrainerRecord | undefined
  }

  let { serieIndex, stepIndex, record }: Props = $props()
  const trainerContext = TrainerContext.getContext()
  const step = $state(record ?? $state.snapshot(trainerContext.getStep(serieIndex, stepIndex)))

  function updateWeightUnit(unit: string) {
    step.weight.value = Math.round(convertUnit(step.weight.value, step.weight.unit, unit))
    step.weight.unit = unit
  }

  function updateWeightValue(value: number) {
    step.weight.value = value
  }

  function setRecord() {
    trainerContext.setRecord(serieIndex, stepIndex, step)
  }

  function deleteRecord() {
    trainerContext.deleteRecord(serieIndex, stepIndex)
  }
</script>

<li class="flex shrink-0 grow-0 basis-auto snap-start flex-col items-center gap-2 font-mono">
  <div class="text-center text-2xl opacity-50">
    {stepIndex + 1}
  </div>
  <div class="typescale-label text-center">
    {#if step.type === 'failure'}
      <div class="opacity-75">Al fallo</div>
    {/if}
    <div>{step.value} reps</div>
  </div>
  <label class="ui-input w-full flex-col rounded-card p-1" class:color-neutral-darker={record}>
    <span class="typescale-label opacity-75">Peso</span>
    <input
      class="w-[5ch] text-center text-2xl"
      type="number"
      required
      use:autoselect
      value={step.weight.value}
      onchange={(e) => updateWeightValue(e.currentTarget.valueAsNumber)} />
    <select value={step.weight.unit} onchange={(e) => updateWeightUnit(e.currentTarget.value)}>
      <option value="kg">Kg.</option>
      <option value="lb">Lb.</option>
    </select>
  </label>
  <button
    class={clsx(
      'flex w-full place-content-center items-center rounded-full border-2 p-1 transition-colors surface surface-editable',
      record ? 'justify-end color-neutral-darker' : 'justify-start color-neutral-lighter',
    )}
    onclick={() => (record ? deleteRecord() : setRecord())}>
    <!-- <span class="px-2 text-sm">{stepIndex + 1}</span> -->
    <span
      class={clsx(
        'grid size-5 place-content-center rounded-full shadow',
        record ? 'bg-secondary text-secondary-fg' : 'bg-default-fg',
      )}>
      <span class={clsx('transition-opacity', record ? 'opacity-100' : 'opacity-0')}
        ><Fa icon={faCheck} size="xs"></Fa></span>
    </span>
  </button>
</li>
