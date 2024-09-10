<script lang="ts">
  import clsx from 'clsx'
  import type { HTMLAttributes } from 'svelte/elements'
  import defaultUserAvatar from './default-user-avatar.jpg'

  type Props = HTMLAttributes<HTMLDivElement>

  let { class: ClassName, ...props }: Props = $props()
</script>

<div class={clsx('ui-avatar rounded-full', ClassName)} {...props}>
  <img class="rounded-full" alt="Imagen de perfil del usuario" src={defaultUserAvatar} />
</div>
