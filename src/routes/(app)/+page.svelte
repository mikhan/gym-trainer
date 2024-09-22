<script lang="ts">
  import { faHome } from '@fortawesome/free-solid-svg-icons'
  import AppMetadata from '$lib/components/app/AppMetadata.svelte'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import TrainingsGrid from './trainings/TrainingsGrid.svelte'
  import Welcome from './Welcome.svelte'

  const { data } = $props()
</script>

<AppMetadata title="Dashboard"></AppMetadata>

<AppShellSection name="header">
  <AppTopbar icon={faHome}></AppTopbar>
</AppShellSection>

<div class="container mx-auto space-y-4 p-layout-gap">
  <div class="flex flex-wrap gap-layout-gap">
    <Welcome></Welcome>
    <h1 class="typescale-title w-full">Entrenamientos</h1>
    <TrainingsGrid trainings={data.trainings}></TrainingsGrid>
  </div>
</div>
