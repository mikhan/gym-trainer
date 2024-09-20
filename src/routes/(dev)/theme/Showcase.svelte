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
    showFocus && 'focused-ring',
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
  <div class="grid grid-cols-3 gap-2 p-2 *:rounded-button *:p-2 *:text-center">
    <div class="bg-default-under">Under</div>
    <div class="bg-default-hover">Hover</div>
    <div class="bg-default-active">Active</div>
  </div>
</div>
