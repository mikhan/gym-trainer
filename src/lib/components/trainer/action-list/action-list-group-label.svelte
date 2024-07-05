<script lang="ts">
  import type { ActionGroup } from '$lib/types'

  export let group: ActionGroup
</script>

<div class="action-list-group-label">
  {group.name}
</div>

<style lang="postcss">
  .action-list-group-label {
    scroll-snap-align: start;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: bold;
    width: max-content;
    line-height: 1.5rem;
    padding: 0 1rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-radius: 8px;
    position: sticky;
    top: var(--layout-gap);
    color: var(--color-accent-fg);
    background-color: var(--color-accent-bg);
    box-shadow: var(--shadow-base);
    z-index: 1;
  }
</style>
