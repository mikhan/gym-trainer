<script lang="ts">
  import { faTrash } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'
  import Fa from 'svelte-fa'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { startViewTransition, viewTransitionName } from '$lib/actions/transition.action'
  import AppShellHeader from '$lib/components/app/AppBar.svelte'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import UiButton from '$lib/components/ui/UiButton.svelte'
  import UiIconbutton from '$lib/components/ui/UiIconbutton.svelte'
  import { getPersistedState } from '$lib/states/persisted-state.svelte'

  type View = typeof current

  const { data } = $props()

  let index: number | null = $state(data.index)
  let views: View[] = getPersistedState('local', 'AppBarTest.views', [])
  let current = $state({
    name: '',
    values: {
      topbar: false,
      topbar1: true,
      topbar2: true,
      topbar3: true,
      bottombar: false,
      bottombar1: true,
      bottombar2: true,
      bottombar3: true,
      asidebar: false,
      asidebar1: true,
      asidebar2: true,
      asidebar3: true,
    },
  })

  $effect(() => {
    if (typeof index !== 'number') return
    Object.assign(current, views[index])
  })

  function add() {
    views.push(structuredClone($state.snapshot(current)))
    index = views.length - 1
    console.log('add', index)
  }

  function deleteIndex(index: number) {
    views.splice(index, 1)
  }

  function setIndex(newIndex: number) {
    startViewTransition(async () => {
      index = newIndex
      $page.url.searchParams.set('index', index.toString())
      await goto(`?${$page.url.searchParams.toString()}`, { replaceState: true })
    })
  }
</script>

{#if current.values.asidebar}
  <AppShellSection name="aside">
    <AppShellHeader
      name="aside"
      direction="column"
      class="border-r color-neutral-darkest surface"
      z={2}>
      {#snippet start()}
        <button
          class={clsx(
            'rounded-card border-4 border-primary bg-primary/25',
            current.values.asidebar1 ? 'size-10' : 'h-20 w-40',
          )}
          onclick={() => (current.values.asidebar1 = !current.values.asidebar1)}>
        </button>
        <div class="typescale-title">Title</div>
      {/snippet}
      {#snippet end()}
        <button
          class={clsx(
            'rounded-card border-4 border-secondary bg-secondary/25',
            current.values.asidebar2 ? 'size-10' : 'h-20 w-40',
          )}
          onclick={() => (current.values.asidebar2 = !current.values.asidebar2)}>
        </button>
        <button
          class="size-10 rounded-full border-4 border-secondary bg-secondary/25"
          type="button"
          onclick={() => (current.values.asidebar3 = !current.values.asidebar3)}></button>
      {/snippet}
      {#snippet aside()}
        {#if current.values.asidebar3}
          <div class="m-2 min-w-10 flex-1 rounded-card border-4 border-accent bg-accent/25"></div>
        {/if}
      {/snippet}
    </AppShellHeader>
  </AppShellSection>
{/if}

{#if current.values.topbar}
  <AppShellSection name="header">
    <AppShellHeader class="color-neutral-darkest surface" name="header" z={1}>
      {#snippet start()}
        <button
          class={clsx(
            'rounded-card border-4 border-primary bg-primary/25',
            current.values.topbar1 ? 'size-10' : 'h-20 w-40',
          )}
          onclick={() => (current.values.topbar1 = !current.values.topbar1)}>
        </button>
        <div class="typescale-title">Title</div>
      {/snippet}
      {#snippet end()}
        <button
          class={clsx(
            'rounded-card border-4 border-secondary bg-secondary/25',
            current.values.topbar2 ? 'size-10' : 'h-20 w-40',
          )}
          onclick={() => (current.values.topbar2 = !current.values.topbar2)}>
        </button>
        <button
          class="size-10 rounded-full border-4 border-secondary bg-secondary/25"
          type="button"
          onclick={() => (current.values.topbar3 = !current.values.topbar3)}></button>
      {/snippet}
      {#snippet aside()}
        {#if current.values.topbar3}
          <div class="m-2 flex-1 rounded-card border-4 border-accent bg-accent/25 p-2">Texto</div>
        {/if}
      {/snippet}
    </AppShellHeader>
  </AppShellSection>
{/if}

{#if current.values.bottombar}
  <AppShellSection name="footer">
    <AppShellHeader class="color-neutral-darkest surface" align="end" name="footer" z={1}>
      {#snippet start()}
        <button
          class={clsx(
            'rounded-card border-4 border-primary bg-primary/25',
            current.values.bottombar1 ? 'size-10' : 'h-20 w-40',
          )}
          onclick={() => (current.values.bottombar1 = !current.values.bottombar1)}>
        </button>
        <div class="typescale-title">Title</div>
      {/snippet}
      {#snippet end()}
        <button
          class={clsx(
            'rounded-card border-4 border-secondary bg-secondary/25',
            current.values.bottombar2 ? 'size-10' : 'h-20 w-40',
          )}
          onclick={() => (current.values.bottombar2 = !current.values.bottombar2)}>
        </button>
        <button
          class="size-10 rounded-full border-4 border-secondary bg-secondary/25"
          type="button"
          onclick={() => (current.values.bottombar3 = !current.values.bottombar3)}></button>
      {/snippet}
      {#snippet aside()}
        {#if current.values.bottombar3}
          <div class="m-2 flex-1 rounded-card border-4 border-accent bg-accent/25 p-2">Texto</div>
        {/if}
      {/snippet}
    </AppShellHeader>
  </AppShellSection>
{/if}

<div
  class="fixed inset-0 flex size-full flex-col place-content-center items-center gap-4"
  use:viewTransitionName={'test'}>
  <div class="grid grid-cols-2 gap-2 *:rounded-button *:p-2 *:shadow *:surface *:surface-outlined">
    <button
      class={clsx(
        'row-span-2 size-full surface',
        current.values.asidebar ? 'color-primary' : 'color-neutral',
      )}
      type="button"
      onclick={() => (current.values.asidebar = !current.values.asidebar)}>Aside</button>
    <button
      class={clsx(current.values.topbar ? 'color-primary' : 'color-neutral')}
      type="button"
      onclick={() => (current.values.topbar = !current.values.topbar)}>Header</button>
    <button
      class={clsx(current.values.bottombar ? 'color-primary' : 'color-neutral')}
      type="button"
      onclick={() => (current.values.bottombar = !current.values.bottombar)}>Footer</button>
  </div>
  <div class="flex w-full max-w-screen-sm items-center gap-4">
    <UiButton onclick={add}>Add</UiButton>
    <div class="flex flex-1 flex-col gap-1">
      {#each Array.from({ length: views.length }, (_, i) => i) as i}
        <div class="flex items-center gap-2">
          <button
            class="flex-1 rounded-button px-4 py-2 text-left surface surface-hoverable"
            class:color-primary={index === i}
            type="button"
            onclick={() => setIndex(i)}>
            {i}
          </button>
          <UiIconbutton class="flex-none" label="Eliminar" onclick={() => deleteIndex(i)}>
            <Fa icon={faTrash}></Fa>
          </UiIconbutton>
        </div>
      {/each}
    </div>
  </div>
</div>
