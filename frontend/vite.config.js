import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Semantic UI 2.5 contiene selectores que Lightning CSS no puede minimizar.
    cssMinify: false,
  },
})
