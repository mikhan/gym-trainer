<script lang="ts">
  import { autoselect } from '$lib/actions/autoselect.action'
  import clsx from 'clsx'
  import { TrainerContext } from './TrainerContext.svelte'
  import { convertUnit } from '$lib/utils/unit-converter'
  import Fa from 'svelte-fa'
  import { faCheck } from '@fortawesome/free-solid-svg-icons'
  import { faCircle } from '@fortawesome/free-regular-svg-icons'

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
  <label
    class={clsx('ui-input w-full flex-col rounded-card p-1', record && 'color-neutral-darkest')}>
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
      'flex w-full place-content-center items-center justify-between rounded-full border-2 p-1 transition-colors surface surface-editable',
      record && 'color-neutral-darkest',
    )}
    onclick={() => {
      record ? deleteRecord() : setRecord()
      //   completed[stepIndex] = completed ? undefined : step
    }}>
    <span class="px-2 text-sm">{stepIndex + 1}</span>
    <span class="grid size-5 place-content-center rounded-full">
      <Fa icon={record ? faCheck : faCircle} size="sm"></Fa>
    </span>
  </button>
</li>
