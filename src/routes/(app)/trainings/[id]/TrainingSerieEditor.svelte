<script lang="ts">
  import TrainingSerieEditorStep from './TrainingSerieEditorStep.svelte'
  import { getMuscles } from '$data/trainer/config'
  import UiDialog from '$lib/components/ui/UiDialog.svelte'
  import { onMount } from 'svelte'
  import UiButton from '$lib/components/ui/UiButton.svelte'
  import UiCheckbox from '$lib/components/ui/UiCheckbox.svelte'

  type Props = {
    serie: Types.RoutineSerie
    open?: boolean
    onclose?: (serie?: Types.RoutineSerie) => void
  }

  let { serie: orinalSerie, open = false, onclose }: Props = $props()

  const muscles = getMuscles()
  let serie = $state(structuredClone(orinalSerie))
  let useSameDelay = $state(true)

  function deleteStep(index: number) {
    serie.steps.splice(index, 1)
  }

  function addStep() {
    const step = serie.steps.at(-1) ?? ({} as Types.RoutineStep)
    serie.steps.push({ ...step })
  }

  function setSameDelay() {
    if (!useSameDelay) return
    let globalDelay = Math.round(
      serie.steps.reduce((total, step) => total + step.delay, 0) / serie.steps.length,
    )
    globalDelay -= globalDelay % 5
    serie.steps.forEach((step) => (step.delay = globalDelay))
  }

  function cancel() {
    onclose?.()
    serie = structuredClone(orinalSerie)
  }

  function done() {
    onclose?.($state.snapshot(serie))
  }

  onMount(() => {
    useSameDelay = serie.steps.every(({ delay }) => delay === serie.steps[0]?.delay)
  })
</script>

<UiDialog bind:open align="right" onclose={cancel} title="Editar ejercicio">
  <div class="space-y-4">
    <div class="grid gap-2">
      <label class="ui-field flex-[3_1_40ch]">
        <div class="ui-label">Nombre</div>
        <div class="ui-input">
          <input type="string" required bind:value={serie.name} />
        </div>
      </label>
      <label class="ui-field flex-[1_1_15ch]">
        <div class="ui-label">Músculo</div>
        <div class="ui-input">
          <select required bind:value={serie.muscle} onchange={() => (serie.group = serie.muscle)}>
            {#each muscles as muscle}
              <option value={muscle.id}>{muscle.name}</option>
            {/each}
          </select>
        </div>
      </label>
      <label class="ui-field">
        <div class="ui-label">
          <UiCheckbox bind:checked={useSameDelay} onchange={() => setSameDelay()}></UiCheckbox>
          <span class="cursor-pointer">Same delay</span>
        </div>
      </label>
    </div>

    <div class="font-bold">Series</div>

    {#each serie.steps as step, index}
      <TrainingSerieEditorStep
        {step}
        {index}
        onchange={(step) => (serie.steps[index] = step)}
        ondelete={serie.steps.length === 1 ? undefined : () => deleteStep(index)}
      ></TrainingSerieEditorStep>
    {/each}
    <UiButton class="w-full" onclick={addStep}>Agregar serie</UiButton>
  </div>

  {#snippet actions()}
    <UiButton onclick={cancel}>Cancelar</UiButton>
    <UiButton class="color-primary" onclick={done}>Listo</UiButton>
  {/snippet}
</UiDialog>
