type ElementSelectorState = {
  isSelecting: boolean
  highlightedElement: Element | null
}

export class ElementSelectorStore {
  private static instance: ElementSelectorStore
  private state: ElementSelectorState = {
    isSelecting: false,
    highlightedElement: null,
  }
  private listeners: Set<(state: ElementSelectorState) => void> = new Set()

  private constructor() {}

  static getInstance(): ElementSelectorStore {
    if (!ElementSelectorStore.instance) {
      ElementSelectorStore.instance = new ElementSelectorStore()
    }
    return ElementSelectorStore.instance
  }

  getState(): ElementSelectorState {
    return { ...this.state }
  }

  setState(newState: Partial<ElementSelectorState>): void {
    this.state = {
      ...this.state,
      ...newState,
    }
    this.notifyListeners()
  }

  subscribe(listener: (state: ElementSelectorState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getState()))
  }
}
