<script lang="ts">
  import clsx from 'clsx'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    children: Snippet
  } & HTMLAttributes<HTMLDivElement>

  const { children, class: className, ...props }: Props = $props()
</script>

<div
  class={clsx(
    'flex flex-col justify-end p-4 isolate contain-size contain-paint overflow-y-auto *:flex-none',
    className,
  )}
  {...props}>
  {@render children()}
</div>
