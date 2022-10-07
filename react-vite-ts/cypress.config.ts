import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'xib1gr',
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
})