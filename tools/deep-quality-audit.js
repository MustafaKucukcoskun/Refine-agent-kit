#!/usr/bin/env node

/**
 * deep-quality-audit.js — Comprehensive Quality Audit
 * 
 * Validates EVERY component of refine-agent-kit:
 * - Agent files: structure, content quality, skill references
 * - Skills: SKILL.md frontmatter, description, scripts validity
 * - Workflows: structure, trigger patterns
 * - Domains: JSON validity, file references, MCP configs
 * - Global config: GEMINI.md sections, mcp_config.json
 * - Design system: personas, reference sites, anti-patterns
 * - CLI: env template, banner, commands
 * - Build: package.json, .npmignore, .gitignore consistency
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SHARED = path.join(ROOT, "shared", ".agent");
const AGENTS_DIR = path.join(SHARED, "agents");
const SKILLS_DIR = path.join(SHARED, "skills");
const WORKFLOWS_DIR = path.join(SHARED, "workflows");
const DOMAINS_DIR = path.join(ROOT, "domains");
const GLOBAL_DIR = path.join(ROOT, "global");
const DESIGN_DIR = path.join(SHARED, ".shared", "design-system");
const RULES_DIR = path.join(SHARED, "rules");
const SCRIPTS_DIR = path.join(SHARED, "scripts");

const issues = [];
const warnings = [];
const stats = {};

function addIssue(category, file, msg) {
  issues.push({ category, file: path.relative(ROOT, file), msg });
}
function addWarning(category, file, msg) {
  warnings.push({ category, file: path.relative(ROOT, file), msg });
}

// ─── 1. AGENT AUDIT ──────────────────────────────────────────────────────────

function auditAgents() {
  console.log("\n=== 1. AGENT QUALITY AUDIT ===\n");
  const agentFiles = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith(".md"));
  stats.agents = agentFiles.length;

  for (const file of agentFiles) {
    const filePath = path.join(AGENTS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const agentName = file.replace(".md", "");
    const lines = content.split("\n");
    const sizeKB = (Buffer.byteLength(content) / 1024).toFixed(1);

    // Check minimum content
    if (lines.length < 20) {
      addIssue("agent", filePath, `Too short (${lines.length} lines). Agents should have detailed instructions.`);
    }

    // Check for heading (agents use frontmatter, so H1 may come after ---)
    const hasFrontmatter = content.startsWith("---");
    const hasH1 = /^# /m.test(content);
    if (!hasFrontmatter && !hasH1) {
      addIssue("agent", filePath, "Missing frontmatter or H1 heading");
    }

    // Check for role/persona definition (search in entire content for agents with frontmatter)
    const searchArea = hasFrontmatter ? content.substring(0, 1000) : content.substring(0, 500);
    const hasRole = /role|persona|specialist|expert|engineer|architect|developer|tester|auditor|manager|owner|writer|optimizer|planner|orchestrat/i.test(searchArea);
    if (!hasRole) {
      addWarning("agent", filePath, "No clear role/persona definition in first 500 chars");
    }

    // Check for skill references
    const skillRefs = content.match(/skills?\s*:\s*[\w-]+|skill.*?:\s*\[/gi) || [];
    
    // Check for empty sections
    const emptyH2 = content.match(/^## .+\n\n(?=## )/gm);
    if (emptyH2) {
      addWarning("agent", filePath, `${emptyH2.length} empty section(s) found`);
    }

    console.log(`  ✔ ${agentName.padEnd(30)} ${sizeKB.padStart(6)} KB  ${lines.length} lines`);
  }
  console.log(`\n  Total: ${agentFiles.length} agents`);
}

// ─── 2. SKILL AUDIT ──────────────────────────────────────────────────────────

function auditSkills() {
  console.log("\n=== 2. SKILL QUALITY AUDIT ===\n");
  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(f => {
    return fs.statSync(path.join(SKILLS_DIR, f)).isDirectory();
  });
  stats.skillPacks = skillDirs.length;
  let totalModules = 0;
  let totalScripts = 0;
  let missingDesc = 0;
  let tooShort = 0;

  for (const dir of skillDirs) {
    const skillDir = path.join(SKILLS_DIR, dir);
    const skillMd = path.join(skillDir, "SKILL.md");

    // Check SKILL.md exists
    if (!fs.existsSync(skillMd)) {
      addIssue("skill", skillDir, "Missing SKILL.md");
      continue;
    }

    const content = fs.readFileSync(skillMd, "utf-8");
    const lines = content.split("\n");
    const sizeKB = (Buffer.byteLength(content) / 1024).toFixed(1);

    // Parse frontmatter (handle both LF and CRLF line endings)
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fmMatch) {
      addIssue("skill", skillMd, "Missing YAML frontmatter (---...---)");
      continue;
    }

    const frontmatter = fmMatch[1];
    
    // Check name field
    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    if (!nameMatch || !nameMatch[1].trim()) {
      addIssue("skill", skillMd, "Missing 'name' in frontmatter");
    }

    // Check description field
    const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
    if (!descMatch || !descMatch[1].trim()) {
      addIssue("skill", skillMd, "Missing 'description' in frontmatter");
      missingDesc++;
    } else if (descMatch[1].trim().length < 20) {
      addWarning("skill", skillMd, `Description too short: "${descMatch[1].trim()}"`);
    }

    // Check body content quality
    const bodyStart = content.indexOf("---", 4);
    const body = bodyStart > 0 ? content.substring(bodyStart + 3).trim() : "";
    
    if (body.length < 200) {
      addWarning("skill", skillMd, `Body too short (${body.length} chars). Skills should have detailed instructions.`);
      tooShort++;
    }

    // Count sub-modules (additional .md files in skill dir)
    const subFiles = fs.readdirSync(skillDir).filter(f => f.endsWith(".md") && f !== "SKILL.md");
    totalModules += 1 + subFiles.length;

    // Count scripts
    const scriptsDir = path.join(skillDir, "scripts");
    if (fs.existsSync(scriptsDir)) {
      const scripts = fs.readdirSync(scriptsDir).filter(f => f.endsWith(".py") || f.endsWith(".sh") || f.endsWith(".js"));
      totalScripts += scripts.length;
      
      // Validate script syntax (basic check)
      for (const script of scripts) {
        const scriptPath = path.join(scriptsDir, script);
        const scriptContent = fs.readFileSync(scriptPath, "utf-8");
        if (scriptContent.trim().length < 50) {
          addWarning("skill-script", scriptPath, "Script seems too short (< 50 chars)");
        }
      }
    }

    const status = "✔";
    console.log(`  ${status} ${dir.padEnd(35)} ${sizeKB.padStart(6)} KB  ${subFiles.length > 0 ? `+${subFiles.length} modules` : ""}`);
  }

  stats.skillModules = totalModules;
  stats.skillScripts = totalScripts;
  console.log(`\n  Total: ${skillDirs.length} packs, ${totalModules} modules, ${totalScripts} scripts`);
  if (missingDesc > 0) console.log(`  ⚠ ${missingDesc} skills missing description`);
  if (tooShort > 0) console.log(`  ⚠ ${tooShort} skills with very short body`);
}

// ─── 3. WORKFLOW AUDIT ───────────────────────────────────────────────────────

function auditWorkflows() {
  console.log("\n=== 3. WORKFLOW QUALITY AUDIT ===\n");
  const wfFiles = fs.readdirSync(WORKFLOWS_DIR).filter(f => f.endsWith(".md"));
  stats.workflows = wfFiles.length;

  for (const file of wfFiles) {
    const filePath = path.join(WORKFLOWS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const sizeKB = (Buffer.byteLength(content) / 1024).toFixed(1);
    const wfName = file.replace(".md", "");

    // Check minimum content
    if (lines.length < 10) {
      addIssue("workflow", filePath, `Too short (${lines.length} lines)`);
    }

    // Check for heading (workflows use frontmatter + H1 after it)
    const wfHasFrontmatter = content.startsWith("---");
    const wfHasH1 = /^# /m.test(content);
    if (!wfHasFrontmatter && !wfHasH1) {
      addWarning("workflow", filePath, "Missing frontmatter or H1 heading");
    }

    // Check for steps/procedure structure
    const hasSteps = /step|phase|\d\.\s|##\s/i.test(content);
    if (!hasSteps) {
      addWarning("workflow", filePath, "No clear step/phase structure detected");
    }

    console.log(`  ✔ /${wfName.padEnd(25)} ${sizeKB.padStart(6)} KB  ${lines.length} lines`);
  }
  console.log(`\n  Total: ${wfFiles.length} workflows`);
}

// ─── 4. DOMAIN AUDIT ─────────────────────────────────────────────────────────

function auditDomains() {
  console.log("\n=== 4. DOMAIN QUALITY AUDIT ===\n");
  const domainDirs = fs.readdirSync(DOMAINS_DIR).filter(f => {
    return fs.statSync(path.join(DOMAINS_DIR, f)).isDirectory();
  });
  stats.domains = domainDirs.length;

  for (const domain of domainDirs) {
    const domainPath = path.join(DOMAINS_DIR, domain);
    const domainIssues = [];

    // Check domain.json
    const domainJson = path.join(domainPath, "domain.json");
    if (fs.existsSync(domainJson)) {
      try {
        const config = JSON.parse(fs.readFileSync(domainJson, "utf-8"));
        
        // Validate skill references
        if (config.skills) {
          for (const skill of config.skills) {
            const skillName = typeof skill === "string" ? skill : skill.name || skill;
            const skillPath = path.join(SKILLS_DIR, skillName);
            if (!fs.existsSync(skillPath)) {
              addIssue("domain", domainJson, `References non-existent skill: ${skillName}`);
            }
          }
        }

        // Validate agent references
        if (config.agents) {
          for (const agent of config.agents) {
            const agentFile = path.join(AGENTS_DIR, `${agent}.md`);
            if (!fs.existsSync(agentFile)) {
              addIssue("domain", domainJson, `References non-existent agent: ${agent}`);
            }
          }
        }

        // Validate workflow references
        if (config.workflows) {
          for (const wf of config.workflows) {
            const wfFile = path.join(WORKFLOWS_DIR, `${wf}.md`);
            if (!fs.existsSync(wfFile)) {
              addIssue("domain", domainJson, `References non-existent workflow: ${wf}`);
            }
          }
        }
      } catch (e) {
        addIssue("domain", domainJson, `Invalid JSON: ${e.message}`);
      }
    }

    // Check MCP config
    const mcpConfig = path.join(domainPath, "mcp_config.json");
    if (fs.existsSync(mcpConfig)) {
      try {
        JSON.parse(fs.readFileSync(mcpConfig, "utf-8"));
      } catch (e) {
        addIssue("domain-mcp", mcpConfig, `Invalid MCP JSON: ${e.message}`);
      }
    }

    // Check rules
    const rulesDir = path.join(domainPath, "rules");
    const hasRules = fs.existsSync(rulesDir) && fs.readdirSync(rulesDir).length > 0;

    // Check subdir-markers
    const markersDir = path.join(domainPath, "subdir-markers");
    const hasMarkers = fs.existsSync(markersDir) && fs.readdirSync(markersDir).length > 0;

    const mcpExists = fs.existsSync(mcpConfig) ? "✔ MCP" : "- MCP";
    console.log(`  ✔ ${domain.padEnd(25)} rules: ${hasRules ? "✔" : "-"}  markers: ${hasMarkers ? "✔" : "-"}  ${mcpExists}`);
  }
  console.log(`\n  Total: ${domainDirs.length} domains`);
}

// ─── 5. GLOBAL CONFIG AUDIT ──────────────────────────────────────────────────

function auditGlobal() {
  console.log("\n=== 5. GLOBAL CONFIG AUDIT ===\n");

  // GEMINI.md
  const geminiPath = path.join(GLOBAL_DIR, "GEMINI.md");
  if (fs.existsSync(geminiPath)) {
    const content = fs.readFileSync(geminiPath, "utf-8");
    const sections = content.match(/^## .+$/gm) || [];
    console.log(`  ✔ GEMINI.md — ${sections.length} sections, ${(Buffer.byteLength(content) / 1024).toFixed(1)} KB`);
    for (const s of sections) {
      console.log(`      ${s}`);
    }
  } else {
    addIssue("global", geminiPath, "Missing GEMINI.md");
  }

  // MCP config
  const mcpPath = path.join(GLOBAL_DIR, "mcp_config.json");
  if (fs.existsSync(mcpPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(mcpPath, "utf-8"));
      const servers = Object.keys(config.mcpServers || {});
      console.log(`  ✔ mcp_config.json — ${servers.length} servers: ${servers.join(", ")}`);
    } catch (e) {
      addIssue("global", mcpPath, `Invalid MCP JSON: ${e.message}`);
    }
  } else {
    addWarning("global", mcpPath, "No global mcp_config.json");
  }
}

// ─── 6. DESIGN SYSTEM AUDIT ─────────────────────────────────────────────────

function auditDesignSystem() {
  console.log("\n=== 6. DESIGN SYSTEM AUDIT ===\n");

  const csvFiles = ["personas.csv", "reference-sites.csv", "anti-patterns.csv"];
  for (const csv of csvFiles) {
    const csvPath = path.join(DESIGN_DIR, csv);
    if (fs.existsSync(csvPath)) {
      const content = fs.readFileSync(csvPath, "utf-8");
      const lines = content.split("\n").filter(l => l.trim());
      const dataLines = lines.length - 1; // minus header
      console.log(`  ✔ ${csv.padEnd(25)} ${dataLines} entries`);
      stats[csv.replace(".csv", "")] = dataLines;

      // Check for empty cells in first 2 columns
      let emptyCells = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols.length < 2 || !cols[0].trim() || !cols[1].trim()) {
          emptyCells++;
        }
      }
      if (emptyCells > 0) {
        addWarning("design", csvPath, `${emptyCells} rows with empty key columns`);
      }
    } else {
      addIssue("design", csvPath, `Missing ${csv}`);
    }
  }
}

// ─── 7. RULES AUDIT ─────────────────────────────────────────────────────────

function auditRules() {
  console.log("\n=== 7. SHARED RULES AUDIT ===\n");

  if (!fs.existsSync(RULES_DIR)) {
    addIssue("rules", RULES_DIR, "Missing rules/ directory");
    return;
  }

  const ruleFiles = fs.readdirSync(RULES_DIR).filter(f => f.endsWith(".md"));
  stats.rules = ruleFiles.length;

  for (const file of ruleFiles) {
    const filePath = path.join(RULES_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const sizeKB = (Buffer.byteLength(content) / 1024).toFixed(1);
    
    if (content.trim().length < 100) {
      addWarning("rules", filePath, "Rule file seems too short");
    }

    console.log(`  ✔ ${file.padEnd(35)} ${sizeKB.padStart(6)} KB`);
  }
  console.log(`\n  Total: ${ruleFiles.length} rule files`);
}

// ─── 8. SCRIPTS AUDIT ───────────────────────────────────────────────────────

function auditScripts() {
  console.log("\n=== 8. SHARED SCRIPTS AUDIT ===\n");

  if (!fs.existsSync(SCRIPTS_DIR)) {
    addWarning("scripts", SCRIPTS_DIR, "Missing scripts/ directory");
    return;
  }

  const scriptFiles = fs.readdirSync(SCRIPTS_DIR).filter(f => !f.startsWith("."));
  stats.sharedScripts = scriptFiles.length;

  for (const file of scriptFiles) {
    const filePath = path.join(SCRIPTS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const sizeKB = (Buffer.byteLength(content) / 1024).toFixed(1);
    console.log(`  ✔ ${file.padEnd(35)} ${sizeKB.padStart(6)} KB`);
  }
  console.log(`\n  Total: ${scriptFiles.length} scripts`);
}

// ─── 9. BUILD / PUBLISH AUDIT ────────────────────────────────────────────────

function auditBuild() {
  console.log("\n=== 9. BUILD & PUBLISH AUDIT ===\n");

  // package.json
  const pkgPath = path.join(ROOT, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  // Check files whitelist
  if (pkg.files) {
    console.log(`  ✔ package.json files whitelist: ${pkg.files.join(", ")}`);
    for (const f of pkg.files) {
      const fullPath = path.join(ROOT, f);
      if (!fs.existsSync(fullPath)) {
        addIssue("build", pkgPath, `files entry "${f}" doesn't exist`);
      }
    }
  } else {
    addIssue("build", pkgPath, "No 'files' whitelist in package.json — everything gets published!");
  }

  // Check scripts
  const requiredScripts = ["test", "prepack"];
  for (const script of requiredScripts) {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`  ✔ script "${script}": ${pkg.scripts[script].substring(0, 60)}...`);
    } else {
      addWarning("build", pkgPath, `Missing script: ${script}`);
    }
  }

  // Check prepublishOnly guard
  if (pkg.scripts && pkg.scripts.prepublishOnly) {
    if (pkg.scripts.prepublishOnly.includes(".env")) {
      console.log(`  ✔ prepublishOnly: .env leak guard active`);
    } else {
      addWarning("build", pkgPath, "prepublishOnly doesn't check for .env leaks");
    }
  } else {
    addWarning("build", pkgPath, "No prepublishOnly script — no publish safety net");
  }

  // .npmignore checks
  const npmignorePath = path.join(ROOT, ".npmignore");
  if (fs.existsSync(npmignorePath)) {
    const npmignore = fs.readFileSync(npmignorePath, "utf-8");
    const criticalEntries = [".env", ".agent/", ".agents/", "tools/", ".git/"];
    for (const entry of criticalEntries) {
      if (npmignore.includes(entry)) {
        console.log(`  ✔ .npmignore excludes: ${entry}`);
      } else {
        addWarning("build", npmignorePath, `.npmignore missing: ${entry}`);
      }
    }
  }

  // .gitignore checks
  const gitignorePath = path.join(ROOT, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, "utf-8");
    if (gitignore.includes(".env")) {
      console.log(`  ✔ .gitignore excludes: .env`);
    } else {
      addIssue("build", gitignorePath, ".gitignore doesn't exclude .env!");
    }
  }

  // Check for stale artifacts
  const staleFiles = ["refine-agent-kit-1.0.2.tgz"];
  for (const stale of staleFiles) {
    const stalePath = path.join(ROOT, stale);
    if (fs.existsSync(stalePath)) {
      addWarning("build", stalePath, `Stale artifact found: ${stale} — should be deleted or .gitignored`);
    }
  }
}

// ─── 10. CROSS-REFERENCE AUDIT ──────────────────────────────────────────────

function auditCrossReferences() {
  console.log("\n=== 10. CROSS-REFERENCE AUDIT ===\n");

  // Check ARCHITECTURE.md stats match reality
  const archPath = path.join(SHARED, "ARCHITECTURE.md");
  if (fs.existsSync(archPath)) {
    const arch = fs.readFileSync(archPath, "utf-8");
    
    // Extract claimed counts
    const agentMatch = arch.match(/(\d+)\s*Specialist Agents/);
    const skillMatch = arch.match(/(\d+)\s*Skill Packs/);
    const workflowMatch = arch.match(/(\d+)\s*Workflows/);
    const domainMatch = arch.match(/(\d+)\s*Domain Packs/);
    const mcpMatch = arch.match(/(\d+)\s*MCP Servers/);

    const checks = [
      { name: "Agents", claimed: agentMatch ? parseInt(agentMatch[1]) : "?", actual: stats.agents },
      { name: "Skill Packs", claimed: skillMatch ? parseInt(skillMatch[1]) : "?", actual: stats.skillPacks },
      { name: "Workflows", claimed: workflowMatch ? parseInt(workflowMatch[1]) : "?", actual: stats.workflows },
      { name: "Domains", claimed: domainMatch ? parseInt(domainMatch[1]) : "?", actual: stats.domains },
    ];

    for (const check of checks) {
      const match = check.claimed === check.actual;
      const icon = match ? "✔" : "✘";
      const msg = match ? "" : ` ← MISMATCH! ARCHITECTURE.md says ${check.claimed}`;
      console.log(`  ${icon} ${check.name.padEnd(15)} actual: ${String(check.actual).padStart(3)}${msg}`);
      if (!match) {
        addIssue("cross-ref", archPath, `${check.name}: ARCHITECTURE.md says ${check.claimed} but actual is ${check.actual}`);
      }
    }
  }

  // Check SKILLS_INDEX.md
  const indexPath = path.join(SHARED, "SKILLS_INDEX.md");
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, "utf-8");
    const indexedSkills = indexContent.match(/\|\s*([\w-]+)\s*\|/g) || [];
    console.log(`  ✔ SKILLS_INDEX.md — ${indexedSkills.length} entries`);
  }

  // Check CLI DOMAINS table matches domains/ directory
  const cliPath = path.join(ROOT, "bin", "cli.js");
  if (fs.existsSync(cliPath)) {
    const cliContent = fs.readFileSync(cliPath, "utf-8");
    const cliDomains = cliContent.match(/"([\w-]+)":\s*\{\s*\n\s*label:/g) || [];
    const actualDomains = fs.readdirSync(DOMAINS_DIR).filter(f => 
      fs.statSync(path.join(DOMAINS_DIR, f)).isDirectory()
    );
    
    const cliCount = cliDomains.length;
    const dirCount = actualDomains.length;
    
    if (cliCount === dirCount) {
      console.log(`  ✔ CLI DOMAINS (${cliCount}) matches domains/ dir (${dirCount})`);
    } else {
      addIssue("cross-ref", cliPath, `CLI has ${cliCount} domains but domains/ has ${dirCount}`);
    }
  }
}

// ─── 11. STALE / ORPHAN FILE CHECK ──────────────────────────────────────────

function auditOrphans() {
  console.log("\n=== 11. ORPHAN & STALE FILES ===\n");

  // Check for doc.md in skills (should probably be in a skill dir)
  const docMd = path.join(SKILLS_DIR, "doc.md");
  if (fs.existsSync(docMd)) {
    addWarning("orphan", docMd, "Stray doc.md file in skills/ root — should be inside a skill directory");
    console.log(`  ⚠ ${path.relative(ROOT, docMd)} — stray file`);
  }

  // Check for .tgz files
  const rootFiles = fs.readdirSync(ROOT);
  const tgzFiles = rootFiles.filter(f => f.endsWith(".tgz"));
  if (tgzFiles.length > 0) {
    for (const tgz of tgzFiles) {
      addWarning("orphan", path.join(ROOT, tgz), `Stale npm pack artifact: ${tgz}`);
      console.log(`  ⚠ ${tgz} — stale build artifact`);
    }
  }

  // Check for image files that shouldn't be committed
  const imageFiles = rootFiles.filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));
  if (imageFiles.length > 0) {
    for (const img of imageFiles) {
      addWarning("orphan", path.join(ROOT, img), `Image at root: ${img}`);
      console.log(`  ⚠ ${img} — image at project root`);
    }
  }

  if (tgzFiles.length === 0 && imageFiles.length === 0 && !fs.existsSync(docMd)) {
    console.log("  ✔ No orphan or stale files found");
  }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

console.log("╔══════════════════════════════════════════════════╗");
console.log("║   refine-agent-kit — Deep Quality Audit          ║");
console.log("╚══════════════════════════════════════════════════╝");

auditAgents();
auditSkills();
auditWorkflows();
auditDomains();
auditGlobal();
auditDesignSystem();
auditRules();
auditScripts();
auditBuild();
auditCrossReferences();
auditOrphans();

// ─── REPORT ──────────────────────────────────────────────────────────────────

console.log("\n══════════════════════════════════════════════════");
console.log("                    REPORT");
console.log("══════════════════════════════════════════════════\n");

if (issues.length > 0) {
  console.log(`  🔴 ISSUES (${issues.length}):\n`);
  for (const i of issues) {
    console.log(`    [${i.category}] ${i.file}`);
    console.log(`      → ${i.msg}\n`);
  }
}

if (warnings.length > 0) {
  console.log(`  🟡 WARNINGS (${warnings.length}):\n`);
  for (const w of warnings) {
    console.log(`    [${w.category}] ${w.file}`);
    console.log(`      → ${w.msg}\n`);
  }
}

console.log("  📊 SUMMARY:\n");
console.log(`    Agents:         ${stats.agents}`);
console.log(`    Skill Packs:    ${stats.skillPacks}`);
console.log(`    Skill Modules:  ${stats.skillModules}`);
console.log(`    Skill Scripts:  ${stats.skillScripts}`);
console.log(`    Workflows:      ${stats.workflows}`);
console.log(`    Domains:        ${stats.domains}`);
console.log(`    Rules:          ${stats.rules}`);
console.log(`    Shared Scripts: ${stats.sharedScripts}`);
console.log(`    Issues:         ${issues.length}`);
console.log(`    Warnings:       ${warnings.length}`);
console.log("");

process.exit(issues.length > 0 ? 1 : 0);
