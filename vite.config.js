import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@apollo/client', '@apollo/client/core']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  server: {
    port: 5000,       // 👈 set dev server port
    open: true,       // optional: opens browser automatically
  }
})
