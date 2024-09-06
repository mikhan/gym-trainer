<script lang="ts">
  import clsx from 'clsx'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    value?: number
    duration?: string
    stroke?: number
  } & HTMLAttributes<HTMLElement>

  const { class: className, value, duration, stroke, ...other }: Props = $props()
</script>

<div
  class={clsx('ui-circular-progress', duration && 'ui-circular-progress-duration', className)}
  style:--progress={value}
  style:--duration={duration}
  style:--stroke={stroke}
  {...other}>
  <svg viewBox="0 0 100 100">
    <circle class="bg"></circle>
    <circle class="fg"></circle>
  </svg>
</div>
