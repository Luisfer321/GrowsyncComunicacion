import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/GrowsyncComunicacion/',
  build: {
    outDir: 'docs',
    sourcemap: false,
    minify: 'terser', // más seguro que esbuild (que a veces mete eval)
    target: 'es2017'
  }
})