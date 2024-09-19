<script lang="ts">
  import { page } from '$app/stores'
  import AppErrorPage from '$lib/components/app/AppErrorPage.svelte'
</script>

<AppErrorPage code={$page.error?.code} name={$page.error?.name} message={$page.error?.message} />
