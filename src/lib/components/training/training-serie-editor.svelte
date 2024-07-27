<script lang="ts">
  import { Fa } from 'svelte-fa'
  import { getMuscles } from '$data/trainer/config'
  import { faTrash } from '@fortawesome/free-solid-svg-icons'
  import UiDialog from '../ui/ui-dialog.svelte'
  import { TrainingViewportContext } from './training-viewport-context.svelte'
  import { onMount } from 'svelte'
  import UiIconbutton from '../ui/ui-iconbutton.svelte'
  import UiButton from '../ui/ui-button.svelte'

  type Props = {
    routineId: string
    serieId: string
    open?: boolean
    onclose?: () => void
  }

  let { routineId, serieId, open = false, onclose }: Props = $props()

  const muscles = getMuscles()
  const trainingViewportContext = TrainingViewportContext.get()
  const training$ = $state(structuredClone(trainingViewportContext.training$))
  const serie$ = $derived(pickSerie(training$, routineId, serieId))
  let useSameDelay = $state(true)

  function pickSerie(training: Types.Training, routineId: string, serieId: string) {
    return training.routines
      .find(({ id }) => id === routineId)
      ?.series.find(({ id }) => id === serieId)!
  }

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

  function update() {
    trainingViewportContext.updateSerie(routineId, $state.snapshot(serie$))
    onclose?.()
  }

  onMount(() => {
    useSameDelay = serie$.steps.every(({ delay }) => delay === serie$.steps[0].delay)
  })
</script>

<UiDialog bind:open onclose={update} title="Edit exercise">
  <div class="grid gap-4">
    <div class="flex"></div>
    <div class="flex flex-wrap gap-2">
      <label class="field flex-[3_1_40ch]">
        <span class="field-label">Name</span>
        <input class="input" type="string" required bind:value={serie$.name} />
      </label>
      <label class="field flex-[1_1_15ch]">
        <span class="field-label">Muscle</span>
        <select
          class="input"
          required
          bind:value={serie$.muscle}
          onchange={() => (serie$.group = serie$.muscle)}>
          {#each muscles as muscle}
            <option value={muscle.id}>{muscle.name}</option>
          {/each}
        </select>
      </label>
      <label>
        <input type="checkbox" bind:checked={useSameDelay} onchange={() => setSameDelay()} />
        Same delay
      </label>
    </div>

    <h3>Steps</h3>

    {#each serie$.steps as step, stepIndex}
      <div class="flex items-end gap-2">
        <label class="field grow">
          <span class="field-label">Type</span>
          <select class="input" required bind:value={step.type}>
            <option value="repetitions">Repetitions</option>
            <option value="failure">Failure</option>
          </select>
        </label>
        <label class="field grow">
          <span class="field-label">Value</span>
          <input class="input" type="string" required bind:value={step.value} />
        </label>
        <!-- {#if !sameDelay} -->
        <label class="field grow">
          <span class="field-label">Recovery time</span>
          <input
            class="input"
            type="number"
            min="0"
            step="5"
            required
            bind:value={step.delay}
            onchange={() =>
              useSameDelay &&
              serie$.steps.forEach((step) => (step.delay = serie$.steps[0].delay))} />
        </label>
        <!-- {/if} -->
        <UiIconbutton
          class="shrink-0"
          label="Delete step"
          disabled={serie$.steps.length === 1}
          onclick={() => deleteStep(stepIndex)}>
          <Fa icon={faTrash}></Fa>
        </UiIconbutton>
      </div>
    {/each}
  </div>

  {#snippet actions()}
    <UiButton onclick={() => addStep()}>Add step</UiButton>
    <UiButton onclick={() => update()}>Close</UiButton>
  {/snippet}
</UiDialog>
