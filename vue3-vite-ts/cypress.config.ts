import { defineConfig } from "cypress";

export default defineConfig({
  // component: {
  //   devServer: {
  //     framework: 'vue',
  //     bundler: 'vite'
  //   }
  // }
  projectId: "aakpof",

  e2e: {
    baseUrl: 'http://localhost:3000'
  },
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
