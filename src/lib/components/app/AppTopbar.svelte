<script lang="ts">
  import { faArrowLeft, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'
  import { type Snippet } from 'svelte'
  import Fa from 'svelte-fa'
  import UiIconlink from '../ui/UiIconlink.svelte'
  import AppShellHeader from './AppBar.svelte'
  import AppUserAvatar from './AppUserAvatar.svelte'

  type Props = {
    name?: string
    icon?: IconDefinition | Snippet
    previous?: string | URL
    actions?: Snippet
    class?: string
    filled?: boolean
  } & ({ title: string } | { children: Snippet })

  let {
    name = 'topbar',
    icon,
    previous,
    actions,
    class: className,
    filled = false,
    ...other
  }: Props = $props()

  function isIconDefinition(value: unknown): value is IconDefinition {
    return typeof value === 'object' && value !== null && 'icon' in value
  }
</script>

<AppShellHeader
  class={clsx(
    'app-topbar',
    !filled && 'app-topbar-docked',
    className || (!filled && 'color-neutral-darkest'),
  )}
  {name}>
  {#snippet start()}
    {#if previous}
      <UiIconlink href={previous.toString()} label="Previous">
        <Fa icon={isIconDefinition(icon) ? icon : faArrowLeft}></Fa>
      </UiIconlink>
    {:else if isIconDefinition(icon)}
      <div class="grid size-[--widget-height] place-content-center">
        <Fa {icon}></Fa>
      </div>
    {:else if icon}
      {@render icon()}
    {/if}

    {#if 'title' in other}
      <div class="typescale-title line-clamp-1">{other.title}</div>
    {:else}
      {@render other.children()}
    {/if}
  {/snippet}

  {#snippet end()}
    {#if actions}
      {@render actions()}
    {/if}
    <a class="block rounded-full focusable-ring" href="/about">
      <AppUserAvatar class="size-10 border-2 border-neutral-line"></AppUserAvatar>
    </a>
  {/snippet}
</AppShellHeader>

<style lang="postcss">
  :global {
    :where(.app-topbar) {
      @apply color-canvas surface;
    }

    :where(.app-topbar-docked) {
      @apply bg-default/0 shadow-none;
      animation-timeline: scroll(nearest);
      animation-name: --app-topbar-docked-animation;
      animation-range-end: min(var(--layout-header-height), 50%);
      animation-fill-mode: forwards;
    }

    @keyframes --app-topbar-docked-animation {
      from {
        @apply bg-default/0 shadow-none;
      }
      to {
        @apply bg-default/100 shadow;
      }
    }
  }
</style>
