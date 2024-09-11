<script lang="ts">
  import { onMount } from 'svelte'
  import AppDatabase from '$lib/components/app/app-database.svelte'
  import { invalidate } from '$app/navigation'
  import AppPwa from '$lib/components/app/AppPwa.svelte'
  import AppNavigatingIndicator from '$lib/components/app/AppNavigatingIndicator.svelte'
  import AppViewTransition from '$lib/components/app/AppViewTransition.svelte'
  import '$lib/styles/app.css'

  let { children, data } = $props()

  onMount(() => {
    const {
      data: { subscription },
    } = data.supabase.auth.onAuthStateChange((_, session) => {
      if (session?.expires_at !== data.session?.expires_at) {
        invalidate('supabase:auth')
      }
    })

    return () => subscription.unsubscribe()
  })
</script>

<AppPwa />
<AppViewTransition />
<AppNavigatingIndicator />
<AppDatabase client={data.supabase}>
  {@render children()}
</AppDatabase>
