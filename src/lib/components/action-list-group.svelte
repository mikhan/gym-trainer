<script lang="ts">
  import type { ActionGroup } from '$lib/types'

  export let group: ActionGroup

  function setAnimationRange(element: HTMLElement) {
    const height = element.offsetHeight
    const marginTop = 8 + 40 + 8 + 200 + 8
    const parentHeight = element.parentElement?.offsetHeight ?? 0
    const start = element.offsetTop + parentHeight - element.offsetHeight - marginTop
    const end = start + element.offsetHeight
    console.log({ offsetTop: element.offsetTop, marginTop, parentHeight })
    console.log({ start, end })
    element.style.setProperty('--start', `${start}px`)
    element.style.setProperty('--end', `${end}px`)
  }
</script>

{#key group}
  <div class="action-group" use:setAnimationRange style:--color-hue={group.color.hue}>
    {group.name}
  </div>
{/key}

<style lang="postcss">
  .action-group {
    color: oklch(95% 0.04 var(--color-hue));
    background-color: oklch(45% 0.04 var(--color-hue));
    width: fit-content;
    padding: 0 1rem;
    height: 20px;
    align-content: center;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-radius: 8px;
    position: sticky;
    top: calc(8px + 40px + 8px + 200px);
    z-index: 1;
    animation: op;
    animation-timeline: scroll();
    animation-range-start: var(--start);
    animation-range-end: var(--end);
    animation-fill-mode: forwards;
  }

  @keyframes op {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
