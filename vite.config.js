import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    strictPort: false,
    // Deshabilitar CSP estricto en desarrollo
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    }
  },
  build: {
    // Configuración más segura para producción
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['axios']
        }
      }
    }
  }
})
