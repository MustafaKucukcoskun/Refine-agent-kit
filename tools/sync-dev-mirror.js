#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const packageRoot = path.resolve(__dirname, "..");
const sourceAgentDir = path.join(packageRoot, "shared", ".agent");
const sourceSharedDir = path.join(packageRoot, "shared", ".shared");
const targetAgentDir = path.join(packageRoot, ".agent");
const targetSharedDir = path.join(packageRoot, ".shared");
const devDomain = "next-web";

function resetDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDir(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function ensureExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`Missing ${label}: ${targetPath}`);
  }
}

ensureExists(sourceAgentDir, "shared agent source");
ensureExists(sourceSharedDir, "shared design source");

resetDir(targetAgentDir);
resetDir(targetSharedDir);

copyDir(sourceAgentDir, targetAgentDir);
copyDir(sourceSharedDir, targetSharedDir);

copyFile(
  path.join(packageRoot, "domains", devDomain, "rules", "GEMINI.md"),
  path.join(targetAgentDir, "rules", "GEMINI.md"),
);
copyFile(
  path.join(packageRoot, "domains", devDomain, "mcp_config.json"),
  path.join(targetAgentDir, "mcp_config.json"),
);

const researchReport = path.join(packageRoot, "research-report.md");
if (fs.existsSync(researchReport)) {
  copyFile(
    researchReport,
    path.join(targetSharedDir, "design-system", "research-report.md"),
  );
}

console.log(
  JSON.stringify(
    {
      sourceAgentDir,
      sourceSharedDir,
      targetAgentDir,
      targetSharedDir,
      devDomain,
      status: "ok",
    },
    null,
    2,
  ),
);
