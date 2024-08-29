<script lang="ts">
  import { onNavigate } from '$app/navigation'
  import { startViewTransition } from '$lib/actions/transition.action'

  onNavigate((navigation) => {
    return new Promise((resolve) => {
      startViewTransition({
        update: async () => {
          resolve()
          await navigation.complete
        },
        types: ['navigation'],
      })
    })
  })
</script>

<style lang="postcss">
  :global {
    @view-transition {
      navigation: auto;
    }
  }
</style>
