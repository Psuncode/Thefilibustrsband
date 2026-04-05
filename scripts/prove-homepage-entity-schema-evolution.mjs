import { execFile } from "node:child_process";
import { promisify } from "node:util";
import process from "node:process";

const execFileAsync = promisify(execFile);
const taskCommit = "9b86e0bd159f81319da6c216fc9bedada3e0fc9b";
const baselineRef = `${taskCommit}^`;
const baselineSourcePath = "src/data/site.ts";
const absentNeedles = [
  "export const siteEntityIds =",
  "export const buildWebSiteSchema =",
  '"@id": string;',
  "genre: bandFacts.geoIdentity.genre,",
  "addressCountry: string;",
  "mainEntityOfPage: {",
  "subjectOf: readonly WebPageSchema[];"
];

const fail = (message) => {
  throw new Error(message);
};

const run = async (command, args) => {
  const { stdout } = await execFileAsync(command, args, {
    cwd: process.cwd(),
    maxBuffer: 10 * 1024 * 1024
  });

  return stdout;
};

const baselineSource = await run("git", ["show", `${baselineRef}:${baselineSourcePath}`]);
const missingNeedles = absentNeedles.filter((needle) => baselineSource.includes(needle));

if (missingNeedles.length > 0) {
  fail(`Baseline source unexpectedly contains: ${missingNeedles.join(", ")}`);
}

await run("node", ["scripts/verify-homepage-entity-schema.mjs"]);

console.log(`Baseline source omits the homepage schema fields, and current build passes verification.`);
