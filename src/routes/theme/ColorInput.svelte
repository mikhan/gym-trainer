<script lang="ts">
  type Props = {
    value: string | undefined
    type: 'hue' | 'lch'
    onchange?: (value: string) => void
  }

  class NumberValue {
    readonly type = 'number'
    value: number
    min: number | undefined
    max: number | undefined
    step: number | undefined
    suffix: string
    constructor(
      public name: string,
      value: string,
      options: { min?: number; max?: number; step?: number; suffix?: string } = {},
    ) {
      this.value = parseFloat(value)
      this.min = options.min
      this.max = options.max
      this.step = options.step
      this.suffix = options.suffix ?? ''
    }
    toString() {
      return this.value + this.suffix
    }
  }

  class TextValue {
    readonly type = 'text'
    constructor(
      public name: string,
      public value: string,
    ) {}
    toString() {
      return this.value
    }
  }

  let { value = $bindable(''), type, onchange }: Props = $props()

  let parts = $derived(getParts(value))
  let backgroundColor = $derived(getColor())

  function getParts(value: string) {
    if (type === 'hue') {
      return [getConfig('h', value)]
    } else if (type === 'lch') {
      const [l, c, h] = value.split(/ +/g)
      if (!l || !c || !h) throw new TypeError('Invalid color')

      return [getConfig('l', l), getConfig('c', c), getConfig('h', h)]
    }

    throw new TypeError('Invalid')
  }

  function getConfig(component: string, value: string) {
    const type = getValueType(value)
    if (type === 'text') return new TextValue(component, value)

    if (component === 'l') {
      return type === 'percentage'
        ? new NumberValue(component, value, { min: 0, max: 100, step: 1, suffix: '%' })
        : new NumberValue(component, value, { min: 0, max: 1, step: 0.01 })
    }

    if (component === 'c') {
      return type === 'percentage'
        ? new NumberValue(component, value, { min: 0, max: 100, step: 1, suffix: '%' })
        : new NumberValue(component, value, { min: 0, max: 0.5, step: 0.01 })
    }

    if (component === 'h') {
      return type === 'degree'
        ? new NumberValue(component, value, { min: 0, max: 360, step: 1, suffix: 'deg' })
        : new NumberValue(component, value, { min: 0, max: 360, step: 1 })
    }

    throw new TypeError('Invalid')
  }

  function getValueType(value: string) {
    if (/^[-0-9.]+%$/.test(value)) return 'percentage'
    if (/^[-0-9.]+deg$/.test(value)) return 'degree'
    if (/^[-0-9.]+$/.test(value)) return 'number'
    else return 'text'
  }

  function getColor() {
    if (type === 'lch') {
      return `oklch(${value})`
    } else {
      return `oklch(50% 0.25 ${value})`
    }
  }

  function update() {
    if (!onchange) return
    const newValue = parts.map((part) => part.toString()).join(' ')
    value = newValue
    onchange(newValue)
  }
</script>

<div class="flex items-center gap-1">
  <div
    class="size-5 flex-none rounded-full border border-black outline outline-1 outline-white/50"
    style:background-color={backgroundColor}>
  </div>
  <div class="text-sm">{type}</div>
  {#each parts as part}
    <!-- <span class="text-xs uppercase">{part.name}</span> -->
    {#if part.type === 'number'}
      <input
        class="input max-w-[8ch] flex-1"
        type="number"
        min={part.min}
        max={part.max}
        step="any"
        bind:value={part.value}
        oninput={update} />
    {:else if part.type === 'text'}
      <input
        class="input flex-1"
        type="text"
        spellcheck="false"
        bind:value={part.value}
        oninput={update} />
    {/if}
  {/each}
</div>

<style lang="postcss">
  .input {
    padding: 0 0 0 4px;
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    border-radius: 4px;
    width: 0px;
  }
</style>
