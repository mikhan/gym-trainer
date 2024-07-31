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
    top: theme('space.layout-gap');
    color: theme('colors.accent.fg');
    background-color: theme('colors.accent.DEFAULT');
    box-shadow: theme('boxShadow.DEFAULT');
    z-index: 1;
  }
</style>
