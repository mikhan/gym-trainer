<script lang="ts">
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import type { TrainerContextStateCompleted } from './TrainerContext.svelte'

  type Props = {
    state: TrainerContextStateCompleted
  }

  const { state }: Props = $props()
  let { training, currentRoutine } = state
</script>

<AppShellSection name="header">
  <AppTopbar previous={`/trainings/${training.id}`} title={training.name}></AppTopbar>
</AppShellSection>

<article class="container mx-auto flex flex-col space-y-4 p-layout-gap">
  <header>
    <h1 class="typescale-title">Entrenamiento completado</h1>
  </header>
  <details class="rounded-card p-4 shadow scrollbar color-neutral surface">
    <summary>Data</summary>
    <pre class="text-xs">{JSON.stringify(currentRoutine, null, 2)}</pre>
  </details>
</article>
