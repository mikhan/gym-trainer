<script lang="ts">
  import clsx from 'clsx'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    children: Snippet
  } & HTMLAttributes<HTMLElement>

  let { children, class: className, ...props }: Props = $props()
</script>

<article
  class={clsx('space-y-4 rounded-card p-4 shadow color-neutral surface', className)}
  {...props}>
  <h1 class="typescale-title">Instrucciones</h1>
  <div>{@render children()}</div>
</article>
