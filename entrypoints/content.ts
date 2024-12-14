// 要素選択の状態管理
const elementSelector = {
  isSelecting: false,
  highlightedElement: null as Element | null,
}

// 要素のハイライト処理
function highlightElement(element: Element) {
  if (elementSelector.highlightedElement) {
    ;(elementSelector.highlightedElement as HTMLElement).style.outline = ''
  }
  ;(element as HTMLElement).style.outline = '2px solid #ff0000'
  elementSelector.highlightedElement = element
}

// ハイライトの解除
function clearHighlight() {
  if (elementSelector.highlightedElement) {
    ;(elementSelector.highlightedElement as HTMLElement).style.outline = ''
    elementSelector.highlightedElement = null
  }
}

// 選択モードの開始
function startElementSelect() {
  elementSelector.isSelecting = true
  document.body.style.cursor = 'crosshair'
}

// 選択モードの終了
function stopElementSelect() {
  elementSelector.isSelecting = false
  document.body.style.cursor = 'default'
  clearHighlight()
}

// マウスオーバーハンドラ
function handleMouseOver(e: MouseEvent) {
  if (!elementSelector.isSelecting) return

  const target = e.target as Element
  highlightElement(target)
  e.stopPropagation()
}

// クリックハンドラ
function handleClick(e: MouseEvent) {
  if (!elementSelector.isSelecting) return

  e.preventDefault()
  e.stopPropagation()

  const target = e.target as Element
  stopElementSelect()
}

// キーダウンハンドラ
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && elementSelector.isSelecting) {
    stopElementSelect()
  }
}

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'START_ELEMENT_SELECT') {
        if (elementSelector.isSelecting) {
          stopElementSelect()
        } else {
          startElementSelect()
        }
      }
      sendResponse({ message: 'Hello from content' })
      return true
    })

    // イベントリスナーの設定
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeyDown)
  },
})
