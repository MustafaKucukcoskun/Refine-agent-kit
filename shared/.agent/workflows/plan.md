---
description: Create a rigorous project plan with decision artifacts (constraints, options, trade-off matrix, ADR) before writing any code. Use when starting a new project, a major feature, or a significant refactor. Produces a PLAN-{slug}.md file. Keywords: plan, planning, architect, design, blueprint, roadmap.
---

# /plan — Decision-Quality Project Planning

$ARGUMENTS

---

## 🔴 Critical Rules

1. **NO CODE WRITING** — This workflow produces planning artifacts only. The file `PLAN-{slug}.md` is the deliverable.
2. **Socratic Gate** — Ask clarifying questions before committing to a plan.
3. **Decision Artifacts Are Mandatory** — constraints, options, trade-off matrix, chosen path, risk register.
4. **Delegate to `project-planner` agent** — do not plan inline.

---

## When to Use

| Use when | Do NOT use for |
|---|---|
| New project from scratch | Single-file edits → use `/enhance` |
| Major feature crossing 5+ files | Bug fixes → use `/debug` |
| Architecture change / migration | Quick polish → inline request |
| Multi-session work that needs documentation | Ad-hoc questions |

---

## Phase Flow

```
Phase -1: Context Load  →  Phase 0: Socratic Gate  →  Phase 1: Discovery
                                                            ↓
Phase 2: Decision Design  →  Phase 3: Plan Draft  →  [GATE]  →  PLAN-{slug}.md
```

---

## Phase -1: Context Load

Read existing context to avoid redundant questions.

- `CODEBASE.md` (if exists) — tech stack, conventions
- `docs/PLAN-*.md` — prior plans
- `.agent/rules/GEMINI.md` — domain rules
- Conversation history — prior decisions the user made

Skip any question whose answer is already in context.

---

## Phase 0: Socratic Gate

Ask **up to 5 clarifying questions**, only those genuinely needed:

- What problem does this solve? (business goal, not implementation)
- Who uses it? (user archetype, scale)
- What is explicitly OUT of scope?
- What are the hard constraints? (budget, timeline, tech choice locked in)
- Is there a prior version / competitor reference?

If user says "just plan it" and skips — proceed with best-guess assumptions, flag them clearly in the plan.

---

## Phase 1: Discovery

Map the terrain:

- **Current state:** what exists now (files, modules, services)
- **Target state:** what will exist after
- **Gap:** the delta
- **Dependencies:** external systems, libraries, APIs, team approvals
- **Unknowns:** what must be learned before committing

**Tool:** delegate to `explorer-agent` if codebase is unfamiliar.

---

## Phase 2: Decision Design (MANDATORY)

This is where most plans fail. Produce **all five artifacts** — no skipping:

### Artifact 1: Constraint Envelope

```markdown
### Constraints
**Hard (non-negotiable):**
- [e.g., must run on Node 18+]
- [e.g., PostgreSQL already in prod]

**Soft (strong preference):**
- [e.g., prefer TypeScript]
- [e.g., CI time < 5 min]

**Open (flexible):**
- [e.g., any UI library]
```

### Artifact 2: Option Space (minimum 3)

```markdown
### Options

**Option A — Conservative**
Use existing patterns, minimal new dependencies. Safe, slower to ship.

**Option B — Balanced (recommended baseline)**
Adopt 1-2 new tools where they clearly help, reuse elsewhere.

**Option C — Frontier**
New stack / cutting-edge approach. Higher upside, higher risk.
```

### Artifact 3: Trade-off Scoring Matrix

```markdown
### Trade-off Matrix (5 = best, 1 = worst)

| Dimension | A | B | C |
|---|---|---|---|
| Correctness risk | 5 | 4 | 2 |
| Operability | 4 | 5 | 3 |
| Time-to-value | 2 | 5 | 3 |
| Team fit | 5 | 4 | 2 |
| Cost | 4 | 4 | 2 |
| Evolvability | 2 | 4 | 5 |
| **Total** | **22** | **26** | **17** |
```

### Artifact 4: ADR-Lite (Architecture Decision Record)

```markdown
### Decision

**Chosen:** Option B

**Rationale:**
- Highest total score across dimensions that matter most (time-to-value, operability)
- Conservative enough for team skill set
- Leaves escape hatches for future evolution

**Rollback trigger:**
- If metric X degrades > 20% → revert to Option A
- If team velocity drops in sprint 2 → simplify scope
```

### Artifact 5: Risk Register

```markdown
### Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Third-party API rate limits | Medium | High | Implement caching + queue |
| Schema migration downtime | Low | High | Blue-green deploy |
| New dep has vuln | Low | Medium | `npm audit` in CI, pin versions |
```

---

## Phase 3: Plan Draft

Combine decision artifacts + concrete task breakdown into `docs/PLAN-{slug}.md`:

```markdown
# PLAN-{slug}

## Summary
One-paragraph outcome statement.

## Constraints
[From Artifact 1]

## Options Considered
[From Artifact 2]

## Decision
[From Artifact 4 — ADR-Lite]

## Risks
[From Artifact 5]

## Task Breakdown

| # | Task | Owner Agent | Depends On | Est |
|---|---|---|---|---|
| 1 | Scaffold module X | backend-specialist | — | 1h |
| 2 | Add schema | database-architect | 1 | 30m |
| 3 | Wire API | backend-specialist | 2 | 1h |
| 4 | Frontend form | frontend-specialist | 3 | 1h |
| 5 | Tests | test-engineer | 1–4 | 2h |

## Success Criteria
- [ ] All tasks done
- [ ] `npm test` green
- [ ] Manual smoke test passes
- [ ] No regressions in CI

## Out of Scope
- [explicitly list what is NOT in this plan]
```

---

## 🚦 Gate — Plan Approval

Present the plan and ask:
*"Plan ready at `docs/PLAN-{slug}.md`. Review and confirm, or request changes."*

Do NOT proceed to implementation from this workflow. User runs `/enhance` (or `/create` for scaffolding) per task once the plan is approved.

---

## Naming

| Request | File |
|---|---|
| `e-commerce site with cart` | `docs/PLAN-ecommerce-cart.md` |
| `mobile fitness app` | `docs/PLAN-fitness-app.md` |
| `fix auth bug` | (too small — use `/debug` instead) |
| `add dark mode` | `docs/PLAN-dark-mode.md` |
| `SaaS dashboard analytics` | `docs/PLAN-saas-dashboard.md` |

Rule: 2–3 key words, lowercase, hyphens, ≤ 30 chars.

---

## Anti-Patterns

- ❌ **Skipping decision artifacts** — "I'll just pick the obvious one" produces brittle plans
- ❌ **Only one option** — without alternatives, trade-offs are invisible
- ❌ **Scoring without a matrix** — "feels right" is not a decision
- ❌ **Planning without reading current state** — recommendations become fantasy
- ❌ **Writing code in this workflow** — the output is a markdown plan, nothing else
- ❌ **Over-engineering** — 3 options is plenty; don't generate 7 and paralyze the user

---

## After Approval

```
User: approves plan
↓
/enhance build-{task-slug}   ← per implementation task in plan
↓
/verify                       ← when all tasks done
↓
/deploy                       ← ship
```

---

## Examples

```
/plan e-commerce site with cart
/plan mobile app for fitness tracking
/plan migrate from Redux to Zustand
/plan add multi-tenant support
```
