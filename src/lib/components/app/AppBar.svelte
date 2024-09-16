<script lang="ts" context="module">
  let globalIndex = 0
</script>

<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { viewTransitionName } from '$lib/actions/transition.action'
  import clsx from 'clsx'
  import type { HTMLAttributes } from 'svelte/elements'
  import styleTemplate from './AppBar/style-template.css?raw'

  type Props = {
    name?: string
    direction?: 'row' | 'column'
    align?: 'start' | 'end'
    start?: Snippet
    end?: Snippet
    aside?: Snippet
    z?: number
  } & HTMLAttributes<HTMLDivElement>

  const animations = {
    row: {
      start: 'top',
      end: 'bottom',
    },
    column: {
      start: 'left',
      end: 'right',
    },
  } as const

  const objectPosition = {
    row: {
      start: {
        first: 'top left',
        last: 'top right',
        aside: 'bottom left',
      },
      end: {
        first: 'bottom left',
        last: 'bottom right',
        aside: 'top left',
      },
    },
    column: {
      start: {
        first: 'top left',
        last: 'bottom left',
        aside: 'top right',
      },
      end: {
        first: 'top right',
        last: 'bottom right',
        aside: 'top left',
      },
    },
  } as const

  let {
    name,
    direction = 'row',
    align = 'start',
    start,
    end,
    aside,
    class: className,
    z,
    ...other
  }: Props = $props()
  const validNameRegexp = /^[a-z0-1-]+$/i
  if (!name || !validNameRegexp.test(name)) name = (++globalIndex).toString()
  const prefix = `app-bar-${name}`
  const styleElementId = `app-bar-${name}-style`
  let root: HTMLElement

  onMount(() => {
    const styleContent = styleTemplate
      .replaceAll('prefix', prefix)
      .replaceAll('--object-position-first', objectPosition[direction][align].first)
      .replaceAll('--object-position-last', objectPosition[direction][align].last)
      .replaceAll('--object-position-aside', objectPosition[direction][align].aside)
      .replaceAll('--slide-animation-old', `--slide-to-${animations[direction][align]}`)
      .replaceAll('--slide-animation-new', `--slide-from-${animations[direction][align]}`)
      .replaceAll('--z-index', typeof z === 'undefined' ? 'auto' : z.toString())

    const previousStyleElement = document.getElementById(styleElementId)
    previousStyleElement?.remove()

    const head = document.head || document.getElementsByTagName('head')[0]
    const styleElement = document.createElement('style')
    styleElement.id = styleElementId
    styleElement.appendChild(document.createTextNode(styleContent))
    head.appendChild(styleElement)
  })
</script>

{#snippet asideContent(content: Snippet)}
  <div class={clsx('container mx-auto flex', direction === 'column' ? 'flex-col' : 'flex-row')}>
    {@render content()}
  </div>
{/snippet}

<div
  class={clsx(
    'app-bar',
    direction === 'row' ? 'w-full flex-col contain-inline-size' : 'h-full flex-row',
    className,
  )}
  {...other}
  use:viewTransitionName={`${prefix}-root`}
  bind:this={root}>
  {#if aside && align === 'end'}
    {@render asideContent(aside)}
  {/if}

  <div
    class={clsx(
      'container mx-auto flex flex-1',
      direction === 'row'
        ? 'flex-row px-layout-gap *:min-h-[--widget-height] *:flex-row *:py-3'
        : 'flex-col py-layout-gap *:min-w-[--widget-height] *:flex-col *:px-3',
      align === 'start' ? 'items-start' : 'items-end',
      '*:box-content *:flex *:items-center *:gap-2',
    )}>
    <div class="flex-1" use:viewTransitionName={`${prefix}-first`}>
      {#if start}
        {@render start()}
      {/if}
    </div>

    <div
      class={clsx(
        'flex-none justify-end',
        direction === 'row' ? 'pl-2 empty:pl-0' : 'pt-2 empty:pt-0',
      )}
      use:viewTransitionName={`${prefix}-last`}>
      {#if end}
        {@render end()}
      {/if}
    </div>
  </div>

  {#if aside && align === 'start'}
    {@render asideContent(aside)}
  {/if}
</div>

<style lang="postcss">
  :global {
    :where(.app-bar) {
      @apply flex overflow-hidden transition;
    }
  }
</style>
