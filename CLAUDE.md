# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**refine-agent-kit** is an AI Agent toolkit (npm package) for Google Antigravity IDE. It installs a multi-agent system into user projects via `npx refine-agent-kit init --domain <domain>`. Zero runtime dependencies — Node.js native modules only.

## Commands

```bash
# Sync inventory counts into docs + regenerate .agent/ mirror
npm run sync:all

# Individual sync steps
npm run sync:inventory    # Update agent/skill/workflow counts in README, ARCHITECTURE.md, package.json
npm run sync:mirror       # Regenerate repo-root .agent/ from shared/.agent/ + next-web overlay

# Audit consistency (missing skills, orphan references, domain JSON issues)
node tools/audit.js

# Smoke test (just runs --help)
npm test
```

## Source of Truth Rule

`shared/.agent/` is the **only** editable source tree. The repo-root `.agent/` is a generated mirror (shared + `domains/next-web/` overlay) for local dogfooding. **Never edit `.agent/` directly** — always edit under `shared/.agent/`, then run `npm run sync:all`.

## Architecture

### Directory Layout

- **`bin/cli.js`** — Main CLI entry point. 6 commands: `init`, `add-domain`, `list`, `update`, `help`, `version`. Copies files from `shared/` and `domains/` into user projects, installs global rules to `~/.gemini/`, and writes MCP configs.
- **`bin/inventory.js`** — Counts agents, skills, workflows, domains, design-system assets. Used by both CLI (banner stats) and sync tools.
- **`tools/sync-inventory.js`** — Reads inventory counts and patches them into README.md, ARCHITECTURE.md, and package.json description.
- **`tools/sync-dev-mirror.js`** — Regenerates `.agent/` from `shared/.agent/` plus the `next-web` domain overlay.
- **`tools/audit.js`** — Validates domain JSON consistency, checks for orphan/missing skill references, verifies workflow frontmatter.
- **`shared/.agent/`** — Shipped agent tree (agents, skills, workflows, domains, scripts, rules).
- **`shared/.agent/.shared/design-system/`** — CSV-based design system (personas, reference sites, anti-patterns).
- **`domains/`** — 13 domain overlay packs, each containing `rules/GEMINI.md`, `subdir-markers/GEMINI.md`, and optionally `mcp_config.json`.
- **`global/GEMINI.md`** — Global code quality rules installed to `~/.gemini/GEMINI.md`.

### CLI Commands

| Command | Purpose |
|---------|---------|
| `init` | Install agent system — copies `shared/.agent/`, overlays domain rules/MCP, installs global `~/.gemini/`, generates `.env.agent.example` |
| `add-domain` | Write a subdirectory GEMINI.md marker for monorepo setups |
| `list` | Show installed agents, skills, workflows, domain, and version metadata |
| `update` | Re-install agent system preserving domain choice (`--dry-run` to preview) |
| `help` | Print usage with all flags and available domains |
| `version` | Print package version |

### Skill Filtering Pipeline

`init` does **not** copy all 54 skill packs. It builds an allow-list from three sources:

1. **Domain JSON** (`shared/.agent/domains/<domain>.json`) — `skills.p0`, `skills.p1`, `skills.p2` arrays
2. **Agent frontmatter** — reads `skills:` field from `primary_agent` and `supporting_agents` defined in domain JSON
3. **Hardcoded universal set** — `universalAgentSkills` in `bin/cli.js` (~line 482)

Same filtering applies to workflows via `universalWorkflows` (~line 540) + domain JSON `workflows` array.

Only the union of these three sources gets copied to the user's project.

### `.agents/` Directory Support

Antigravity IDE moved to `.agents/` (plural) since v1.18.4, but `.agent/` (singular) has backward compatibility. The CLI supports both via `resolveAgentDir()` in `bin/cli.js`:

- Default: `.agent/` (backward compat)
- Auto-detect: if `.agents/` already exists, use it
- Explicit: `--agents-dir .agents` flag overrides

### Key Conventions

- All JS files use CommonJS (`require`/`module.exports`), no build step.
- Agent definitions are Markdown files in `shared/.agent/agents/`.
- Skills are organized as packs (directories) containing one or more `SKILL.md` modules.
- Domain configs are JSON files in `shared/.agent/domains/` that map skill groups to domain names.
- Workflows are Markdown files with YAML frontmatter (description field required).
- The `files` field in package.json controls what ships to npm: `bin/`, `global/`, `shared/`, `domains/`.

### Antigravity Frontmatter Formats

These formats are critical — Antigravity uses them for agent routing, skill loading, and tool permissions.

**Agent** (`shared/.agent/agents/*.md`):
```yaml
---
name: agent-name
description: What this agent does. Include "Use when..." and trigger keywords — Antigravity matches semantically.
tools: Read, Grep, Glob, Bash, Edit, Write    # Antigravity enforces this tool whitelist
model: inherit                                  # Always "inherit"
skills: skill-pack-1, skill-pack-2              # Comma-separated skill pack directory names
---
```

**Skill** (`shared/.agent/skills/<pack>/SKILL.md`):
```yaml
---
name: skill-name
description: What this skill teaches. Include "Use when..." triggers — Antigravity loads skills via semantic matching on this field.
allowed-tools: Read, Glob, Grep                # Required — Antigravity uses this for tool permissions per skill
---
```

**Workflow** (`shared/.agent/workflows/*.md`):
```yaml
---
description: What this workflow does. Becomes a slash command in Antigravity.
---
```

**Why this matters:** `description` drives Antigravity's progressive disclosure — skills are loaded on-demand based on semantic relevance, not bulk-loaded. `allowed-tools` / `tools` controls which tools the agent/skill can access. Missing fields = broken Antigravity integration.

### Multi-Agent Orchestration

The orchestrator agent supports three execution models for Antigravity's Agent Manager:

- **Model A — Parallel Workspaces**: Each agent runs in its own workspace simultaneously. Best for independent analysis tasks.
- **Model B — Sequential Chain**: Agents run one after another, each building on the previous output.
- **Model C — Hybrid**: Mix of parallel groups with sequential dependencies.

Inter-agent communication uses the `_handoff/` directory protocol:
```
_handoff/{agent-name}/
├── status.md      # PENDING | IN_PROGRESS | DONE | BLOCKED
├── output.md      # Agent's deliverable
├── issues.md      # Problems found (optional)
└── artifacts/     # Generated files (optional)
```

### Domain JSON Format

Each domain config in `shared/.agent/domains/<name>.json`:

```json
{
  "domain": "next-web",
  "primary_agent": "frontend-specialist",
  "supporting_agents": ["seo-specialist", "performance-optimizer"],
  "skills": {
    "p0": ["nextjs-react-expert"],
    "p1": ["seo-fundamentals"],
    "p2": ["nodejs-best-practices"]
  },
  "workflows": ["/ui-ux-pro-max", "/deploy"],
  "mcp_extra": ["21st-dev-magic", "shadcn"]
}
```

`p0`/`p1`/`p2` are priority tiers (all get installed — tiers are informational).

### npm Publishing

The `prepack` script runs `sync:all` automatically before `npm pack` / `npm publish`, ensuring inventory counts and the dev mirror are up to date. The published binary names are both `refine-agent-kit` and `refine-kit`.

## Development Workflows

### Adding a new skill pack
1. Create directory: `shared/.agent/skills/<pack-name>/`
2. Write `SKILL.md` with required frontmatter (`name`, `description` with "Use when..." triggers, `allowed-tools`)
3. Reference it in one of: domain JSON `skills.p0/p1/p2`, agent frontmatter `skills:`, or `universalAgentSkills` in `bin/cli.js:482`
4. Run `npm run sync:all` then `node tools/audit.js`

### Adding a new domain
1. Create `shared/.agent/domains/<name>.json` with required fields
2. Create `domains/<name>/rules/GEMINI.md` and `domains/<name>/subdir-markers/GEMINI.md`
3. Add domain key to `DOMAINS` object in `bin/cli.js`
4. Optionally add `mcp_config.json` to `domains/<name>/`
5. Run `npm run sync:all` then `node tools/audit.js`

### Adding a new agent
1. Create `shared/.agent/agents/<name>.md` with frontmatter (`name`, `description`, `tools`, `model: inherit`, `skills`)
2. All referenced skills must exist in `shared/.agent/skills/`
3. Run `npm run sync:all` — agents are NOT filtered, always copied

### Validation checklist (run after any change)
```bash
node tools/audit.js        # Domain consistency, orphan skills, missing refs
npm run sync:all           # Update counts in docs + regenerate mirror
npm test                   # Smoke test
```

## Claude Code Configuration

This project has a `.claude/settings.json` that enforces the Source of Truth Rule:
- **Denied**: Writing to `.agent/` (mirror) directly
- **Allowed**: `npm run sync:*`, `node tools/audit.js`, `git` commands
- **Hook**: `PostToolUse` runs audit.js automatically after Write/Edit operations

## Gotchas

- **Universal skill/workflow sets are hardcoded** — Adding a new skill or workflow that should be available in ALL domains requires editing `universalAgentSkills` (~line 482) or `universalWorkflows` (~line 540) in `bin/cli.js`. Otherwise it only ships to domains that explicitly list it.
- **Agents are NOT filtered** — All 21 agents are always copied (they're small). Only skills and workflows are domain-filtered.
- **Skill sub-paths** — Some domain JSONs reference skills like `game-development/pc-games`. The CLI handles this via `s.startsWith(skillDir + "/")` matching at `bin/cli.js:605`.
- **`prepack` runs sync automatically** — Don't forget: `npm publish` triggers `sync:all`. If inventory counts are wrong after publish, the sync tools may have a bug.
