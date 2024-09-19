<script lang="ts">
  import { faTrash } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'
  import UiIconbutton from '$lib/components/ui/UiIconbutton.svelte'

  type Props = {
    content?: string
  }

  let {
    content = `Eu consectetur officia labore aliqua id nisi fugiat dolore ipsum et sit est. Reprehenderit elit ad fugiat velit ipsum. Laborum pariatur ullamco non fugiat Lorem elit adipisicing duis cupidatat eiusmod commodo proident incididunt mollit. Id cillum ullamco aliqua nisi eiusmod laboris`,
  }: Props = $props()
</script>

<section class="rounded-card shadow contain-paint color-neutral surface">
  <div class="flex items-start p-4">
    <div class="typescale-title flex-1">Notas</div>
    <UiIconbutton class="flex-none" label="Borrar nota" size="sm">
      <Fa icon={faTrash}></Fa>
    </UiIconbutton>
  </div>

  <textarea
    class="block w-full resize-none rounded-b-card border-t p-4 surface surface-editable focusable-ring [field-sizing:content]"
    bind:value={content}
    spellcheck="false"
    placeholder="Agregar una nota"></textarea>
</section>
