<script lang="ts">
  import clsx from 'clsx'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    children: Snippet
  } & HTMLAttributes<HTMLLIElement>

  const { children, class: className, ...props }: Props = $props()
</script>

<li
  class={clsx('col-span-2 flex h-10 w-full items-center px-4 font-bold', className)}
  {...props}
  role="presentation">
  {@render children()}
</li>
