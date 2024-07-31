<script lang="ts">
  import { navigating } from '$app/stores'
</script>

{#if $navigating}
  <div class="app-navigating-indicator fixed left-0 right-0 top-0 z-2 h-1 bg-primary/50">
    <div class="app-navigating-indicator-value size-full bg-primary"></div>
  </div>
{/if}

<style lang="postcss">
  .app-navigating-indicator-value {
    animation: indeterminateAnimation 1s infinite linear;
    transform-origin: 0% 50%;
  }

  @keyframes indeterminateAnimation {
    0% {
      transform: translateX(0) scaleX(0);
    }
    40% {
      transform: translateX(0) scaleX(0.4);
    }
    100% {
      transform: translateX(100%) scaleX(0.5);
    }
  }
</style>
