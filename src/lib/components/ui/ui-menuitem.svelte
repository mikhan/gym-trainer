<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { UiMenuContext } from './ui-menu-context.svelte'
  import clsx from 'clsx'

  type Props = {
    children: Snippet
  } & Omit<HTMLButtonAttributes, 'type'>

  const { children, class: className, ...props }: Props = $props()
  const uiMenuContext = UiMenuContext.get()
</script>

<li>
  <button
    class={clsx(
      'menu-item h-10 w-full rounded-card px-4 pt-0 text-left hover:bg-popover-hover',
      className,
    )}
    type="button"
    {...props}
    popovertarget={uiMenuContext.id}
    popovertargetaction="hide">{@render children()}</button>
</li>
