<script lang="ts">
  import AppMetadata from '$lib/components/app/AppMetadata.svelte'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import TrainingsGrid from './TrainingsGrid.svelte'

  type Props = {
    trainings: Types.Training[]
  }
  const { trainings }: Props = $props()
</script>

<AppMetadata title="Entrenamientos"></AppMetadata>

<AppShellSection name="header">
  <AppTopbar title="Entrenamientos" previous="/"></AppTopbar>
</AppShellSection>

<div class="container mx-auto p-layout-gap">
  <div class="flex flex-wrap gap-layout-gap">
    <TrainingsGrid {trainings}></TrainingsGrid>
  </div>
</div>
