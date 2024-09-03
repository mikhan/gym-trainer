<script lang="ts">
  import { type Snippet } from 'svelte'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import Fa from 'svelte-fa'
  import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
  import AppUserAvatar from './AppUserAvatar.svelte'
  import UiIconlink from '../ui/ui-iconlink.svelte'
  import AppShellHeader from './AppShellHeader.svelte'

  type Props = { previous?: string | URL; actions?: Snippet } & (
    | { title: string }
    | { children: Snippet }
  )

  let { previous, actions, ...other }: Props = $props()
</script>

<AppShellSection name="header">
  <AppShellHeader class="app-topbar">
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
      <a class="block rounded-full focusable-ring" href="#user">
        <AppUserAvatar class="size-10 border-2 border-neutral-line"></AppUserAvatar>
      </a>
    {/snippet}
  </AppShellHeader>
</AppShellSection>

<style lang="postcss">
  :global {
    .app-topbar {
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
