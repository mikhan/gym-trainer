<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { UiMenuContext } from './UiMenuContext.svelte'
  import clsx from 'clsx'

  type Props = {
    children: Snippet
    icon?: Snippet
  } & Omit<HTMLButtonAttributes, 'type'>

  const { children, icon, class: className, ...props }: Props = $props()
  const uiMenuContext = UiMenuContext.get()
</script>

<li class="col-span-2 grid grid-cols-subgrid">
  <button
    role="menuitem"
    class={clsx(
      'col-span-2 grid h-10 w-full grid-cols-subgrid items-center rounded-button border border-transparent px-2 py-0 text-left hover:border-default-line hover:bg-popover-hover',
      className,
    )}
    type="button"
    {...props}
    popovertarget={uiMenuContext.id}
    popovertargetaction="hide">
    {#if icon}
      <div class="grid size-[1lh] place-content-center">{@render icon()}</div>
    {/if}
    <div class="col-start-2 px-2">{@render children()}</div>
  </button>
</li>
