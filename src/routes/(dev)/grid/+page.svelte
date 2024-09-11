<script lang="ts">
  const width: number[] = $state([])
  const height: number[] = $state([])
  let length = $state(6)
  let flowColumn = $state(true)
</script>

<!-- <div class="flex h-layout-viewport-height flex-col"> -->
<div class="grid-cols-f flex h-layout-viewport-height flex-col gap-8 border p-8 contain-strict">
  <p class="border">
    Non velit eu reprehenderit eu. Ipsum consequat cupidatat nulla dolore cillum do cupidatat magna
    nostrud pariatur tempor Lorem et minim. Qui sit irure cupidatat non minim fugiat do nulla
    laboris voluptate nostrud.
  </p>
  <div class="flex gap-2 border">
    <input class="w-[4ch]" type="number" bind:value={length} />
    <label>
      <input type="checkbox" bind:checked={flowColumn} />
      Column
    </label>
  </div>
  <section class="border-2 border-[green]" style:--flow={flowColumn ? 'column' : 'row'}>
    <ul class="h-full border-2 border-[red]">
      {#each Array.from({ length }, (_, i) => i + 1) as item, index}
        <li
          class="relative p-2 outline outline-1"
          bind:clientWidth={width[index]}
          bind:clientHeight={height[index]}>
          <div>{item}</div>
          <div class="rounded-button border px-4 text-center text-xs">
            {width[index]}x{height[index]}
          </div>
        </li>
      {/each}
    </ul>
  </section>
</div>

<!-- </div> -->

<style lang="postcss">
  section {
    flex: 1 0 max-content;
    display: flex;
    overflow: auto;
    contain: strict;
  }

  ul {
    flex: 1 0 auto;
    height: 100%;
    display: grid;

    /* grid-template-columns: repeat(auto-fill, minmax(min(120px, 100%), 1fr));
    grid-auto-flow: row;
    grid-auto-rows: auto; */

    width: max-content;
    grid-template-rows: repeat(auto-fill, minmax(min(80px, 100%), 1fr));
    grid-auto-flow: column;
    grid-auto-columns: max-content;

    /* grid-template-columns: repeat(auto-fill, minmax(min(16rem, 100%), 1fr)); */
    /* grid-auto-rows: auto; */
    /* grid-auto-columns: auto; */
    /* align-content: end; */
    /* justify-content: start; */
    gap: 1rem;
    /* width: min-content; */
  }

  li {
    /* min-width: 128px; */
  }
</style>
