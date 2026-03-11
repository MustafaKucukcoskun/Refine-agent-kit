# refine-agent-kit

[![npm version](https://img.shields.io/npm/v/refine-agent-kit.svg)](https://www.npmjs.com/package/refine-agent-kit)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://opensource.org/license/agpl-v3)

AI Agent toolkit for **Google Antigravity IDE**. 21 specialist agents, 65 skill modules across 54 skill packs, 13 domains, design persona system, and anti-AI-slop protection.

## What is this?

When you code in [Google Antigravity IDE](https://antigravity.google/), the AI assistant reads instruction files (GEMINI.md) to understand how to help you better. **refine-agent-kit** installs a complete agent system that makes the AI:

- **Smarter** — 21 specialist agents, each expert in a specific domain (frontend, backend, security, database, etc.)
- **Context-aware** — Automatically picks the right agent based on the file you're editing
- **Anti-slop** — Prevents generic AI output (no `utils.py`, no purple gradients, no "In today's rapidly evolving...")
- **Design-focused** — 59 design personas, 107 reference sites for unique UI/UX output

## Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org/)
- **Google Antigravity IDE** — [idx.google.com](https://antigravity.google/)
- **GitHub account** — For GitHub MCP server (code search, PR management)

## Quick Start

### Step 1: Install

Open terminal in your project root and run:

```bash
npx refine-agent-kit init --domain next-web
```

> Replace `next-web` with your domain. See [Available Domains](#available-domains) below.

### Step 2: Add API Keys

The installer creates `.env.agent.example`. Copy it to `.env` and fill in your keys:

```bash
cp .env.agent.example .env
```

| Key                            | Required | What it does                           | Where to get                                                     |
| ------------------------------ | -------- | -------------------------------------- | ---------------------------------------------------------------- |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | Yes      | GitHub code search, PR tools           | [github.com/settings/tokens](https://github.com/settings/tokens) |
| `CONTEXT7_API_KEY`             | Yes      | Up-to-date library documentation       | [context7.com](https://context7.com)                             |
| `TWENTYFIRST_API_KEY`          | Optional | 21st.dev UI components (next-web only) | [21st.dev/settings/api](https://21st.dev/settings/api)           |
| Figma                          | Auto     | Design file access                     | OAuth — browser login when first used                            |
| Supabase                       | Auto     | Database management                    | OAuth — browser login when first used                            |

### Step 3: Open in Antigravity

Open your project in Google Antigravity IDE. The agents activate automatically — no configuration needed.

## Available Domains

Pick the domain that matches your project:

| Domain             | Best for                                | Primary Agent       | Extra MCP                               |
| ------------------ | --------------------------------------- | ------------------- | --------------------------------------- |
| `next-web`         | Next.js + React + Tailwind + shadcn     | frontend-specialist | shadcn, 21st-dev-magic, figma, supabase |
| `python-backend`   | FastAPI + PostgreSQL + SQLAlchemy       | backend-specialist  | —                                       |
| `python-ml`        | PyTorch + OpenCV + NumPy                | backend-specialist  | —                                       |
| `python-data`      | Pandas + Polars + DuckDB + scikit-learn | backend-specialist  | —                                       |
| `mobile-flutter`   | Flutter 3.x + Dart 3 + Riverpod         | mobile-developer    | —                                       |
| `mobile-rn`        | React Native + Expo + TypeScript        | mobile-developer    | —                                       |
| `electron-desktop` | Electron + Node.js desktop apps         | frontend-specialist | —                                       |
| `chrome-extension` | Chrome Extension (Manifest V3)          | frontend-specialist | —                                       |
| `cli-tool`         | CLI tools (Node.js or Python)           | backend-specialist  | —                                       |
| `csharp-backend`   | ASP.NET Core + EF Core + C# 13          | backend-specialist  | —                                       |
| `godot-game`       | Godot 4.x + GDScript + 2D/3D            | game-developer      | —                                       |
| `unity-game`       | Unity 2023+ + C# + URP                  | game-developer      | —                                       |
| `phaser-game`      | Phaser 3.x + TypeScript + HTML5         | game-developer      | —                                       |

**Not sure which to pick?**

- Building a website or web app? → `next-web`
- Building an API or server? → `python-backend` or `csharp-backend`
- Doing ML, image processing, or data science? → `python-ml` or `python-data`
- Building a mobile app? → `mobile-flutter` or `mobile-rn`
- Building a game? → `godot-game`, `unity-game`, or `phaser-game`
- Building a desktop app? → `electron-desktop`
- Building a browser extension? → `chrome-extension`
- Building a CLI tool? → `cli-tool`

## Monorepo Setup (Multiple Technologies)

If your project has multiple technologies in one repo (e.g., a Next.js frontend + Python API + ML service), you can set up each subdirectory with its own domain.

```bash
cd my-monorepo

# 1. Root setup — installs the agent system + global rules
npx refine-agent-kit init --domain next-web

# 2. Add domain markers for each subdirectory
npx refine-agent-kit add-domain --domain python-backend --subdir services/api
npx refine-agent-kit add-domain --domain python-ml --subdir services/ml
npx refine-agent-kit add-domain --domain next-web --subdir apps/dashboard
```

**Result:**

```
my-monorepo/
├── .agent/                        ← Agent system (21 agents, 65 skill modules / 54 skill packs)
├── .shared/design-system/         ← 59 personas, 107 reference sites
├── .agent/rules/GEMINI.md         ← Root agent routing (next-web)
├── .agent/mcp_config.json         ← Domain MCP servers
├── apps/
│   └── dashboard/GEMINI.md        ← "Use frontend-specialist"
├── services/
│   ├── api/GEMINI.md              ← "Use backend-specialist"
│   └── ml/GEMINI.md               ← "Use ML/CV specialist"
└── .env.agent.example
```

**How it works:** When you edit `services/api/handler.py`, Antigravity reads that directory's GEMINI.md and automatically activates **backend-specialist**. Switch to `apps/dashboard/page.tsx`, and it activates **frontend-specialist**. No manual switching needed.

## What Gets Installed

### Global (`~/.gemini/`) — Applies to ALL your projects

| File                          | Purpose                                           |
| ----------------------------- | ------------------------------------------------- |
| `GEMINI.md`                   | Code quality rules, anti-AI-slop, scope expansion |
| `antigravity/mcp_config.json` | context7, github, playwright, chrome-devtools     |

### Project (`.agent/` + `.shared/`) — This project only

| Directory                | Contents                                             |
| ------------------------ | ---------------------------------------------------- |
| `.agent/agents/`         | 21 specialist AI agents                              |
| `.agent/skills/`         | 65 skill modules across 54 top-level skill packs |
| `.agent/workflows/`      | 17 slash command workflows                           |
| `.agent/domains/`        | 13 domain configuration packs                        |
| `.agent/rules/`          | Local GEMINI.md + domain routing rules               |
| `.agent/scripts/`        | 6 utility scripts       |
| `.agent/mcp_config.json` | Domain-specific MCP servers (next-web only)          |
| `.shared/design-system/` | 59 personas + 107 reference sites + 32 anti-patterns |

## Maintainer Source Of Truth

This package keeps one shipped source tree and one generated development mirror:

- `shared/.agent/` is the only source of truth for the shipped agent system.
- `shared/.shared/` is the only source of truth for shipped shared assets.
- Repo-root `.agent/` and `.shared/` are generated mirrors used to run this repository itself with a concrete local domain.
- The generated `.agent/` mirror is `shared/.agent/` plus the `domains/next-web/` overlay.
- The generated `.shared/` mirror is `shared/.shared/` plus the local design research report copy used while developing the package.

**Why two trees existed:** this repo needs a local standalone agent setup for dogfooding, while the npm package needs a clean distributable tree. The problem was not the existence of both views, but maintaining both manually.

**Maintainer rule:** edit only `shared/.agent/` and `shared/.shared/`, then regenerate the repo-root mirrors.

```bash
npm run sync:all
```

This updates inventory-sensitive docs and regenerates `.agent/` and `.shared/` from the shipped source tree.

## App Builder Blueprints

`shared/.agent/skills/app-builder/blueprints/` contains stack-specific blueprint documents.
These files are not executable starter repos or code generators. They are selective reference files that the app-builder skill reads when it needs to scaffold a project shape for a specific stack.

## The 21 Agents

| Agent                    | Expertise                                                     |
| ------------------------ | ------------------------------------------------------------- |
| `orchestrator`           | Routes tasks to the right agent, coordinates multi-agent work |
| `project-planner`        | 4-phase planning methodology, task breakdown                  |
| `frontend-specialist`    | UI/UX, React, Tailwind, design personas, animation            |
| `backend-specialist`     | API design, business logic, Python/Node.js patterns           |
| `database-architect`     | Schema design, migrations, query optimization, indexing       |
| `security-specialist`    | Auth, OWASP top 10, zero trust architecture                   |
| `security-auditor`       | Security audit, vulnerability assessment, compliance          |
| `penetration-tester`     | Offensive security testing, exploit discovery                 |
| `performance-optimizer`  | Core Web Vitals, profiling, caching strategies                |
| `test-engineer`          | TDD, unit/integration/E2E testing strategies                  |
| `qa-automation-engineer` | CI/CD test pipelines, automated quality gates                 |
| `seo-specialist`         | Technical SEO, structured data, Core Web Vitals               |
| `devops-engineer`        | Docker, Kubernetes, CI/CD pipelines, cloud infra              |
| `debugger`               | Systematic debugging, root cause analysis                     |
| `mobile-developer`       | React Native, Flutter, platform-specific patterns             |
| `game-developer`         | Unity, Godot, Phaser, game design patterns                    |
| `code-archaeologist`     | Legacy code analysis, refactoring strategies                  |
| `documentation-writer`   | API docs, technical writing, README generation                |
| `product-owner`          | User stories, backlog prioritization, acceptance criteria     |
| `product-manager`        | PRD writing, roadmap planning, feature scoping                |
| `explorer-agent`         | Codebase exploration, dependency mapping                      |

## How Agent Routing Works

```
You open a file in Antigravity IDE
      ↓
Antigravity reads GEMINI.md hierarchy (all levels concatenated):
  1. ~/.gemini/GEMINI.md              ← Global quality rules (anti-slop)
  2. .agent/rules/GEMINI.md           ← Agent system + routing
  3. services/api/GEMINI.md           ← "Use backend-specialist"
      ↓
Correct specialist agent activates automatically
      ↓
Agent loads its skills (e.g., python-patterns, api-patterns)
      ↓
AI writes project-specific, high-quality code
```

## Anti-AI Slop

Global rules prevent generic AI output across ALL languages:

- **Code**: No `data`, `temp`, `utils.py`, obvious comments, unnecessary wrappers
- **Backend**: No generic CRUD without domain logic, no swallowed exceptions
- **Frontend**: No purple gradients, 3-column grids, stock illustrations
- **Text**: No "In today's rapidly evolving...", no "seamless integration"

**Balance rule**: Avoiding slop ≠ over-engineering. Simple tasks stay simple. A 3-line CRUD endpoint doesn't need a factory pattern.

## CLI Reference

```bash
# Install full agent system (interactive domain selection)
npx refine-agent-kit init

# Install with specific domain (skip prompts)
npx refine-agent-kit init --domain next-web

# Add domain marker to subdirectory (monorepo)
npx refine-agent-kit add-domain --domain python-backend --subdir services/api

# Options
--domain <d>     Select domain: next-web, python-backend, python-ml
--subdir <dir>   Target subdirectory (for add-domain)
--force          Overwrite existing .agent/ files
--skip-global    Skip ~/.gemini/ installation
--path <dir>     Target directory (default: current directory)
--yes            Skip interactive prompts
--quiet          Minimal output
```

## Troubleshooting

**"`.agent/` already exists"**
Use `--force` flag to overwrite: `npx refine-agent-kit init --domain next-web --force`

**`npx refine-agent-kit` does not start the CLI**
If npm resolves the package but the command does not launch, the published version may expose the binary as `refine-kit` instead of `refine-agent-kit`. In that case, either run `npx refine-kit ...` for that older release or publish a newer version whose `bin` field includes `refine-agent-kit`.

**Agents not activating in Antigravity**
Check that `.agent/rules/GEMINI.md` exists in your project root. Antigravity reads this file to discover the agent system.

**MCP servers not connecting**
Verify your `.env` file has the correct API keys. Global MCP servers (context7, github) require `GITHUB_PERSONAL_ACCESS_TOKEN` and `CONTEXT7_API_KEY`.

**Monorepo: wrong agent activating**
Make sure each subdirectory has its own `GEMINI.md` marker. Run `add-domain` for each technology directory.

## License

AGPL-3.0-only

This means downstream users may use, modify, and redistribute the project, but if they distribute a modified version, or run a modified network service based on it, they must provide the corresponding source code under the same license terms.
