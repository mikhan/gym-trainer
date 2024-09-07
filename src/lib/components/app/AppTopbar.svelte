<script lang="ts">
  import { type Snippet } from 'svelte'
  import Fa from 'svelte-fa'
  import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
  import AppUserAvatar from './AppUserAvatar.svelte'
  import UiIconlink from '../ui/ui-iconlink.svelte'
  import AppShellHeader from './AppShellHeader.svelte'
  import clsx from 'clsx'

  type Props = { previous?: string | URL; actions?: Snippet; class?: string } & (
    | { title: string }
    | { children: Snippet }
  )

  let { previous, actions, class: className, ...other }: Props = $props()
</script>

<AppShellHeader class={clsx('app-topbar', className)}>
  {#snippet start()}
    {#if previous}
      <UiIconlink href={previous.toString()} label="Previous">
        <Fa icon={faArrowLeft}></Fa>
      </UiIconlink>
    {/if}
    {#if 'title' in other}
      <div class="typescale-title">{other.title}</div>
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
    .app-topbar {
      @apply color-canvas;
      animation-timeline: scroll(nearest);
      animation-name: app-topbar-color;
      animation-range-end: min(200px, 50%);
      animation-fill-mode: forwards;
    }

    @keyframes app-topbar-color {
      from {
        @apply color-canvas;
      }
      to {
        @apply shadow color-neutral-darkest;
      }
    }
  }
</style>
