<script lang="ts">
  import { type TrainerContextStateRunning } from './trainer/TrainerContext.svelte'
  import TrainerTimer from './TrainerTimer.svelte'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import AppShellFooter from '$lib/components/app/AppShellFooter.svelte'

  type Props = { state: TrainerContextStateRunning }
  const { state }: Props = $props()
</script>

<AppShellSection name="footer">
  <AppShellFooter class="color-neutral-darkest">
    {#snippet start()}
      <a
        class="-ml-2 grid h-12 place-content-center rounded-button px-2 focusable-ring hover:bg-default-hover md:-ml-4 md:px-4"
        href="/trainer">
        <div
          class="line-clamp-2 text-balance font-bold leading-4 md:typescale-title md:line-clamp-1">
          {state.currentSerie.name}
        </div>
      </a>
    {/snippet}

    {#snippet end()}
      <TrainerTimer></TrainerTimer>
    {/snippet}
  </AppShellFooter>
</AppShellSection>
