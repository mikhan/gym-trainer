<script lang="ts">
  import { faChevronRight, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
  import type { ComponentProps } from 'svelte'
  import { goto } from '$app/navigation'
  import MessageActions from './MessageActions.svelte'
  import MessageBox from './MessageBox.svelte'
  import MessagesContainer from './MessagesContainer.svelte'
  import { TrainerContext } from './trainer/TrainerContext.svelte'
  import welcomeAfternoon from './welcome-afternoon.jpeg'
  import welcomeEvening from './welcome-evening.jpeg'
  import welcomeMorning from './welcome-morning.jpeg'
  import welcomeRunning from './welcome-running.jpeg'

  type Salute = 'morning' | 'afternoon' | 'evening'
  type Action = { name: string; title: string; icon?: IconDefinition }
  type EntryMessage = { type: 'message'; props: ComponentProps<MessageBox> }
  type EntryActions = { type: 'actions'; props: ComponentProps<MessageActions> }
  type Entry = EntryMessage | EntryActions
  type Chat = { entries: Entry[]; background: string }

  const trainerContext = TrainerContext.getContext()
  const salute = getSalute()
  const chat = getChat()

  function getChat(): Chat {
    const salute = getSalute()
    const images = {
      morning: welcomeMorning,
      afternoon: welcomeAfternoon,
      evening: welcomeEvening,
      running: welcomeRunning,
    }

    return {
      entries: getEntries(),
      background: trainerContext.state.status === 'running' ? images.running : images[salute],
    }
  }

  function getEntries(): Entry[] {
    const messages = getMessages()
    const actions = getActions()
    return [
      ...messages.map(
        (message) => ({ type: 'message', props: { direction: 'in', message } }) as const,
      ),
      { type: 'actions', props: { direction: 'out', actions, onclick: actionClick } },
    ]
  }

  function getActions(): Action[] {
    switch (trainerContext.state.status) {
      case 'running':
        return [
          {
            name: 'start-training',
            title: 'Continuar entrenando',
            icon: faChevronRight,
          },
        ]
      case 'completed':
        return [{ name: 'start-training', title: 'Iniciar entrenamiento', icon: faChevronRight }]
      case 'unset':
        return [
          { name: 'start-training', title: 'Seleccionar entrenamiento', icon: faChevronRight },
        ]
    }
  }

  function getMessages(): string[] {
    const salutes: Record<Salute, string> = {
      morning: 'Buenos días',
      afternoon: 'Buenas tardes',
      evening: 'Buenas noches',
    }

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

  function getSalute(): Salute {
    const hours = new Date().getHours()
    return hours >= 18 || hours < 7 ? 'evening' : hours > 12 ? 'afternoon' : 'morning'
  }

  function actionClick(action: string) {
    if (action === 'start-training') {
      switch (trainerContext.state.status) {
        case 'running':
          return goto('/trainer')
        case 'completed':
          return goto(`/trainings/${trainerContext.state.training.id}`)
        case 'unset':
          return goto('/trainings')
      }
    }
  }
</script>

<div style:--background-image={`url('${chat.background}')`}>
  <MessagesContainer class="p-6 md:py-8 h-full">
    {#each chat.entries as entry}
      {#if entry.type === 'message'}
        <MessageBox {...entry.props}></MessageBox>
      {:else if entry.type === 'actions'}
        <MessageActions {...entry.props}></MessageActions>
      {/if}
    {/each}
  </MessagesContainer>
</div>

<style lang="postcss">
  div {
    background-size: cover;
    background-position: top;
    background-image: linear-gradient(
        to top,
        theme('colors.default.DEFAULT'),
        theme('spacing.48'),
        theme('colors.default.DEFAULT/25%') theme('spacing.80')
      ),
      var(--background-image);
  }
</style>
