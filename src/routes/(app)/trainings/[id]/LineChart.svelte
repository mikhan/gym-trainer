<script lang="ts" context="module">
  export interface ChartData {
    label: string
    value: number
    color: string
  }
</script>

<script lang="ts">
  import clsx from 'clsx'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    data: ChartData[]
  } & HTMLAttributes<HTMLDivElement>

  const { data, class: className }: Props = $props()
</script>

<div class={clsx('flex gap-1 font-mono', className)}>
  {#each data as dataset (dataset.label)}
    <div
      class="typescale-label w-full uppercase"
      style:width={`${dataset.value}%`}
      style:--color-default={dataset.color}>
      <div class="truncate">{dataset.label}</div>
      <div class="h-2 w-full rounded-button border border-black bg-default"></div>
      <div class="opacity-50">{dataset.value}%</div>
    </div>
  {/each}
</div>
