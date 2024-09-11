<script lang="ts">
  import { Fa } from 'svelte-fa'
  import { faTrash } from '@fortawesome/free-solid-svg-icons'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import { convertUnit } from '$lib/utils/unit-converter'
  import { autoselect } from '$lib/actions/autoselect.action'

  type Props = {
    index: number
    step: Types.RoutineStep
    onchange?: (step: Types.RoutineStep) => void
    ondelete?: () => void
  }

  let { index, step: originalStep, onchange = () => {}, ondelete }: Props = $props()
  const step = $state($state.snapshot(originalStep))
  let valueChanged = false

  $effect(() => {
    onchange($state.snapshot(step))
  })

  function changeValue(step: Types.RoutineStep, value: number) {
    valueChanged = true
    step.weight = {
      value,
      unit: step.weight.unit,
    }
  }

  function changeUnit(step: Types.RoutineStep, unit: string) {
    step.weight = {
      value: valueChanged
        ? step.weight.value
        : Math.round(convertUnit(step.weight.value, step.weight.unit, unit)),
      unit,
    }
  }
</script>

<div class="flex items-end gap-2">
  <div>{index + 1}</div>
  <label class="ui-field flex-auto">
    <div class="ui-label">Tipo</div>
    <div class="ui-input">
      <select required bind:value={step.type}>
        <option value="repetitions">Repeticiones</option>
        <option value="failure">Al fallo</option>
      </select>
    </div>
  </label>
  <label class="ui-field flex-auto">
    <div class="ui-label">Value</div>
    <div class="ui-input">
      <input type="string" required use:autoselect bind:value={step.value} />
    </div>
  </label>
  <!-- {#if !useSameDelay} -->
  <!-- <label class="ui-field grow">
          <div class="ui-label">Descanso</div>
          <div class="ui-input max-w-24">
            <input
              class="text-right"
              type="number"
              min="0"
              step="5"
              required
              bind:value={step.delay}
              onchange={() =>
                useSameDelay &&
                serie$.steps.forEach((step) => (step.delay = serie$.steps[0]?.delay ?? 0))} />
            <span>seg</span>
          </div>
        </label> -->
  <!-- {/if} -->
  <label class="ui-field">
    <div class="ui-label">Peso</div>
    <div class="flex gap-2">
      <div class="ui-input">
        <input
          class="w-[3ch] text-right"
          type="number"
          min="0"
          required
          use:autoselect
          value={step.weight.value}
          onchange={({ currentTarget }) => changeValue(step, currentTarget.valueAsNumber)} />
      </div>
      <div class="ui-input">
        <select
          class="w-[3ch]"
          value={step.weight.unit}
          onchange={({ currentTarget }) => changeUnit(step, currentTarget.value)}>
          <option value="kg">Kg</option>
          <option value="lb">Lb</option>
        </select>
      </div>
    </div>
  </label>
  <UiIconbutton
    class="shrink-0"
    label="Delete step"
    disabled={!ondelete}
    onclick={() => ondelete?.()}>
    <Fa icon={faTrash}></Fa>
  </UiIconbutton>
</div>
