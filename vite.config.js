import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Reemplaza 'GrowsyncComunicacion' con el nombre exacto de tu repo
export default defineConfig({
  plugins: [react()],
  base: '/GrowsyncComunicacion/'
})