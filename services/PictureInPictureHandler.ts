import { LoadingSpinner } from './LoadingSpinner'

export class PictureInPictureHandler {
  static isSupported(): boolean {
    return 'documentPictureInPicture' in window
  }

  static async createWindow(element: Element): Promise<void> {
    if (!this.isSupported()) {
      alert('This browser does not support Document Picture-in-Picture')
      return
    }

    const originalRect = element.getBoundingClientRect()

    try {
      const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: originalRect.width,
        height: originalRect.height,
      })

      LoadingSpinner.show(pipWindow)

      try {
        await this.copyStyles(pipWindow)
        await this.setupPipWindow(pipWindow, element)
      } finally {
        LoadingSpinner.hide(pipWindow)
      }
    } catch (error) {
      console.error('Picture-in-Picture failed:', error)
    }
  }

  private static setupPipWindow(pipWindow: Window, element: Element): void {
    const containerDiv = pipWindow.document.createElement('div')
    const { clone, wrapper } = this.cloneElementWithParents(element, pipWindow)

    containerDiv.style.height = '100vh'
    containerDiv.style.overflow = 'auto'

    this.setupPipWindowStyles(pipWindow)
    containerDiv.appendChild(wrapper)
    pipWindow.document.body.appendChild(containerDiv)

    pipWindow.addEventListener('pagehide', () => pipWindow.close())
  }

  private static cloneElementWithParents(
    element: Element,
    pipWindow: Window
  ): {
    clone: Element
    wrapper: Element
  } {
    const originalRect = element.getBoundingClientRect()
    const pipWidth = Math.max(400, pipWindow.innerWidth)

    const scale = Math.min(1, pipWidth / originalRect.width)
    const safeScale = Math.max(0.1, scale)

    const elements: Element[] = []
    let currentElement: Element | null = element
    while (currentElement && currentElement !== document.body) {
      elements.unshift(currentElement)
      currentElement = currentElement.parentElement
    }

    let wrapper: HTMLElement | null = null
    let lastElement: Element | null = null

    elements.forEach((el, index) => {
      const newElement = pipWindow.document.createElement(
        el.tagName.toLowerCase()
      )

      if (!wrapper) {
        wrapper = newElement as HTMLElement
      } else {
        lastElement!.appendChild(newElement)
      }

      if (el.className) newElement.className = el.className
      if (el.id) newElement.id = el.id
      lastElement = newElement

      if (index === elements.length - 1) {
        newElement.innerHTML = el.innerHTML
      }
    })

    return {
      clone: lastElement!,
      wrapper: wrapper!,
    }
  }

  private static setupPipWindowStyles(pipWindow: Window): void {
    const bodyStyle = pipWindow.document.body.style
    bodyStyle.margin = '0'
    bodyStyle.padding = '0'
    bodyStyle.width = '100%'
    bodyStyle.height = '100%'
    bodyStyle.boxSizing = 'border-box'
    bodyStyle.overflow = 'hidden'
  }

  private static async copyStyles(pipWindow: Window): Promise<void> {
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]')

    for (const style of styles) {
      if (style instanceof HTMLStyleElement) {
        pipWindow.document.head.appendChild(style.cloneNode(true))
      } else if (style instanceof HTMLLinkElement) {
        try {
          const response = await fetch(style.href)
          if (response.ok) {
            const css = await response.text()
            const newStyle = pipWindow.document.createElement('style')
            newStyle.textContent = css
            pipWindow.document.head.appendChild(newStyle)
          }
        } catch (error) {
          console.error('Failed to load stylesheet:', style.href, error)
        }
      }
    }
  }
}
