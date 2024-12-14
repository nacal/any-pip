interface DocumentPictureInPicture {
  requestWindow(options: { width: number; height: number }): Promise<Window>
}

declare global {
  interface Window {
    documentPictureInPicture: DocumentPictureInPicture
  }
}

export global {}
