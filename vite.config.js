import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        low: resolve(__dirname, 'low.html'),
        leaderboard: resolve(__dirname, 'leaderboard.html')
      }
    }
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.obj', '**/*.vox', '**/*.mp3', '**/*.wav'],
  define: {
    global: 'globalThis'
  }
})