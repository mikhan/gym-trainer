<script lang="ts">
  import UiToc from '../ui/ui-toc.svelte'

  type Props = {
    training: Types.Training
  }

  const { training }: Props = $props()
</script>

<UiToc>
  {#snippet children(active)}
    <nav
      class="scrollbar sticky left-0 top-0 hidden max-h-[100cqb] space-y-4 overflow-y-auto px-layout-gap py-10 scrollbar-autohide lg:block">
      <div class="font-bold">Rutinas</div>
      <ul class="space-y-2">
        {#each training.routines as routine}
          {@const id = `routine-${routine.id}`}
          <li>
            <a
              href={`#${id}`}
              class={`-mx-2 block rounded-button border px-2 py-1 text-sm ${active?.id === id ? 'border-primary-border bg-primary text-primary-fg' : 'border-transparent hover:bg-canvas-hover'}`}
              ondragover={() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
              }}
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
