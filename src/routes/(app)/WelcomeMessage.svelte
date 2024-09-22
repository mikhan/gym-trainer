<script lang="ts">
  import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'
  import UiButton from '$lib/components/ui/UiButton.svelte'
  import { TrainerContext } from './trainer/TrainerContext.svelte'

  type Salute = 'morning' | 'afternoon' | 'evening'
  type Action = { label: string; href: string }

  const trainerContext = TrainerContext.getContext()
  const salutes: Record<Salute, string> = {
    morning: 'Buenos días',
    afternoon: 'Buenas tardes',
    evening: 'Buenas noches',
  }

  const salute = getSalute()
  const messages = getMessages()
  const action = getAction()

  function getAction(): Action {
    const state = trainerContext.state
    switch (state.status) {
      case 'running':
        return { label: 'Continuar entrenamiento', href: '/trainer' }
      case 'completed':
        return { label: 'Iniciar entrenamiento', href: `/trainings/${state.training.id}` }
      case 'unset':
        return { label: 'Seleccionar entrenamiento', href: `/trainings` }
    }
  }

  function getSalute(): Salute {
    const hours = new Date().getHours()
    return hours >= 18 || hours < 7 ? 'evening' : hours > 12 ? 'afternoon' : 'morning'
  }

  function getMessages(): string[] {
    switch (trainerContext.state.status) {
      case 'running':
        return ['Vas muy bien con tu entrenamiento', '¡Sigue así!']
      case 'completed':
        return [salutes[salute], '¡Es hora de entrenar! 💪']
      // return ['Terminaste tu entrenamiento', '¡Genial!']
      case 'unset':
        return []
    }
  }
</script>

{#snippet messageBox({ text, showArrow = false }: { text: string; showArrow?: boolean })}
  <div
    class="relative rounded-[8px] px-2 py-1 text-right font-bold color-accent surface [filter:drop-shadow(2px_2px_2px_#0009)]"
    class:rounded-tr-none={showArrow}>
    {#if showArrow}
      <span
        class="absolute left-full top-0 hidden h-full w-2 bg-inherit [clip-path:path('M0,12C8,0,8,0,0,0z')] first:block">
      </span>
    {/if}
    {text}
  </div>
{/snippet}

<div
  class="__container flex size-full flex-col items-center justify-end p-6 md:py-8"
  data-salute={salute}
  data-running={trainerContext.state.status === 'running'}>
  <div class="z-1 flex flex-col items-end gap-1 self-end">
    {#each messages as text, index}
      {@render messageBox({ text, showArrow: index === 0 })}
    {/each}
  </div>
  <UiButton
    class="mt-4 flex items-center gap-2 max-md:mt-4"
    filled
    outlined
    size="lg"
    is="a"
    href={action.href}>
    {action.label}
    <Fa icon={faChevronRight}></Fa>
  </UiButton>
</div>

<style lang="postcss">
  .__container {
    background-size: cover;
    background-position: top;

    background-image: linear-gradient(to top, var(--color-default), 12rem, #0004 20rem),
      var(--background-image);

    &[data-salute='morning'] {
      --background-image: url('./welcome-morning.jpeg');
    }

    &[data-salute='afternoon'] {
      --background-image: url('./welcome-afternoon.jpeg');
    }

    &[data-salute='evening'] {
      --background-image: url('./welcome-evening.jpeg');
    }

    &[data-running='true'] {
      --background-image: url('./welcome-running.jpeg');
    }
  }
</style>
