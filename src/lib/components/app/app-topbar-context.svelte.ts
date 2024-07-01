import { getContext, setContext, type Snippet } from 'svelte'

class AppTopbarContext {
  private elements = $state<Snippet[]>([])
  public title: Snippet | undefined = $derived(this.elements[this.elements.length - 1])

  addTitle(snippet: Snippet) {
    this.elements.push(snippet)
  }

  removeTitle(snippet: Snippet) {
    this.elements.slice(this.elements.indexOf(snippet), 1)
  }
}

const contextKey = Symbol('AppTopbarContext')

export function setAppTopbarContext() {
  return setContext(contextKey, new AppTopbarContext())
}

export function getAppTopbarContext(): ReturnType<typeof setAppTopbarContext> {
  return getContext(contextKey)
}
