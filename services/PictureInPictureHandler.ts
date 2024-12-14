export class PictureInPictureHandler {
  static isSupported(): boolean {
    return 'documentPictureInPicture' in window
  }

  static async createWindow(element: Element): Promise<void> {
    if (!this.isSupported()) {
      alert('This browser does not support Document Picture-in-Picture')
      return
    }

    try {
      const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 400,
        height: 300,
      })
      this.setupPipWindow(pipWindow, element)
    } catch (error) {
      console.error('Picture-in-Picture failed:', error)
    }
  }

  private static setupPipWindow(pipWindow: Window, element: Element): void {
    const clone = element.cloneNode(true) as Element

    this.setupPipWindowStyles(pipWindow)
    this.copyStyles(pipWindow)
    pipWindow.document.body.appendChild(clone)

    pipWindow.addEventListener('pagehide', () => pipWindow.close())
  }

  private static setupPipWindowStyles(pipWindow: Window): void {
    pipWindow.document.body.style.margin = '0'
    pipWindow.document.body.style.padding = '0'
  }

  private static copyStyles(pipWindow: Window): void {
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]')
    styles.forEach((style) => {
      pipWindow.document.head.appendChild(style.cloneNode(true))
    })
  }
}
