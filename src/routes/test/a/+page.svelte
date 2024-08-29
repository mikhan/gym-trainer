<script lang="ts">
  import { transitionName } from '$lib/actions/transition.action'
</script>

<div class="grid size-full">
  <p class="p-8">
    Anim anim ex tempor culpa eiusmod. Velit culpa consequat proident consectetur. Nisi dolore velit
    ad mollit eiusmod quis pariatur.
  </p>
  <div
    class="m-16 box-content flex size-40 flex-col gap-4 rounded-card border border-default-line p-8 shadow-over color-primary surface"
    use:transitionName={{ type: 'navigation', name: 'card' }}>
    <div class="typescale-title">Página A</div>
    <ul class="list-disc">
      <li class="underline">
        <a href="/test/a">Página A</a>
      </li>
      <li class="underline">
        <a href="/test/b">Página B</a>
      </li>
      <li class="underline">
        <a href="/test/c">Página C</a>
      </li>
    </ul>
  </div>
</div>

<style lang="postcss">
  :global {
    ::view-transition-group(card) {
      animation-duration: 1s;
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
</style>
