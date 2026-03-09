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

// ── Constants ──────────────────────────────────────────────────────────────

const VERSION = "1.0.0";
const PACKAGE_ROOT = path.resolve(__dirname, "..");
const HOME_DIR = os.homedir();
const GEMINI_DIR = path.join(HOME_DIR, ".gemini");
const ANTIGRAVITY_DIR = path.join(GEMINI_DIR, "antigravity");

const DOMAINS = {
  "next-web": {
    label: "Next.js Full-Stack Web",
    description: "Next.js + React + Tailwind + shadcn + Supabase",
    mcpExtra: ["shadcn", "magic-ui", "figma", "supabase"],
    envKeys: ["MAGIC_UI_API_KEY"],
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
  console.log(c("cyan", "  ║") + c("bold", "   refine-kit ") + c("dim", `v${VERSION}`) + c("cyan", "                            ║"));
  console.log(c("cyan", "  ║") + c("dim", "   AI Agent Toolkit for Google Antigravity IDE") + c("cyan", "  ║"));
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
      count += copyRecursive(path.join(src, item), path.join(dest, item), exclude);
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
  if (!quiet) console.log(c("blue", "  ⟳ ") + "Installing global rules to ~/.gemini/ ...");

  // Ensure directories exist
  if (!fs.existsSync(GEMINI_DIR)) fs.mkdirSync(GEMINI_DIR, { recursive: true });
  if (!fs.existsSync(ANTIGRAVITY_DIR)) fs.mkdirSync(ANTIGRAVITY_DIR, { recursive: true });

  // ── GEMINI.md (global code quality rules) ──
  const globalGeminiSrc = path.join(PACKAGE_ROOT, "global", "GEMINI.md");
  const globalGeminiDest = path.join(GEMINI_DIR, "GEMINI.md");

  if (fs.existsSync(globalGeminiDest) && !force) {
    // Check if our content is already there
    const existing = fs.readFileSync(globalGeminiDest, "utf-8");
    if (existing.includes("refine-agent-kit") || existing.includes("Anti-AI Slop")) {
      if (!quiet) console.log(c("dim", "  ⊘ ") + "Global GEMINI.md already contains refine-kit rules (skip)");
    } else {
      // Append our rules
      const ourRules = fs.readFileSync(globalGeminiSrc, "utf-8");
      const separator = "\n\n---\n\n<!-- refine-agent-kit global rules -->\n\n";
      fs.writeFileSync(globalGeminiDest, existing + separator + ourRules, "utf-8");
      if (!quiet) console.log(c("green", "  ✔ ") + "Global GEMINI.md updated (appended refine-kit rules)");
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
      fs.writeFileSync(globalMcpDest, JSON.stringify(merged, null, 4) + "\n", "utf-8");
      if (!quiet) console.log(c("green", "  ✔ ") + "Global MCP config merged (existing servers preserved)");
    } catch {
      fs.copyFileSync(globalMcpSrc, globalMcpDest);
      if (!quiet) console.log(c("green", "  ✔ ") + "Global MCP config installed");
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

# 21st.dev Magic UI API Key
# Get from: https://21st.dev/settings/api
MAGIC_UI_API_KEY=

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

  // ── Step 4: Copy shared base + domain-specific files ──
  const sharedAgentSrc = path.join(PACKAGE_ROOT, "shared", ".agent");
  const sharedDesignSrc = path.join(PACKAGE_ROOT, "shared", ".shared");
  const domainSrc = path.join(PACKAGE_ROOT, "domains", domain);

  if (!quiet) console.log(c("blue", "  ⟳ ") + `Installing ${c("bold", DOMAINS[domain].label)} domain...`);

  // Copy shared .agent/ base (agents, skills, workflows, scripts, domains, ARCHITECTURE.md)
  if (fs.existsSync(sharedAgentSrc)) {
    const agentCount = copyRecursive(sharedAgentSrc, agentDir);
    if (!quiet) console.log(c("green", "  ✔ ") + `${agentCount} agent system files (shared base)`);
  }

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
    if (!quiet) console.log(c("green", "  ✔ ") + `Domain MCP servers: ${DOMAINS[domain].mcpExtra.join(", ")}`);
  }

  // Copy shared .shared/ design system (only for domains that need it)
  const sharedDest = path.join(targetDir, ".shared");
  if (fs.existsSync(sharedDesignSrc)) {
    const designCount = copyRecursive(sharedDesignSrc, sharedDest);
    if (!quiet) console.log(c("green", "  ✔ ") + `${designCount} design system files`);
  }

  // ── Step 5: Create env template ──
  createEnvTemplate(targetDir, domain);
  if (!quiet) console.log(c("green", "  ✔ ") + ".env.agent.example created");

  // ── Step 6: Summary ──
  if (!quiet) {
    const agentMds = fs.existsSync(path.join(agentDir, "agents"))
      ? fs.readdirSync(path.join(agentDir, "agents")).filter((f) => f.endsWith(".md")).length
      : 0;
    const totalFiles = countFiles(agentDir) + countFiles(sharedDest);
    const d = DOMAINS[domain];

    console.log("");
    console.log(c("green", "  ── Installation Complete ──────────────────────"));
    console.log("");
    console.log(`    Domain:  ${c("bold", d.label)}`);
    console.log(`    Agents:  ${c("bold", String(agentMds))}     Files: ${c("bold", String(totalFiles))}`);
    if (d.mcpExtra.length > 0) {
      console.log(`    MCP:     ${c("bold", d.mcpExtra.join(", "))}`);
    }
    console.log("");
    console.log(c("dim", "    Global:  ~/.gemini/GEMINI.md"));
    console.log(c("dim", "    Global:  ~/.gemini/antigravity/mcp_config.json"));
    console.log(c("dim", "    Local:   .agent/ + .shared/"));
    console.log("");

    console.log(c("yellow", "\n  Next steps:"));
    console.log(c("dim", "    1.") + " Copy " + c("bold", ".env.agent.example") + " → " + c("bold", ".env") + " and add your API keys");
    console.log(c("dim", "    2.") + " Required keys: " + c("bold", "GITHUB_PERSONAL_ACCESS_TOKEN") + ", " + c("bold", "CONTEXT7_API_KEY"));

    if (d.mcpExtra.includes("magic-ui")) {
      console.log(c("dim", "    3.") + " Optional: " + c("bold", "MAGIC_UI_API_KEY") + " (for 21st.dev components)");
    }

    console.log(c("dim", `    ${d.mcpExtra.includes("magic-ui") ? "4" : "3"}.`) + " Open project in " + c("bold", "Google Antigravity") + " — agents activate automatically!");
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
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
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
    console.log(c("red", "  ✖ ") + "Invalid domain. Available: " + Object.keys(DOMAINS).join(", "));
    process.exit(1);
  }

  // Determine target subdirectory
  const installDir = subdir ? path.join(targetDir, subdir) : targetDir;

  if (!fs.existsSync(installDir)) {
    console.log(c("red", "  ✖ ") + `Directory not found: ${installDir}`);
    process.exit(1);
  }

  // Copy subdirectory GEMINI.md marker
  const markerSrc = path.join(PACKAGE_ROOT, "domains", domain, "subdir-markers", "GEMINI.md");
  const markerDest = path.join(installDir, "GEMINI.md");

  if (fs.existsSync(markerSrc)) {
    fs.copyFileSync(markerSrc, markerDest);
    if (!quiet) {
      console.log(c("green", "  ✔ ") + `GEMINI.md marker installed: ${subdir || "."}`);
      console.log(c("dim", `    Domain: ${DOMAINS[domain].label}`));
      console.log(c("dim", `    Path: ${markerDest}`));
      console.log("");
      console.log(c("yellow", "  Info:") + " When you work on files in this directory,");
      console.log("        Antigravity will automatically use the correct agents.");
    }
  } else {
    console.log(c("red", "  ✖ ") + `Marker not found for domain: ${domain}`);
    process.exit(1);
  }

  // Copy domain-specific MCP config if it exists
  const mcpSrc = path.join(PACKAGE_ROOT, "domains", domain, "subdir-markers", "mcp_config.json");
  if (fs.existsSync(mcpSrc)) {
    const agentDir = path.join(targetDir, ".agent");
    if (fs.existsSync(agentDir)) {
      const mcpDest = path.join(agentDir, "mcp_config.json");
      if (fs.existsSync(mcpDest)) {
        const existing = JSON.parse(fs.readFileSync(mcpDest, "utf-8"));
        const incoming = JSON.parse(fs.readFileSync(mcpSrc, "utf-8"));
        const merged = mergeJson(existing, incoming);
        fs.writeFileSync(mcpDest, JSON.stringify(merged, null, 4) + "\n", "utf-8");
        if (!quiet) console.log(c("green", "  ✔ ") + "Domain MCP servers merged into .agent/mcp_config.json");
      }
    }
  }

  console.log("");
}

function cmdHelp() {
  printBanner();
  console.log("  " + c("bold", "Usage:"));
  console.log("    npx refine-kit init [options]");
  console.log("");
  console.log("  " + c("bold", "Commands:"));
  console.log("    init            Install global rules + agent system + domain");
  console.log("    add-domain      Add domain marker to a subdirectory (monorepo)");
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
  console.log(c("dim", "    npx refine-kit init                         # Interactive"));
  console.log(c("dim", "    npx refine-kit init --domain next-web       # Direct"));
  console.log(c("dim", "    npx refine-kit init --domain next-web -f    # Force overwrite"));
  console.log("");
  console.log("    " + c("magenta", "Monorepo (multi-technology):"));
  console.log(c("dim", "    npx refine-kit init --domain next-web       # Root setup"));
  console.log(c("dim", "    npx refine-kit add-domain --domain python-backend --subdir services/api"));
  console.log(c("dim", "    npx refine-kit add-domain --domain python-ml --subdir services/ml"));
  console.log(c("dim", "    npx refine-kit add-domain --domain next-web --subdir apps/landing"));
  console.log("");
  console.log("  " + c("bold", "What gets installed:"));
  console.log("");
  console.log("    " + c("magenta", "GLOBAL") + " (~/.gemini/):");
  console.log("      GEMINI.md                    Code quality + anti-slop rules");
  console.log("      antigravity/mcp_config.json  context7, github, playwright, chrome-devtools");
  console.log("");
  console.log("    " + c("blue", "PROJECT") + " (.agent/ + .shared/):");
  console.log("      .agent/agents/               21 specialist AI agents");
  console.log("      .agent/skills/               Domain-specific skills");
  console.log("      .agent/workflows/            Slash command workflows");
  console.log("      .agent/rules/GEMINI.md       Agent routing & domain rules");
  console.log("      .agent/mcp_config.json       Domain MCP servers");
  console.log("      .shared/design-system/       59 personas + 107 reference sites");
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
