<script lang="ts">
  import clsx from 'clsx'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    title: string
    src: string | URL
    alt: string
  } & HTMLAttributes<HTMLElement>

  let { title, src, alt, class: className, ...props }: Props = $props()
</script>

<figure
  class={clsx(
    'grid aspect-square grid-cols-[100%] grid-rows-[1fr,auto] justify-items-center gap-4 rounded-card bg-white p-4 shadow contain-strict',
    className,
  )}>
  <img
    class="size-full max-h-full max-w-full object-contain contain-size"
    src={src.toString()}
    {alt} />
  <figcaption
    class="typescale-label rounded-full px-4 py-1 font-bold uppercase color-neutral surface">
    {title}
  </figcaption>
</figure>
