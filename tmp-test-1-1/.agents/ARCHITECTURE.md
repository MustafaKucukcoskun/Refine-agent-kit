# refine-kit Architecture

> Comprehensive AI Agent Capability Expansion Toolkit

---

## 📋 Overview

refine-kit is a modular system consisting of:

- **21 Specialist Agents** - Role-based AI personas
- **59 Skill Packs** - Domain-specific knowledge modules
- **31 Workflows** - Slash command procedures
- **13 Domain Packs** - Tech stack integrations
- **9 MCP Servers** - External tool integrations (3 global + domain-specific)

---

## 🧭 Source Model

- `shared/.agent/` is the single source of truth for the shipped project agent tree.
- Design system assets (personas, reference sites, anti-patterns) live inside `shared/.agent/.shared/design-system/`.
- The repo-root `.agent/` directory is a generated development mirror used to dogfood the package in this repository.
- The development mirror overlays the `next-web` domain on top of `shared/.agent/` so this package repo can run with a concrete local domain.
- **Install directory:** CLI defaults to `.agents/` (plural, Antigravity 2.0+ standard). Legacy `.agent/` (singular) is auto-detected for backward compatibility.

---

## 🏗️ Directory Structure

```plaintext
.agent/
├── ARCHITECTURE.md          # This file
├── agents/                  # 21 Specialist Agents
├── skills/                  # 59 Skill Packs (70 modules)
├── workflows/               # 31 Slash Commands
├── domains/                 # 13 Domain Packs
├── rules/                   # GEMINI.md (global) + 13 domain rules
│   ├── GEMINI.md            # Global rules
│   └── domains/             # Domain specific rules
└── scripts/                 # Master Validation Scripts
```

---

## 🤖 Agents (21)

Specialist AI personas for different domains.

| Agent                    | Focus                        |
| ------------------------ | ---------------------------- |
| `orchestrator`           | Multi-agent coordination     |
| `frontend-specialist`    | Web UI/UX                    |
| `backend-specialist`     | API, business logic          |
| `mobile-developer`       | iOS, Android, RN             |
| `game-developer`         | Game logic, mechanics        |
| `database-architect`     | Schema, SQL                  |
| `devops-engineer`        | CI/CD, deployment            |
| `security-specialist`    | Security audit + pen testing |
| `security-auditor`       | Zero trust, OWASP, defense   |
| `penetration-tester`     | Offensive security, red team |
| `performance-optimizer`  | Speed, Web Vitals            |
| `seo-specialist`         | Ranking, visibility          |
| `debugger`               | Troubleshooting, debugging   |
| `code-archaeologist`     | Legacy code analysis         |
| `qa-automation-engineer` | QA, testing automation       |
| `test-engineer`          | TDD, unit/E2E test writing   |
| `documentation-writer`   | Manuals, docs                |
| `product-owner`          | Product strategy, specs      |
| `product-manager`        | PRD, user stories, scoping   |
| `explorer-agent`         | Codebase exploration         |
| `project-planner`        | Task planning, breakdown     |

---

## 🧩 Skills (59 packs / 70 modules)

Modular knowledge domains that agents can load on-demand based on task context. Current shipped inventory: 59 top-level skill packs and 70 total SKILL.md modules.

### Frontend & UI

| Skill                   | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `react-best-practices`  | React & Next.js performance optimization (Vercel - 57 rules)          |
| `web-design-guidelines` | Web UI audit - 100+ rules for accessibility, UX, performance (Vercel) |
| `tailwind-patterns`     | Tailwind CSS v4 utilities                                             |
| `frontend-design`       | UI/UX patterns, design systems                                        |
| `ui-ux-pro-max`         | 50 styles, 21 palettes, 50 fonts                                      |

### Backend & API

| Skill                   | Description               |
| ----------------------- | ------------------------- |
| `api-patterns`          | REST, GraphQL, tRPC       |
| `nodejs-best-practices` | Node.js async, modules    |
| `python-patterns`       | Python standards, FastAPI |

### Database

| Skill             | Description                 |
| ----------------- | --------------------------- |
| `database-design` | Schema design, optimization |

### Cloud & Infrastructure

| Skill                   | Description               |
| ----------------------- | ------------------------- |
| `deployment-procedures` | CI/CD, deploy workflows   |
| `server-management`     | Infrastructure management |

### Testing & Quality

| Skill                   | Description              |
| ----------------------- | ------------------------ |
| `testing-patterns`      | Jest, Vitest, strategies |
| `webapp-testing`        | E2E, Playwright          |
| `tdd-workflow`          | Test-driven development  |
| `code-review-checklist` | Code review standards    |
| `lint-and-validate`     | Linting, validation      |

### Security

| Skill                   | Description              |
| ----------------------- | ------------------------ |
| `vulnerability-scanner` | Security auditing, OWASP |
| `red-team-tactics`      | Offensive security       |

### Architecture & Planning

| Skill           | Description                |
| --------------- | -------------------------- |
| `app-builder`   | Full-stack app scaffolding |
| `architecture`  | System design patterns     |
| `plan-writing`  | Task planning, breakdown   |
| `brainstorming` | Socratic questioning       |

### Mobile

| Skill           | Description           |
| --------------- | --------------------- |
| `mobile-design` | Mobile UI/UX patterns |

### Game Development

| Skill              | Description           |
| ------------------ | --------------------- |
| `game-development` | Game logic, mechanics |

### SEO & Growth

| Skill              | Description                   |
| ------------------ | ----------------------------- |
| `seo-fundamentals` | SEO, E-E-A-T, Core Web Vitals |
| `geo-fundamentals` | GenAI optimization            |

### Shell/CLI

| Skill                | Description               |
| -------------------- | ------------------------- |
| `bash-linux`         | Linux commands, scripting |
| `powershell-windows` | Windows PowerShell        |

### Other

| Skill                     | Description               |
| ------------------------- | ------------------------- |
| `clean-code`              | Coding standards (Global) |
| `behavioral-modes`        | Agent personas            |
| `parallel-agents`         | Multi-agent patterns      |
| `mcp-builder`             | Model Context Protocol    |
| `documentation-templates` | Doc formats               |
| `i18n-localization`       | Internationalization      |
| `performance-profiling`   | Web Vitals, optimization  |
| `systematic-debugging`    | Troubleshooting           |

---

## 📦 Domain Packs (13)

Pre-configured tech stack integrations.

| Domain Pack        |
| ------------------ |
| `next-web`         |
| `python-backend`   |
| `python-ml`        |
| `csharp-backend`   |
| `unity-game`       |
| `godot-game`       |
| `python-data`      |
| `mobile-rn`        |
| `mobile-flutter`   |
| `electron-desktop` |
| `cli-tool`         |
| `chrome-extension` |
| `phaser-game`      |

---

## 🔌 MCP Servers (8)

External tool integration via Model Context Protocol. Config: `mcp_config.json`

| Category   | Server            | Package / URL                         | Purpose                              | Auth          |
| ---------- | ----------------- | ------------------------------------- | ------------------------------------ | ------------- |
| **GLOBAL** | `context7`        | `https://mcp.context7.com/mcp`        | Library docs & code examples         | API key (env) |
| **GLOBAL** | `github`          | `@modelcontextprotocol/server-github` | GitHub API integration               | PAT (env)     |
| **GLOBAL** | `playwright`      | `@playwright/mcp`                     | Browser automation & E2E testing     | No            |
| **GLOBAL** | `chrome-devtools` | `chrome-devtools-mcp`                 | Console, Network, Performance        | No            |
| **WEB**    | `shadcn`          | `shadcn@latest mcp`                   | shadcn/ui components                 | No            |
| **WEB**    | `21st-dev-magic`  | `@21st-dev/magic`                     | 21st.dev production-ready components | API key (env) |
| **DESIGN** | `figma`           | `https://mcp.figma.com/mcp`           | Figma Dev Mode design extraction     | OAuth (auto)  |
| **DATA**   | `supabase`        | `https://mcp.supabase.com/mcp`        | Database & auth integration          | OAuth (auto)  |

---

## 🔄 Workflows (31)

Slash command procedures. Invoke with `/command`.

| Command | Description |
| ------- | ----------- |
| `/brainstorm` | Structured brainstorming for projects and features. Explores multiple options before implementation. |
| `/build-fix` | Build/CI error analysis and fix. Reads full stack trace, categorizes, finds root cause, and applies minimum fix. Adapts to project domain. |
| `/code-review` | Code review workflow. Systematic review for security, performance, readability, and test coverage. |
| `/create` | Create new application command. Triggers App Builder skill and starts interactive dialogue with user. |
| `/debug` | Debugging command. Activates DEBUG mode for systematic problem investigation. |
| `/deploy` | Deployment command for production releases. Pre-flight checks and deployment execution. Adapts to project domain. |
| `/eas-build` | Expo EAS Build and Submit workflow. Configures build profiles, triggers cloud builds, manages credentials, and submits to app stores. Use for React Native/Expo cloud builds, app store submission, or CI/CD mobile pipeline. |
| `/eda` | Exploratory Data Analysis workflow. Profile dataset, detect quality issues, visualize distributions, analyze correlations, and generate actionable insights. Use for data profiling, dataset investigation, feature analysis, or data quality audit. |
| `/enhance` | Add or update features in existing application with phase-gated approval. Use when user wants to add a new feature, modify an existing feature, integrate a service, or iteratively improve functionality. Runs 5 phases with explicit approval gates between major phases. Keywords: add feature, update, modify, integrate, extend, improve, enhance. |
| `/export` | Godot 4.x game export to target platforms. Configures export presets, verifies templates, builds release binaries via headless CLI. Use for game distribution, platform builds, CI/CD export, or release packaging. |
| `/migrate` | Database migration workflow with Alembic/SQLAlchemy or Django ORM. Generates, reviews, and applies schema migrations safely. Use for schema changes, database versioning, migration review, or rollback planning. |
| `/onboard` | Codebase onboarding workflow. Systematically analyzes a new or unfamiliar repository to understand its architecture, patterns, dependencies, and key files. Produces a structured onboarding report. Use when joining a new project, starting on an unfamiliar codebase, or after a long break from a project. Keywords: onboard, analyze, understand, explore, architecture, codebase, new project, getting started. |
| `/orchestrate` | Coordinate multiple agents for complex tasks. Use for multi-perspective analysis, comprehensive reviews, or tasks requiring different domain expertise running in parallel workspaces. |
| `/package` | Electron or Tauri desktop app packaging. Builds platform-specific installers with code signing, notarization, and auto-update configuration. Use for desktop distribution, installer creation, or release builds. |
| `/plan` | Create a rigorous project plan with decision artifacts (constraints, options, trade-off matrix, ADR) before writing any code. Use when starting a new project, a major feature, or a significant refactor. Produces a PLAN-{slug}.md file. Keywords: plan, planning, architect, design, blueprint, roadmap. |
| `/prefab` | Unity prefab and asset creation. Generates prefab structure with components, materials, physics, and proper asset organization. Use for game entity creation, reusable components, prefab variants, or asset pipeline setup. |
| `/preview` | Preview server start, stop, and status check. Local development server management. Adapts to project domain. |
| `/publish` | Chrome Web Store publishing workflow. Validates manifest v3, builds extension zip, uploads to CWS, and tracks review status. Use for extension release, store submission, or publishing updates. |
| `/python-review` | Python-specific code review. Type safety, async correctness, PEP compliance, import hygiene, security patterns. Deeper than generic /code-review. |
| `/refactor-clean` | Systematic refactoring workflow for cleaning and improving working code without breaking behavior. Detects code smells, applies safe transformations, and verifies with tests after each step. |
| `/release` | CLI tool release pipeline. Version bump, changelog generation, npm/PyPI publish, git tag, and GitHub release. Use for package publishing, version management, or release automation. |
| `/scaffold` | ASP.NET Core project scaffolding. Generates solution structure with controllers, EF Core, authentication, and Docker configuration. Use for new .NET projects, solution setup, or architecture initialization. |
| `/scene` | Game scene creation wizard for Godot and Phaser. Generates scene structure with nodes/objects, scripts, physics setup, and signal wiring. Use for level design, UI screens, player/enemy creation, or menu systems. |
| `/security-review` | Security-focused code review. OWASP Top 10, credentials, auth, input validation, dependency CVEs. |
| `/status` | Report current project health, agent/workflow activity, and captured learnings. Produces a structured dashboard with tech stack, feature status, health metrics, recent decisions, and actionable recommendations. Use to answer "where are we?" on a multi-session project. Keywords: status, dashboard, health, progress, summary, check-in. |
| `/store-deploy` | Flutter app store deployment for iOS App Store and Google Play Store. Handles signing, release builds, store submission, and phased rollout. Use for mobile app publishing, store release, or production deployment. |
| `/tdd` | Test-Driven Development cycle. Write failing test first, then implement. |
| `/test` | Test generation and test running command. Creates and executes tests for code. Adapts to project domain automatically. |
| `/train` | ML model training pipeline. Data splitting, preprocessing, model training, evaluation metrics, and artifact export. Use for model development, hyperparameter tuning, experiment tracking, or training pipeline setup. |
| `/ui-ux-pro-max` | Plan and implement high-quality UI with AI-powered design intelligence. Uses 59 design personas, 107 reference sites, 33 anti-patterns, plus 50+ styles and 97 color palettes. Produces a complete design system (MASTER.md + per-page overrides) before any code is written. Use when building new UI from scratch, designing a landing page, creating a design system, or planning visual direction. Keywords: design, UI, UX, landing page, style, design system, color palette, typography, layout. |
| `/verify` | Verify project integrity with severity-tiered findings. Runs agent/skill file checks, workflow reference resolution, domain pack validation, linting, type checking, and test suite execution. Produces a structured report with critical/important/suggestion tiers and actionable fixes. Use before merging, before deploying, or when project consistency is suspected broken. Keywords: verify, validate, check, audit, integrity, pre-merge, pre-deploy. |

---

## 🎯 Skill Loading Protocol

```plaintext
User Request → Skill Description Match → Load SKILL.md
                                            ↓
                                    Read references/
                                            ↓
                                    Read scripts/
```

### Skill Structure

```plaintext
skill-name/
├── SKILL.md           # (Required) Metadata & instructions
├── scripts/           # (Optional) Python/Bash scripts
├── references/        # (Optional) Templates, docs
└── assets/            # (Optional) Images, logos
```

### Enhanced Skills (with scripts/references)

| Skill           | Files | Coverage                         |
| --------------- | ----- | -------------------------------- |
| `ui-ux-pro-max` | 27    | 50 styles, 21 palettes, 50 fonts |
| `app-builder`   | 20    | Full-stack scaffolding           |

### App Builder Note

`app-builder` now uses `blueprints/` for stack-specific reference documents.
These are planning and scaffolding blueprints, not executable starter repos.

---

## 📜 Scripts (6)

Master validation and utility scripts.

### Scripts

| Script                  | Purpose                                 | When to Use              |
| ----------------------- | --------------------------------------- | ------------------------ |
| `checklist.py`          | Priority-based validation (Core checks) | Development, pre-commit  |
| `verify_all.py`         | Comprehensive verification (All checks) | Pre-deployment, releases |
| `session_manager.py`    | Session init, CODEBASE.md generation    | Session start            |
| `setup-agent.py`        | Agent kit installation & setup          | First-time setup         |
| `auto_preview.py`       | Auto-preview for UI changes             | During development       |
| `verify_project_tmp.py` | Temporary project verification          | Quick validation         |

### Usage

```bash
# Quick validation during development
python .agent/scripts/checklist.py .

# Full verification before deployment
python .agent/scripts/verify_all.py . --url http://localhost:3000
```

### What They Check

**checklist.py** (Core checks):

- Security (vulnerabilities, secrets)
- Code Quality (lint, types)
- Schema Validation
- Test Suite
- UX Audit
- SEO Check

**verify_all.py** (Full suite):

- Everything in checklist.py PLUS:
- Lighthouse (Core Web Vitals)
- Playwright E2E
- Bundle Analysis
- Mobile Audit
- i18n Check

For details, see [scripts/README.md](scripts/README.md)

---

## 🎨 Design System

CSV-based design intelligence in `.shared/design-system/`. Used by `/ui-ux-pro-max` workflow and `frontend-specialist` agent for UI domains.

| Asset | File | Content |
| ----- | ---- | ------- |
| **Personas** | `personas.csv` | 59 unique design personas (style family, color palette, typography, layout philosophy, animation, geometry, risk level) |
| **Reference Sites** | `reference-sites.csv` | 109 award-winning websites (sector, style category, standout features, matching personas) |
| **Anti-Patterns** | `anti-patterns.csv` | 33 common design anti-patterns with severity and alternatives |

**Non-UI domains** (python-backend, python-ml, python-data, cli-tool, csharp-backend) skip this directory during installation.

---

## 📊 Statistics

| Metric                  | Value                         |
| ----------------------- | ----------------------------- |
| **Total Agents**        | 21                            |
| **Total Skill Packs**   | 59                            |
| **Total Skill Modules** | 70                            |
| **Total Workflows**     | 31                            |
| **Total Domain Packs**  | 13                            |
| **Total MCP Servers**   | 8                             |
| **Total Scripts**       | 8 (master) + 16 (skill-level) |
| **Coverage**            | ~90% web/mobile development   |

---

## 🔗 Quick Reference

| Need     | Agent                    | Skills                                  |
| -------- | ------------------------ | --------------------------------------- |
| Web App  | `frontend-specialist`    | react-best-practices, frontend-design   |
| API      | `backend-specialist`     | api-patterns, nodejs-best-practices     |
| Mobile   | `mobile-developer`       | mobile-design                           |
| Database | `database-architect`     | database-design                         |
| Security | `security-specialist`    | vulnerability-scanner, red-team-tactics |
| Testing  | `qa-automation-engineer` | testing-patterns, webapp-testing        |
| Debug    | `debugger`               | systematic-debugging                    |
| Plan     | `project-planner`        | brainstorming, plan-writing             |
