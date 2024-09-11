<script lang="ts">
  import { viewTransitionName } from '$lib/actions/transition.action'
</script>

<div class="grid size-full">
  <p class="p-8">
    Nostrud voluptate laborum eu tempor. Culpa laborum cillum sunt amet. Pariatur quis aute pariatur
    eiusmod elit ut deserunt veniam dolor ut aliqua non proident. Laborum in id velit ex. Eiusmod
    exercitation aute et ipsum quis excepteur reprehenderit ipsum.
  </p>
  <div
    class="m-16 ml-auto box-content flex size-40 translate-x-8 flex-col gap-4 rounded-card border border-default-line p-8 shadow-over color-secondary surface"
    use:viewTransitionName={'card'}>
    <div class="typescale-title">Página B</div>
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
