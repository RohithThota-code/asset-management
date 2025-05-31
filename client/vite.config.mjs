// client/vite.config.mjs
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👉 Notice we import from "@tailwindcss/postcss" (the new PostCSS‐only plugin)
import tailwindPostcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindPostcss(),   // ← now uses "@tailwindcss/postcss"
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 5173,
  },
})
