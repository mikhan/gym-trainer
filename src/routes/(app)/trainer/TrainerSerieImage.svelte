<script lang="ts">
  import clsx from 'clsx'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    src: string | URL
    alt: string
    children?: Snippet
  } & HTMLAttributes<HTMLElement>

  let { src, alt, class: className, children, ...props }: Props = $props()
</script>

<figure
  class={clsx(
    'grid aspect-square max-h-96 w-full grid-cols-[100%] grid-rows-1 justify-items-center gap-4 rounded-button bg-black p-2 contain-strict',
    className,
  )}
  {...props}>
  <div class="relative isolate size-full contain-size">
    <img class="size-full object-contain invert" src={src.toString()} {alt} loading="lazy" />
    <img
      class="absolute inset-0 size-full object-contain mix-blend-color"
      src={src.toString()}
      aria-hidden="true"
      loading="lazy"
      alt="" />
  </div>
  {#if children}
    <figcaption class="typescale-label text-white">
      {@render children()}
    </figcaption>
  {/if}
</figure>
