# refine-kit Architecture

> Comprehensive AI Agent Capability Expansion Toolkit

---

## 📋 Overview

refine-kit is a modular system consisting of:

- **21 Specialist Agents** - Role-based AI personas
- **53 Skill Packs** - Domain-specific knowledge modules
- **17 Workflows** - Slash command procedures
- **13 Domain Packs** - Tech stack integrations
- **8 MCP Servers** - External tool integrations

---

## 🧭 Source Model

- `shared/.agent/` is the single source of truth for the shipped project agent tree.
- `shared/.shared/` is the single source of truth for shipped shared assets.
- The repo-root `.agent/` and `.shared/` directories are generated development mirrors used to dogfood the package in this repository.
- The development mirror overlays the `next-web` domain on top of `shared/.agent/` so this package repo can run with a concrete local domain.

---

## 🏗️ Directory Structure

```plaintext
.agent/
├── ARCHITECTURE.md          # This file
├── agents/                  # 21 Specialist Agents
├── skills/                  # 53 Skill Packs (64 modules)
├── workflows/               # 17 Slash Commands
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

## 🧩 Skills (53 packs / 64 modules)

Modular knowledge domains that agents can load on-demand based on task context. Current shipped inventory: 54 top-level skill packs and 65 total SKILL.md modules. Current shipped inventory: 54 top-level skill packs and 65 total SKILL.md modules. Current shipped inventory: 54 top-level skill packs and 65 total SKILL.md modules. Current shipped inventory: 54 top-level skill packs and 65 total SKILL.md modules. Current shipped inventory: 54 top-level skill packs and 65 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules. Current shipped inventory: 53 top-level skill packs and 64 total SKILL.md modules.

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

## 🔄 Workflows (17)

Slash command procedures. Invoke with `/command`.

| Command            | Description                |
| ------------------ | -------------------------- |
| `/plan`            | Task breakdown             |
| `/create`          | Create new features        |
| `/debug`           | Debug issues               |
| `/test`            | Run tests                  |
| `/tdd`             | Test-driven development    |
| `/code-review`     | Automated code review      |
| `/refactor-clean`  | Clean refactoring          |
| `/security-review` | Security analysis          |
| `/deploy`          | Deploy application         |
| `/build-fix`       | Auto build fixing          |
| `/verify`          | Full system verification   |
| `/orchestrate`     | Multi-agent coordination   |
| `/brainstorm`      | Socratic discovery         |
| `/enhance`         | Improve existing code      |
| `/preview`         | Preview changes            |
| `/status`          | Check project status       |
| `/ui-ux-pro-max`   | Advanced UI/UX design task |

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

## 📊 Statistics

| Metric                  | Value                         |
| ----------------------- | ----------------------------- |
| **Total Agents**        | 21                            |
| **Total Skill Packs**   | 54                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 64                            |
| **Total Skill Modules** | 65                            |
| **Total Skill Modules** | 65                            |
| **Total Skill Modules** | 65                            |
| **Total Skill Modules** | 65                            |
| **Total Skill Modules** | 65                            |
| **Total Workflows**    | 18                            |
| **Total Domain Packs** | 13                            |
| **Total MCP Servers**   | 8                             |
| **Total Scripts**       | 6 (master) + 16 (skill-level) |
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
