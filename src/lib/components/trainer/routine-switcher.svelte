<script lang="ts">
  import type { Routine } from '$data/trainer/trainings'
  import UiButton from '../ui/ui-button.svelte'
  import UiMenu from '../ui/ui-menu.svelte'
  import UiMenuitem from '../ui/ui-menuitem.svelte'

  type Props = {
    routines: Routine[]
    currentRoutineId: string | undefined
  }

  let { routines, currentRoutineId = $bindable() }: Props = $props()
  let currentRoutine = $derived(routines.find(({ id }) => id === currentRoutineId))
</script>

<UiButton class="min-w-48 text-left" id="routine-switcher">
  {currentRoutine?.name}
</UiButton>
<UiMenu target="routine-switcher">
  {#each routines as routine}
    <UiMenuitem onclick={() => (currentRoutineId = routine.id)}>
      {routine.name}
    </UiMenuitem>
  {/each}
</UiMenu>
