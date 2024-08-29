import { type Snippet, getContext, setContext } from 'svelte'

export class AppShellContext {
  static create() {
    return setContext(AppShellContext, new AppShellContext())
  }

  static get(): AppShellContext {
    return getContext<AppShellContext>(AppShellContext)
  }

  #headers = $state.raw<Snippet[]>([])
  #footers = $state.raw<Snippet[]>([])

  public header: Snippet | undefined = $derived(this.#headers.at(-1))
  public footer: Snippet | undefined = $derived(this.#footers.at(-1))

  public headerLevel: number = $derived(this.#headers.length)
  public footerLevel: number = $derived(this.#footers.length)

  private constructor() {}

  addHeader(snippet: Snippet) {
    this.#headers = [...this.#headers, snippet]
  }

  removeHeader(snippet: Snippet) {
    this.#headers = this.#headers.filter((e) => e !== snippet)
  }

  addFooter(snippet: Snippet) {
    this.#footers = [...this.#footers, snippet]
  }

  removeFooter(snippet: Snippet) {
    this.#footers = this.#footers.filter((e) => e !== snippet)
  }
}
