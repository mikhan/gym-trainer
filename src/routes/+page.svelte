<script lang="ts">
  import AppMetadata from '$lib/components/app/AppMetadata.svelte'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import TrainingsGrid from '$lib/components/trainings/TrainingsGrid.svelte'
  import type { PageData } from './$types'

  const { data }: { data: PageData } = $props()
</script>

<AppMetadata title="Dashboard"></AppMetadata>

<AppShellSection name="header">
  <AppTopbar title="Dashboard"></AppTopbar>
</AppShellSection>

<div class="container mx-auto space-y-4 p-layout-gap">
  <h1 class="typescale-title">Entrenamientos</h1>
  <TrainingsGrid trainings={data.trainings}></TrainingsGrid>
</div>
