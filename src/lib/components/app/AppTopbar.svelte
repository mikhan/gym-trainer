<script lang="ts">
  import { type Snippet } from 'svelte'
  import AppHeader from './AppHeader.svelte'
  import Fa from 'svelte-fa'
  import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
  import AppUserAvatar from './AppUserAvatar.svelte'
  import UiIconlink from '../ui/ui-iconlink.svelte'

  type Props = { previous?: string | URL; actions?: Snippet } & (
    | { title: string }
    | { children: Snippet }
  )

  let { previous, actions, ...other }: Props = $props()
</script>

<AppHeader>
  <div class="app-topbar">
    <div class="container flex h-16 w-full items-center gap-2 px-layout-gap">
      {#if previous}
        <UiIconlink href={previous.toString()} label="Previous">
          <Fa icon={faArrowLeft}></Fa>
        </UiIconlink>
      {/if}
      {#if 'title' in other}
        <div class="typescale-title mr-auto">{other.title}</div>
      {:else}
        {@render other.children()}
      {/if}
      <div class="ml-auto flex items-center gap-2">
        {#if actions}
          {@render actions()}
        {/if}
        <a class="block rounded-full focusable-ring" href="#user">
          <AppUserAvatar class="size-10 border-2 border-neutral-line"></AppUserAvatar>
        </a>
      </div>
    </div>
  </div>
</AppHeader>

<style lang="postcss">
  :global {
    .app-topbar {
      @apply flex justify-center transition color-canvas surface;
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
