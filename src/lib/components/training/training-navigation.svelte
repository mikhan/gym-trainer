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
      class="sticky left-0 top-0 hidden max-h-[100cqb] space-y-4 overflow-y-auto px-layout-gap py-10 scrollbar scrollbar-autohide lg:block">
      <div class="font-bold">Rutinas</div>
      <ul class="">
        {#each training.routines as routine}
          {@const id = `routine-${routine.id}`}
          <li>
            <a
              href={`#${id}`}
              class={clsx(
                '-mx-4 block rounded-s-button border-e-2 px-4 py-3 text-sm transition-colors',
                active?.id === id
                  ? 'border-primary-lighter bg-primary-darker text-primary-darker-fg'
                  : 'border-canvas-line hover:text-primary-lighter',
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
