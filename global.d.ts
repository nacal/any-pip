// APIのインターフェース定義を追加
interface DocumentPictureInPicture {
  requestWindow(options: { width: number; height: number }): Promise<Window>
}

// windowオブジェクトの拡張
declare global {
  interface Window {
    documentPictureInPicture: DocumentPictureInPicture
  }
}

export global {}
