import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'n6uehy',
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
})