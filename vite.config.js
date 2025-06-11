import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url' // Add this import

const __dirname = fileURLToPath(new URL('.', import.meta.url)) // Add this line

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    css: true,
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.js',
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}',
        'src/main.jsx',
        'src/index.css',
        'coverage/**',
        'dist/**',
        '**/*.config.{js,ts}',
        '**/.*'
      ]
    },
    // Add this to handle JSX properly
    esbuild: {
      jsx: 'automatic'
    }
  },
  server: {
    host: true,
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['prop-types']
        }
      }
    }
  }
})