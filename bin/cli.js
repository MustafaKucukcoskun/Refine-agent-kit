#!/usr/bin/env node

/**
 * refine-kit CLI
 * AI Agent toolkit installer for Google Antigravity IDE.
 * Global rules → ~/.gemini/ | Project files → .agent/
 * Zero dependencies — Node.js native modules only.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const os = require("os");
const { getInventory } = require("./inventory");

// ── Constants ──────────────────────────────────────────────────────────────

const PACKAGE_ROOT = path.resolve(__dirname, "..");
const { version: VERSION } = JSON.parse(
  fs.readFileSync(path.join(PACKAGE_ROOT, "package.json"), "utf-8"),
);
const INVENTORY = getInventory(PACKAGE_ROOT);
const HOME_DIR = os.homedir();
const GEMINI_DIR = path.join(HOME_DIR, ".gemini");
const ANTIGRAVITY_DIR = path.join(GEMINI_DIR, "antigravity");

const DOMAINS = {
  "next-web": {
    label: "Next.js Full-Stack Web",
    description: "Next.js + React + Tailwind + shadcn + Supabase",
    mcpExtra: ["shadcn", "magic-ui", "21st-dev-magic", "figma", "supabase"],
    envKeys: ["TWENTYFIRST_API_KEY"],
  },
  "python-backend": {
    label: "Python Backend (FastAPI/Django)",
    description: "FastAPI + PostgreSQL + SQLAlchemy + Pytest",
    mcpExtra: ["postman"],
    envKeys: [],
  },
  "python-ml": {
    label: "Python ML / Image Processing",
    description: "PyTorch + OpenCV + NumPy + scikit-learn",
    mcpExtra: [],
    envKeys: [],
  },
  "python-data": {
    label: "Python Data Science",
    description: "Pandas + Polars + DuckDB + scikit-learn + matplotlib",
    mcpExtra: [],
    envKeys: [],
  },
  "mobile-flutter": {
    label: "Flutter Mobile App",
    description: "Flutter 3.x + Dart 3 + Material Design 3 + Riverpod",
    mcpExtra: [],
    envKeys: [],
  },
  "mobile-rn": {
    label: "React Native App",
    description: "React Native 0.76+ + Expo + TypeScript + NativeWind",
    mcpExtra: [],
    envKeys: [],
  },
  "electron-desktop": {
    label: "Electron Desktop App",
    description: "Electron 30+ + Node.js + Chromium + IPC",
    mcpExtra: [],
    envKeys: [],
  },
  "chrome-extension": {
    label: "Chrome Extension (Manifest V3)",
    description: "Manifest V3 + Chrome APIs + Service Worker",
    mcpExtra: [],
    envKeys: [],
  },
  "cli-tool": {
    label: "CLI Tool (Node.js/Python)",
    description: "commander/yargs (Node) or Click/Typer (Python)",
    mcpExtra: [],
    envKeys: [],
  },
  "csharp-backend": {
    label: "C# Backend (.NET)",
    description: "ASP.NET Core + Entity Framework Core + C# 13",
    mcpExtra: [],
    envKeys: [],
  },
  "godot-game": {
    label: "Godot Game",
    description: "Godot 4.x + GDScript + 2D/3D Game Development",
    mcpExtra: [],
    envKeys: [],
  },
  "unity-game": {
    label: "Unity Game",
    description: "Unity 2023+ + C# + URP + 3D/2D Game Development",
    mcpExtra: [],
    envKeys: [],
  },
  "phaser-game": {
    label: "Phaser Web Game",
    description: "Phaser 3.x + TypeScript + HTML5 Canvas",
    mcpExtra: [],
    envKeys: [],
  },
};

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

// ── Helpers ────────────────────────────────────────────────────────────────

function printBanner() {
  console.log("");
  console.log(c("cyan", "  ╔═══════════════════════════════════════════════╗"));
  console.log(
    c("cyan", "  ║") +
      c("bold", "   refine-kit ") +
      c("dim", `v${VERSION}`) +
      c("cyan", "                            ║"),
  );
  console.log(
    c("cyan", "  ║") +
      c("dim", "   AI Agent Toolkit for Google Antigravity IDE") +
      c("cyan", "  ║"),
  );
  console.log(c("cyan", "  ╚═══════════════════════════════════════════════╝"));
  console.log("");
}

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function copyRecursive(src, dest, exclude = [], overwrite = true) {
  let count = 0;
  if (!fs.existsSync(src)) return count;

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    const dirName = path.basename(src);
    if (exclude.includes(dirName)) return count;

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const item of fs.readdirSync(src)) {
      if (exclude.includes(item)) continue;
      count += copyRecursive(
        path.join(src, item),
        path.join(dest, item),
        exclude,
        overwrite
      );
    }
  } else {
    const fileName = path.basename(src);
    if (exclude.includes(fileName)) return count;

    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    if (!overwrite && fs.existsSync(dest)) {
      return count;
    }
    fs.copyFileSync(src, dest);
    count++;
  }
  return count;
}

// Default agent directory name (.agents for Antigravity 2.0+, .agent auto-detected for backward compat)
const DEFAULT_AGENT_DIR_NAME = ".agents";

/**
 * Resolve the agent directory path.
 * Priority: --agents-dir flag > existing directory auto-detect > default (.agent)
 *
 * For init: uses flag or default (creates new directory)
 * For list/update/add-domain: detects which directory exists, prefers metadata
 */
function resolveAgentDir(targetDir, args, mode = "detect") {
  // Explicit flag takes priority
  if (args["agents-dir"]) {
    const name = args["agents-dir"];
    if (name !== ".agent" && name !== ".agents") {
      console.log(
        c("red", "  ✖ ") +
          `Invalid --agents-dir value: ${name}. Use ".agent" or ".agents".`,
      );
      process.exit(1);
    }
    return path.join(targetDir, name);
  }

  // For init: default to .agent unless .agents already exists
  if (mode === "init") {
    const agentsPlural = path.join(targetDir, ".agents");
    if (fs.existsSync(agentsPlural)) return agentsPlural;
    return path.join(targetDir, DEFAULT_AGENT_DIR_NAME);
  }

  // For detect (list/update/add-domain): find existing directory
  const agentSingular = path.join(targetDir, ".agent");
  const agentsPlural = path.join(targetDir, ".agents");

  // Check metadata first (most reliable)
  for (const dir of [agentSingular, agentsPlural]) {
    const metaPath = path.join(dir, ".refine-kit.json");
    if (fs.existsSync(metaPath)) return dir;
  }

  // Fallback: whichever exists
  if (fs.existsSync(agentSingular)) return agentSingular;
  if (fs.existsSync(agentsPlural)) return agentsPlural;

  // Neither exists — return default
  return path.join(targetDir, DEFAULT_AGENT_DIR_NAME);
}

function countFiles(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return count;
  const stat = fs.statSync(dir);
  if (stat.isDirectory()) {
    for (const item of fs.readdirSync(dir)) {
      count += countFiles(path.join(dir, item));
    }
  } else {
    count++;
  }
  return count;
}

function mergeJson(existing, incoming) {
  const result = JSON.parse(JSON.stringify(existing));
  for (const [key, value] of Object.entries(incoming)) {
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      value !== null &&
      result[key] &&
      typeof result[key] === "object"
    ) {
      result[key] = mergeJson(result[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// ── Global Install ─────────────────────────────────────────────────────────

function installGlobal(force, quiet) {
  if (!quiet)
    console.log(
      c("blue", "  ⟳ ") + "Installing global rules to ~/.gemini/ ...",
    );

  // Ensure directories exist
  if (!fs.existsSync(GEMINI_DIR)) fs.mkdirSync(GEMINI_DIR, { recursive: true });
  if (!fs.existsSync(ANTIGRAVITY_DIR))
    fs.mkdirSync(ANTIGRAVITY_DIR, { recursive: true });

  // ── GEMINI.md (global code quality rules) ──
  const globalGeminiSrc = path.join(PACKAGE_ROOT, "global", "GEMINI.md");
  const globalGeminiDest = path.join(GEMINI_DIR, "GEMINI.md");

  if (fs.existsSync(globalGeminiDest) && !force) {
    // Check if our content is already there
    const existing = fs.readFileSync(globalGeminiDest, "utf-8");
    if (
      existing.includes("refine-agent-kit") ||
      existing.includes("Anti-AI Slop")
    ) {
      if (!quiet)
        console.log(
          c("dim", "  ⊘ ") +
            "Global GEMINI.md already contains refine-kit rules (skip)",
        );
    } else {
      // Append our rules
      const ourRules = fs.readFileSync(globalGeminiSrc, "utf-8");
      const separator = "\n\n---\n\n<!-- refine-agent-kit global rules -->\n\n";
      fs.writeFileSync(
        globalGeminiDest,
        existing + separator + ourRules,
        "utf-8",
      );
      if (!quiet)
        console.log(
          c("green", "  ✔ ") +
            "Global GEMINI.md updated (appended refine-kit rules)",
        );
    }
  } else {
    fs.copyFileSync(globalGeminiSrc, globalGeminiDest);
    if (!quiet) console.log(c("green", "  ✔ ") + "Global GEMINI.md installed");
  }

  // ── MCP config (global servers) ──
  // Always merge — never overwrite. The user's own MCP servers must be
  // preserved even when --force is passed (force is for updates, not for
  // destroying user config).
  const globalMcpSrc = path.join(PACKAGE_ROOT, "global", "mcp_config.json");
  const globalMcpDest = path.join(ANTIGRAVITY_DIR, "mcp_config.json");

  if (fs.existsSync(globalMcpDest)) {
    try {
      const existing = JSON.parse(fs.readFileSync(globalMcpDest, "utf-8"));
      const incoming = JSON.parse(fs.readFileSync(globalMcpSrc, "utf-8"));
      const merged = mergeJson(existing, incoming);
      fs.writeFileSync(
        globalMcpDest,
        JSON.stringify(merged, null, 4) + "\n",
        "utf-8",
      );
      if (!quiet)
        console.log(
          c("green", "  ✔ ") +
            "Global MCP config merged (existing servers preserved)",
        );
    } catch {
      // Existing config is malformed — back it up, then write fresh
      const backupPath = globalMcpDest + ".bak";
      try {
        fs.copyFileSync(globalMcpDest, backupPath);
        if (!quiet)
          console.log(
            c("yellow", "  ⚠ ") +
              `Existing MCP config was malformed, backed up to ${backupPath}`,
          );
      } catch {}
      fs.copyFileSync(globalMcpSrc, globalMcpDest);
      if (!quiet)
        console.log(c("green", "  ✔ ") + "Global MCP config installed");
    }
  } else {
    if (!fs.existsSync(path.dirname(globalMcpDest))) {
      fs.mkdirSync(path.dirname(globalMcpDest), { recursive: true });
    }
    fs.copyFileSync(globalMcpSrc, globalMcpDest);
    if (!quiet) console.log(c("green", "  ✔ ") + "Global MCP config installed");
  }

  return true;
}

// ── Domain MCP → Global Merge ──────────────────────────────────────────────
//
// Antigravity reads MCP servers ONLY from ~/.gemini/antigravity/mcp_config.json
// — per-workspace mcp_config.json files are NOT loaded. So when a user installs
// a domain with extra MCP servers (e.g. next-web ships shadcn/figma/supabase),
// we must merge those servers into the global config or they'll never activate.
// The file is still also copied to .agent/ for reference and potential future
// per-workspace support.

function mergeDomainMcpToGlobal(domain, quiet) {
  const domainSrc = path.join(PACKAGE_ROOT, "domains", domain);
  const domainMcpSrc = path.join(domainSrc, "mcp_config.json");
  if (!fs.existsSync(domainMcpSrc)) return false;

  const globalMcpDest = path.join(ANTIGRAVITY_DIR, "mcp_config.json");
  if (!fs.existsSync(ANTIGRAVITY_DIR)) {
    fs.mkdirSync(ANTIGRAVITY_DIR, { recursive: true });
  }

  let incoming;
  try {
    incoming = JSON.parse(fs.readFileSync(domainMcpSrc, "utf-8"));
  } catch (err) {
    console.warn(
      c("yellow", "  ⚠ ") + `Domain MCP config malformed, skipping merge: ${err.message}`,
    );
    return false;
  }

  let existing = { mcpServers: {} };
  if (fs.existsSync(globalMcpDest)) {
    try {
      existing = JSON.parse(fs.readFileSync(globalMcpDest, "utf-8"));
    } catch {
      // Corrupt global config — overwrite with incoming rather than crash
      existing = { mcpServers: {} };
    }
  }

  const merged = mergeJson(existing, incoming);
  fs.writeFileSync(
    globalMcpDest,
    JSON.stringify(merged, null, 4) + "\n",
    "utf-8",
  );

  const serverNames = Object.keys(incoming.mcpServers || {});
  if (!quiet && serverNames.length > 0) {
    console.log(
      c("green", "  ✔ ") +
        `Domain MCP servers merged into global config: ${serverNames.join(", ")}`,
    );
  }
  return true;
}

// ── ENV Template ───────────────────────────────────────────────────────────

function createEnvTemplate(targetDir, domain) {
  const envPath = path.join(targetDir, ".env.agent.example");

  let content = `# refine-kit Environment Variables
# Copy this to .env and add your API keys
# Antigravity reads these automatically via $VAR_NAME expansion
#
# ⚠️ ALL KEYS ARE OPTIONAL — The system works without any MCP servers.
#    Add keys only for the MCP tools you want to use.

# ── Recommended (improves quality but not required) ──

# Context7 API Key — reduces API hallucinations via real-time library docs
# Get from: https://context7.com
# CONTEXT7_API_KEY=

# ── Optional: Add only if you use these MCP servers ──

# GitHub Personal Access Token — remote repo operations via GitHub MCP
# Not needed if you use local git. System falls back to git CLI automatically.
# Get from: https://github.com/settings/tokens (select repo, read:org scopes)
# GITHUB_PERSONAL_ACCESS_TOKEN=
`;

  if (domain === "next-web") {
    content += `
# ── next-web Domain (optional) ──

# 21st.dev Magic API Key — AI-powered production-ready component generation
# Get from: https://21st.dev/settings/api
# TWENTYFIRST_API_KEY=

# Figma — uses OAuth (no manual token needed, browser login)
# Supabase — uses OAuth (no manual token needed, browser login)
# shadcn — no API key needed
# magic-ui — no API key needed
`;
  }

  if (domain === "godot-game") {
    content += `
# ── godot-game Domain (optional) ──

# Godot Editor path (for godot-mcp server)
# GODOT_PATH=C:\\Godot\\Godot_v4.x-stable_win64.exe
`;
  }

  fs.writeFileSync(envPath, content, "utf-8");
}

// ── Commands ───────────────────────────────────────────────────────────────

async function cmdInit(args) {
  const targetDir = args.path || process.cwd();
  const force = args.force || false;
  const quiet = args.quiet || false;
  const skipPrompts = args.yes || false;
  const domainArg = args.domain || null;
  const skipGlobal = args["skip-global"] || false;

  if (!quiet && !args.suppressBanner) printBanner();

  // ── Step 1: Global install ──
  if (!skipGlobal) {
    installGlobal(force, quiet);
    if (!quiet) console.log("");
  }

  // ── Step 2: Domain selection ──
  let domain = domainArg;

  if (!domain && !skipPrompts) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(c("yellow", "  ? ") + "Select your project domain:\n");
    const domainKeys = Object.keys(DOMAINS);
    domainKeys.forEach((key, i) => {
      const d = DOMAINS[key];
      console.log(c("bold", `    ${i + 1}. ${d.label}`));
      console.log(c("dim", `       ${d.description}`));
      console.log(c("dim", `       MCP: ${d.mcpExtra.join(", ")}`));
      console.log("");
    });

    const answer = await ask(rl, c("yellow", "  ? ") + "Enter number: ");
    rl.close();

    const idx = parseInt(answer.trim()) - 1;
    if (idx >= 0 && idx < domainKeys.length) {
      domain = domainKeys[idx];
    }
  }

  if (!domain) {
    console.log(c("red", "  ✖ ") + "No domain selected. Use --domain <name>");
    process.exit(1);
  }

  if (!DOMAINS[domain]) {
    console.log(c("red", "  ✖ ") + `Unknown domain: ${domain}`);
    console.log(c("dim", "    Available: " + Object.keys(DOMAINS).join(", ")));
    process.exit(1);
  }

  // ── Step 3: Check existing agent directory ──
  const agentDir = resolveAgentDir(targetDir, args, "init");
  const agentDirName = path.basename(agentDir);
  if (fs.existsSync(agentDir) && !force) {
    console.log(
      c("red", "  ✖ ") + `${agentDirName}/ already exists in ${targetDir}`,
    );
    console.log(c("dim", "    Use --force to overwrite."));
    process.exit(1);
  }

  // ── Step 4: Copy shared base + domain-specific files (FILTERED) ──
  const sharedAgentSrc = path.join(PACKAGE_ROOT, "shared", ".agent");
  const domainSrc = path.join(PACKAGE_ROOT, "domains", domain);

  if (!quiet)
    console.log(
      c("blue", "  ⟳ ") +
        `Installing ${c("bold", DOMAINS[domain].label)} domain...`,
    );

  // ── Load domain config to determine what to install ──
  const domainConfigPath = path.join(
    sharedAgentSrc,
    "domains",
    `${domain}.json`,
  );
  const domainConfig = fs.existsSync(domainConfigPath)
    ? JSON.parse(fs.readFileSync(domainConfigPath, "utf-8"))
    : null;

  // Collect domain-specific skills from domain JSON (p0, p1, p2)
  const domainSkills = new Set();
  if (domainConfig && domainConfig.skills) {
    for (const tier of Object.values(domainConfig.skills)) {
      for (const skill of tier || []) {
        domainSkills.add(skill);
      }
    }
  }

  // Collect skills required by universal agents (orchestrator, debugger, etc.)
  // These agents work in every domain, so their skills must be available.
  const universalAgentSkills = new Set([
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
    "error-handling-patterns",
    "async-javascript-patterns",
    "cache-strategy-patterns",
    "observability-patterns",
  ]);

  // Collect skills from domain primary + supporting agents' frontmatter
  const domainAgents = new Set();
  if (domainConfig) {
    if (domainConfig.primary_agent)
      domainAgents.add(domainConfig.primary_agent);
    for (const a of domainConfig.supporting_agents || []) domainAgents.add(a);
  }
  const agentSkillsDir = path.join(sharedAgentSrc, "agents");
  if (fs.existsSync(agentSkillsDir)) {
    for (const agentName of domainAgents) {
      const agentFile = path.join(agentSkillsDir, `${agentName}.md`);
      if (fs.existsSync(agentFile)) {
        const content = fs.readFileSync(agentFile, "utf-8");
        const fmMatch = content.match(/^---[\s\S]*?^---/m);
        if (fmMatch) {
          const skillMatch = fmMatch[0].match(/skills:\s*(.+)/);
          if (skillMatch) {
            skillMatch[1]
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .forEach((s) => domainSkills.add(s));
          }
        }
      }
    }
  }

  // Merge: domain skills + universal agent skills = total skills to install
  const allowedSkills = new Set([...domainSkills, ...universalAgentSkills]);

  // Domain workflows from JSON
  const domainWorkflowNames = new Set();
  if (domainConfig && domainConfig.workflows) {
    for (const w of domainConfig.workflows) {
      domainWorkflowNames.add(w.replace(/^\//, "")); // strip leading /
    }
  }
  // Universal workflows available to all domains
  const universalWorkflows = new Set([
    "plan",
    "debug",
    "status",
    "brainstorm",
    "code-review",
    "deploy",
    "verify",
    "orchestrate",
    "refactor-clean",
    "security-review",
    "test",
    "tdd",
    "enhance",
    "onboard",
  ]);
  const allowedWorkflows = new Set([
    ...domainWorkflowNames,
    ...universalWorkflows,
  ]);

  let totalCount = 0;

  // ── 4a: Copy ARCHITECTURE.md + doc files (root-level .agent files) ──
  const rootFiles = fs
    .readdirSync(sharedAgentSrc)
    .filter(
      (f) =>
        !fs.statSync(path.join(sharedAgentSrc, f)).isDirectory() &&
        f !== "doc.md",
    );
  for (const f of rootFiles) {
    const destPath = path.join(agentDir, f);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(path.join(sharedAgentSrc, f), destPath);
    totalCount++;
  }

  // ── 4b: Copy agents/ (all agents — they're small and universal agents are needed) ──
  const agentsSrc = path.join(sharedAgentSrc, "agents");
  if (fs.existsSync(agentsSrc)) {
    totalCount += copyRecursive(agentsSrc, path.join(agentDir, "agents"));
  }

  // ── 4c: Copy skills/ (FILTERED by domain) ──
  const skillsSrc = path.join(sharedAgentSrc, "skills");
  if (fs.existsSync(skillsSrc)) {
    // Copy doc.md if it exists
    const skillDocSrc = path.join(skillsSrc, "doc.md");
    if (fs.existsSync(skillDocSrc)) {
      const skillsDestDir = path.join(agentDir, "skills");
      if (!fs.existsSync(skillsDestDir))
        fs.mkdirSync(skillsDestDir, { recursive: true });
      fs.copyFileSync(skillDocSrc, path.join(skillsDestDir, "doc.md"));
      totalCount++;
    }

    // Copy only allowed skill folders
    for (const skillDir of fs.readdirSync(skillsSrc)) {
      const skillPath = path.join(skillsSrc, skillDir);
      if (!fs.statSync(skillPath).isDirectory()) continue;

      // Check if this skill or any of its sub-skills are allowed
      const isAllowed =
        allowedSkills.has(skillDir) ||
        [...allowedSkills].some((s) => s.startsWith(skillDir + "/"));

      if (isAllowed) {
        totalCount += copyRecursive(
          skillPath,
          path.join(agentDir, "skills", skillDir),
        );
      }
    }
  }

  // ── 4d: Copy workflows/ (FILTERED by domain) ──
  const workflowsSrc = path.join(sharedAgentSrc, "workflows");
  if (fs.existsSync(workflowsSrc)) {
    const workflowsDest = path.join(agentDir, "workflows");
    if (!fs.existsSync(workflowsDest))
      fs.mkdirSync(workflowsDest, { recursive: true });
    for (const wf of fs.readdirSync(workflowsSrc)) {
      const wfName = wf.replace(/\.md$/, "");
      if (allowedWorkflows.has(wfName)) {
        fs.copyFileSync(
          path.join(workflowsSrc, wf),
          path.join(workflowsDest, wf),
        );
        totalCount++;
      }
    }
  }

  // ── 4e: Copy scripts/ (all — utility scripts are universal) ──
  const scriptsSrc = path.join(sharedAgentSrc, "scripts");
  if (fs.existsSync(scriptsSrc)) {
    totalCount += copyRecursive(scriptsSrc, path.join(agentDir, "scripts"));
  }

  // ── 4e2: Copy memory/ (Memory System templates) ──
  const memorySrc = path.join(sharedAgentSrc, "memory");
  if (fs.existsSync(memorySrc)) {
    totalCount += copyRecursive(memorySrc, path.join(agentDir, "memory"), [], false);
  }

  // ── 4f: Copy rules/ (base rules + only selected domain rules) ──
  const rulesSrc = path.join(sharedAgentSrc, "rules");
  if (fs.existsSync(rulesSrc)) {
    const rulesDest = path.join(agentDir, "rules");
    if (!fs.existsSync(rulesDest)) fs.mkdirSync(rulesDest, { recursive: true });
    // Copy base rule files (non-directory files)
    for (const f of fs.readdirSync(rulesSrc)) {
      const fp = path.join(rulesSrc, f);
      if (!fs.statSync(fp).isDirectory()) {
        fs.copyFileSync(fp, path.join(rulesDest, f));
        totalCount++;
      }
    }
    // Copy only the selected domain's rules file
    const domainRulesDir = path.join(rulesSrc, "domains");
    if (fs.existsSync(domainRulesDir)) {
      const domainRuleFile = `${domain}-rules.md`;
      const drSrc = path.join(domainRulesDir, domainRuleFile);
      if (fs.existsSync(drSrc)) {
        const drDest = path.join(rulesDest, "domains");
        if (!fs.existsSync(drDest)) fs.mkdirSync(drDest, { recursive: true });
        fs.copyFileSync(drSrc, path.join(drDest, domainRuleFile));
        totalCount++;
      }
    }
  }

  // ── 4g: Copy only selected domain JSON (not all 13) ──
  if (fs.existsSync(domainConfigPath)) {
    const domainsDest = path.join(agentDir, "domains");
    if (!fs.existsSync(domainsDest))
      fs.mkdirSync(domainsDest, { recursive: true });
    fs.copyFileSync(domainConfigPath, path.join(domainsDest, `${domain}.json`));
    totalCount++;
  }

  if (!quiet)
    console.log(
      c("green", "  ✔ ") +
        `${totalCount} files installed (${allowedSkills.size} skills, domain-filtered)`,
    );

  // Overlay domain-specific rules/GEMINI.md
  const domainRulesSrc = path.join(domainSrc, "rules", "GEMINI.md");
  const domainRulesDest = path.join(agentDir, "rules", "GEMINI.md");
  if (fs.existsSync(domainRulesSrc)) {
    const rulesDir = path.dirname(domainRulesDest);
    if (!fs.existsSync(rulesDir)) fs.mkdirSync(rulesDir, { recursive: true });
    fs.copyFileSync(domainRulesSrc, domainRulesDest);
    if (!quiet) console.log(c("green", "  ✔ ") + `Domain rules: ${domain}`);
  }

  // Copy domain-specific MCP config (for reference — Antigravity doesn't read
  // per-workspace configs, but keeping it helps users see what was installed)
  const domainMcpSrc = path.join(domainSrc, "mcp_config.json");
  const domainMcpDest = path.join(agentDir, "mcp_config.json");
  if (fs.existsSync(domainMcpSrc)) {
    fs.copyFileSync(domainMcpSrc, domainMcpDest);
    if (!quiet)
      console.log(
        c("green", "  ✔ ") +
          `Domain MCP config (reference): ${DOMAINS[domain].mcpExtra.join(", ")}`,
      );
  }

  // Merge domain MCP into the global Antigravity config (the one Antigravity
  // actually reads). Skip if user passed --skip-global.
  if (!args["skip-global"] && fs.existsSync(domainMcpSrc)) {
    mergeDomainMcpToGlobal(domain, quiet);
  }

  // Overlay domain-specific workflows (adds/replaces shared workflows)
  const domainWorkflowsSrc = path.join(domainSrc, "workflows");
  if (fs.existsSync(domainWorkflowsSrc)) {
    const workflowsDest = path.join(agentDir, "workflows");
    const wfCount = copyRecursive(domainWorkflowsSrc, workflowsDest);
    if (!quiet && wfCount > 0)
      console.log(
        c("green", "  ✔ ") + `${wfCount} domain-specific workflow(s)`,
      );
  }

  // Overlay domain-specific scripts (adds/replaces shared scripts)
  const domainScriptsSrc = path.join(domainSrc, "scripts");
  if (fs.existsSync(domainScriptsSrc)) {
    const scriptsDest = path.join(agentDir, "scripts");
    const scCount = copyRecursive(domainScriptsSrc, scriptsDest);
    if (!quiet && scCount > 0)
      console.log(c("green", "  ✔ ") + `${scCount} domain-specific script(s)`);
  }

  // ── 4h: Copy .shared/ assets (design-system, ui-ux-pro-max data) ──
  const NON_UI_DOMAINS = new Set([
    "csharp-backend",
    "python-backend",
    "python-data",
    "python-ml",
    "godot-game",
    "unity-game",
    "phaser-game",
    "cli-tool",
  ]);

  const sharedAssetsSrc = path.join(sharedAgentSrc, ".shared");
  if (fs.existsSync(sharedAssetsSrc) && !NON_UI_DOMAINS.has(domain)) {
    const sharedCount = copyRecursive(
      sharedAssetsSrc,
      path.join(agentDir, ".shared"),
      ["__pycache__"],
    );
    totalCount += sharedCount;
    if (!quiet)
      console.log(
        c("green", "  ✔ ") + `${sharedCount} design system & asset files`,
      );
  } else if (!quiet && NON_UI_DOMAINS.has(domain)) {
    console.log(c("dim", "  ⊘ ") + "Design system skipped (not a UI domain)");
  }

  // ── Step 5: Create env template ──
  createEnvTemplate(targetDir, domain);
  if (!quiet) console.log(c("green", "  ✔ ") + ".env.agent.example created");

  // ── Step 5b: Write metadata for list/update ──
  const metaPath = path.join(agentDir, ".refine-kit.json");
  fs.writeFileSync(
    metaPath,
    JSON.stringify(
      {
        version: VERSION,
        domain: domain,
        agentDirName: path.basename(agentDir),
        installedAt: new Date().toISOString().split("T")[0],
      },
      null,
      2,
    ) + "\n",
    "utf-8",
  );

  // ── Step 6: Summary ──
  if (!quiet) {
    const agentMds = fs.existsSync(path.join(agentDir, "agents"))
      ? fs
          .readdirSync(path.join(agentDir, "agents"))
          .filter((f) => f.endsWith(".md")).length
      : 0;
    const totalFiles = countFiles(agentDir);
    const d = DOMAINS[domain];

    console.log("");
    console.log(
      c("green", "  ── Installation Complete ──────────────────────"),
    );
    console.log("");
    console.log(`    Domain:  ${c("bold", d.label)}`);
    console.log(
      `    Agents:  ${c("bold", String(agentMds))}     Files: ${c("bold", String(totalFiles))}`,
    );
    if (d.mcpExtra.length > 0) {
      console.log(`    MCP:     ${c("bold", d.mcpExtra.join(", "))}`);
    }
    console.log("");
    console.log(c("dim", "    Global:  ~/.gemini/GEMINI.md"));
    console.log(c("dim", "    Global:  ~/.gemini/antigravity/mcp_config.json"));
    console.log(c("dim", `    Local:   ${agentDirName}/`));
    console.log("");

    console.log(c("yellow", "\n  Next steps:"));
    console.log(
      c("dim", "    1.") +
        " " +
        c("bold", "Open project in Google Antigravity") +
        " — agents activate automatically!",
    );
    console.log(
      c("dim", "    2.") +
        " Optional: Copy " +
        c("bold", ".env.agent.example") +
        " → " +
        c("bold", ".env") +
        " and add API keys for MCP tools",
    );
    console.log(
      c("dim", "       ") +
        c("dim", "All keys are optional. System works without any MCP servers."),
    );

    if (d.mcpExtra.length > 0) {
      console.log(
        c("dim", "    3.") +
          " If using MCP tools: " +
          c("yellow", "Restart Antigravity IDE") +
          " to activate them",
      );
    }

    console.log("");
  }
}

async function cmdAddDomain(args) {
  const targetDir = args.path || process.cwd();
  const quiet = args.quiet || false;
  const domainArg = args.domain || null;
  const subdir = args.subdir || null;

  if (!quiet) printBanner();

  let domain = domainArg;

  if (!domain) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.log(c("yellow", "  ? ") + "Select domain for this subdirectory:\n");
    const domainKeys = Object.keys(DOMAINS);
    domainKeys.forEach((key, i) => {
      console.log(c("bold", `    ${i + 1}. ${DOMAINS[key].label}`));
      console.log(c("dim", `       ${DOMAINS[key].description}`));
      console.log("");
    });
    const answer = await ask(rl, c("yellow", "  ? ") + "Enter number: ");
    rl.close();
    const idx = parseInt(answer.trim()) - 1;
    if (idx >= 0 && idx < domainKeys.length) domain = Object.keys(DOMAINS)[idx];
  }

  if (!domain || !DOMAINS[domain]) {
    console.log(
      c("red", "  ✖ ") +
        "Invalid domain. Available: " +
        Object.keys(DOMAINS).join(", "),
    );
    process.exit(1);
  }

  // Determine target subdirectory
  const installDir = subdir ? path.join(targetDir, subdir) : targetDir;

  if (!fs.existsSync(installDir)) {
    console.log(c("red", "  ✖ ") + `Directory not found: ${installDir}`);
    process.exit(1);
  }

  // Copy subdirectory GEMINI.md marker
  const markerSrc = path.join(
    PACKAGE_ROOT,
    "domains",
    domain,
    "subdir-markers",
    "GEMINI.md",
  );
  const markerDest = path.join(installDir, "GEMINI.md");

  if (fs.existsSync(markerSrc)) {
    fs.copyFileSync(markerSrc, markerDest);
    if (!quiet) {
      console.log(
        c("green", "  ✔ ") + `GEMINI.md marker installed: ${subdir || "."}`,
      );
      console.log(c("dim", `    Domain: ${DOMAINS[domain].label}`));
      console.log(c("dim", `    Path: ${markerDest}`));
      console.log("");
      console.log(
        c("yellow", "  Info:") + " When you work on files in this directory,",
      );
      console.log(
        "        Antigravity will automatically use the correct agents.",
      );
    }
  } else {
    console.log(c("red", "  ✖ ") + `Marker not found for domain: ${domain}`);
    process.exit(1);
  }

  // Copy domain-specific MCP config if it exists
  const mcpSrc = path.join(
    PACKAGE_ROOT,
    "domains",
    domain,
    "subdir-markers",
    "mcp_config.json",
  );
  const agentDir = resolveAgentDir(targetDir, args);
  if (fs.existsSync(mcpSrc)) {
    if (fs.existsSync(agentDir)) {
      const mcpDest = path.join(agentDir, "mcp_config.json");
      if (fs.existsSync(mcpDest)) {
        const existing = JSON.parse(fs.readFileSync(mcpDest, "utf-8"));
        const incoming = JSON.parse(fs.readFileSync(mcpSrc, "utf-8"));
        const merged = mergeJson(existing, incoming);
        fs.writeFileSync(
          mcpDest,
          JSON.stringify(merged, null, 4) + "\n",
          "utf-8",
        );
        if (!quiet)
          console.log(
            c("green", "  ✔ ") +
              `Domain MCP servers merged into ${path.basename(agentDir)}/mcp_config.json`,
          );
      }
    }
  }

  // Install missing skills required by the new domain
  if (fs.existsSync(agentDir)) {
    const sharedAgentSrc = path.join(PACKAGE_ROOT, "shared", ".agent");
    const domainConfigPath = path.join(
      sharedAgentSrc,
      "domains",
      `${domain}.json`,
    );
    if (fs.existsSync(domainConfigPath)) {
      const domainConfig = JSON.parse(
        fs.readFileSync(domainConfigPath, "utf-8"),
      );
      const neededSkills = new Set();
      if (domainConfig.skills) {
        for (const tier of Object.values(domainConfig.skills)) {
          for (const skill of tier || []) neededSkills.add(skill);
        }
      }
      // Also collect skills from the domain's agents frontmatter
      const domainAgents = new Set();
      if (domainConfig.primary_agent)
        domainAgents.add(domainConfig.primary_agent);
      for (const a of domainConfig.supporting_agents || [])
        domainAgents.add(a);
      const agentsSrcDir = path.join(sharedAgentSrc, "agents");
      for (const agentName of domainAgents) {
        const agentFile = path.join(agentsSrcDir, `${agentName}.md`);
        if (fs.existsSync(agentFile)) {
          const content = fs.readFileSync(agentFile, "utf-8");
          const fmMatch = content.match(/^---[\s\S]*?^---/m);
          if (fmMatch) {
            const skillMatch = fmMatch[0].match(/skills:\s*(.+)/);
            if (skillMatch) {
              skillMatch[1]
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .forEach((s) => neededSkills.add(s));
            }
          }
        }
      }

      // Copy only skills that don't already exist
      const skillsSrc = path.join(sharedAgentSrc, "skills");
      const skillsDest = path.join(agentDir, "skills");
      let addedSkills = 0;
      for (const skillName of neededSkills) {
        const destSkillDir = path.join(skillsDest, skillName);
        if (fs.existsSync(destSkillDir)) continue; // already installed
        const srcSkillDir = path.join(skillsSrc, skillName);
        if (!fs.existsSync(srcSkillDir)) continue; // not in package
        copyRecursive(srcSkillDir, destSkillDir);
        addedSkills++;
      }
      if (addedSkills > 0 && !quiet) {
        console.log(
          c("green", "  ✔ ") +
            `${addedSkills} additional skill(s) installed for ${DOMAINS[domain].label}`,
        );
      }

      // Copy domain-specific rules file if not present
      const domainRulesFile = `${domain}-rules.md`;
      const rulesSrc = path.join(
        sharedAgentSrc,
        "rules",
        "domains",
        domainRulesFile,
      );
      const rulesDest = path.join(agentDir, "rules", "domains", domainRulesFile);
      if (fs.existsSync(rulesSrc) && !fs.existsSync(rulesDest)) {
        const rulesDestDir = path.dirname(rulesDest);
        if (!fs.existsSync(rulesDestDir))
          fs.mkdirSync(rulesDestDir, { recursive: true });
        fs.copyFileSync(rulesSrc, rulesDest);
        if (!quiet)
          console.log(
            c("green", "  ✔ ") + `Domain rules: ${domainRulesFile}`,
          );
      }
    }
  }

  console.log("");
}

// ── List Command ───────────────────────────────────────────────────────────

function cmdList(args) {
  const targetDir = args.path || process.cwd();
  const agentDir = resolveAgentDir(targetDir, args);

  if (!fs.existsSync(agentDir)) {
    console.log(
      c("red", "  ✖ ") +
        "No .agent/ or .agents/ found in this directory. Run " +
        c("bold", "refine-kit init") +
        " first.",
    );
    process.exit(1);
  }

  printBanner();

  // Detect installed version and domain from .agent/.refine-kit.json metadata
  const metaPath = path.join(agentDir, ".refine-kit.json");
  let installedVersion = null;
  let installedDate = null;
  let rootDomain = null;
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      installedVersion = meta.version || null;
      installedDate = meta.installedAt || null;
      rootDomain = meta.domain || null;
    } catch {}
  }

  // Fallback: detect root domain from rules/GEMINI.md
  if (!rootDomain) {
    const rulesGemini = path.join(agentDir, "rules", "GEMINI.md");
    if (fs.existsSync(rulesGemini)) {
      const content = fs.readFileSync(rulesGemini, "utf-8");
      for (const key of Object.keys(DOMAINS)) {
        if (content.includes(`(${key})`) || content.includes(key)) {
          rootDomain = key;
          break;
        }
      }
    }
  }

  // Count installed files
  const agentMds = fs.existsSync(path.join(agentDir, "agents"))
    ? fs
        .readdirSync(path.join(agentDir, "agents"))
        .filter((f) => f.endsWith(".md")).length
    : 0;
  const skillDirs = fs.existsSync(path.join(agentDir, "skills"))
    ? fs
        .readdirSync(path.join(agentDir, "skills"))
        .filter((f) =>
          fs.statSync(path.join(agentDir, "skills", f)).isDirectory(),
        ).length
    : 0;
  const workflowMds = fs.existsSync(path.join(agentDir, "workflows"))
    ? fs
        .readdirSync(path.join(agentDir, "workflows"))
        .filter((f) => f.endsWith(".md")).length
    : 0;
  const totalFiles = countFiles(agentDir);

  console.log("  " + c("bold", "Installed Agent System"));
  console.log("");
  console.log(
    `    Domain:     ${rootDomain ? c("bold", DOMAINS[rootDomain]?.label || rootDomain) : c("dim", "unknown")}`,
  );
  if (installedVersion)
    console.log(`    Version:    ${c("bold", `v${installedVersion}`)}`);
  if (installedDate) console.log(`    Installed:  ${c("dim", installedDate)}`);
  console.log(`    Agents:     ${c("bold", String(agentMds))}`);
  console.log(`    Skills:     ${c("bold", String(skillDirs))}`);
  console.log(`    Workflows:  ${c("bold", String(workflowMds))}`);
  console.log(`    Files:      ${c("bold", String(totalFiles))}`);
  console.log("");

  // Scan for subdirectory GEMINI.md markers (monorepo domains)
  const subdomains = [];
  const SCAN_EXCLUDE = new Set([
    "node_modules",
    "dist",
    "build",
    ".next",
    "out",
    "coverage",
    "__pycache__",
    ".venv",
    "venv",
    "bin",
    "shared",
    "domains",
    "tools",
    "global",
    "public",
    "static",
    "vendor",
  ]);
  function scanSubDir(dir, rel) {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir)) {
      if (item.startsWith(".") || SCAN_EXCLUDE.has(item)) continue;
      const fullPath = path.join(dir, item);
      if (!fs.statSync(fullPath).isDirectory()) continue;
      const geminiPath = path.join(fullPath, "GEMINI.md");
      const relPath = rel ? `${rel}/${item}` : item;
      if (fs.existsSync(geminiPath)) {
        const content = fs.readFileSync(geminiPath, "utf-8");
        let detectedDomain = null;
        for (const key of Object.keys(DOMAINS)) {
          if (content.includes(key)) {
            detectedDomain = key;
            break;
          }
        }
        if (detectedDomain) {
          subdomains.push({
            path: relPath,
            domain: detectedDomain,
            label: DOMAINS[detectedDomain]?.label || detectedDomain,
          });
        }
      }
      // Only scan 2 levels deep
      if ((rel || "").split("/").length < 2) {
        scanSubDir(fullPath, relPath);
      }
    }
  }
  scanSubDir(targetDir, "");

  if (subdomains.length > 0) {
    console.log("  " + c("bold", "Subdirectory Domains (monorepo)"));
    console.log("");
    for (const sd of subdomains) {
      console.log(
        `    ${c("cyan", sd.path.padEnd(30))} ${c("dim", sd.domain)} (${sd.label})`,
      );
    }
    console.log("");
  }

  // Check global installation
  const globalGemini = path.join(GEMINI_DIR, "GEMINI.md");
  const globalMcp = path.join(ANTIGRAVITY_DIR, "mcp_config.json");
  console.log("  " + c("bold", "Global Installation"));
  console.log("");
  console.log(
    `    ~/.gemini/GEMINI.md                    ${fs.existsSync(globalGemini) ? c("green", "✔") : c("red", "✖")}`,
  );
  console.log(
    `    ~/.gemini/antigravity/mcp_config.json  ${fs.existsSync(globalMcp) ? c("green", "✔") : c("red", "✖")}`,
  );
  console.log("");
}

// ── Update Command ─────────────────────────────────────────────────────────

async function cmdUpdate(args) {
  const targetDir = args.path || process.cwd();
  const agentDir = resolveAgentDir(targetDir, args);
  const quiet = args.quiet || false;
  const dryRun = args["dry-run"] || false;

  if (!fs.existsSync(agentDir)) {
    console.log(
      c("red", "  ✖ ") +
        "No .agent/ or .agents/ found. Run " +
        c("bold", "refine-kit init") +
        " first.",
    );
    process.exit(1);
  }

  if (!quiet) printBanner();

  // Detect installed domain and version from metadata
  const metaPath = path.join(agentDir, ".refine-kit.json");
  let domain = args.domain || null;
  let installedVersion = null;
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      installedVersion = meta.version || null;
      if (!domain) domain = meta.domain || null;
    } catch {}
  }

  // Fallback: detect domain from rules/GEMINI.md
  if (!domain) {
    const rulesGemini = path.join(agentDir, "rules", "GEMINI.md");
    if (fs.existsSync(rulesGemini)) {
      const content = fs.readFileSync(rulesGemini, "utf-8");
      for (const key of Object.keys(DOMAINS)) {
        if (content.includes(`(${key})`) || content.includes(key)) {
          domain = key;
          break;
        }
      }
    }
  }

  if (!domain) {
    console.log(
      c("red", "  ✖ ") +
        "Could not detect installed domain. Use " +
        c("bold", "--domain <name>") +
        " to specify.",
    );
    process.exit(1);
  }

  if (!quiet) {
    console.log(
      c("blue", "  ⟳ ") +
        `Updating ${c("bold", DOMAINS[domain]?.label || domain)} ...`,
    );
    console.log("");
    if (installedVersion) {
      console.log(
        `    Installed: v${installedVersion}  →  Available: v${VERSION}`,
      );
    } else {
      console.log(`    Available: v${VERSION}`);
    }

    if (installedVersion === VERSION && !args.force) {
      console.log("");
      console.log(c("green", "  ✔ ") + "Already up to date!");
      console.log("");
      return;
    }
    console.log("");
  }

  if (dryRun) {
    console.log(c("yellow", "  ⚑ ") + "Dry run — no files will be changed.");
    console.log("");
    console.log("  Would update:");
    console.log(`    Domain:  ${c("bold", DOMAINS[domain]?.label || domain)}`);
    console.log(
      `    From:    ${installedVersion ? `v${installedVersion}` : "unknown"}`,
    );
    console.log(`    To:      v${VERSION}`);
    console.log(`    Path:    ${targetDir}`);
    console.log("");
    return;
  }

  // Re-run init with --force to overwrite
  args.force = true;
  args.domain = domain;
  args.path = targetDir;
  args.suppressBanner = true;
  await cmdInit(args);

  if (!quiet) {
    console.log(c("green", "  ✔ ") + `Updated to v${VERSION}`);
    console.log("");
  }
}

function cmdHelp() {
  printBanner();
  console.log("  " + c("bold", "Usage:"));
  console.log("    npx refine-kit <command> [options]");
  console.log("");
  console.log("  " + c("bold", "Commands:"));
  console.log("");
  console.log(
    `    ${c("green", "init")}            Install agent system into your project`,
  );
  console.log(
    `    ${c("green", "add-domain")}      Add a domain to a monorepo subdirectory`,
  );
  console.log(
    `    ${c("green", "list")}            Show what's installed in this project`,
  );
  console.log(
    `    ${c("green", "update")}          Update agent system to latest version`,
  );
  console.log(`    ${c("green", "help")}            Show this help message`);
  console.log(`    ${c("green", "version")}         Show version`);
  console.log("");
  console.log("  " + c("bold", "Options:"));
  console.log("");
  console.log(
    "    --domain, -d <name>  Select domain (skip interactive prompt)",
  );
  console.log("    --subdir, -s <dir>   Target subdirectory (for add-domain)");
  console.log("    --force, -f          Overwrite existing agent directory");
  console.log("    --path, -p <dir>     Run in a different directory");
  console.log(
    "    --agents-dir <name>  Agent directory name (.agent or .agents)",
  );
  console.log("    --skip-global        Don't touch ~/.gemini/ global files");
  console.log(
    "    --dry-run            Show what update would do (for update)",
  );
  console.log("    --yes, -y            Skip interactive prompts");
  console.log("    --quiet, -q          Minimal output");
  console.log("");
  console.log("  " + c("bold", "Available Domains") + c("dim", " (13):"));
  console.log("");
  for (const [key, d] of Object.entries(DOMAINS)) {
    console.log(`    ${c("cyan", key.padEnd(20))} ${d.label}`);
  }
  console.log("");
  console.log("  " + c("bold", "Quick Start:"));
  console.log("");
  console.log(c("dim", "    # New project — interactive domain picker"));
  console.log("    npx refine-kit init");
  console.log("");
  console.log(c("dim", "    # Direct domain selection"));
  console.log("    npx refine-kit init --domain next-web");
  console.log("");
  console.log(c("dim", "    # Monorepo — add backend to services/api"));
  console.log(
    "    npx refine-kit add-domain -d python-backend -s services/api",
  );
  console.log("");
  console.log(c("dim", "    # Check what's installed"));
  console.log("    npx refine-kit list");
  console.log("");
  console.log(c("dim", "    # Update to latest version"));
  console.log("    npx refine-kit update");
  console.log("");
  console.log("  " + c("bold", "Aliases:") + c("dim", " Both work the same:"));
  console.log("    npx refine-kit init");
  console.log("    npx refine-agent-kit init");
  console.log("");
}

// ── Argument Parser ────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { command: null, force: false, quiet: false, yes: false };
  let i = 2;

  function requireValue(flag) {
    if (i + 1 >= argv.length || argv[i + 1].startsWith("-")) {
      console.error(c("red", `  ✖ Error: ${flag} requires a value`));
      process.exit(1);
    }
    i++;
    return argv[i];
  }

  while (i < argv.length) {
    const arg = argv[i];
    switch (arg) {
      case "init":
      case "add-domain":
      case "list":
      case "update":
      case "help":
      case "version":
        args.command = arg;
        break;
      case "--force":
      case "-f":
        args.force = true;
        break;
      case "--quiet":
      case "-q":
        args.quiet = true;
        break;
      case "--yes":
      case "-y":
        args.yes = true;
        break;
      case "--skip-global":
        args["skip-global"] = true;
        break;
      case "--dry-run":
        args["dry-run"] = true;
        break;
      case "--path":
      case "-p":
        args.path = requireValue(arg);
        break;
      case "--domain":
      case "-d":
        args.domain = requireValue(arg);
        break;
      case "--subdir":
      case "-s":
        args.subdir = requireValue(arg);
        break;
      case "--agents-dir":
        args["agents-dir"] = requireValue(arg);
        break;
      case "--help":
      case "-h":
        args.command = "help";
        break;
      case "--version":
      case "-v":
        args.command = "version";
        break;
      default:
        if (!arg.startsWith("-")) {
          args.command = args.command || arg;
        }
        break;
    }
    i++;
  }
  return args;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv);

  switch (args.command) {
    case "init":
      await cmdInit(args);
      break;
    case "add-domain":
      await cmdAddDomain(args);
      break;
    case "list":
      cmdList(args);
      break;
    case "update":
      await cmdUpdate(args);
      break;
    case "version":
      console.log(`refine-kit v${VERSION}`);
      break;
    case "help":
    default:
      cmdHelp();
      break;
  }
}

main().catch((err) => {
  console.error(c("red", "  ✖ Error: ") + err.message);
  process.exit(1);
});
