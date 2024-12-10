import { crx, defineManifest } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'

const manifest = defineManifest({
  manifest_version: 3,
  name: 'any-pip',
  version: '1.0.0',
  description: 'any-pip',
  action: {
    default_popup: 'index.html',
  },
})

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
})
