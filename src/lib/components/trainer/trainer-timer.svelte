<script lang="ts">
  import type { Action } from '$lib/types'
  import { getTrainerViewportContext } from './trainer-viewport.context'

  type Props = { action: Action }

  const trainerViewportContext = getTrainerViewportContext()

  let { action }: Props = $props()
</script>

<div class="trainer-timer"></div>

<style lang="postcss">
  .trainer-timer {
    /* padding: 1rem; */
    height: 64px;
    /* color: hsl(0 0% 80%);
    background-color: hsl(0 0% 10%); */
  }
</style>
