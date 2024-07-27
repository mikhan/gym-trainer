<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { onMount, type Snippet } from 'svelte'
  import { clsx } from 'clsx'

  type Props = {
    children: Snippet
    direction?: 'horizontal' | 'vertical'
    snap?: 'start' | 'end' | 'center'
    onchange?: (current: HTMLLIElement | null) => void
  } & Omit<HTMLAttributes<HTMLOListElement>, 'onchange'>

  let {
    children,
    direction = 'horizontal',
    snap = 'center',
    onchange,
    class: className,
    ...props
  }: Props = $props()
  let element: HTMLOListElement

  const isLIElement = (node: Node): node is HTMLLIElement => node.nodeName === 'LI'

  export function previous() {
    const children = getChildren()
    const current = getCurrent(children)
    if (current) goto(children, children.indexOf(current) - 1)
  }

  export function next() {
    const children = getChildren()
    const current = getCurrent(children)
    if (current) goto(children, children.indexOf(current) + 1)
  }

  function goto(children: HTMLLIElement[], index: number) {
    if (index < 0 || index >= children.length) return
    const target = children.at(index)
    target?.scrollIntoView({ behavior: 'smooth' })
  }

  function getChildren() {
    return Array.from(element.children).filter(isLIElement)
  }

  function getCurrent(children: HTMLLIElement[]) {
    for (const child of children) {
      const rect = child.getBoundingClientRect()
      if (rect.x >= 0 && rect.y >= 0) return child
    }

    return null
  }

  onMount(() => {
    if (!onchange) return

    let current: HTMLLIElement | null = null
    const intersectionObserver = new IntersectionObserver(onIntersection, { threshold: [0, 1] })

    for (const child of element.children) {
      if (isLIElement(child)) intersectionObserver.observe(child)
    }

    const mutationObserver = new MutationObserver(onMutation)
    mutationObserver.observe(element, { childList: true })

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
        current = entry.target as HTMLLIElement
        onchange?.(current)
        break
      }
    }

    return () => {
      intersectionObserver.disconnect()
      mutationObserver.disconnect()
    }
  })
</script>

<ol
  class={clsx('ui-carousel', className)}
  data-direction={direction}
  data-snap={snap}
  {...props}
  bind:this={element}>
  {@render children()}
</ol>

<style lang="postcss">
  :global {
    .ui-carousel {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: 100%;
      grid-auto-columns: 100%;
      grid-auto-rows: 100%;
      overflow: auto;
      scroll-snap-type: both mandatory;
      scroll-behavior: smooth;
      container: carousel / size;
      --scrollbar-size: 0px;

      &[data-direction='horizontal'] {
        grid-auto-flow: column;
      }

      &[data-direction='vertical'] {
        grid-auto-flow: row;
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
    }
  }
</style>
