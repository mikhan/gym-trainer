<script lang="ts">
  import type { Routine } from '$data/trainer/trainings'

  export let routines: Routine[]
  export let currentRoutineId: string | undefined = undefined
  export let onchange: (data: { id: string }) => void = () => {}
</script>

<form>
  {#each routines as routine}
    <label>
      <input
        type="radio"
        name="routine-id"
        value={routine.id}
        on:change={() => {
          currentRoutineId = routine.id
          onchange({ id: currentRoutineId })
        }}
        checked={currentRoutineId === routine.id}
      />
      <span>{routine.name}</span>
    </label>
  {/each}
</form>

<style lang="postcss">
  form {
    display: flex;
    gap: 1px;

    border-radius: 8px;
    background-color: hsl(0 0% 30%);
    /* border: 1px solid hsl(0 0% 10%); */
    overflow: hidden;
    padding: 4px;
    height: 40px;
    z-index: 2;
    box-shadow:
      0 2px 4px hsl(0 0% 0% / 20%),
      0 4px 8px hsl(0 0% 0% / 20%);
  }

  input {
    position: absolute;
    opacity: 0;
  }

  label {
    display: grid;
    flex: 1 1 auto;
    place-content: center;
    color: hsl(0 0% 80%);
    padding: 0 2px;
    text-transform: uppercase;
    font-weight: bold;
    border-radius: 4px;

    &:has(input:checked) {
      background-color: hsl(0 0% 40%);
      /* background-color: transparent; */
      color: hsl(0 0% 90%);
    }
  }
</style>
