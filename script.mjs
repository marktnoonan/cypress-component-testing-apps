import * as ncu from "npm-check-updates";
import * as path from "path";
import { execa } from "execa";
import crypto from "crypto";
import * as fs from "fs/promises";

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

async function main() {

  const projectHashes = await getProjectHashes()

  const previousAngularHash = projectHashes.angular

  await ncu.run({
    packageFile: "./angular/package.json",
    cwd: path.join(cwd, "angular"),
    filter: "@angular*",
    target: "newest",
    upgrade: true,
  });

  const packageJson = await fs.readFile(path.join(cwd, "angular", "package.json"), 'utf-8');
  const newAngularHash = createHash(packageJson)

  if (previousAngularHash === newAngularHash) {
    console.log('Nothing to do here')

    return
  }

  await execa("npm", ["i", "--f"], {
    stdio: "inherit",
    cwd: path.join(cwd, "angular"),
  });
  await execa("npm", ["run", "cypress:run:ct"], {
    stdio: "inherit",
    cwd: path.join(cwd, "angular"),
  });

  projectHashes.angular = newAngularHash

  await updateProjectHashes(projectHashes)
}

main();
