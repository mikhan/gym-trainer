<script lang="ts">
  import { viewTransitionName, startViewTransition } from '$lib/actions/transition.action'

  let state = $state(1)

  function update(number: number) {
    startViewTransition({
      update: () => (state = number),
      types: ['test-update'],
    })
  }
</script>

<div class="flex size-full flex-col">
  <div class="p-8">
    <button class="ui-button" onclick={() => update(1)}>1</button>
    <button class="ui-button" onclick={() => update(2)}>2</button>
    <button class="ui-button" onclick={() => update(3)}>3</button>
  </div>
  <div class="grid grid-cols-3 border p-8">
    <div>
      {#if state === 1}
        <div
          class="rounded-card p-8 shadow-over color-primary surface"
          use:viewTransitionName={{ type: 'test-update', name: 'card' }}>
          A
        </div>
      {/if}
    </div>
    <div>
      {#if state === 2}
        <div
          class="rounded-card p-8 shadow-over color-secondary surface"
          use:viewTransitionName={{ type: 'test-update', name: 'card' }}>
          B
        </div>
      {/if}
    </div>
    <div>
      {#if state === 3}
        <div
          class="rounded-card p-8 shadow-over color-accent surface"
          use:viewTransitionName={{ type: 'test-update', name: 'card' }}>
          C
        </div>
      {/if}
    </div>
  </div>
  <div class="grid grid-cols-3 border p-8">
    {#if state === 1}
      <div
        class="rounded-card p-8 shadow-over color-primary surface"
        use:viewTransitionName={{ type: 'test-update', name: 'card2' }}>
        A
      </div>
    {/if}
    {#if state === 2}
      <div
        class="rounded-card p-8 shadow-over color-secondary surface"
        use:viewTransitionName={{ type: 'test-update', name: 'card2' }}>
        B
      </div>
    {/if}
    {#if state === 3}
      <div
        class="rounded-card p-8 shadow-over color-accent surface"
        use:viewTransitionName={{ type: 'test-update', name: 'card2' }}>
        C
      </div>
    {/if}
  </div>
  <div class="grid grid-cols-3 border p-8">
    {#if state === 1}
      <div class="card-3 rounded-card p-8 shadow-over color-primary surface">A</div>
    {/if}
    {#if state === 2}
      <div class="card-3 rounded-card p-8 shadow-over color-secondary surface">B</div>
    {/if}
    {#if state === 3}
      <div class="card-3 rounded-card p-8 shadow-over color-accent surface">C</div>
    {/if}
  </div>
</div>

<style lang="postcss">
  :global {
    html:active-view-transition-type(test-update) {
      .card-3 {
        view-transition-name: card-3;
      }

      &::view-transition-old(card-3) {
        animation: 0.5s 0s linear both shrink-y;
      }

      &::view-transition-new(card-3) {
        animation: 0.5s 0.5s linear both grow-y;
      }
    }

    @keyframes grow-y {
      from {
        transform: scaleY(0);
        /* filter: blur(0px); */
      }
      to {
        transform: scaleY(1);
        /* filter: blur(4px); */
      }
    }

    @keyframes shrink-y {
      from {
        transform: scaleY(1);
        /* filter: blur(0px); */
      }
      to {
        transform: scaleY(0);
        /* filter: blur(4px); */
      }
    }

    ::view-transition-group(card),
    ::view-transition-group(card2) {
      animation-duration: 0.5s;
      animation-timing-function: ease-in-out;
      /* transform-origin: right center; */
      /* border: 1px solid green; */
    }

    ::view-transition-old(card),
    ::view-transition-old(card2) {
      /* opacity: 1; */
      animation: 0.5s 0s linear both shrink-y;
      /* border: 1px solid red; */
    }

    ::view-transition-new(card),
    ::view-transition-new(card2) {
      animation: 0.5s 0.5s linear both grow-y;
      /* border: 1px solid blue; */
    }

    /* ::view-transition-image-pair(card) {
      isolation: auto;
    }

    ::view-transition-old(card),
    ::view-transition-new(card) {
      animation: none;
      mix-blend-mode: normal;
      display: block;
    } */

    /* .navigating::view-transition-old(root) {
        animation:
          90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
          300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
      }

      .navigating::view-transition-new(root) {
        animation:
          210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
          300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
      } */

    @keyframes fade-in {
      from {
        opacity: 0;
      }
    }

    @keyframes fade-out {
      to {
        opacity: 0;
      }
    }

    @keyframes slide-from-right {
      from {
        transform: translateX(30px);
      }
    }

    @keyframes slide-to-left {
      to {
        transform: translateX(-30px);
      }
    }
  }
</style>
