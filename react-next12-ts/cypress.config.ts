import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'uuuotr',
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    }
  }
})