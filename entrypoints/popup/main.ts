function main() {
  browser.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id!, { type: 'START_ELEMENT_SELECT' })
  })
  window.close()
}

main()
