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

<div class={clsx('flex flex-wrap gap-x-2', className)}>
  <div
    class="flex h-2 w-full divide-x divide-black overflow-hidden rounded-button border border-black">
    {#each data as dataset (dataset.label)}
      <span style:background-color={dataset.color} style:width={`${dataset.value}%`}></span>
    {/each}
  </div>
  {#each data as dataset (dataset.label)}
    <div class="typescale-label inline-flex items-center gap-1">
      <span class="size-2 rounded-full border border-black" style:background-color={dataset.color}>
      </span>
      <span class="font-mono">{dataset.label}</span>
    </div>
  {/each}
</div>
