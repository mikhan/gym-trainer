<script lang="ts">
  import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'
  import UiButton from '$lib/components/ui/UiButton.svelte'

  type Salute = 'morning' | 'afternoon' | 'evening'
  type WelcomeImages = Record<Salute, string>

  const welcomeImages = getWelcomeImages()
  const salutes: Record<Salute, string> = {
    morning: 'Buenos días',
    afternoon: 'Buenas tardes',
    evening: 'Buenas noches',
  }

  const salute = getSalute()
  const welcomeImage = welcomeImages[salute]

  function getWelcomeImages(): WelcomeImages {
    const regexp = /(?<=welcome-)[a-z]+/
    const paths = import.meta.glob<string>('./welcome-*.jpeg', { import: 'default', eager: true })
    const entries = Object.entries(paths).map(([name, path]) => [name.match(regexp)![0], path])
    return Object.fromEntries(entries) as WelcomeImages
  }

  function getSalute(): Salute {
    const hours = new Date().getHours()
    return hours >= 18 || hours < 7 ? 'evening' : hours > 12 ? 'afternoon' : 'morning'
  }
</script>

<article class="grid h-80 w-full max-w-screen-sm *:col-start-1 *:row-start-1">
  <img
    src={welcomeImage}
    class="h-full min-h-0 w-full min-w-0 object-cover object-top"
    alt="Una pareja joven emocionada porque es hora de ir al gimnasio" />
  <div
    class="[background-image:linear-gradient(to_top,var(--color-default),60%,transparent_max(15rem,100%))]">
  </div>
  <div class="flex flex-col items-center self-end px-layout-gap py-6 md:py-10">
    <div class="typescale-title">{salutes[salute]}</div>
    <div class="typescale-headline">¡Es hora de entrenar!</div>
    <UiButton
      class="ui-button ui-button-filled ui-button-outlined mt-2 flex items-center gap-2"
      is="a"
      href="/trainings">
      Iniciar entrenamiento
      <Fa icon={faChevronRight}></Fa>
    </UiButton>
  </div>
</article>
