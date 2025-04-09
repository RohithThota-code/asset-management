import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/routes': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/login': 'http://localhost:8000',
      '/profile': 'http://localhost:8000',
      '/logout': 'http://localhost:8000',
      
    }
  }
});
