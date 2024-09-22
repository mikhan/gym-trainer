<script lang="ts">
  import Trainings from './Trainings.svelte'

  const { data } = $props()
</script>

<Trainings trainings={data.trainings}></Trainings>
