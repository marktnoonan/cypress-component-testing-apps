import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'aakpof',
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  }
})