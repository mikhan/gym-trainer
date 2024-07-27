<script lang="ts">
  import AppTopbar from '$lib/components/app/app-topbar.svelte'
  import TrainingHeader from './training-header.svelte'
  import TrainingNavigation from '$lib/components/training/training-navigation.svelte'
  import TrainingRoutinesList from '$lib/components/training/training-routines-list.svelte'
  import { TrainingViewportContext } from './training-viewport-context.svelte'
  import UiButton from '../ui/ui-button.svelte'

  type Props = {
    training: Types.Training
  }

  let { training }: Props = $props()
  const trainingViewportContext = TrainingViewportContext.create({ training })
</script>

<AppTopbar>
  <div class="flex items-center">
    <div class="grow text-2xl">{trainingViewportContext.training$.name}</div>
  </div>
  {#snippet actions()}
    {#if trainingViewportContext.pristine$ === false}
      <UiButton
        onclick={() => trainingViewportContext.reset()}
        disabled={trainingViewportContext.saving$}>Reset</UiButton>
      <UiButton
        onclick={() => trainingViewportContext.save()}
        disabled={trainingViewportContext.saving$}>Save</UiButton>
    {/if}
  {/snippet}
</AppTopbar>

<div class="scrollbar-stable h-full scroll-py-layout-gap overflow-auto scroll-smooth">
  <div
    class="container mx-auto grid grid-cols-1 gap-layout-gap px-layout-gap lg:grid-cols-[1fr,minmax(min-content,30ch)]">
    <article class="container flex h-full flex-col gap-layout-gap py-10">
      <TrainingHeader {training}></TrainingHeader>
      <TrainingRoutinesList></TrainingRoutinesList>
    </article>
    <TrainingNavigation></TrainingNavigation>
  </div>
</div>
