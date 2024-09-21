<script lang="ts">
  import { faClock } from '@fortawesome/free-regular-svg-icons'
  import { faDumbbell, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'
  import Fa from 'svelte-fa'
  import WelcomeMessage from './WelcomeMessage.svelte'

  type Insight = {
    icon: IconDefinition
    label: string
    value: string
  }

  const data: Insight[] = $state([
    { icon: faClock, label: 'Último entrenamiento', value: 'Hace 2 días' },
    { icon: faDumbbell, label: 'Siguiente rutina', value: 'Push' },
    { icon: faDumbbell, label: 'Etiqueta', value: 'Valor' },
    { icon: faDumbbell, label: 'Etiqueta', value: 'Valor' },
  ])
</script>

<div
  class="xl:zoom-lg flex max-w-screen-md flex-auto flex-col rounded-card shadow contain-paint color-neutral-darkest surface
  md:flex-row">
  <WelcomeMessage></WelcomeMessage>
  <div
    class="flex flex-auto items-center justify-around p-6
  md:max-w-screen-sm md:flex-col md:items-start">
    {#each data as insight, index}
      <div class={clsx('flex items-end gap-2', index >= 2 && 'max-md:hidden')}>
        <div class="my-1 grid size-6 place-content-center">
          <Fa class="opacity-75" size="lg" icon={insight.icon}></Fa>
        </div>
        <div>
          <div class="typescale-label opacity-75">{insight.label}</div>
          <div>{insight.value}</div>
        </div>
      </div>
      {#if index + 1 < data.length}
        <div
          class={clsx(
            'bg-default-line max-md:h-4 max-md:w-0.5 md:ml-8 md:h-0.5 md:w-12',
            index >= 1 && 'max-md:hidden',
          )}>
        </div>
      {/if}
    {/each}
  </div>
</div>
