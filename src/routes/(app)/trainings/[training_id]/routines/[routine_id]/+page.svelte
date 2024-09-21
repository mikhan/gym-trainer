<script lang="ts">
  import type { PageData } from './$types'
  import Routine from './Routine.svelte'

  export let data: PageData
</script>

<Routine training={data.training} routineIndex={data.routineIndex}></Routine>
