<script lang="ts">
  import { faClock } from '@fortawesome/free-regular-svg-icons'
  import { faDumbbell, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'
  import Fa from 'svelte-fa'

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
  class="xl:zoom-lg flex flex-auto items-center justify-around rounded-card p-4 shadow color-neutral-darkest surface
  md:max-w-screen-sm md:flex-auto md:flex-col md:items-start">
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
