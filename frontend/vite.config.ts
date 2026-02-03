import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning limit slightly (optional)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks: {
          // Vendor chunks - split large dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-animation': ['framer-motion'],
          'vendor-firebase': ['firebase/app', 'firebase/database'],
          'vendor-utils': ['@emailjs/browser', 'lucide-react'],
        },
      },
    },
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Minification settings
    minify: 'esbuild',
    // Target modern browsers for smaller bundle
    target: 'es2020',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber', 'framer-motion'],
  },
})
