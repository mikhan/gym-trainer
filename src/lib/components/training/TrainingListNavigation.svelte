<script lang="ts">
  import clsx from 'clsx'
  import UiToc from '../ui/ui-toc.svelte'

  type Props = {
    training: Types.Training
  }

  const { training }: Props = $props()
</script>

<UiToc>
  {#snippet children(active)}
    <nav
      class="sticky left-0 top-layout-header-height ms-auto hidden h-layout-viewport-height w-full max-w-80 space-y-4 overflow-y-auto py-layout-gap scrollbar scrollbar-autohide lg:block">
      <div class="px-4 font-bold">Rutinas</div>
      <ul class="">
        {#each training.routines as routine}
          {@const id = `routine-${routine.id}`}
          <li>
            <a
              href={`#${id}`}
              class={clsx(
                'block rounded-button px-4 py-3 text-sm transition-colors focusable-ring',
                active?.id === id ? 'color-primary-darker surface' : 'hover:text-primary-lighter',
              )}
              ondragover={() =>
                document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })}
              onclick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView()
              }}>{routine.name}</a>
          </li>
        {/each}
      </ul>
    </nav>
  {/snippet}
</UiToc>
