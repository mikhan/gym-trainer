<script lang="ts">
  type Props = {
    training: Types.Training
  }

  let { training }: Props = $props()
</script>

<header>
  <p class="mb-4 text-sm font-semibold leading-6 text-primary">Training</p>
  <h1 class="inline-block text-2xl font-extrabold tracking-tight sm:text-3xl">
    {training.name}
  </h1>
</header>
