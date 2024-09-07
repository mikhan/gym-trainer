<script lang="ts" context="module">
  export type ScrollSnapEvent = CustomEvent<{
    snapTargetBlock: HTMLLIElement | null
    snapTargetInline: HTMLLIElement | null
  }>
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { onMount, type Snippet } from 'svelte'
  import { clsx } from 'clsx'

  type Props = {
    children: Snippet
    label?: string
    direction?: 'horizontal' | 'vertical'
    snap?: 'start' | 'end' | 'center'
    onscrollsnapchange?: (event: ScrollSnapEvent) => void
  } & HTMLAttributes<HTMLElement>

  let {
    children,
    label,
    direction = 'horizontal',
    snap = 'center',
    onscrollsnapchange,
    class: className,
    ...props
  }: Props = $props()
  let root: HTMLElement

  const isLIElement = (node: Node): node is HTMLLIElement => node.nodeName === 'LI'

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

  function scrollToChild(children: HTMLLIElement[], childIndex: number) {
    if (childIndex < 0 || childIndex >= children.length) return
    const child = children.at(childIndex)
    if (child) scrollTo(child)
  }

  function scrollTo(element: HTMLElement) {
    if (direction === 'horizontal') root.scrollLeft = element.offsetLeft
    if (direction === 'vertical') root.scrollTop = element.offsetTop
  }

  function getChildren() {
    return Array.from(root.children).filter(isLIElement)
  }

  function getCurrent(children: HTMLLIElement[]) {
    const measure = direction === 'horizontal' ? 'x' : 'y'
    for (const child of children) {
      const rect = child.getBoundingClientRect()
      if (rect[measure] >= 0) return child
    }

    return null
  }

  onMount(() => {
    if (!onscrollsnapchange) return

    let current: HTMLLIElement | null = root.querySelector(':scope > li[aria-current="true"]')
    if (current) scrollTo(current)

    const intersectionObserver = new IntersectionObserver(onIntersection, {
      threshold: [0, 1],
      root,
    })

    for (const child of root.children) {
      if (isLIElement(child)) intersectionObserver.observe(child)
    }

    const mutationObserver = new MutationObserver(onMutation)
    mutationObserver.observe(root, { childList: true })

    function onMutation(entries: MutationRecord[]) {
      for (const entry of entries) {
        for (const node of entry.addedNodes) {
          if (isLIElement(node)) intersectionObserver.observe(node)
        }

        for (const node of entry.removedNodes) {
          if (isLIElement(node)) intersectionObserver.unobserve(node)
        }
      }
    }

    function onIntersection(entries: IntersectionObserverEntry[]) {
      for (const entry of entries) {
        if (entry.intersectionRatio !== 1) continue
        if (current === entry.target) continue
        const previous = current
        current = entry.target as HTMLLIElement

        previous?.removeAttribute('aria-current')
        current.setAttribute('aria-current', 'true')

        if (onscrollsnapchange)
          onscrollsnapchange(
            new CustomEvent('change', {
              detail: { snapTargetBlock: current, snapTargetInline: current },
            }),
          )
        break
      }
    }

    return () => {
      intersectionObserver.disconnect()
      mutationObserver.disconnect()
    }
  })
</script>

<ui-carousel
  class={clsx('ui-carousel', className)}
  role="region"
  aria-roledescription="carousel"
  aria-label={label}
  data-direction={direction}
  data-snap={snap}
  {...props}
  bind:this={root}>
  {@render children()}
</ui-carousel>

<style lang="postcss">
  :global {
    :where(ui-carousel) {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: 100%;
      grid-auto-columns: 100%;
      grid-auto-rows: 100%;
      scroll-snap-type: both mandatory;
      scroll-behavior: auto;
      container: carousel / size;

      &[data-direction='horizontal'] {
        grid-auto-flow: column;
        overflow-x: scroll;
      }

      &[data-direction='vertical'] {
        grid-auto-flow: row;
        overflow-y: scroll;
      }

      &[data-snap='start'] > li {
        scroll-snap-align: start;
      }

      &[data-snap='end'] > li {
        scroll-snap-align: end;
      }

      &[data-snap='center'] > li {
        scroll-snap-align: center;
      }

      & > li {
        scroll-snap-stop: always;
      }

      & > :not(li) {
        display: none;
      }
    }
  }
</style>
