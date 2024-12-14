export class LoadingSpinner {
  private static readonly STYLES = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `

  private static createStyleElement(window: Window): void {
    const styleEl = window.document.createElement('style')
    styleEl.textContent = this.STYLES
    window.document.head.appendChild(styleEl)
  }

  private static createSpinnerElement(window: Window): HTMLElement {
    const spinner = window.document.createElement('div')
    spinner.style.cssText = `
      width: 30px;
      height: 30px;
      border: 3px solid #ffffff;
      border-top: 3px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `
    return spinner
  }

  static show(window: Window): void {
    this.createStyleElement(window)

    const loadingEl = window.document.createElement('div')
    loadingEl.id = 'pip-loading'
    loadingEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    `

    const spinner = this.createSpinnerElement(window)
    const text = window.document.createElement('div')
    text.textContent = 'Loading...'

    loadingEl.appendChild(spinner)
    loadingEl.appendChild(text)
    window.document.body.appendChild(loadingEl)
  }

  static hide(window: Window): void {
    const loadingEl = window.document.getElementById('pip-loading')
    if (loadingEl) {
      loadingEl.remove()
    }
  }
}
