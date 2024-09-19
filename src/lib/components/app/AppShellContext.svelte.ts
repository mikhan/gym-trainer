import { getContext, setContext, type Snippet } from 'svelte'
import { getPersistedState } from '$lib/states/persisted-state.svelte'

type AppShellContextState = {
  readonly sidebar: {
    readonly open: boolean
  }
}

export class AppShellContext {
  static create() {
    return setContext(AppShellContext, new AppShellContext())
  }

  static get(): AppShellContext {
    return getContext<AppShellContext>(AppShellContext)
  }

  #headers = $state.raw<Snippet[]>([])
  #asides = $state.raw<Snippet[]>([])
  #footers = $state.raw<Snippet[]>([])

  #state = getPersistedState('session', 'AppShell.state', {
    sidebar: { open: true },
  })

  public header: Snippet | undefined = $derived(this.#headers.at(-1))
  public aside: Snippet | undefined = $derived(this.#asides.at(-1))
  public footer: Snippet | undefined = $derived(this.#footers.at(-1))

  public headerLevel: number = $derived(this.#headers.length)
  public asideLevel: number = $derived(this.#asides.length)
  public footerLevel: number = $derived(this.#footers.length)

  public state: AppShellContextState = this.#state

  private constructor() {}

  addHeader(snippet: Snippet) {
    this.#headers = [...this.#headers, snippet]

    return () => this.removeHeader(snippet)
  }

  removeHeader(snippet: Snippet) {
    this.#headers = this.#headers.filter((e) => e !== snippet)
  }

  addAside(snippet: Snippet) {
    this.#asides = [...this.#asides, snippet]

    return () => this.removeAside(snippet)
  }

  removeAside(snippet: Snippet) {
    this.#asides = this.#asides.filter((e) => e !== snippet)
  }

  addFooter(snippet: Snippet) {
    this.#footers = [...this.#footers, snippet]

    return () => this.removeFooter(snippet)
  }

  removeFooter(snippet: Snippet) {
    this.#footers = this.#footers.filter((e) => e !== snippet)
  }

  toggleSidebar(open = !this.state.sidebar.open) {
    this.#state.sidebar.open = open
  }
}
