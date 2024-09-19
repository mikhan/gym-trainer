<script lang="ts">
  import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'
  import { type Snippet } from 'svelte'
  import Fa from 'svelte-fa'
  import type { HTMLAttributes } from 'svelte/elements'
  import UiIconbutton from '../ui/UiIconbutton.svelte'
  import { AppShellContext } from './AppShellContext.svelte'

  type Props = {
    children: Snippet
    open?: boolean
    title?: string
  } & HTMLAttributes<HTMLDivElement>

  let { children, title, class: className, ...other }: Props = $props()

  const appShellContext = AppShellContext.get()
</script>

<div
  class={clsx(
    'h-full w-max scroll-pt-[calc(4rem+var(--layout-gap))] overflow-auto shadow-over scrollbar-thin surface',
    className,
  )}
  {...other}>
  <div class="sticky top-0 z-1 mb-layout-gap flex h-16 items-center gap-2 bg-default px-4">
    <UiIconbutton
      class="size-6"
      label="Contraer barra"
      onclick={() => appShellContext.toggleSidebar()}>
      <Fa icon={appShellContext.state.sidebar.open ? faAnglesLeft : faAnglesRight} size="sm"></Fa>
    </UiIconbutton>
    <div class="typescale-title" class:hidden={!appShellContext.state.sidebar.open}>{title}</div>
    <div
      class="pointer-events-none absolute bottom-0 left-0 h-layout-gap w-full translate-y-full bg-gradient-to-b from-default">
    </div>
  </div>
  <div class="isolate" class:hidden={!appShellContext.state.sidebar.open}>
    {@render children()}
  </div>
</div>
