<script lang="ts">
  import type { ActionGroup } from '$lib/types'

  export let group: ActionGroup
</script>

{#key group}
  <div class="action-list-group-label" style:--color-hue={group.color.hue}>
    <div class="label-name">{group.name}</div>
  </div>
{/key}

<style lang="postcss">
  .action-list-group-label {
    scroll-snap-align: start;
    /* scroll-margin-block-start: -2rem; */
    z-index: 1;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: bold;
    width: max-content;
    height: 1.5rem;
    padding: 0 1rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-radius: 8px;
    position: sticky;
    top: var(--layout-gap);
    margin-block: var(--layout-gap);
    color: var(--surface-accent-fg);
    background-color: var(--surface-accent-bg);

    /* &::after {
      content: '';
      position: absolute;
      inset: calc(var(--layout-gap) * -1);
      z-index: -1;
      background-image: linear-gradient(to bottom, var(--surface-1-bg), 60%, transparent);
    } */
  }

  .label-name {
  }
</style>
