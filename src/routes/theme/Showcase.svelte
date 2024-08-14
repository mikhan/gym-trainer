<script lang="ts">
  import clsx from 'clsx'

  type Props = {
    color: { name: string; shades: string[] }
    shade: string
    showFocusAndSelection: boolean
  }

  const { showFocusAndSelection }: Props = $props()
</script>

<div
  class="grid cursor-default divide-y divide-surface-line rounded-card bg-surface text-surface-fg shadow">
  <div class="space-y-2 p-4">
    <p>
      <b>The quick brown fox</b> jumps over the
      <span class={clsx(showFocusAndSelection && 'bg-selection text-selection-fg')}>lazy dog</span>.
    </p>
    <p>
      <small><b>Sphinx of black</b> quartz, judge my vow</small>
    </p>
  </div>
  <div class="flex gap-2 p-2">
    <button
      class="focusable grow rounded-button border border-surface-line p-2 transition-colors hover:bg-surface-hover active:bg-surface-active"
      type="button">Button</button>
    <button
      class="focusable grow rounded-button border border-surface-line bg-surface-hover p-2"
      type="button">Button</button>
    <button
      class={clsx(
        'focusable grow rounded-button border border-surface-line bg-surface-active p-2',
        showFocusAndSelection && 'outline outline-2 -outline-offset-2 outline-ring',
      )}
      type="button">Button</button>
  </div>
</div>
