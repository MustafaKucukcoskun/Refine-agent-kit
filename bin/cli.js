#!/usr/bin/env node

/**
 * refine-kit CLI
 * AI Agent toolkit installer for Google Antigravity IDE.
 * Global rules → ~/.gemini/ | Project files → .agent/ + .shared/
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
    mcpExtra: ["shadcn", "21st-dev-magic", "figma", "supabase"],
    envKeys: ["TWENTYFIRST_API_KEY"],
  },
  "python-backend": {
    label: "Python Backend (FastAPI/Django)",
    description: "FastAPI + PostgreSQL + SQLAlchemy + Pytest",
    mcpExtra: [],
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

function copyRecursive(src, dest, exclude = []) {
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
      );
    }
  } else {
    const fileName = path.basename(src);
    if (exclude.includes(fileName)) return count;

    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    count++;
  }
  return count;
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
  const globalMcpSrc = path.join(PACKAGE_ROOT, "global", "mcp_config.json");
  const globalMcpDest = path.join(ANTIGRAVITY_DIR, "mcp_config.json");

  if (fs.existsSync(globalMcpDest) && !force) {
    // Merge: add our servers without removing user's existing ones
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

// ── ENV Template ───────────────────────────────────────────────────────────

function createEnvTemplate(targetDir, domain) {
  const envPath = path.join(targetDir, ".env.agent.example");

  let content = `# refine-kit Environment Variables
# Copy this to .env and add your API keys
# Antigravity reads these automatically via $VAR_NAME expansion

# ── Global (all projects) ──

# GitHub Personal Access Token
# Get from: https://github.com/settings/tokens (select repo, read:org scopes)
GITHUB_PERSONAL_ACCESS_TOKEN=

# Context7 API Key (library documentation)
# Get from: https://context7.com
CONTEXT7_API_KEY=
`;

  if (domain === "next-web") {
    content += `
# ── next-web Domain ──

# 21st.dev Magic API Key
# Get from: https://21st.dev/settings/api
TWENTYFIRST_API_KEY=

# Figma — uses OAuth (no manual token needed, browser login)
# Supabase — uses OAuth (no manual token needed, browser login)
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

  if (!quiet) printBanner();

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

  // ── Step 3: Check existing .agent/ ──
  const agentDir = path.join(targetDir, ".agent");
  if (fs.existsSync(agentDir) && !force) {
    console.log(c("red", "  ✖ ") + `.agent/ already exists in ${targetDir}`);
    console.log(c("dim", "    Use --force to overwrite."));
    process.exit(1);
  }

  // ── Step 4: Copy shared base + domain-specific files (FILTERED) ──
  const sharedAgentSrc = path.join(PACKAGE_ROOT, "shared", ".agent");
  const sharedDesignSrc = path.join(PACKAGE_ROOT, "shared", ".shared");
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

  // Copy domain-specific MCP config (if exists)
  const domainMcpSrc = path.join(domainSrc, "mcp_config.json");
  const domainMcpDest = path.join(agentDir, "mcp_config.json");
  if (fs.existsSync(domainMcpSrc)) {
    fs.copyFileSync(domainMcpSrc, domainMcpDest);
    if (!quiet)
      console.log(
        c("green", "  ✔ ") +
          `Domain MCP servers: ${DOMAINS[domain].mcpExtra.join(", ")}`,
      );
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

  // Copy shared .shared/ design system (only for UI-based domains)
  const UI_DOMAINS = new Set([
    "next-web",
    "mobile-flutter",
    "mobile-rn",
    "electron-desktop",
    "chrome-extension",
  ]);
  const sharedDest = path.join(targetDir, ".shared");
  if (fs.existsSync(sharedDesignSrc) && UI_DOMAINS.has(domain)) {
    const designCount = copyRecursive(sharedDesignSrc, sharedDest);
    if (!quiet)
      console.log(c("green", "  ✔ ") + `${designCount} design system files`);
  } else if (!quiet && !UI_DOMAINS.has(domain)) {
    console.log(c("dim", "  ⊘ ") + "Design system skipped (not a UI domain)");
  }

  // ── Step 5: Create env template ──
  createEnvTemplate(targetDir, domain);
  if (!quiet) console.log(c("green", "  ✔ ") + ".env.agent.example created");

  // ── Step 6: Summary ──
  if (!quiet) {
    const agentMds = fs.existsSync(path.join(agentDir, "agents"))
      ? fs
          .readdirSync(path.join(agentDir, "agents"))
          .filter((f) => f.endsWith(".md")).length
      : 0;
    const totalFiles = countFiles(agentDir) + countFiles(sharedDest);
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
    console.log(c("dim", "    Local:   .agent/ + .shared/"));
    console.log("");

    console.log(c("yellow", "\n  Next steps:"));
    console.log(
      c("dim", "    1.") +
        " Copy " +
        c("bold", ".env.agent.example") +
        " → " +
        c("bold", ".env") +
        " and add your API keys",
    );
    console.log(
      c("dim", "    2.") +
        " Required keys: " +
        c("bold", "GITHUB_PERSONAL_ACCESS_TOKEN") +
        ", " +
        c("bold", "CONTEXT7_API_KEY"),
    );

    if (d.mcpExtra.includes("21st-dev-magic")) {
      console.log(
        c("dim", "    3.") +
          " Optional: " +
          c("bold", "TWENTYFIRST_API_KEY") +
          " (for 21st.dev components)",
      );
    }

    console.log(
      c("dim", `    ${d.mcpExtra.includes("21st-dev-magic") ? "4" : "3"}.`) +
        " Open project in " +
        c("bold", "Google Antigravity") +
        " — agents activate automatically!",
    );
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
  if (fs.existsSync(mcpSrc)) {
    const agentDir = path.join(targetDir, ".agent");
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
              "Domain MCP servers merged into .agent/mcp_config.json",
          );
      }
    }
  }

  console.log("");
}

function cmdHelp() {
  printBanner();
  console.log("  " + c("bold", "Usage:"));
  console.log("    npx refine-agent-kit init [options]");
  console.log("");
  console.log("  " + c("bold", "Commands:"));
  console.log(
    "    init            Install global rules + agent system + domain",
  );
  console.log(
    "    add-domain      Add domain marker to a subdirectory (monorepo)",
  );
  console.log("    help            Show this help message");
  console.log("    version         Show version");
  console.log("");
  console.log("  " + c("bold", "Options:"));
  console.log("    --domain <d>    Select domain (skip interactive prompt)");
  console.log("    --subdir <dir>  Subdirectory for add-domain (monorepo)");
  console.log("    --force         Overwrite existing files");
  console.log("    --path <dir>    Install to a specific directory");
  console.log("    --skip-global   Skip global ~/.gemini/ installation");
  console.log("    --yes           Skip interactive prompts");
  console.log("    --quiet         Minimal output");
  console.log("");
  console.log("  " + c("bold", "Domains:"));
  for (const [key, domain] of Object.entries(DOMAINS)) {
    console.log(`    ${c("bold", key.padEnd(20))} ${domain.label}`);
    console.log(`    ${" ".repeat(20)} ${c("dim", domain.description)}`);
  }
  console.log("");
  console.log("  " + c("bold", "Examples:"));
  console.log("");
  console.log("    " + c("magenta", "Single project:"));
  console.log(
    c("dim", "    npx refine-agent-kit init                   # Interactive"),
  );
  console.log(
    c("dim", "    npx refine-agent-kit init --domain next-web # Direct"),
  );
  console.log(
    c(
      "dim",
      "    npx refine-agent-kit init --domain next-web -f # Force overwrite",
    ),
  );
  console.log("");
  console.log("    " + c("magenta", "Monorepo (multi-technology):"));
  console.log(
    c("dim", "    npx refine-agent-kit init --domain next-web # Root setup"),
  );
  console.log(
    c(
      "dim",
      "    npx refine-agent-kit add-domain --domain python-backend --subdir services/api",
    ),
  );
  console.log(
    c(
      "dim",
      "    npx refine-agent-kit add-domain --domain python-ml --subdir services/ml",
    ),
  );
  console.log(
    c(
      "dim",
      "    npx refine-agent-kit add-domain --domain next-web --subdir apps/landing",
    ),
  );
  console.log("");
  console.log("  " + c("bold", "What gets installed:"));
  console.log("");
  console.log("    " + c("magenta", "GLOBAL") + " (~/.gemini/):");
  console.log(
    "      GEMINI.md                    Code quality + anti-slop rules",
  );
  console.log(
    "      antigravity/mcp_config.json  context7, github, playwright, chrome-devtools",
  );
  console.log("");
  console.log("    " + c("blue", "PROJECT") + " (.agent/ + .shared/):");
  console.log(
    `      .agent/agents/               ${INVENTORY.agents} specialist AI agents`,
  );
  console.log(
    `      .agent/skills/               Domain-filtered (${INVENTORY.skillPacks} total skill packs)`,
  );
  console.log(
    `      .agent/workflows/            ${INVENTORY.workflows} slash command workflows`,
  );
  console.log(
    "      .agent/rules/GEMINI.md       Agent routing & domain rules",
  );
  console.log(
    `      .agent/mcp_config.json       Domain MCP servers for ${INVENTORY.domains} domain packs`,
  );
  console.log(
    `      .shared/design-system/       ${INVENTORY.personas} personas + ${INVENTORY.referenceSites} reference sites + ${INVENTORY.antiPatterns} anti-patterns`,
  );
  console.log("");
}

// ── Argument Parser ────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { command: null, force: false, quiet: false, yes: false };
  let i = 2;

  while (i < argv.length) {
    const arg = argv[i];
    switch (arg) {
      case "init":
      case "add-domain":
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
      case "--path":
      case "-p":
        i++;
        args.path = argv[i];
        break;
      case "--domain":
      case "-d":
        i++;
        args.domain = argv[i];
        break;
      case "--subdir":
      case "-s":
        i++;
        args.subdir = argv[i];
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
