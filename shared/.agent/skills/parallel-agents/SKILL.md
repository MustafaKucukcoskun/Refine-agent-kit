---
name: parallel-agents
description: Multi-agent orchestration with parallel workspace spawning and artifact-based handoff. Use when multiple independent tasks can run simultaneously with different domain expertise, or when comprehensive analysis requires multiple perspectives working in isolated workspaces.
allowed-tools: Read, Glob, Grep
---

# Parallel Agents — Workspace-Based Multi-Agent Orchestration

> Coordinate specialized agents running in parallel workspaces via Antigravity's Agent Manager

## Overview

This skill enables coordinating multiple specialized agents through Antigravity's Agent Manager. Each agent runs in its own isolated workspace. Agents communicate through filesystem artifacts in the `_handoff/` directory, not through shared context.

## When to Use Parallel Orchestration

**Good for:**
- Complex tasks requiring multiple expertise domains simultaneously
- Code analysis from security, performance, and quality perspectives in parallel
- Comprehensive reviews (architecture + security + testing running at the same time)
- Feature implementation where backend + frontend + database work can proceed independently

**Not for:**
- Simple, single-domain tasks (one agent suffices)
- Debugging chains where each step depends on previous findings (use sequential)
- Tasks where agents need real-time access to each other's in-progress work

---

## Execution Models

### Model A: Parallel Workspaces

Agents run simultaneously in isolated workspaces. Best for independent tasks.

```
Agent Manager
  |
  +-- [Workspace 1: frontend-specialist]  -- UI components
  |     reads: _handoff/orchestrator/plan.md
  |     writes: _handoff/frontend-specialist/output.md
  |
  +-- [Workspace 2: backend-specialist]   -- API endpoints
  |     reads: _handoff/orchestrator/plan.md
  |     writes: _handoff/backend-specialist/output.md
  |
  +-- [Workspace 3: test-engineer]        -- test scaffolding
        reads: _handoff/orchestrator/plan.md
        writes: _handoff/test-engineer/output.md
```

**Key characteristics:**
- Each agent has its own workspace (no shared state)
- Communication through `_handoff/` directory artifacts
- All agents can start immediately if inputs are defined upfront
- Best throughput for independent work

### Model B: Sequential Chain

Agents run one at a time, each consuming the previous agent's output. Best for dependent tasks.

```
explorer-agent
  -> findings -> backend-specialist
                   -> changes -> test-engineer
                                   -> verification
```

**Key characteristics:**
- Agents share context within one session
- Direct context passing (no filesystem artifacts needed)
- Each step depends on previous step's output
- Simpler setup but slower for independent tasks

### Model C: Hybrid (Grouped Parallel + Sequential Dependencies)

Mix of parallel groups with sequential gates between them. Best for complex tasks with partial dependencies.

```
Phase 1 (Parallel):
  [database-architect]  -- schema design
  [security-auditor]    -- auth architecture
           |
     Gate: Both complete
           |
Phase 2 (Parallel):
  [backend-specialist]  -- API implementation (uses schema + auth spec)
  [frontend-specialist] -- UI components (uses schema for types)
           |
     Gate: Both complete
           |
Phase 3 (Sequential):
  [test-engineer]       -- integration tests for all new code
```

### Choosing the Right Model

| Scenario | Model | Reason |
| --- | --- | --- |
| Build feature (frontend + backend + tests) | Parallel or Hybrid | Domains are independent |
| Debug cross-cutting issue | Sequential | Each step depends on findings |
| Security audit (static + dynamic) | Parallel | Analyses are independent |
| Refactor API then update consumers | Sequential | Consumers depend on new API |
| Code review from 3 perspectives | Parallel | Reviewers are independent |
| Full-stack feature with DB migration | Hybrid | Schema first, then parallel impl |

---

## Handoff Protocol

When agents run in separate workspaces, they communicate through the `_handoff/` directory.

### Directory Structure

```
_handoff/
  orchestrator/
    plan.md              # Execution plan with agent assignments
    assignments.md       # What each agent should produce
  {agent-name}/
    status.md            # PENDING | IN_PROGRESS | DONE | BLOCKED
    output.md            # Agent's primary deliverable
    issues.md            # Problems, blockers, questions
    artifacts/           # Generated files (schemas, configs, specs)
```

### Writing Handoff Artifacts

**Every agent MUST:**

1. Read `_handoff/orchestrator/plan.md` before starting
2. Write `_handoff/{self}/status.md` with current state
3. Write `_handoff/{self}/output.md` with deliverables
4. Document cross-agent dependencies in output.md

**status.md format:**
```markdown
---
agent: backend-specialist
status: DONE
---
Completed API endpoint implementation.
Blocked by: none
Produces: artifacts/api-spec.json (for test-engineer)
```

**output.md format:**
```markdown
---
agent: backend-specialist
type: implementation
files_changed:
  - src/api/users.ts
  - src/api/auth.ts
---

## Summary
Implemented user API with JWT auth.

## Dependencies for Other Agents
- test-engineer: New endpoints need E2E tests (see artifacts/api-spec.json)
- frontend-specialist: Auth token format in artifacts/auth-contract.md
```

---

## Orchestration Patterns

### Pattern 1: Comprehensive Code Review

**Model:** Parallel Workspaces

```
Spawn 3 workspaces simultaneously:
  [security-auditor]        -- OWASP compliance, auth review
  [performance-optimizer]   -- bottlenecks, N+1, bundle size
  [test-engineer]           -- coverage gaps, flaky tests

Each writes findings to _handoff/{self}/output.md
Orchestrator synthesizes all findings into unified review
```

### Pattern 2: Full-Stack Feature Implementation

**Model:** Hybrid (Grouped Parallel)

```
Phase 1 (Foundation):
  [database-architect]  -- schema + migration
  [security-auditor]    -- auth spec for new feature

Phase 2 (Implementation — after Phase 1):
  [backend-specialist]  -- API endpoints (uses schema)
  [frontend-specialist] -- UI components (uses schema types)

Phase 3 (Verification — after Phase 2):
  [test-engineer]       -- unit + E2E tests
```

### Pattern 3: Security Audit

**Model:** Parallel Workspaces

```
Spawn simultaneously:
  [security-auditor]    -- static analysis, config review, OWASP
  [penetration-tester]  -- active testing, exploit discovery

Both write to _handoff/ -> orchestrator merges into prioritized report
```

### Pattern 4: Bug Investigation

**Model:** Sequential Chain

```
Step 1: explorer-agent  -- map affected code paths
Step 2: debugger        -- root cause analysis (using explorer's map)
Step 3: test-engineer   -- write regression test
Step 4: [domain-agent]  -- implement fix
```

---

## Available Agents (17 Specialist + 3 Built-in)

### Specialist Agents

| Agent | Expertise | Best Paired With |
| --- | --- | --- |
| `orchestrator` | Coordination, planning | project-planner |
| `security-auditor` | OWASP, auth, vulnerabilities | penetration-tester |
| `penetration-tester` | Active security testing | security-auditor |
| `backend-specialist` | API, Node.js, Python, DB | database-architect |
| `frontend-specialist` | React, Next.js, Tailwind | performance-optimizer |
| `test-engineer` | Unit, E2E, coverage | any implementation agent |
| `devops-engineer` | CI/CD, Docker, deploy | backend-specialist |
| `database-architect` | Schema, migrations, SQL | backend-specialist |
| `mobile-developer` | React Native, Flutter | test-engineer |
| `debugger` | Root cause analysis | explorer-agent |
| `explorer-agent` | Codebase discovery | any agent (recon phase) |
| `documentation-writer` | Docs, README, API docs | only if explicitly requested |
| `performance-optimizer` | Profiling, Web Vitals | frontend-specialist |
| `project-planner` | Task breakdown, roadmap | orchestrator |
| `seo-specialist` | SEO, meta, analytics | frontend-specialist |
| `game-developer` | Unity, Godot, Phaser | test-engineer |
| `product-manager` | PRD, user stories | project-planner |

### Antigravity Built-in Agents

| Agent | Model | Purpose |
| --- | --- | --- |
| **Explore** | Haiku | Fast read-only codebase search |
| **Plan** | Sonnet | Research during plan mode |
| **General-purpose** | Sonnet | Complex multi-step modifications |

Use **Explore** for quick searches, **specialist agents** for domain expertise.

---

## Synthesis Protocol

After all agents complete their work, synthesize:

```markdown
## Orchestration Synthesis

### Task Summary
[What was accomplished]

### Execution Model Used
[Parallel / Sequential / Hybrid — and why]

### Agent Contributions
| Agent | Finding / Deliverable | Status |
| --- | --- | --- |
| security-auditor | Found XSS in form handler | DONE |
| backend-specialist | Refactored auth middleware | DONE |
| test-engineer | Added 12 new tests, 94% coverage | DONE |

### Consolidated Recommendations
1. **Critical**: [Issue from Agent A]
2. **Important**: [Issue from Agent B]
3. **Nice-to-have**: [Enhancement from Agent C]

### Action Items
- [ ] Fix critical security issue (from security-auditor)
- [ ] Refactor API endpoint (from backend-specialist)
- [ ] Add missing E2E tests (from test-engineer)
```

---

## Best Practices

1. **Define outputs before spawning** — Each agent must know what artifacts to produce
2. **Use parallel when tasks are independent** — Don't serialize work that can run simultaneously
3. **Use sequential when tasks have dependencies** — Don't parallelize when order matters
4. **Always include test-engineer** — Any code modification needs verification
5. **Keep handoff artifacts concise** — Agents read each other's output; verbosity wastes tokens
6. **Synthesize into one report** — User gets unified findings, not 5 separate documents

---

## Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
| --- | --- | --- |
| "First do X, then Y, then Z" for independent tasks | Wastes time serializing parallel work | Use parallel workspaces |
| Agents sharing context directly in parallel | Impossible — parallel agents have isolated workspaces | Use `_handoff/` artifacts |
| Spawning 6+ agents for a simple task | Overhead exceeds benefit | 2-3 agents max for simple tasks |
| No handoff plan before spawning | Agents don't know what to produce | Write plan.md first |
| Skipping synthesis | User gets fragmented findings | Always merge into one report |
