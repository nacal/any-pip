import { ElementSelectorHandler } from '@/services/ElementSelectorHandler'
import { PictureInPictureHandler } from '@/services/PictureInPictureHandler'

const eventHandlers = {
  handleMouseOver(e: MouseEvent): void {
    if (!ElementSelectorHandler.isSelecting()) return

    const target = e.target as Element
    ElementSelectorHandler.highlight(target)
    e.stopPropagation()
  },

  async handleClick(e: MouseEvent): Promise<void> {
    if (!ElementSelectorHandler.isSelecting()) return

    e.preventDefault()
    e.stopPropagation()

    const targetElement = e.target as Element
    ElementSelectorHandler.clearHighlight()
    ElementSelectorHandler.stop()
    await PictureInPictureHandler.createWindow(targetElement)
  },

  handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && ElementSelectorHandler.isSelecting()) {
      ElementSelectorHandler.stop()
    }
  },
}

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    browser.runtime.onMessage.addListener((message) => {
      if (message.type === 'START_ELEMENT_SELECT') {
        ElementSelectorHandler.isSelecting()
          ? ElementSelectorHandler.stop()
          : ElementSelectorHandler.start()
      }
      return true
    })

    document.addEventListener('mouseover', eventHandlers.handleMouseOver)
    document.addEventListener('click', eventHandlers.handleClick)
    document.addEventListener('keydown', eventHandlers.handleKeyDown)
  },
})
