<script lang="ts">
  import { onNavigate } from '$app/navigation'

  onNavigate((navigation) => {
    if (!document.startViewTransition) return

    document.documentElement.classList.add('navigating')

    return new Promise((resolve) => {
      const transition = document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })

      transition.finished.then(() => {
        document.documentElement.classList.remove('navigating')
      })
    })
  })
</script>

<style lang="postcss">
  :global {
    @view-transition {
      navigation: auto;
    }

    .navigating::view-transition-old(root) {
      animation:
        90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
        300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
    }

    .navigating::view-transition-new(root) {
      animation:
        210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
        300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
    }

    @keyframes fade-out {
      to {
        opacity: 0;
      }
    }

    @keyframes slide-from-right {
      from {
        transform: translateX(30px);
      }
    }

    @keyframes slide-to-left {
      to {
        transform: translateX(-30px);
      }
    }
  }
</style>
