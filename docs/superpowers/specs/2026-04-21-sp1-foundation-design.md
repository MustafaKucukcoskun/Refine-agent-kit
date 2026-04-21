# SP1 Foundation Design — refine-agent-kit v2.0

**Sub-project:** SP1 — Foundation (Months 1–3 of 12-month roadmap)
**Status:** DRAFT — pending user review
**Date:** 2026-04-21
**Target Release:** refine-agent-kit v2.0-beta.1 at end of Month 3

---

## 1. Mission & Positioning

**Mission:** Build the **cross-IDE agent framework** that is the de-facto quality layer for Antigravity, Claude Code, Cursor, and Cline developers.

**Positioning (v2.0 one-liner):**
> *"Write your agent config once. Install into any IDE. Framework-grade runtime with memory that doesn't forget."*

**What v2.0 is NOT:**
- NOT an IDE (don't compete with Cursor)
- NOT a web app builder (don't compete with Manus/Bolt/v0/Lovable)
- NOT a "zero-hallucination" system (overclaim — we claim *verified workflows*)
- NOT a content-only skill pack (we are a framework with runtime)

---

## 2. High-Level Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                        refine-agent-kit v2.0                      │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐  │
│  │ User's IDE   │   │ Web Wizard   │   │ CLI                  │  │
│  │ (AG/CC/      │   │ (installer)  │   │ (refine-kit init)    │  │
│  │  Cursor/     │   └──────┬───────┘   └──────────┬───────────┘  │
│  │  Cline)      │          │                       │              │
│  └──────┬───────┘          │                       │              │
│         │                  │                       │              │
│  ┌──────▼──────────────────▼───────────────────────▼──────────┐  │
│  │                      ADAPTERS LAYER                         │  │
│  │  [antigravity] [claude-code] [cursor*] [cline*]            │  │
│  │        * = SP2                                              │  │
│  └─────────────────────────┬───────────────────────────────────┘  │
│                            │                                      │
│  ┌─────────────────────────▼───────────────────────────────────┐  │
│  │                      RUNTIME ENGINE                         │  │
│  │  state machine · phase gates · agent orchestration          │  │
│  └──┬─────────────┬──────────────┬─────────────┬──────────┬──┘  │
│     │             │              │             │          │      │
│  ┌──▼───┐    ┌───▼────┐    ┌────▼────┐    ┌───▼───┐  ┌──▼───┐  │
│  │memory│    │ eval   │    │observ-  │    │ core  │  │ sdk  │  │
│  │      │    │        │    │ ability │    │(types)│  │      │  │
│  └──────┘    └────────┘    └─────────┘    └───┬───┘  └──────┘  │
│                                                 │               │
│                                      ┌──────────▼───────────┐   │
│                                      │  shared/.agent/      │   │
│                                      │  (markdown content)  │   │
│                                      │  21+ agents, 58+     │   │
│                                      │  skills, 30+ flows,  │   │
│                                      │  13 domains          │   │
│                                      └──────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

**Data flow:** IDE hooks → Adapter → Runtime → (Memory + Eval + Observability) → Content

---

## 3. Monorepo Structure

```
refine-agent-kit/
├── packages/
│   ├── core/                       # Types, schemas, validators
│   ├── memory/                     # Context preservation engine
│   ├── runtime/                    # State machine + agent orchestration
│   ├── eval/                       # Quality scoring + rubrics
│   ├── observability/              # Cost tracking + metrics
│   ├── sdk/                        # 3rd-party extension API
│   ├── adapters/
│   │   ├── antigravity/            # Antigravity IDE adapter
│   │   └── claude-code/            # Claude Code adapter
│   ├── cli/                        # Unified CLI (replaces bin/cli.js)
│   └── installer-web/              # Next.js wizard (Track B)
├── shared/
│   └── .agent/                     # Content: agents, skills, workflows, domains
├── v1-legacy/
│   ├── bin/                        # Old bin/cli.js (frozen)
│   ├── tools/                      # Old sync scripts (frozen)
│   └── README.md                   # "This is v1 LTS"
├── tools/
│   ├── audit.ts                    # v2 audit (TS rewrite of audit.js)
│   ├── sync-inventory.ts
│   └── sync-dev-mirror.ts
├── docs-site/                      # Nextra docs
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .changeset/                     # Changesets for monorepo versioning
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── vitest.config.ts
└── .github/
    └── workflows/
        ├── ci.yml                  # Lint + test + audit every PR
        ├── release.yml             # Changesets publish
        └── eval.yml                # Nightly skill quality eval
```

**Toolchain decisions:**
- **Package manager:** pnpm workspaces (fast, disk-efficient, strict)
- **Bundler:** tsup (esbuild-based, dual ESM/CJS)
- **Test runner:** vitest (Jest-compatible, 3-5× faster)
- **Version management:** changesets (monorepo-native semver)
- **Linter:** eslint + prettier for code, vale for markdown

---

## 4. Data Model (`packages/core`)

### 4.1 Core Types

```typescript
// packages/core/src/types.ts

export type IDE = "antigravity" | "claude-code" | "cursor" | "cline"

export type ModelTier = "haiku" | "sonnet" | "opus" | "inherit"

export interface Skill {
  name: string                     // lowercase-kebab, ≤64 chars
  description: string              // ≤1024 chars, third-person, trigger-rich
  allowedTools: string[]           // tool allowlist per Anthropic spec
  version: string                  // semver
  domain?: "global" | string       // "global" or specific domain
  risk?: "safe" | "moderate" | "destructive"
  path: string                     // relative to shared/.agent/skills/
  body: string                     // markdown body
  sections?: SkillSection[]        // optional supporting docs
  deprecated?: {
    since: string                  // semver
    preferInstead: string          // alternative skill name
  }
}

export interface SkillSection {
  name: string
  file: string                     // relative path
  required: boolean
}

export interface Agent {
  name: string
  description: string
  tools: string[]                  // Antigravity tool whitelist
  model: ModelTier                 // v2.0 NEW: model tiering
  skills: string[]                 // skill pack names referenced
  body: string                     // system prompt
}

export interface Workflow {
  name: string                     // becomes /slash-command
  description: string
  phaseGated: boolean              // v2.0 NEW: enforced via runtime
  body: string
}

export interface Domain {
  id: string
  primaryAgent: string
  supportingAgents: string[]
  skills: {
    p0: string[]                   // always required
    p1: string[]                   // recommended
    p2: string[]                   // optional
  }
  workflows: string[]
  mcpExtra: string[]
  rulesFile: string
  notes?: string
  // v2.0 NEW fields
  triggers?: DomainTrigger[]       // auto-detection heuristics
  bundle?: string[]                // optional preset bundles
}

export interface DomainTrigger {
  type: "file-exists" | "file-contains" | "file-extension" | "dep"
  pattern: string
  weight: number                   // 0-1 confidence contribution
}
```

### 4.2 Memory Types (new in v2.0)

```typescript
// packages/memory/src/types.ts

export interface MemoryState {
  constraints: string              // from CONSTRAINTS.md (immutable)
  goals: GoalStack                 // current goal hierarchy
  decisions: Decision[]            // append-only log
  notes: string                    // active scratchpad
  compactionLog: CompactionEvent[] // forensics
}

export interface GoalStack {
  items: Goal[]                    // top = current, bottom = root
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string                       // UUID
  title: string
  parentId: string | null
  status: "active" | "completed" | "blocked" | "abandoned"
  createdAt: string
}

export interface Decision {
  id: string
  timestamp: string
  type: "architecture" | "implementation" | "scope" | "rollback"
  title: string
  reasoning: string                // WHY, not just what
  alternatives?: string[]          // what else was considered
  relatedGoalId?: string
}

export interface CompactionEvent {
  timestamp: string
  contextTokensBefore: number
  contextTokensAfter: number
  droppedTurns: number
  retainedSummary: string
}
```

### 4.3 Schema Validation

All types have Zod schemas in `packages/core/src/schema.ts`:
- Skill frontmatter validated against Anthropic spec (name regex, description length, third-person voice)
- Domain JSON validated for structural integrity
- Memory state round-trip validated on disk read/write

---

## 5. Adapter Interface (`packages/adapters/*`)

### 5.1 Shared Interface

```typescript
// packages/core/src/adapter.ts

export interface IDEAdapter {
  id: IDE
  displayName: string

  /** Detect if this IDE is active/installed in the workspace */
  detect(workspaceRoot: string): Promise<AdapterDetection>

  /** Install refine-kit content into the user's IDE config layout */
  install(options: InstallOptions): Promise<InstallResult>

  /** Update existing installation */
  update(options: UpdateOptions): Promise<UpdateResult>

  /** Remove refine-kit content (reversible) */
  uninstall(options: UninstallOptions): Promise<UninstallResult>

  /** Return diff preview without applying (for dry-run) */
  preview(options: InstallOptions): Promise<InstallPreview>

  /** Convert a Skill to this IDE's native format */
  formatSkill(skill: Skill): AdapterFile[]

  /** Convert an Agent to this IDE's native format */
  formatAgent(agent: Agent): AdapterFile[]

  /** Convert a Workflow (if supported) */
  formatWorkflow(workflow: Workflow): AdapterFile[]
}

export interface AdapterFile {
  path: string                     // relative to workspace
  content: string
  encoding: "utf8"
  mode?: "create" | "update" | "append"
}

export interface InstallOptions {
  workspaceRoot: string
  domain: string
  dryRun?: boolean
  skipGlobal?: boolean
}

export interface AdapterDetection {
  detected: boolean
  version?: string
  configPath?: string              // e.g., .cursor/rules.md
  evidence: string[]               // what we saw that confirms this IDE
}
```

### 5.2 Adapter-Specific Differences

| Feature | Antigravity | Claude Code | Cursor (SP2) | Cline (SP2) |
|---------|------------|-------------|--------------|-------------|
| Skill format | `.agent/skills/<name>/SKILL.md` | `.claude/skills/...` or CLAUDE.md | `.cursor/rules.md` (merged) | `cline_docs/` |
| Agent format | `.agent/agents/<name>.md` | `.claude/agents/<name>.md` | Merged into rules | `cline_docs/` |
| Workflow format | `.agent/workflows/<name>.md` | `.claude/commands/<name>.md` | N/A (inline rules) | N/A |
| Rules file | `GEMINI.md` | `CLAUDE.md` | `.cursor/rules.md` | `cline_docs/custom_instructions.md` |
| MCP config | `~/.gemini/antigravity/mcp_config.json` | `~/.claude.json` | Internal config | Cline extension settings |
| Hooks | External scripts | `.claude/settings.json` | Limited | Extension API |

### 5.3 Multi-IDE Install Strategy

User can install into multiple IDEs simultaneously:
```bash
refine-kit init --domain next-web --ides antigravity,claude-code
```

Each adapter writes to its own config location. `shared/.agent/` content is rendered differently per IDE.

---

## 6. Runtime Engine (`packages/runtime`)

### 6.1 Responsibilities

The runtime is **optional** — v2.0 can still work as installer-only (like v1). But when activated (via IDE hooks or MCP server), it provides:

1. **Phase-gated workflow execution** — enforces EXPLORE → PLAN → IMPLEMENT → VERIFY → SHIP
2. **Agent orchestration** — multi-agent parallel/sequential via `_handoff/`
3. **Memory integration** — reads/writes from `packages/memory`
4. **Eval hook** — gates on quality score before committing
5. **Observability emission** — metrics to `packages/observability`

### 6.2 State Machine

```
   EXPLORE ──┐
             ├→ (user approval) → PLAN ──┐
             │                            ├→ (user approval) → IMPLEMENT ──┐
             ↑                            │                                  │
             └───── (needs-discovery) ────┘                                  │
                                                                             ↓
                                          ROLLBACK ←─(fail)── VERIFY ←──────┘
                                             │                  │
                                             │                  ↓ (pass)
                                             └──(retry)───    SHIP
```

Each state has:
- **Entry guard** — preconditions (e.g., can't enter PLAN without spec from EXPLORE)
- **Exit guard** — acceptance (e.g., PLAN requires user approval gate)
- **Timeout** — max time in state (prevents agent-stuck scenarios)
- **Artifact contract** — what file(s) must exist to transition

### 6.3 Phase Gate Enforcement

Real gates, not prose. Implemented as:
```typescript
// packages/runtime/src/gates.ts

export interface PhaseGate {
  name: PhaseName
  preconditions: Precondition[]
  postconditions: Postcondition[]
  approvalRequired: boolean
}

const planGate: PhaseGate = {
  name: "PLAN",
  preconditions: [
    { check: "file-exists", path: "docs/EXPLORE-*.md" },
    { check: "memory-has", key: "goals.current" },
  ],
  postconditions: [
    { check: "file-exists", path: "docs/PLAN-*.md" },
    { check: "file-contains", path: "docs/PLAN-*.md", pattern: "^## Decision" },
  ],
  approvalRequired: true,
}
```

Gate failures block the transition. Runtime emits a clear error + suggested next step.

---

## 7. Memory System (`packages/memory`) — Core Moat Feature

### 7.1 Problem Statement

LLM agents lose context as sessions grow. By turn 30, they forget:
- Original constraints
- Earlier decisions
- Why the project exists
- Sub-goal hierarchy

This causes: drift, repeated work, scope creep, forgotten requirements.

**Solution:** Externalize critical state to disk. Re-ground periodically. Compact aggressively.

### 7.2 Storage Layout

```
<workspace-root>/
└── _memory/
    ├── CONSTRAINTS.md        # Immutable, derived from spec. Re-read every turn.
    ├── GOALS.md              # Hierarchical goal stack. Updated on goal transitions.
    ├── DECISIONS.log         # Append-only. One line per significant decision.
    ├── NOTES.md              # Active scratchpad. Phase-transition update.
    ├── ARTIFACTS/            # Raw outputs excluded from agent context
    │   └── <phase>/<file>
    └── COMPACTION.log        # Forensics — when context was compacted, what was dropped
```

### 7.3 Compaction Trigger

```typescript
// packages/memory/src/compaction.ts

export interface CompactionConfig {
  triggerAtTokens: number          // default: 0.7 * model.contextWindow
  aggressiveAtTokens: number       // default: 0.85 * model.contextWindow
  alwaysKeep: string[]             // paths always included (e.g., CONSTRAINTS.md)
  neverKeep: RegExp[]              // e.g., large tool outputs
}

export async function compact(
  turns: Turn[],
  config: CompactionConfig,
  memory: MemoryState,
): Promise<CompactionResult> {
  // 1. Detect current token count
  // 2. If > trigger: summarize old turns, write to NOTES.md, drop raw
  // 3. Update COMPACTION.log
  // 4. Return pruned turn list + summary
}
```

### 7.4 Re-Grounding Protocol

Every N turns OR at phase transitions, the runtime injects into the agent's next prompt:

```
<REGROUNDING>
Current goal: <top of GOALS.md>
Active constraints: <CONSTRAINTS.md content>
Last 3 decisions:
  - <latest 3 from DECISIONS.log>
Current phase: <runtime state>
</REGROUNDING>
```

This survives context compaction because it's re-injected fresh each turn (not part of accumulated history).

### 7.5 Sub-Agent Isolation

When the orchestrator spawns a sub-agent:
- Sub-agent gets clean context
- Orchestrator writes explicit brief to `_handoff/<sub-name>/brief.md`
- Sub-agent returns **≤2000 token summary** in `_handoff/<sub-name>/output.md`
- Raw work goes to `_handoff/<sub-name>/artifacts/`
- Orchestrator only consumes the summary — never pulls raw back into context

### 7.6 How IDE Adapters Wire Into Memory

| IDE | Mechanism |
|-----|-----------|
| Antigravity | Hook script watches `_memory/` dir, injects into system prompt on phase transition |
| Claude Code | `PostToolUse` hook runs memory update; `UserPromptSubmit` hook injects re-grounding |
| Cursor | MCP server `memory` — tools: `memory.read`, `memory.write`, `memory.compact` |
| Cline | Custom MCP tool + workspace state |

---

## 8. Eval Framework (`packages/eval`)

### 8.1 Purpose

Score skill quality and agent output quality. Gate on score before committing.

### 8.2 Rubric Structure

```typescript
export interface Rubric {
  name: string
  dimensions: RubricDimension[]
  passingThreshold: number         // 0-100
}

export interface RubricDimension {
  name: string                     // e.g., "clarity", "anti-slop", "actionability"
  weight: number                   // 0-1
  scoringPrompt: string            // LLM-judge prompt for 0-10 score
}
```

### 8.3 Skill Quality Rubric

| Dimension | Weight | What it scores |
|-----------|--------|----------------|
| Description triggers | 0.25 | Does it have "Use when...", specific keywords? |
| Third-person voice | 0.10 | Anthropic spec compliance |
| Content actionability | 0.25 | Code examples, decision trees, anti-patterns? |
| Uniqueness | 0.15 | Does it say something generic or specific? |
| Cross-references | 0.10 | Linked to related skills? |
| Length appropriateness | 0.15 | Not too short, not bloated |

**Passing threshold:** 70/100

### 8.4 Agent Output Eval (future)

In SP3, extend to eval agent outputs during runtime (catch hallucinations, generic filler) before they reach the user.

---

## 9. Observability (`packages/observability`)

### 9.1 Metrics Emitted

- **Cost per task:** tokens × model price
- **Tokens per phase:** explore vs plan vs implement breakdown
- **Model tier distribution:** how often haiku vs sonnet vs opus
- **Memory operations:** compactions per session, re-groundings per session
- **Gate rejections:** which phases fail most
- **Tool usage:** most-used tools, failure rates

### 9.2 Storage

Local-first: `_memory/metrics.jsonl` (one line per event).
Optional telemetry: opt-in aggregate to `telemetry.refine-kit.dev` (anonymized).

### 9.3 Dashboard (SP3-4)

Web UI: `refine-kit dashboard` → local server on `:3737` → cost/performance dashboard.

This is the **moat feature** — nobody else does cost tracking well.

---

## 10. SDK (`packages/sdk`)

### 10.1 Purpose

3rd-party developers can build their own adapters, skills, and runtime extensions.

### 10.2 Exports

```typescript
// @refine-agent-kit/sdk

export { defineSkill, defineAgent, defineWorkflow, defineDomain } from "./content"
export { defineAdapter } from "./adapter"
export { defineRubric } from "./eval"
export { Memory, GoalStack } from "./memory"
export type { IDE, Skill, Agent, Workflow, Domain } from "@refine-agent-kit/core"
```

### 10.3 Example: Custom Skill

```typescript
// my-custom-skill.ts
import { defineSkill } from "@refine-agent-kit/sdk"

export default defineSkill({
  name: "elixir-phoenix-patterns",
  description: "Phoenix LiveView patterns, GenServer design, OTP supervision trees. Use when building Elixir/Phoenix apps.",
  allowedTools: ["Read", "Write", "Edit", "Glob", "Grep"],
  version: "1.0.0",
  risk: "safe",
  body: `# Elixir Phoenix Patterns\n\n...`,
})
```

---

## 11. Migration Strategy (v1 → v2)

### 11.1 Coexistence Rules

- **v1 users:** `npx refine-agent-kit@1` continues to work. `v1-legacy/` directory frozen.
- **v2 users:** `npx refine-agent-kit@2` (or `@next` during beta).
- **Content is shared:** `shared/.agent/` is the same for both. v2 adds optional new fields (e.g., `model` on agents) — v1 ignores them.

### 11.2 v1 → v2 Upgrade Path

```bash
npx refine-agent-kit@2 migrate

# What it does:
# 1. Reads existing .agent/.refine-kit.json metadata
# 2. Detects domain + IDE
# 3. Installs v2 into parallel directory (.agent-v2/ initially)
# 4. After user confirms, renames .agent/ → .agent-v1-backup/
# 5. Renames .agent-v2/ → .agent/
# 6. Updates metadata
```

### 11.3 Backward Compat Deprecation Timeline

- **v2.0 (Month 3):** v1 still supported. v2 "beta".
- **v2.1 (Month 6):** v1 still supported. v2 "stable".
- **v2.5 (Month 9):** v1 in "LTS" (security fixes only).
- **v3.0 (Month 12+):** v1 EOL.

---

## 12. Testing Strategy

### 12.1 Test Pyramid

| Layer | Framework | Coverage Target |
|-------|-----------|-----------------|
| Unit | vitest | 80%+ on `core`, `memory`, `eval` |
| Integration | vitest + tempdir fixtures | Adapters, CLI commands |
| E2E | playwright | Web installer flow |
| Eval (semantic) | LLM-judge in CI | Every skill/agent scored nightly |

### 12.2 SP1 Test Goals

- **100+ unit tests** by end of Month 3
- **20+ integration tests** (one per CLI command × one per IDE adapter)
- **Smoke E2E:** `refine-kit init --domain next-web --ide antigravity` creates expected files
- **Nightly eval:** All skills score ≥70, failures open auto-PR

### 12.3 CI Enforcement

GitHub Actions runs on every PR:
1. `pnpm install`
2. `pnpm run lint` (eslint + vale)
3. `pnpm run test:unit`
4. `pnpm run test:integration`
5. `pnpm run audit` (updated v2 audit with Anthropic spec)
6. `pnpm run eval:skills` (LLM-judge, only on skills/ changes)

Failing any step blocks merge.

---

## 13. Build + Release Pipeline

### 13.1 Changesets Workflow

- Contributors add a changeset on PR: `pnpm changeset`
- Changeset specifies: which packages affected, major/minor/patch, description
- On merge to main, `release.yml` runs:
  - If pending changesets exist, open "Version Packages" PR
  - When that PR merges, publish to npm, create git tag, GitHub release

### 13.2 Published Packages

All under `@refine-agent-kit/*` scope:
- `@refine-agent-kit/cli` — main binary (replaces top-level `refine-agent-kit`)
- `@refine-agent-kit/core`
- `@refine-agent-kit/memory`
- `@refine-agent-kit/runtime`
- `@refine-agent-kit/eval`
- `@refine-agent-kit/observability`
- `@refine-agent-kit/sdk`
- `@refine-agent-kit/adapter-antigravity`
- `@refine-agent-kit/adapter-claude-code`
- `refine-agent-kit` — top-level convenience (installs cli + core + adapters + content)

---

## 14. SP1 Milestone Breakdown (Months 1–3)

> **Implementation plan cadence:** each month gets its own `writing-plans` invocation at its start. We do NOT write a single 3-month implementation plan. Month 1 plan is written first, executed, then we brainstorm Month 2 adjustments based on real learnings, then write Month 2 plan, etc.

### Month 1 — Scaffolding

**Track A (infra) — 60% time:**
- [ ] Set up pnpm workspaces + tsconfig.base.json
- [ ] Create `packages/core` with types + zod schemas
- [ ] Port `tools/audit.js` to `tools/audit.ts` with new validators
- [ ] Create `packages/memory` skeleton with file I/O layer
- [ ] Add vitest config + first 20 unit tests on core
- [ ] Freeze v1 into `v1-legacy/`, update docs
- [ ] GitHub Actions: basic CI (lint + test)

**Track B (visible) — 40% time:**
- [ ] Rewrite README.md (benefits-first, comparison table, screenshots)
- [ ] Create `docs-site/` skeleton (Nextra)
- [ ] Write 3 blog posts (dev.to):
  1. "Why we rewrote refine-agent-kit in TypeScript"
  2. "The context loss problem in AI agents"
  3. "Anthropic Agent Skills spec — complete validator guide"
- [ ] Set up Discord server

**Month 1 exit criteria:**
- `packages/core` published as v2.0.0-alpha.1 to npm
- CI green on main
- README rewrite merged
- 3 blog posts live
- Discord has ≥10 members

### Month 2 — Antigravity Adapter + Memory System + Web Installer v0

**Track A — 60%:**
- [ ] `packages/adapters/antigravity` — full port of v1 install logic
  - `install()` method writes all expected files
  - `detect()` heuristic: check `.agent/` or `.agents/` presence
  - `preview()` for dry-run
  - **Critical:** domain MCP merge into global config (v1 fix ported cleanly)
- [ ] `packages/memory` — full implementation
  - CONSTRAINTS, GOALS, DECISIONS, NOTES managers
  - Compaction algorithm
  - Re-grounding prompt generation
- [ ] Wire memory into Antigravity adapter: install script sets up `_memory/` skeleton + hook watcher that injects re-grounding on phase transitions
- [ ] 30+ unit tests on adapter + memory

**Track B — 40%:**
- [ ] `packages/installer-web` v0.1 (Next.js 16)
  - Page 1: Select IDE(s)
  - Page 2: Select domain
  - Page 3: Select optional add-ons
  - Page 4: "Copy this command" → `npx @refine-agent-kit/cli@2 init --domain X --ides Y`
  - Hosted on `install.refine-kit.dev`
- [ ] Docs site live on `docs.refine-kit.dev` with:
  - Quick start
  - Multi-IDE guide
  - Skill authoring guide (copied from v1 + improvements)
  - API reference (auto-generated from TypeDoc)

**Month 2 exit criteria:**
- v2 beta can fully install to Antigravity (end-to-end)
- Web installer live and returning correct commands
- Docs site live
- 10+ community skills submitted via new process

### Month 3 — Claude Code Adapter + Runtime + CI/Community

**Track A — 60%:**
- [ ] `packages/adapters/claude-code`
  - Supports `.claude/skills/` + `.claude/agents/` + `.claude/settings.json` hook integration
  - `detect()` checks for Claude Code settings + version
  - Format converter: refine-kit Skill → Claude Code skill with frontmatter differences handled
- [ ] `packages/runtime` v0.1 — state machine + phase gate enforcement (not yet auto-wired to IDE)
- [ ] `packages/cli` v2.0.0-beta.1
  - `init --ides=antigravity,claude-code`
  - `update`, `list`, `add-domain`, `help`, `version` ported
  - `migrate` (v1 → v2)

**Track B — 40%:**
- [ ] CHANGELOG.md + SECURITY.md + CODE_OF_CONDUCT.md + CONTRIBUTING.md
- [ ] GitHub issue/PR templates
- [ ] First 10 approved community skill PRs
- [ ] Docs site: Troubleshooting guide, Migration guide (v1 → v2)
- [ ] Soft launch on r/LocalLLaMA + HackerNews "Show HN"
  - Target: 1000 GitHub stars, 500 npm downloads, 50 Discord members

**Month 3 exit criteria:**
- `refine-agent-kit@2.0.0-beta.1` published on npm
- Full v1 feature parity + 2 IDE support
- Memory system live in framework (even if IDE wiring partial)
- 1000+ stars, 50+ contributors (or followers)
- Ready to begin SP2 (Cursor + Cline + runtime deep integration)

---

## 15. Success Criteria & Metrics

### 15.1 Must-Have (Blocks SP1 Exit)

- [ ] v2.0.0-beta.1 published on npm
- [ ] Antigravity + Claude Code adapters both install successfully on 3 test projects
- [ ] 100+ passing unit tests, all CI green
- [ ] All v1 test cases that make sense in v2 pass
- [ ] Web installer generates valid command for any supported IDE+domain combo
- [ ] Docs site live with Quick Start + Migration guide + Skill authoring
- [ ] Memory system successfully compacts context in demo scenario (tested)
- [ ] 0 orphan skills, Anthropic spec validation passing on all skills

### 15.2 Nice-to-Have (Soft targets)

- 1000+ GitHub stars by Month 3 end
- 20+ community contributors (PRs merged)
- 100+ Discord members
- Top 5 Hacker News ranking for launch post
- 3+ YouTube tutorial videos

### 15.3 Quality Metrics Tracked

| Metric | Target by Month 3 |
|--------|-------------------|
| Test coverage (core) | ≥80% |
| Test coverage (adapters) | ≥70% |
| Audit issues | 0 |
| Anthropic spec violations | 0 |
| Skill eval avg score | ≥80/100 |
| npm weekly downloads | 500+ |

---

## 16. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| TypeScript rewrite consumes all Month 1 (no visible output) | Medium | High | Parallel Track B forces visible work every month |
| Context preservation system over-engineered vs user need | Medium | Medium | Ship v0.1 early (month 2), iterate on real usage |
| Antigravity changes its spec mid-SP1 | Low | High | Adapter-layer abstraction shields us; update one adapter, not whole system |
| Claude Code skill format changes (Anthropic v2 spec) | Medium | Medium | Track Anthropic changelog weekly, version-pin skill format per adapter |
| Community doesn't engage, solo burnout | Medium | High | Part-time yoğun pace (not full-time), weekly off-day required |
| v1 users angry about v2 breaking changes | Low | Medium | v1 LTS continues for 6+ months, migration tool, clear changelog |
| pnpm workspaces + Changesets new to maintainer | Medium | Low | Proven tooling, good docs; 1-week ramp tolerable |
| Manus/Bolt/Lovable release similar cross-IDE feature | Low | High | They're focused on web gen, not agent frameworks. If they pivot, our moat shrinks. |

---

## 17. Out of Scope (Explicit Non-Goals for SP1)

- ❌ Cursor or Cline adapters (SP2)
- ❌ Full runtime engine with agent orchestration (SP2)
- ❌ Eval framework LLM-judge implementation (SP3)
- ❌ Model tiering implementation (SP3 — frontmatter field added in SP1 but no runtime routing)
- ❌ Marketplace / skill registry (SP3)
- ❌ Cost tracking dashboard (SP4)
- ❌ Web generator / Manus-killer (never — out of scope for framework)
- ❌ Enterprise features, SLAs, telemetry pipelines (post-v2.0)

---

## 18. Open Questions (Resolve During Implementation)

1. Should `packages/installer-web` be hosted as a static Next.js site, or does it need a backend? (Current plan: static — all generation happens client-side.)
2. Should we publish `refine-agent-kit` (unscoped) as a meta-package that depends on all others, or deprecate it and migrate users to `@refine-agent-kit/cli`?
3. Do we run eval in CI (fast, narrow rubrics) or nightly (slow, comprehensive LLM-judge)? Leaning nightly.
4. Docs site hosting: Vercel vs Cloudflare Pages? (Lean Cloudflare — better cold-start.)

---

## 19. Design Principles (Throughout)

1. **Content is king** — `shared/.agent/` is the product. Code exists to deliver it well.
2. **Adapters are thin** — no business logic in adapters; they convert data formats.
3. **Memory is first-class** — every agent call has access to persistent state.
4. **Progressive disclosure** — load only what's relevant, not everything.
5. **Fail loudly** — silent errors rotted v1; v2 errors with actionable messages.
6. **One way to do things** — no "you can use X or Y" — pick X, document why.
7. **Measure, don't assume** — eval and observability from day 1.
8. **Document decisions** — every non-obvious choice gets an ADR.
9. **Small, focused commits** — Changesets enforce this.
10. **Ship incrementally** — beta early, iterate with real users.

---

**End of SP1 Foundation Design.**
Awaiting user review before invoking writing-plans skill.
