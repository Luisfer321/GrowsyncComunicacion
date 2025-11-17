import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/GrowsyncComunicacion/',
  build: {
    outDir: 'docs',
    sourcemap: false,
    target: 'es2017'
  }
})