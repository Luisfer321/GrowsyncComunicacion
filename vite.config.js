import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración para GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/GrowsyncComunicacion/', // <- nombre exacto de tu repo
  build: {
    sourcemap: false // Evita eval en JS, compatible con CSP de GitHub Pages
  }
})