<script lang="ts">
  import { type Snippet } from 'svelte'
  import AppHeader from './AppHeader.svelte'
  // import UiIconbutton from '../ui/ui-iconbutton.svelte'
  // import Fa from 'svelte-fa'
  // import { faTimes } from '@fortawesome/free-solid-svg-icons'

  type Props = { children: Snippet; title: string; onclose?: () => void }

  let { children, title }: Props = $props()
</script>

<AppHeader>
  <div class="flex justify-center border-b shadow color-neutral-darkest surface">
    <div class="container flex h-16 w-full items-center gap-2 px-layout-gap">
      <!-- <UiIconbutton onclick={onclose} label="Previous">
        <Fa icon={faTimes}></Fa>
      </UiIconbutton> -->
      <div class="typescale-title grow truncate">{title}</div>
      <div class="flex items-center gap-2">
        {@render children()}
      </div>
    </div>
  </div>
</AppHeader>
