<script lang="ts">
  import { TrainerContext } from './trainer/TrainerContext.svelte'
  import WelcomeInsights from './WelcomeInsights.svelte'
  import WelcomeMessage from './WelcomeMessage.svelte'

  const trainerContext = TrainerContext.getContext()
</script>

<div
  class="-m-layout-gap h-layout-viewport-height min-h-96 w-layout-viewport-width p-layout-gap md:contents">
  <article
    class="h-full max-w-screen-md flex-auto rounded-card shadow contain-strict color-neutral-darkest surface
    md:h-96 xl:zoom-lg">
    <div
      class="grid size-full grid-rows-[1fr,auto] md:grid-cols-[1fr,fit-content(24rem)] md:grid-rows-1">
      <WelcomeMessage></WelcomeMessage>
      {#if trainerContext.state.status !== 'unset'}
        <WelcomeInsights></WelcomeInsights>
      {/if}
    </div>
  </article>
</div>
