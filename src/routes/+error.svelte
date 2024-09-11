<script lang="ts">
  import AppErrorPage from '$lib/components/app/AppErrorPage.svelte'
  import { page } from '$app/stores'
</script>

<AppErrorPage code={$page.error?.code} name={$page.error?.name} message={$page.error?.message} />
