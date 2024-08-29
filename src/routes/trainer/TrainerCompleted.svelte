<script lang="ts">
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  // import { TrainerContext } from './TrainerContext.svelte'

  type Props = {
    training: Types.Training
    currentRoutine: Types.Routine
  }

  let { training, currentRoutine }: Props = $props()
  // const trainerContext = TrainerContext.getContext()
</script>

<AppTopbar previous={`/trainings/${training.id}`} title={training.name}></AppTopbar>

<article class="container mx-auto flex flex-col space-y-4 p-layout-gap">
  <header>
    <h1 class="typescale-title">Entrenamiento completado</h1>
  </header>
  <details class="rounded-card p-4 shadow scrollbar color-neutral surface">
    <summary>Data</summary>
    <pre class="text-xs">{JSON.stringify(currentRoutine, null, 2)}</pre>
  </details>
</article>
