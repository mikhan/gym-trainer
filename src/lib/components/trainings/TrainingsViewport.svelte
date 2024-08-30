<script lang="ts">
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import AppMetadata from '../app/AppMetadata.svelte'
  import TrainingsGrid from './TrainingsGrid.svelte'

  type Props = {
    trainings: Types.Training[]
  }
  const { trainings }: Props = $props()
</script>

<AppMetadata title="Entrenamientos"></AppMetadata>

<AppTopbar title="Entrenamientos"></AppTopbar>

<div class="container mx-auto p-layout-gap">
  <TrainingsGrid {trainings}></TrainingsGrid>
</div>
