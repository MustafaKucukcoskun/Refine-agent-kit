#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { getInventory } = require("../bin/inventory");

const packageRoot = path.resolve(__dirname, "..");

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, "utf-8");
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  fs.writeFileSync(filePath, content, "utf-8");
}

const inventory = getInventory(packageRoot);

const packageJsonPath = path.join(packageRoot, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
packageJson.description = `AI Agent toolkit for Google Antigravity IDE. ${inventory.agents} agents, ${inventory.skillModules} skill modules across ${inventory.skillPacks} skill packs, ${inventory.domains} domains, design persona system, anti-AI-slop protection.`;
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2) + "\n",
  "utf-8",
);

replaceInFile(path.join(packageRoot, "README.md"), [
  [
    /AI Agent toolkit for \*\*Google Antigravity IDE\*\*\.[^\n]*/,
    `AI Agent toolkit for **Google Antigravity IDE**. ${inventory.agents} specialist agents, ${inventory.skillModules} skill modules across ${inventory.skillPacks} skill packs, ${inventory.domains} domains, design persona system, and anti-AI-slop protection.`,
  ],
  [
    /├── \.agent\/\s+← Agent system \([^\n]*\)/,
    `├── .agent/                        ← Agent system (${inventory.agents} agents, ${inventory.skillModules} skill modules / ${inventory.skillPacks} skill packs)`,
  ],
  [
    /\| `\.agent\/skills\/`\s+\| [^|]+\|/,
    `| \`.agent/skills/\`         | ${inventory.skillModules} skill modules across ${inventory.skillPacks} top-level skill packs |`,
  ],
  [
    /\| `\.agent\/domains\/`\s+\| [^|]+\|/,
    `| \`.agent/domains/\`        | ${inventory.domains} domain configuration packs                        |`,
  ],
  [
    /\| `\.agent\/scripts\/`\s+\| [^|]+\|/,
    `| \`.agent/scripts/\`        | ${inventory.scripts} utility scripts       |`,
  ],
  [
    /\| `\.shared\/design-system\/` \| [^|]+\|/,
    `| \`.shared/design-system/\` | ${inventory.personas} personas + ${inventory.referenceSites} reference sites + ${inventory.antiPatterns} anti-patterns |`,
  ],
]);

replaceInFile(path.join(packageRoot, "shared", ".agent", "ARCHITECTURE.md"), [
  [/\*\*53 Skills\*\*/g, `**${inventory.skillPacks} Skill Packs**`],
  [/\*\*12 Domain Packs\*\*/g, `**${inventory.domains} Domain Packs**`],
  [
    /├── skills\/\s+# 53 Skills/,
    `├── skills/                  # ${inventory.skillPacks} Skill Packs (${inventory.skillModules} modules)`,
  ],
  [
    /├── domains\/\s+# 12 Domain Packs/,
    `├── domains/                 # ${inventory.domains} Domain Packs`,
  ],
  [
    /├── rules\/\s+# GEMINI\.md \(global\) \+ 12 domain rules/,
    `├── rules/                   # GEMINI.md (global) + ${inventory.domains} domain rules`,
  ],
  [
    /## 🧩 Skills \(53\)/,
    `## 🧩 Skills (${inventory.skillPacks} packs / ${inventory.skillModules} modules)`,
  ],
  [/## 📦 Domain Packs \(12\)/, `## 📦 Domain Packs (${inventory.domains})`],
  [
    /Modular knowledge domains that agents can load on-demand based on task context\./,
    `Modular knowledge domains that agents can load on-demand based on task context. Current shipped inventory: ${inventory.skillPacks} top-level skill packs and ${inventory.skillModules} total SKILL.md modules.`,
  ],
  [
    /\| \*\*Total Skills\*\*\s+\| [^|]+\|/,
    `| **Total Skill Packs**   | ${inventory.skillPacks}                            |`,
  ],
  [
    /\| \*\*Total Skill Packs\*\*\s+\| [^|]+\|/,
    `| **Total Skill Packs**   | ${inventory.skillPacks}                            |`,
  ],
  [
    /\| \*\*Total Workflows\*\*\s+\| [^|]+\|/,
    `| **Total Skill Modules** | ${inventory.skillModules}                            |\n| **Total Workflows**    | ${inventory.workflows}                            |`,
  ],
  [
    /\| \*\*Total Domain Packs\*\*\s+\| [^|]+\|/,
    `| **Total Domain Packs** | ${inventory.domains}                            |`,
  ],
]);

replaceInFile(path.join(packageRoot, "DEVELOPMENT-ROADMAP.md"), [
  [
    /← \d+ agent, \d+ skill.*?, \d+ workflow, \d+ script/,
    `← ${inventory.agents} agent, ${inventory.skillPacks} skill pack (${inventory.skillModules} module), ${inventory.workflows} workflow, ${inventory.scripts} script`,
  ],
  [
    /^\| Top-level skill packs \| \d+ \|.*$/m,
    `| Top-level skill packs | ${inventory.skillPacks} | shared/.agent/skills/ altinda |`,
  ],
  [
    /^\| SKILL\.md modul.*\| \d+ \|.*$/m,
    `| SKILL.md modulleri (toplam) | ${inventory.skillModules} | shared/.agent/skills altinda (sub-skill'ler dahil) |`,
  ],
  [
    /^\| Domain config'lerden referans edilen \| \d+ \|.*$/m,
    `| Domain config'lerden referans edilen | ${inventory.referencedSkillModules} | shared/.agent/domains/*.json icinde |`,
  ],
  [
    /^\| Kirik referans.*\| \d+ \|.*$/m,
    `| Kirik referans (skill yok) | ${inventory.brokenSkillReferences} | shared/.agent/skills ile karsilastirildi |`,
  ],
  [
    /^\| Yetim.*\| \d+ \|.*$/m,
    `| Yetim (domain ref yok) | ${inventory.orphanSkillModules} | Skill var ama hicbir domain config referans etmiyor |`,
  ],
  [
    /^\| \*\*refine-agent-kit.*$/m,
    `| **refine-agent-kit (biz)** | **Yeni** | **${inventory.skillModules} modul / ${inventory.skillPacks} pack** | **${inventory.agents}** | **Agent routing, persona, anti-slop** |`,
  ],
  [
    /#   Updated \d+ agents, \d+ skill.*?, \d+ workflows/,
    `#   Updated ${inventory.agents} agents, ${inventory.skillModules} skill modules, ${inventory.workflows} workflows`,
  ],
  [
    /### 3\.1 (?:Neden|Why Should All) \d+ Domain.*(?:Eklenmeli\?|CLI\?)/,
    `### 3.1 Neden ${inventory.domains} Domain'in Hepsi CLI'a Eklenmeli?`,
  ],
  [
    /`\.agent\/` (?:dizininde|directory contains).*?(?:skill'ler|technologies)/,
    `\`.agent/\` dizininde ${inventory.domains} teknoloji icin domain config, domain rules ve ilgili skill'ler`,
  ],
]);

console.log(JSON.stringify(inventory, null, 2));
