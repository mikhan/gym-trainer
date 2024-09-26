<script lang="ts">
  import { type IconDefinition } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'
  import Fa from 'svelte-fa'
  import UiButton from '$lib/components/ui/UiButton.svelte'

  type Action = { name: string; title: string; icon?: IconDefinition }
  type Props = {
    direction: 'in' | 'out'
    actions: Action[]
    onclick?: (action: string) => void
  }

  const { direction, actions, onclick = () => {} }: Props = $props()
</script>

<div
  class={clsx(
    'chat-entry flex flex-wrap gap-2',
    direction === 'in' ? 'chat-entry-in' : 'chat-entry-out flex-row-reverse',
  )}>
  {#each actions as action}
    <UiButton
      class={`flex items-center gap-2`}
      filled
      outlined
      onclick={() => onclick(action.name)}>
      {action.title}
      {#if action.icon}
        <Fa icon={action.icon}></Fa>
      {/if}
    </UiButton>
  {/each}
</div>
