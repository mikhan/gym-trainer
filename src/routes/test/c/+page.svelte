<script lang="ts">
  import { viewTransitionName } from '$lib/actions/transition.action'
</script>

<div class="grid size-full">
  <p class="p-8">
    Amet deserunt ullamco id est minim. Ut ut ad officia nisi reprehenderit minim sit ut do dolore
    esse commodo duis id. Eu eu anim dolor proident tempor nulla exercitation irure et occaecat
    adipisicing.
  </p>
  <div
    class="m-16 mt-auto box-content flex size-40 flex-col gap-4 rounded-card border border-default-line p-8 shadow-over color-accent surface"
    use:viewTransitionName={'card'}>
    <div class="typescale-title">Página C</div>
    <ul class="list-disc">
      <li class="underline">
        <a href="/test/a">Página A</a>
      </li>
      <li class="underline">
        <a href="/test/b">Página B</a>
      </li>
      <li class="underline">
        <a href="/test/c">Página C</a>
      </li>
    </ul>
  </div>
</div>
