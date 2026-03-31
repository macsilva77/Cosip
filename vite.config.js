import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Cosip/',
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor':  ['recharts'],
          'map-vendor':    ['leaflet', 'react-leaflet'],
          'icons-vendor':  ['lucide-react'],
        },
      },
    },
  },
})
