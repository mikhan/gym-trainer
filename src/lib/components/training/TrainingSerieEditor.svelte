<script lang="ts">
  import { Fa } from 'svelte-fa'
  import { getMuscles } from '$data/trainer/config'
  import { faTrash } from '@fortawesome/free-solid-svg-icons'
  import UiDialog from '../ui/ui-dialog.svelte'
  import { onMount } from 'svelte'
  import UiIconbutton from '../ui/ui-iconbutton.svelte'
  import UiButton from '../ui/ui-button.svelte'
  import { convertUnit } from '$lib/utils/unit-converter'
  import { autoselect } from '$lib/actions/autoselect.action'

  type Props = {
    serie: Types.RoutineSerie
    open?: boolean
    onclose?: (serie?: Types.RoutineSerie) => void
  }

  let { serie, open = false, onclose }: Props = $props()

  const muscles = getMuscles()
  const serie$ = $state(structuredClone(serie))
  let useSameDelay = $state(true)

  function deleteStep(index: number) {
    serie$.steps.splice(index, 1)
  }

  function addStep() {
    const step = serie$.steps.at(-1) ?? ({} as Types.RoutineStep)
    serie$.steps.push({ ...step })
  }

  function setSameDelay() {
    if (!useSameDelay) return
    let globalDelay = Math.round(
      serie$.steps.reduce((total, step) => total + step.delay, 0) / serie$.steps.length,
    )
    globalDelay -= globalDelay % 5
    serie$.steps.forEach((step) => (step.delay = globalDelay))
  }

  function changeUnit(step: Types.RoutineStep, unit: string) {
    step.weight.value = Math.round(convertUnit(step.weight.value, step.weight.unit, unit))
    step.weight.unit = unit
  }

  onMount(() => {
    useSameDelay = serie$.steps.every(({ delay }) => delay === serie$.steps[0]?.delay)
  })
</script>

<UiDialog bind:open align="right" onclose={() => onclose?.()} title="Editar ejercicio">
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <label class="ui-field flex-[3_1_40ch]">
        <div class="ui-label">Nombre</div>
        <div class="ui-input">
          <input type="string" required bind:value={serie$.name} />
        </div>
      </label>
      <label class="ui-field flex-[1_1_15ch]">
        <div class="ui-label">Músculo</div>
        <div class="ui-input">
          <select
            required
            bind:value={serie$.muscle}
            onchange={() => (serie$.group = serie$.muscle)}>
            {#each muscles as muscle}
              <option value={muscle.id}>{muscle.name}</option>
            {/each}
          </select>
        </div>
      </label>
      <label>
        <input type="checkbox" bind:checked={useSameDelay} onchange={() => setSameDelay()} />
        Same delay
      </label>
    </div>

    <div class="font-bold">Series</div>

    {#each serie$.steps as step, stepIndex}
      <div class="flex items-end gap-2">
        <div>{stepIndex + 1}</div>
        <label class="ui-field flex-auto">
          <div class="ui-label">Value</div>
          <div class="ui-input">
            <input type="string" required use:autoselect bind:value={step.value} />
          </div>
        </label>
        <label class="ui-field flex-auto">
          <div class="ui-label">Tipo</div>
          <div class="ui-input">
            <select required bind:value={step.type}>
              <option value="repetitions">Repeticiones</option>
              <option value="failure">Al fallo</option>
            </select>
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
                bind:value={step.weight.value} />
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
          disabled={serie$.steps.length === 1}
          onclick={() => deleteStep(stepIndex)}>
          <Fa icon={faTrash}></Fa>
        </UiIconbutton>
      </div>
    {/each}
    <UiButton class="w-full" onclick={() => addStep()}>Agregar serie</UiButton>
  </div>

  {#snippet actions()}
    <UiButton onclick={() => onclose?.()}>Cancelar</UiButton>
    <UiButton class="color-primary" onclick={() => onclose?.($state.snapshot(serie$))}
      >Listo</UiButton>
  {/snippet}
</UiDialog>
