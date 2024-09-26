<script lang="ts">
  import clsx from 'clsx'
  import SvelteMarkdown from 'svelte-markdown'
  import type { HTMLAttributes } from 'svelte/elements'
  import TrainerSerieImage from './TrainerSerieImage.svelte'

  type Props = {
    instructions?: string
    image: string
    alt: string
  } & HTMLAttributes<HTMLElement>

  const DEFAULT = `
Amet ipsum sint duis ex nisi anim cupidatat labore proident do ullamco culpaconsectetur.

1. Sint minim quis amet **voluptate** nostrud sint fugiat duis pariatur ad anim sint.
2. Ad ea laborum duis labore duis et do pariatur eiusmod ad culpa veniam. Fugiat dolore nulla amet ullamco est elit deserunt ullamco.
3. In adipisicing eu irure incididunt commodo fugiat culpa aliqua commodo non commodo esse ex.

Excepteur aute voluptate anim mollit do amet officia dolore excepteur occaecat ullamco sit.`

  let { instructions = DEFAULT, image, alt, class: className, ...props }: Props = $props()
</script>

<article
  class={clsx('space-y-4 rounded-card p-4 shadow color-neutral surface', className)}
  {...props}>
  <h1 class="typescale-title">Instrucciones</h1>
  <div class="flex flex-col gap-layout-gap sm:flex-row sm:flex-wrap">
    <div class="prose prose-invert flex-1 sm:min-w-96">
      <SvelteMarkdown source={instructions} />
    </div>
    <div class="flex-1 sm:min-w-48">
      <TrainerSerieImage src={image} {alt}></TrainerSerieImage>
    </div>
  </div>
</article>
