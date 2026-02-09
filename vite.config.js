/// <reference types="vite/client" />
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'
import blitsVitePlugins from '@lightningjs/blits/vite'

export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    //legacy/chrome-57/
    base: '/', // Set to your base path if you are deploying to a subdirectory (example: /myApp/)
    plugins: [
      ...blitsVitePlugins,
      // legacy({
      //   targets: 'chrome >= 57 and chrome < 63',
      //   renderModernChunks: false,
      // }),
    ],
    resolve: {
      mainFields: ['browser', 'module', 'jsnext:main', 'jsnext'],
    },
    // build: {
    //   outDir: 'dist/legacy/chrome-57/',
    // },
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
      fs: {
        allow: ['..'],
      },
    },
    worker: {
      format: 'es',
    },
  }
})
