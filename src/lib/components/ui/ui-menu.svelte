<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    id: string
    children: Snippet
  }

  let { id, children }: Props = $props()
</script>

<ul {id} popover="auto">
  {@render children()}
</ul>

<style lang="postcss">
  ul {
    position: fixed;
    position-anchor: --routine-switcher;
    inset-area: bottom span-right;
    margin: 0;
    padding: 16px 0;
    min-width: anchor-size(inline);
    border: none;
    border-radius: var(--card-roundness);
    background-color: color-mix(in oklch, var(--surface-popover-bg) 85%, transparent);
    backdrop-filter: blur(8px);
    color: var(--surface-popover-fg);
    box-shadow: var(--shadow-over);

    transform: translateY(-8px);
    opacity: 0;
    transition:
      transform 250ms,
      opacity 250ms,
      display 250ms allow-discrete;

    &:popover-open {
      transform: translateY(0);
      opacity: 1;

      @starting-style {
        display: grid;
        transform: translateY(-8px);
        opacity: 0;
      }
    }
  }
</style>
