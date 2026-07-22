import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // No source maps in production — avoids shipping readable original source alongside the minified bundle.
    sourcemap: false,
  },
})
