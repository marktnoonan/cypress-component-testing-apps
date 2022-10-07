import * as ncu from "npm-check-updates";
import * as path from "path";
import { execa } from "execa";
import crypto from "crypto";
import * as fs from "fs/promises";

const projects = {'angular': ['@angular*'], 'react-cra5-ts': ['react-scripts'], 'react-vite-ts': [], 'react-webpack5-js': [], 'svelte-webpack5-js': [], 'vue2-cli4-js': []}

/** @type {Array<{ projectName: string, filters: string[] }>} */
const _projects = [
  { projectName: 'angular', filters: ['@angular*'] },
  { projectName: 'react-cra5-ts', filters: ['react-scripts'] },
  { projectName: 'react-next12-ts', filters: ['next'] },
  { projectName: 'react-vite-ts', filters: ['vite', '@vitejs/plugin-react'] },
  { projectName: 'react-webpack5-js', filters: ['react', 'react-dom'] },
  { projectName: 'svelte-vite-ts', filters: ['svelte', '@sveltejs/vite-plugin-svelte', 'svelte-preprocess'] },
  { projectName: 'vue3-cli5-ts', filters: ['@vue/cli*'] },
  { projectName: 'vue2-nuxt2-js', filters: ['nuxt', '@nuxtjs*'] }
]

function createHash(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

async function getProjectHashes() {
  return JSON.parse(await fs.readFile('./project-hashes.json', 'utf-8'))
}

async function updateProjectHashes(content) {
  await fs.writeFile('./project-hashes.json', JSON.stringify(content))
}

const cwd = process.cwd();

async function run(projectHashes, project) {
  
  const targets = ['newest', 'latest']
  targets.forEach( async (t) => {
    const previousFrameworkHash = projectHashes[project.projectName][t]

    await ncu.run({
      packageFile: `./${project.projectName}/package.json`,
      cwd: path.join(cwd, project.projectName),
      filter: project.filters, // gotta figure out for each folder what we want to filter by
      target: t,
      upgrade: true,
    });

    const packageJson = await fs.readFile(path.join(cwd, project.projectName, "package.json"), 'utf-8');
    const newFrameworkHash = createHash(packageJson)

    if (previousFrameworkHash === newFrameworkHash) {
      console.log('Nothing to do here')
      return
    }

    await execa("npm", ["i", "--f"], {
      stdio: "inherit",
      cwd: path.join(cwd, project.projectName),
    });
    await execa("npm", ["run", "cypress:run:ct"], {
      stdio: "inherit",
      cwd: path.join(cwd, project.projectName),
    });
  
    projectHashes[project.projectName][t] = newFrameworkHash
  
    await updateProjectHashes(projectHashes)
  })
}

async function main() {
  const projectHashes = await getProjectHashes()
  _projects.forEach((project) => {
    run(projectHashes, project)
  })
}

main();

/**
 * Hash Schema
 * {
 * FrameworkName: {newest: hashValue, latest: hashValue}
 * }
 */