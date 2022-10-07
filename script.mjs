import * as ncu from "npm-check-updates";
import * as path from "path";
import { execa } from "execa";
import crypto from "crypto";
import * as fs from "fs/promises";

/** @type {Array<{ projectName: string, filters: string[], tag: string }>} */
const projects = [
  { projectName: "angular", filters: ["@angular*"], tag: "@angular/core" },
  // { projectName: "react-cra5-ts", filters: ["react-scripts"], tag: 'react-scripts' },
  // { projectName: 'react-next12-ts', filters: ['next'], tag: 'next' },
  // { projectName: 'react-vite-ts', filters: ['vite', '@vitejs/plugin-react'], tag: 'vite' },
  // { projectName: 'react-webpack5-js', filters: ['react', 'react-dom'], tag: 'react' },
  // { projectName: 'svelte-vite-ts', filters: ['svelte', '@sveltejs/vite-plugin-svelte', 'svelte-preprocess'], tag: 'svelte' },
  // { projectName: 'vue3-cli5-ts', filters: ['@vue/cli*'], tag: '@vue/cli-service' },
  // { projectName: 'vue2-nuxt2-js', filters: ['nuxt', '@nuxtjs*'], tag: 'nuxt' }
];

function createHash(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

async function getProjectHashes() {
  return JSON.parse(await fs.readFile("./project-hashes.json", "utf-8"));
}

async function updateProjectHashes(content) {
  await fs.writeFile("./project-hashes.json", JSON.stringify(content, null, 2));
}

let originalPackageJson = null;
let originalPackageLock = null;

async function savePackageJson(projectName) {
  originalPackageJson = await getPackageJson(projectName);
  originalPackageLock = await fs.readFile(
    path.join(cwd, projectName, "package-lock.json"),
    "utf-8"
  );
}

async function restorePackageJson(projectName) {
  await fs.writeFile(
    path.join(cwd, projectName, "package.json"),
    originalPackageJson
  );

  await fs.writeFile(
    path.join(cwd, projectName, "package-lock.json"),
    originalPackageLock
  );
}

async function getPackageJson(projectName) {
  return await fs.readFile(
    path.join(cwd, projectName, "package.json"),
    "utf-8"
  );
}

const cwd = process.cwd();

/** @type {(projectHashes: { [key: string]: { newest: string, latest: string } }, project: { projectName: string, filters: string[], tag: string })} */
async function run(projectHashes, { projectName, filters, tag }) {
  const targets = ["latest", "newest"];

  for (const target of targets) {
    console.log({ target });
    await savePackageJson(projectName);

    const previousFrameworkHash = projectHashes[projectName]?.[target];

    const updated = await ncu.run({
      packageFile: `./${projectName}/package.json`,
      cwd: path.join(cwd, projectName),
      filter: filters, // gotta figure out for each folder what we want to filter by
      target,
      upgrade: true,
    });

    console.log("Packages that will be updated: ", updated);

    const packageJson = JSON.parse(await getPackageJson(projectName));
    const newFrameworkHash = createHash(JSON.stringify(packageJson));

    if (previousFrameworkHash === newFrameworkHash) {
      console.log("Nothing to do here");

      await restorePackageJson(projectName);
      continue;
    }

    try {
      await execa("npm", ["i", "--f"], {
        stdio: "inherit",
        cwd: path.join(cwd, projectName),
      });

      const cypressVersion =
        packageJson.dependencies?.["cypress"] ||
        packageJson.devDependencies?.["cypress"];

      const packageVersion =
        packageJson.dependencies?.[tag] || packageJson.devDependencies?.[tag];

      const tags = [
        projectName,
        `cypress@${cypressVersion}`,
        `${tag}@${packageVersion}`,
      ];

      console.log({ tags });

      await execa(
        "npx",
        [
          "cypress",
          "run",
          "--component",
          // "--record",
          // "--key",
          // "xxxxxxxx", // Replace with real
          // "--tag",
          // tags.join(","),
        ],
        {
          stdio: "inherit",
          cwd: path.join(cwd, projectName),
        }
      );
    } catch (e) {
      console.error(e);
    }

    if (!projectHashes[projectName]) {
      projectHashes[projectName] = {};
    }

    projectHashes[projectName][target] = newFrameworkHash;

    await updateProjectHashes(projectHashes);

    await restorePackageJson(projectName);
  }
}

async function main() {
  const projectHashes = await getProjectHashes();
  for (const project of projects) {
    await run(projectHashes, project);
  }
}

main();

/**
 * Hash Schema
 * {
 * FrameworkName: {newest: hashValue, latest: hashValue}
 * }
 */
