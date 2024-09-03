<script lang="ts">
  import CSSValueInput from './CSSValueInput.svelte'

  type Props = { name: string; value?: string; onchange?: (value: string) => void }

  let { name, value, onchange = () => {} }: Props = $props()

  const id = $derived(`css-input${name}`)
  const inputId = crypto.randomUUID()
</script>

<div class="flex flex-col items-start gap-1" {id}>
  <label class="font-mono text-xs" for={inputId}>{name}:</label>
  <CSSValueInput id={inputId} {name} bind:value {onchange}></CSSValueInput>
</div>
