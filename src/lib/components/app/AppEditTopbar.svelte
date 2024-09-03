<script lang="ts">
  import { type Snippet } from 'svelte'
  import AppShellSection from './AppShellSection.svelte'
  import AppShellHeader from './AppShellHeader.svelte'
  // import UiIconbutton from '../ui/ui-iconbutton.svelte'
  // import Fa from 'svelte-fa'
  // import { faTimes } from '@fortawesome/free-solid-svg-icons'

  type Props = { children: Snippet; title: string; onclose?: () => void }

  let { children, title }: Props = $props()
</script>

<AppShellSection name="header">
  <AppShellHeader class="color-neutral-darkest">
    {#snippet start()}
      <!-- <UiIconbutton onclick={onclose} label="Previous">
          <Fa icon={faTimes}></Fa>
          </UiIconbutton> -->
      <div class="typescale-title truncate">{title}</div>
    {/snippet}
    {#snippet end()}
      {@render children()}
    {/snippet}
  </AppShellHeader>
</AppShellSection>
