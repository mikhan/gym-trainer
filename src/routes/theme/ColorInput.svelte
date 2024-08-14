<script lang="ts">
  import type { Action } from 'svelte/action'

  type Props = {
    value: string | undefined
    type: 'hue' | 'lch'
    onchange?: (value: string) => void
  }

  class NumberValue {
    readonly type = 'number'
    value: number
    readonly min: number | undefined
    readonly max: number | undefined
    constructor(value: string, options: { min?: number; max?: number } = {}) {
      this.value = parseFloat(value)
      this.min = options.min
      this.max = options.max
    }
  }

  class TextValue {
    readonly type = 'text'
    constructor(public readonly value: string) {}
  }

  let { value = $bindable(), type, onchange }: Props = $props()

  let parts = $derived(getParts(value))
  let backgroundColor = $derived(getColor())

  function getParts(value?: string) {
    const parts: (TextValue | NumberValue)[] = []
    if (!value) return parts

    for (const match of value.matchAll(/-?[0-9]+(?:\.[0-9]+)?|\D+/g)) {
      const isNumber = /-?[0-9]+(?:\.[0-9]+)?/.test(match[0])
      parts.push(
        isNumber
          ? new NumberValue(match[0], { min: 0, max: type === 'hue' ? 360 : 100 })
          : new TextValue(match[0]),
      )
    }

    return parts
  }

  function getColor() {
    if (type === 'lch') {
      return value
    } else {
      return `oklch(100% 1 ${value})`
    }
  }

  function update() {
    if (!onchange) return
    const newValue = parts.map((part) => part.value).join('')
    value = newValue
    onchange(newValue)
  }

  function makeEditable(element: HTMLElement) {
    element.contentEditable = 'plaintext-only'

    element.addEventListener('blur', () => (element.contentEditable = 'false'), { once: true })
  }

  const numberControl: Action<HTMLElement, NumberValue | TextValue> = (element, part) => {
    if (part.type === 'text') return

    element.addEventListener('click', onClick)
    element.addEventListener('mousedown', onMousedown)
    element.setAttribute('tabindex', '-1')

    return {
      update(newPart) {
        part = newPart
      },
      destroy() {
        element.removeEventListener('click', onClick)
        element.removeEventListener('mousedown', onMousedown)
      },
    }

    function onClick() {
      makeEditable(element)
    }

    function onMousedown() {
      document.addEventListener('mousemove', onMousemove)
      document.addEventListener('mouseup', onMouseup)

      element.requestPointerLock()

      function onMousemove(event: MouseEvent) {
        if (part.type !== 'number') return
        element.style.setProperty('user-select', 'none')
        let y = event.movementY * -1
        if (event.ctrlKey) y = y / 10
        if (event.altKey) y = y / 100

        part.value = parseFloat((part.value + y).toFixed(3))
        if (part.min !== undefined) part.value = Math.max(part.min, part.value)
        if (part.max !== undefined) part.value = Math.min(part.max, part.value)
        update()
      }

      function onMouseup() {
        document.removeEventListener('mousemove', onMousemove)
        document.removeEventListener('mouseup', onMouseup)
        element.style.removeProperty('user-select')
        document.exitPointerLock()
      }
    }
  }
</script>

<div class="wrapper">
  <div class="color-sample" style:background-color={backgroundColor}></div>
  <div class="color-value">
    {#each parts as part}
      <span class:number-control={part.type === 'number'} use:numberControl={part}>
        {part.value}
      </span>
    {/each}
    <span>;</span>
  </div>
</div>

<style lang="postcss">
  .wrapper {
    display: inline-flex;
    gap: 8px;
    align-items: center;
  }

  .color-sample {
    width: 14px;
    aspect-ratio: 1/1;
    border: 1px solid color-mix(in oklch, currentColor 50%, transparent);
    border-radius: 100%;
  }

  .color-value {
    display: flex;
    align-items: center;
    white-space: pre;
    font-family: monospace;
    font-size: 12px;
    line-height: 1rem;
  }

  .number-control {
    cursor: ns-resize;
    color: rgb(83, 189, 224);
    text-decoration-line: underline;
  }
</style>
