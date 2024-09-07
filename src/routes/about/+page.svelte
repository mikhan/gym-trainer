<script lang="ts">
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import type { PageData } from './$types'

  export let data: PageData
  console.log(data.build)
</script>

<AppShellSection name="header">
  <AppTopbar previous="/" title="About"></AppTopbar>
</AppShellSection>

<div class="container mx-auto space-y-layout-gap p-layout-gap">
  <h1 class="typescale-title">Build</h1>
  <dl class="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
    <dt class="font-bold">Build date</dt>
    <dd>{new Date(data.build.buildDate).toLocaleString()}</dd>
    <dt class="font-bold">Branch</dt>
    <dd>{data.build.branch}</dd>
    <dt class="font-bold">Commit ref</dt>
    <dd>{data.build.commitRef}</dd>
  </dl>
</div>
