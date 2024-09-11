<script lang="ts">
  import clsx from 'clsx'

  type Props = {
    class?: string
    showFocus: boolean
    showSelection: boolean
  }

  const { class: className, showFocus, showSelection }: Props = $props()
</script>

<div
  class={clsx(
    'grid cursor-default divide-y divide-default-line rounded-card shadow surface',
    className,
  )}>
  <div class="space-y-2 p-4">
    <p>
      <b>The quick brown fox</b> jumps over the
      <span class={clsx(showSelection && 'bg-selection text-selection-fg')}>lazy dog</span>.
    </p>
    <p>
      <small><b>Sphinx of black</b> quartz, judge my vow</small>
    </p>
  </div>
  <div class="flex gap-2 p-2">
    <button
      class="focusable grow rounded-button border border-default-line p-2 transition-colors hover:bg-default-hover active:bg-default-active"
      type="button">Button</button>
    <button
      class="focusable grow rounded-button border border-default-line bg-default-hover p-2"
      type="button">Button</button>
    <button
      class={clsx(
        'focusable grow rounded-button border border-default-line bg-default-active p-2',
        showFocus && 'outline outline-2 -outline-offset-2 outline-ring',
      )}
      type="button">Button</button>
  </div>
</div>
