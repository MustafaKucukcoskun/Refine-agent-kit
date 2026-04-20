#!/usr/bin/env node
/**
 * Audit tool: checks for missing skills, orphan skills, missing workflows,
 * and domain JSON consistency.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SHARED = path.join(ROOT, "shared", ".agent");
const DOMAINS_DIR = path.join(SHARED, "domains");
const SKILLS_DIR = path.join(SHARED, "skills");
const AGENTS_DIR = path.join(SHARED, "agents");
const WORKFLOWS_DIR = path.join(SHARED, "workflows");
const DOMAIN_OVERLAYS = path.join(ROOT, "domains");

let issues = 0;

function warn(msg) {
  issues++;
  console.log("  WARNING: " + msg);
}

function isBinaryByExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",
    ".pdf",
    ".zip",
    ".gz",
    ".7z",
    ".tgz",
    ".exe",
    ".dll",
    ".pyc",
  ].includes(ext);
}

// ── 1. Check domain JSON consistency ──
console.log("\n=== DOMAIN JSON AUDIT ===\n");
const domainFiles = fs
  .readdirSync(DOMAINS_DIR)
  .filter((f) => f.endsWith(".json"));

for (const f of domainFiles) {
  const domain = f.replace(".json", "");
  const d = JSON.parse(fs.readFileSync(path.join(DOMAINS_DIR, f), "utf-8"));

  console.log(`[${domain}]`);

  // Check required fields
  if (!d.primary_agent) warn("Missing primary_agent");
  if (!d.supporting_agents)
    warn("Missing supporting_agents (should be [] if none)");
  if (!d.skills) warn("Missing skills object");
  if (!d.workflows) warn("Missing workflows array");
  if (!d.trigger) warn("Missing trigger object");

  // Check skills exist
  const skills = d.skills || {};
  const allSkills = [
    ...(skills.p0 || []),
    ...(skills.p1 || []),
    ...(skills.p2 || []),
  ];
  for (const s of allSkills) {
    const base = s.split("/")[0];
    if (!fs.existsSync(path.join(SKILLS_DIR, base))) {
      warn(`Skill "${s}" not found in shared/.agent/skills/`);
    }
  }

  // Check workflows exist (in shared or domain overlay)
  const workflows = d.workflows || [];
  for (const w of workflows) {
    const wName = w.replace(/^\//, "");
    const inShared = fs.existsSync(path.join(WORKFLOWS_DIR, wName + ".md"));
    const inDomain = fs.existsSync(
      path.join(DOMAIN_OVERLAYS, domain, "workflows", wName + ".md"),
    );
    if (!inShared && !inDomain) {
      warn(`Workflow "${wName}" not found (shared or domain overlay)`);
    }
  }

  // Check primary agent exists
  if (d.primary_agent) {
    const agentFile = path.join(AGENTS_DIR, d.primary_agent + ".md");
    if (!fs.existsSync(agentFile)) {
      warn(`Primary agent "${d.primary_agent}" not found`);
    }
  }

  // Check supporting agents exist
  for (const a of d.supporting_agents || []) {
    const agentFile = path.join(AGENTS_DIR, a + ".md");
    if (!fs.existsSync(agentFile)) {
      warn(`Supporting agent "${a}" not found`);
    }
  }

  // Check rules_file exists
  if (d.rules_file) {
    const rulesPath = path.join(SHARED, d.rules_file);
    if (!fs.existsSync(rulesPath)) {
      warn(`rules_file "${d.rules_file}" not found`);
    }
  }

  // Check domain overlay GEMINI.md exists
  const domainGemini = path.join(DOMAIN_OVERLAYS, domain, "rules", "GEMINI.md");
  if (!fs.existsSync(domainGemini)) {
    warn("Missing domains/" + domain + "/rules/GEMINI.md");
  }

  console.log("");
}

// ── 2. Orphan skills ──
console.log("=== ORPHAN SKILLS (exist but never referenced) ===\n");
const allReferenced = new Set();

// From domain JSONs
for (const f of domainFiles) {
  const d = JSON.parse(fs.readFileSync(path.join(DOMAINS_DIR, f), "utf-8"));
  const skills = d.skills || {};
  [...(skills.p0 || []), ...(skills.p1 || []), ...(skills.p2 || [])].forEach(
    (s) => allReferenced.add(s.split("/")[0]),
  );
}

// Universal skills (from CLI)
const universal = [
  "clean-code",
  "architecture",
  "brainstorming",
  "plan-writing",
  "parallel-agents",
  "behavioral-modes",
  "lint-and-validate",
  "systematic-debugging",
  "code-review-checklist",
  "documentation-templates",
  "deployment-procedures",
  "app-builder",
  "intelligent-routing",
  "context-engineering",
  "mcp-builder",
  "trail-of-bits-security",
];
universal.forEach((s) => allReferenced.add(s));

// From agent frontmatter
for (const f of fs.readdirSync(AGENTS_DIR)) {
  if (!f.endsWith(".md")) continue;
  const content = fs.readFileSync(path.join(AGENTS_DIR, f), "utf-8");
  const match = content.match(/skills:\s*(.+)/);
  if (match) {
    match[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => allReferenced.add(s.split("/")[0]));
  }
}

const orphans = [];
for (const d of fs.readdirSync(SKILLS_DIR)) {
  if (d === "doc.md") continue;
  const p = path.join(SKILLS_DIR, d);
  if (!fs.statSync(p).isDirectory()) continue;
  if (!allReferenced.has(d)) orphans.push(d);
}

if (orphans.length) {
  orphans.forEach((s) => console.log("  ORPHAN: " + s));
} else {
  console.log("  No orphan skills found!");
}

// ── 3. Agent skills check ──
console.log("\n=== AGENT SKILL REFERENCES ===\n");
for (const f of fs.readdirSync(AGENTS_DIR)) {
  if (!f.endsWith(".md")) continue;
  const content = fs.readFileSync(path.join(AGENTS_DIR, f), "utf-8");
  const match = content.match(/skills:\s*(.+)/);
  if (match) {
    const skills = match[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const s of skills) {
      const base = s.split("/")[0];
      if (!fs.existsSync(path.join(SKILLS_DIR, base))) {
        warn(`Agent "${f}" references non-existent skill "${s}"`);
      }
    }
  }
}

// ── 4. Base rule files for @import ──
console.log("\n=== BASE RULE FILES FOR @IMPORT ===\n");
const baseFiles = [
  "base-protocol.md",
  "routing-protocol.md",
  "file-dependency.md",
  "gemini-modes.md",
  "agents-reference.md",
];
for (const bf of baseFiles) {
  const p = path.join(SHARED, "rules", bf);
  if (fs.existsSync(p)) {
    console.log("  OK: " + bf);
  } else {
    warn("MISSING base rule: " + bf);
  }
}

// ── 5. Secret hygiene on tracked files ──
console.log("\n=== TRACKED SECRET HYGIENE ===\n");
const issuesBeforeSecrets = issues;
let trackedFiles = [];
try {
  trackedFiles = execSync("git ls-files", {
    cwd: ROOT,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "ignore"],
  })
    .split(/\r?\n/)
    .filter(Boolean);
} catch {
  console.log("  Skipped: git metadata not available.");
}

if (trackedFiles.length > 0) {
  const trackedEnv = trackedFiles.filter((f) => {
    const base = path.basename(f);
    if (base === ".env.agent.example") return false;
    return base === ".env" || /^\.env\./.test(base);
  });
  if (trackedEnv.length > 0) {
    warn(`Tracked env file(s): ${trackedEnv.join(", ")}`);
  }

  const hardcodedKeyPattern =
    /^\s*(GITHUB_PERSONAL_ACCESS_TOKEN|CONTEXT7_API_KEY|TWENTYFIRST_API_KEY)\s*=\s*([^\s#'"`][^\s#'"`]*)\s*$/m;
  const tokenSignaturePatterns = [
    /github_pat_[A-Za-z0-9_]{20,}/,
    /ghp_[A-Za-z0-9]{20,}/,
    /ctx7sk-[A-Za-z0-9-]{10,}/,
  ];

  for (const rel of trackedFiles) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full) || isBinaryByExtension(full)) continue;
    let content;
    try {
      content = fs.readFileSync(full, "utf-8");
    } catch {
      continue;
    }
    const hasHardcodedKey = hardcodedKeyPattern.test(content);
    const hasTokenSignature = tokenSignaturePatterns.some((p) =>
      p.test(content),
    );
    if (hasHardcodedKey || hasTokenSignature) {
      warn(`Potential hardcoded secret in tracked file: ${rel}`);
    }
  }

  if (issues === issuesBeforeSecrets) {
    console.log("  No tracked env or hardcoded key patterns found.");
  }
}

// ── 6. Anthropic Agent Skills spec validation ──
// Reference: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
console.log("\n=== ANTHROPIC SKILL SPEC VALIDATION ===\n");

const NAME_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
const RESERVED_WORDS = ["anthropic", "claude"];
const BAD_VOICE_RE = /\b(I can|I will|I'll|you can|you should|we'll|we will|let me|let's)\b/i;
const DESCRIPTION_MAX = 1024;
const BODY_SOFT_LIMIT = 500;

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { fm, bodyStart: m[0].length };
}

let specIssues = 0;
function specWarn(file, msg) {
  specIssues++;
  issues++;
  console.log(`  SPEC: ${file}: ${msg}`);
}

const skillDirs = fs
  .readdirSync(SKILLS_DIR)
  .filter((d) => {
    try {
      return fs.statSync(path.join(SKILLS_DIR, d)).isDirectory();
    } catch {
      return false;
    }
  });

for (const dir of skillDirs) {
  const skillPath = path.join(SKILLS_DIR, dir, "SKILL.md");
  if (!fs.existsSync(skillPath)) continue;

  const content = fs.readFileSync(skillPath, "utf-8");
  const parsed = parseFrontmatter(content);
  const rel = `skills/${dir}/SKILL.md`;

  if (!parsed) {
    specWarn(rel, "missing YAML frontmatter");
    continue;
  }

  const { fm, bodyStart } = parsed;

  if (!fm.name) {
    specWarn(rel, "frontmatter missing `name`");
  } else if (!NAME_RE.test(fm.name)) {
    specWarn(rel, `name "${fm.name}" must match /^[a-z0-9][a-z0-9-]{0,63}$/`);
  } else if (RESERVED_WORDS.some((w) => fm.name.toLowerCase().includes(w))) {
    specWarn(rel, `name "${fm.name}" contains reserved word (anthropic/claude)`);
  }

  if (!fm.description) {
    specWarn(rel, "frontmatter missing `description`");
  } else {
    if (fm.description.length > DESCRIPTION_MAX) {
      specWarn(rel, `description ${fm.description.length} > ${DESCRIPTION_MAX} chars`);
    }
    if (BAD_VOICE_RE.test(fm.description)) {
      specWarn(rel, `description uses first/second person — prefer third person ("${fm.description.match(BAD_VOICE_RE)[0]}")`);
    }
  }

  if (!fm["allowed-tools"]) {
    specWarn(rel, "frontmatter missing `allowed-tools`");
  }

  const body = content.slice(bodyStart);
  const bodyLines = body.split(/\r?\n/).length;
  if (bodyLines > BODY_SOFT_LIMIT) {
    specWarn(rel, `body ${bodyLines} lines > soft limit ${BODY_SOFT_LIMIT} — consider splitting into references/`);
  }

  // Only flag backslash paths in markdown links, not code blocks
  const bodyWithoutCode = body.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
  if (/\]\([^)]*\\[^)]*\)/.test(bodyWithoutCode)) {
    specWarn(rel, "backslash in markdown link path — use forward slashes");
  }
}

if (specIssues === 0) {
  console.log("  OK: all skills pass Anthropic spec validation");
}

// ── 7. Summary ──
console.log("\n=== SUMMARY ===\n");
console.log(`  Domains: ${domainFiles.length}`);
console.log(
  `  Skills: ${
    fs.readdirSync(SKILLS_DIR).filter((d) => {
      try {
        return fs.statSync(path.join(SKILLS_DIR, d)).isDirectory();
      } catch {
        return false;
      }
    }).length
  }`,
);
console.log(
  `  Agents: ${fs.readdirSync(AGENTS_DIR).filter((f) => f.endsWith(".md")).length}`,
);
console.log(
  `  Workflows (shared): ${fs.readdirSync(WORKFLOWS_DIR).filter((f) => f.endsWith(".md")).length}`,
);
console.log(`  Orphan skills: ${orphans.length}`);
console.log(`  Total issues: ${issues}`);
console.log("");

process.exit(issues > 0 ? 1 : 0);
