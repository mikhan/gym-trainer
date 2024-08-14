<script lang="ts" context="module">
  export type ChangeEvent = CustomEvent<{
    current: HTMLLIElement | null
    previous: HTMLLIElement | null
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
    onchange?: (event: ChangeEvent) => void
  } & Omit<HTMLAttributes<HTMLElement>, 'onchange'>

  let {
    children,
    label,
    direction = 'horizontal',
    snap = 'center',
    onchange,
    class: className,
    ...props
  }: Props = $props()
  let root: HTMLElement

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
    if (target) target.scrollIntoView({ behavior: 'smooth' })
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
    if (!onchange) return

    let current: HTMLLIElement | null = root.querySelector(':scope > li[aria-current="true"]')
    if (current) current.scrollIntoView({ behavior: 'instant' })

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

        if (onchange) onchange(new CustomEvent('change', { detail: { current, previous } }))
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
    ui-carousel {
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

      & > :not(li) {
        display: none;
      }
    }
  }
</style>
