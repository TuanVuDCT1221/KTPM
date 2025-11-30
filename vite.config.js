import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { coverageConfigDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',       
      reporter: ['text', 'html'], 
      exclude: [...coverageConfigDefaults.exclude],
    },
  },
})
