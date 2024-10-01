<script lang="ts">
  import { clsx } from 'clsx'
  import { onMount, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type ScrollSnapEvent = CustomEvent<{
    snapTargetBlock: HTMLElement | null
    snapTargetInline: HTMLElement | null
  }>

  type Props = {
    children: Snippet
    label?: string
    direction?: 'horizontal' | 'vertical'
    onscrollsnapchange?: (event: ScrollSnapEvent) => void
  } & HTMLAttributes<HTMLElement>

  let {
    children,
    label,
    direction = 'horizontal',
    onscrollsnapchange,
    class: className,
    ...props
  }: Props = $props()
  let root: HTMLElement
  let current: HTMLElement | null = null

  export function previous() {
    const children = getChildren()
    const current = getCurrent(children)
    if (current) scrollToChild(children, children.indexOf(current) - 1)
  }

  export function next() {
    const children = getChildren()
    const current = getCurrent(children)
    if (current) scrollToChild(children, children.indexOf(current) + 1)
  }

  export function goto(index: number) {
    const children = getChildren()
    scrollToChild(children, index)
  }

  function scrollToChild(children: HTMLElement[], childIndex: number) {
    if (childIndex < 0 || childIndex >= children.length) return
    const child = children.at(childIndex)
    if (child) scrollTo(child)
  }

  function scrollTo(element: HTMLElement) {
    if (direction === 'horizontal') root.scrollLeft = element.offsetLeft
    if (direction === 'vertical') root.scrollTop = element.offsetTop
  }

  function getChildren() {
    return Array.from(root.children) as HTMLElement[]
  }

  function getCurrent(children: HTMLElement[]) {
    const measure = direction === 'horizontal' ? 'x' : 'y'
    const offset = root.getBoundingClientRect()[measure]
    for (const child of children) {
      const rect = child.getBoundingClientRect()
      if (rect[measure] - offset === 0) return child
    }

    return null
  }

  let scrollTimeout: number

  function scrollHandler() {
    const atSnappingPoint = root.scrollLeft % root.offsetWidth === 0
    const timeOut = atSnappingPoint ? 0 : 150

    clearTimeout(scrollTimeout)

    scrollTimeout = setTimeout(() => {
      if (timeOut) return
      const newCurrent = getCurrent(getChildren())
      if (newCurrent) setCurrent(newCurrent)
    }, timeOut) as unknown as number
  }

  function setCurrent(element: HTMLElement) {
    if (current === element) return
    const previous = current
    current = element

    previous?.removeAttribute('aria-current')
    current.setAttribute('aria-current', 'true')

    if (onscrollsnapchange) {
      const detail = { snapTargetBlock: current, snapTargetInline: current }
      onscrollsnapchange(new CustomEvent('change', { detail }))
    }
  }

  onMount(() => {
    if (!onscrollsnapchange) return

    current = root.querySelector<HTMLElement>(':scope > li[aria-current="true"]')
    if (current) scrollTo(current)

    root.addEventListener('scroll', scrollHandler)
  })
</script>

<ui-carousel
  class={clsx('ui-carousel', className)}
  role="region"
  aria-roledescription="carousel"
  aria-label={label}
  data-direction={direction}
  {...props}
  bind:this={root}>
  {@render children()}
</ui-carousel>

<style lang="postcss">
  :global {
    :where(ui-carousel) {
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: 100%;
      grid-auto-columns: 100%;
      grid-auto-rows: 100%;
      scroll-snap-type: both mandatory;
      scroll-behavior: auto;
      position: relative;

      &[data-direction='horizontal'] {
        grid-auto-flow: column;
        overflow-x: scroll;
      }

      &[data-direction='vertical'] {
        grid-auto-flow: row;
        overflow-y: scroll;
      }

      & > * {
        scroll-snap-align: end;
        scroll-snap-stop: always;
      }
    }
  }
</style>
