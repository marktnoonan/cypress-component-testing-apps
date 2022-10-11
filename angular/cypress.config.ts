import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'n6uehy',
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
});
