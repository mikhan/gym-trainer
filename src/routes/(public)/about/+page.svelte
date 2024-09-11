<script lang="ts">
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'

  const { data } = $props()
</script>

<AppShellSection name="header">
  <AppTopbar previous="/" title="About"></AppTopbar>
</AppShellSection>

<div
  class="mx-auto grid grid-cols-[repeat(auto-fill,minmax(min(24rem,100%),1fr))] justify-between gap-layout-gap p-layout-gap md:container">
  <article class="h-full space-y-layout-gap rounded-card p-layout-gap shadow color-neutral surface">
    <h1 class="typescale-title">Build</h1>
    <dl class="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
      <dt class="font-bold">Build date</dt>
      <dd class="text-right">{new Date(data.build.buildDate).toLocaleString()}</dd>
      <dt class="font-bold">Branch</dt>
      <dd class="text-right">{data.build.branch}</dd>
      <dt class="font-bold">Commit ref</dt>
      <dd class="text-right">{data.build.commitRef.substring(0, 8)}</dd>
    </dl>
  </article>
</div>
