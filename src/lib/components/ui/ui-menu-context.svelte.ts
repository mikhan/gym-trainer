import { getContext, setContext } from 'svelte'

export class UiMenuContext {
  static create() {
    return setContext(UiMenuContext, new UiMenuContext())
  }

  static get() {
    return getContext<UiMenuContext>(UiMenuContext)
  }

  public readonly id = crypto.randomUUID()

  private constructor() {}
}
