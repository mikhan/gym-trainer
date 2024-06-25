<script lang="ts">
  import './app.css'
</script>

<slot></slot>

<style lang="postcss">
  :root {
    color-scheme: dark;
    font-family: 'Quicksand Variable', sans-serif;
    background-color: var(--surface-canvas-bg);
    color: var(--surface-canvas-fg);
  }

  :global {
    body {
      margin: 0;
      height: 100dvh;
    }

    button {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
    }

    :where(button, input, .focusable) {
      &:focus-visible {
        outline: 2px solid var(--focus-color);
        outline-offset: -2px;
      }
    }

    .scrollable {
      overflow-y: auto;

      @media (pointer: fine) {
        --scrollbar-size: 16px;
        --scrollbar-track-color: transparent;
        --scrollbar-thumb-color: hsl(0 0% 50%);
        --scrollbar-thumb-size: 4px;

        &:hover {
          --scrollbar-thumb-color: hsl(0 0% 70%);
        }

        &::-webkit-scrollbar {
          width: var(--scrollbar-size);
          height: var(--scrollbar-size);
          background-color: var(--scrollbar-track-color);
        }

        &::-webkit-scrollbar-corner {
          background-color: var(--scrollbar-track-color);
        }

        &::-webkit-scrollbar-thumb {
          border: calc(calc(var(--scrollbar-size) - var(--scrollbar-thumb-size)) / 2) solid
            transparent;
          border-radius: calc(var(--scrollbar-size) / 2);
          background-color: var(--scrollbar-thumb-color);
          background-clip: content-box;
        }
      }
    }
  }
</style>
