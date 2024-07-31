import { type Snippet, getContext, setContext } from 'svelte'

export class AppShellContext {
  static create() {
    return setContext(AppShellContext, new AppShellContext())
  }

  static get(): AppShellContext {
    return getContext<AppShellContext>(AppShellContext)
  }

  #titles = $state.frozen<Snippet[]>([])
  #footers = $state.frozen<Snippet[]>([])

  public title: Snippet | undefined = $derived(this.#titles.at(-1))
  public footer: Snippet | undefined = $derived(this.#footers.at(-1))
  public actions: ReadonlyArray<Snippet> = $state.frozen([])
  public previous: string | URL | undefined = $state()

  private constructor() {}

  addTitle(snippet: Snippet) {
    this.#titles = [...this.#titles, snippet]
  }

  removeTitle(snippet: Snippet) {
    this.#titles = this.#titles.filter((e) => e !== snippet)
  }

  addActions(snippet: Snippet) {
    this.actions = [...this.actions, snippet]
  }

  removeActions(snippet: Snippet) {
    this.actions = this.actions.filter((e) => e !== snippet)
  }

  addFooter(snippet: Snippet) {
    this.#footers = [...this.#footers, snippet]
  }

  removeFooter(snippet: Snippet) {
    this.#footers = this.#footers.filter((e) => e !== snippet)
  }
}
