<script lang="ts">
  import type { PageData } from './$types'
  import Routine from './Routine.svelte'

  export let data: PageData
</script>

<Routine routineIndex={data.routineIndex}></Routine>
