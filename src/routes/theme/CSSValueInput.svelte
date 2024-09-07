<script lang="ts">
  import type { Action } from 'svelte/action'
  import { parse, type UnitLengthToken, type VarToken } from './css-parser'

  type Props = {
    name?: string
    value?: string
    id: string
    onchange?: (value: string) => void
  }

  let { name, value = $bindable(), id, onchange }: Props = $props()

  let tokens = $derived(parse(value))
  let backgroundColor = $derived(getColor())

  function getColor() {
    if (!value) return
    if (/oklch/.test(value)) return value
    return `oklch(100% 1 ${value})`
  }

  function update() {
    if (!onchange) return
    const newValue = tokens.map((token) => token.toString()).join('')
    value = newValue
    onchange(newValue)
  }

  function makeEditable(element: HTMLElement) {
    element.contentEditable = 'plaintext-only'

    element.addEventListener('blur', () => (element.contentEditable = 'false'), { once: true })
  }

  const unitLengthControl: Action<HTMLElement, UnitLengthToken> = (
    element,
    token: UnitLengthToken,
  ) => {
    element.addEventListener('click', onClick)
    element.addEventListener('mousedown', onMousedown)
    element.setAttribute('tabindex', '-1')

    return {
      update(newToken) {
        token = newToken
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
        element.style.setProperty('user-select', 'none')
        let y = event.movementY * -1
        if (event.ctrlKey) y = y / 10
        if (event.altKey) y = y / 100

        token.value = parseFloat((token.value + y).toFixed(3))
        if (token.min !== undefined) token.value = Math.max(token.min, token.value)
        if (token.max !== undefined) token.value = Math.min(token.max, token.value)
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

  const varControl: Action<HTMLElement, VarToken> = (element, token: VarToken) => {
    function onclick(event: MouseEvent) {
      event.preventDefault()
      document.getElementById(`css-input${token.value}`)?.scrollIntoView({ behavior: 'smooth' })
    }

    element.setAttribute('tabindex', '-1')
    element.addEventListener('click', onclick)

    return {
      destroy() {
        element.removeEventListener('click', onclick)
      },
    }
  }

  let focused = $state(false)
</script>

<div class="wrapper">
  <div class="color-sample" style:background-color={backgroundColor}></div>
  <label class="value" class:focused>
    <input
      class="value-input"
      {id}
      {name}
      bind:value
      oninput={(e) => onchange?.(e.currentTarget.value)}
      onfocus={(e) => {
        e.currentTarget.select()
        focused = true
      }}
      onblur={() => (focused = false)} />
    <div class="value-tokens">
      {#each tokens as token}
        {#if token.type === 'unit-length'}
          <button type="button" class="unit-length-control" use:unitLengthControl={token}>
            {token.toString()}
          </button>
        {:else if token.type === 'var'}
          <button type="button" class="var-control" use:varControl={token}
            >{token.toString()}</button>
        {:else}
          <span class="text-control">{token.toString()}</span>
        {/if}
      {/each}
    </div>
  </label>
</div>

<style lang="postcss">
  .wrapper {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    font-family: monospace;
    font-size: 12px;
    line-height: 1rem;
  }

  .color-sample {
    width: 1em;
    height: 1em;
    /* border-radius: 2px; */
    border: 1px solid rgb(255 255 255 / 50%);
    /* border: 1px solid rgb(0 0 0 / 50%); */
  }

  .value {
    position: relative;

    &.focused > .value-tokens {
      opacity: 0;
      pointer-events: none;
    }

    &:not(.focused) > .value-input {
      opacity: 0;
    }
  }

  .value-input {
    field-sizing: content;
    background: none;
    &:focus {
      outline: 1px solid gray;
      outline-offset: 1px;
    }
  }

  .value-tokens {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    white-space: pre;
  }

  .unit-length-control {
    cursor: ns-resize;
    padding-inline: 2px;
    margin-inline: -2px;
    border-radius: 2px;
    color: hsl(70, 60%, 75%);

    &:focus {
      color: black;
      background-color: hsl(70, 60%, 75%);
    }
  }

  .var-control {
    cursor: pointer;
    color: hsl(200, 80%, 60%);
    font-weight: bold;

    &:hover {
      text-decoration-line: underline;
    }
  }

  .text-control {
    pointer-events: none;
  }
</style>
