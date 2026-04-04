const fs = require("fs");
const path = require("path");

function countFiles(dir, predicate) {
  if (!fs.existsSync(dir)) return 0;

  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += countFiles(entryPath, predicate);
      continue;
    }
    if (!predicate || predicate(entry.name, entryPath)) {
      total += 1;
    }
  }
  return total;
}

function countTopLevelDirs(dir) {
  if (!fs.existsSync(dir)) return 0;

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory()).length;
}

function countCsvRows(filePath) {
  if (!fs.existsSync(filePath)) return 0;

  const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/);
  return lines.filter((line, index) => index > 0 && line.trim().length > 0)
    .length;
}

function collectSkillModules(skillsDir, relativePrefix = "") {
  if (!fs.existsSync(skillsDir)) return [];

  const modules = [];
  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const entryPath = path.join(skillsDir, entry.name);
    const moduleId = relativePrefix
      ? `${relativePrefix}/${entry.name}`
      : entry.name;
    const skillFile = path.join(entryPath, "SKILL.md");

    if (fs.existsSync(skillFile)) {
      modules.push(moduleId);
    }

    modules.push(...collectSkillModules(entryPath, moduleId));
  }

  return modules;
}

function collectDomainSkillReferences(domainsDir) {
  if (!fs.existsSync(domainsDir)) {
    return {
      referencedModules: new Set(),
      missingReferences: new Set(),
    };
  }

  const referencedModules = new Set();
  const missingReferences = new Set();

  for (const fileName of fs.readdirSync(domainsDir)) {
    if (!fileName.endsWith(".json")) continue;

    const domainConfig = JSON.parse(
      fs.readFileSync(path.join(domainsDir, fileName), "utf-8"),
    );
    const skillGroups = Object.values(domainConfig.skills || {});

    for (const group of skillGroups) {
      for (const skillName of group || []) {
        referencedModules.add(skillName);
      }
    }
  }

  return {
    referencedModules,
    missingReferences,
  };
}

function getInventory(packageRoot) {
  const skillsDir = path.join(packageRoot, "shared", ".agent", "skills");
  const domainsDir = path.join(packageRoot, "shared", ".agent", "domains");
  const designSystemDir = path.join(
    packageRoot,
    "shared",
    ".agent",
    ".shared",
    "design-system",
  );
  const skillModuleIds = collectSkillModules(skillsDir);
  const availableModules = new Set(skillModuleIds);
  const { referencedModules } = collectDomainSkillReferences(domainsDir);
  const validReferencedModules = new Set(
    [...referencedModules].filter((moduleId) => availableModules.has(moduleId)),
  );
  const missingReferencedModules = new Set(
    [...referencedModules].filter(
      (moduleId) => !availableModules.has(moduleId),
    ),
  );
  const orphanModules = skillModuleIds.filter(
    (moduleId) => !validReferencedModules.has(moduleId),
  );

  return {
    agents: countFiles(path.join(packageRoot, "shared", ".agent", "agents")),
    skillPacks: countTopLevelDirs(skillsDir),
    skillModules: skillModuleIds.length,
    workflows: countFiles(
      path.join(packageRoot, "shared", ".agent", "workflows"),
    ),
    domains: countFiles(domainsDir),
    scripts: countFiles(path.join(packageRoot, "shared", ".agent", "scripts")),
    personas: countCsvRows(path.join(designSystemDir, "personas.csv")),
    referenceSites: countCsvRows(
      path.join(designSystemDir, "reference-sites.csv"),
    ),
    antiPatterns: countCsvRows(path.join(designSystemDir, "anti-patterns.csv")),
    referencedSkillModules: validReferencedModules.size,
    brokenSkillReferences: missingReferencedModules.size,
    orphanSkillModules: orphanModules.length,
  };
}

module.exports = {
  getInventory,
};
