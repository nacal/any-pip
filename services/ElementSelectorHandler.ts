import { ElementSelectorStore } from '../stores/ElementSelectorStore'

export class ElementSelectorHandler {
  private static store = ElementSelectorStore.getInstance()
  private static originalStyles: {
    boxShadow?: string
    position?: string
    zIndex?: string
  } = {}

  static highlight(element: Element): void {
    this.clearCurrentHighlight()
    const htmlElement = element as HTMLElement

    this.originalStyles = {
      boxShadow: htmlElement.style.boxShadow,
      position: htmlElement.style.position,
      zIndex: htmlElement.style.zIndex,
    }

    htmlElement.style.boxShadow = '0 0 0 2px #ff0000'
    htmlElement.style.position = 'relative'
    htmlElement.style.zIndex = '999999'
    this.store.setState({ highlightedElement: element })
  }

  static clearHighlight(): void {
    this.clearCurrentHighlight()
    this.store.setState({ highlightedElement: null })
  }

  private static clearCurrentHighlight(): void {
    const { highlightedElement } = this.store.getState()
    if (highlightedElement) {
      const htmlElement = highlightedElement as HTMLElement

      htmlElement.style.boxShadow = this.originalStyles.boxShadow || ''
      htmlElement.style.position = this.originalStyles.position || ''
      htmlElement.style.zIndex = this.originalStyles.zIndex || ''

      this.originalStyles = {}
    }
  }

  static start(): void {
    this.store.setState({ isSelecting: true })
    document.body.style.cursor = 'crosshair'
  }

  static stop(): void {
    this.store.setState({ isSelecting: false })
    document.body.style.cursor = 'default'
    this.clearHighlight()
  }

  static isSelecting(): boolean {
    return this.store.getState().isSelecting
  }
}
