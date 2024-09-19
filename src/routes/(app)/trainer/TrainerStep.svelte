<script lang="ts">
  import { faCheck } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'
  import Fa from 'svelte-fa'
  import { autoselect } from '$lib/actions/autoselect.action'
  import { convertUnit } from '$lib/utils/unit-converter'
  import { TrainerContext } from './TrainerContext.svelte'

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

<li class="row-span-4 grid grid-rows-subgrid font-mono">
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
    <select
      class="focusable-ring"
      value={step.weight.unit}
      onchange={(e) => updateWeightUnit(e.currentTarget.value)}>
      <option value="kg">Kg.</option>
      <option value="lb">Lb.</option>
    </select>
  </label>
  <button
    class={clsx(
      'relative flex w-full items-center rounded-full p-1 transition-all surface surface-editable surface-outlined focusable-ring',
      record ? 'justify-end color-neutral-darker' : 'justify-start color-neutral-lighter',
    )}
    onclick={() => (record ? deleteRecord() : setRecord())}>
    <span
      class={clsx(
        'grid size-6 place-content-center rounded-full shadow',
        record ? 'bg-secondary text-secondary-fg' : 'bg-default-fg',
      )}>
      <span class={clsx('transition-opacity', record ? 'opacity-100' : 'opacity-0')}
        ><Fa icon={faCheck} size="xs"></Fa></span>
    </span>
    <div class="absolute -inset-1"></div>
  </button>
</li>
