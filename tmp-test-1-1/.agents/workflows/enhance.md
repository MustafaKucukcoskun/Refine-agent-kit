---
description: Add or update features in existing application with phase-gated approval. Use when user wants to add a new feature, modify an existing feature, integrate a service, or iteratively improve functionality. Runs 5 phases with explicit approval gates between major phases. Keywords: add feature, update, modify, integrate, extend, improve, enhance.
---

# /enhance — Feature Addition & Update (Phase-Gated)

$ARGUMENTS

---

## Purpose

Add features or iteratively improve an existing application using a **5-phase gated workflow**. Each phase produces a concrete deliverable; major phases require explicit user approval before proceeding.

---

## When to Use

| Use when | Do NOT use for |
|---|---|
| Adding a new feature | Initial project scaffolding → use `/create` |
| Modifying existing behavior | Bug fixes → use `/debug` |
| Integrating a third-party service | Refactoring only → use `/refactor-clean` |
| Cross-cutting improvement (dark mode, i18n) | Security audit → use `/security-review` |

---

## Phase-Gated Flow

```
Phase 0: Scope Detection  →  Phase 1: Impact Analysis  →  [GATE 1]
                                                              ↓
Phase 2: NFR Check (if major)  →  [GATE 2]  →  Phase 3: Implementation Plan
                                                              ↓
                                                          [GATE 3]
                                                              ↓
Phase 4: Execute & Verify  →  Phase 5: Commit & Report
```

---

## Phase 0: Scope Detection

Decide which scope tier applies — skips unnecessary phases for minor changes.

| Tier | Indicators | Phases Run |
|---|---|---|
| **Minor** | Single file, UI polish, string change, dependency bump | 0 → 3 → 4 → 5 |
| **Medium** | 2–5 files, one domain, no new data | 0 → 1 → 3 → 4 → 5 |
| **Major** | New data entity, new integration, security/auth change, cross-domain | ALL phases |

**Output:** Declare tier at start. Example: `Scope: MEDIUM (touches 3 files in frontend)`.

---

## Phase 1: Impact Analysis (Medium/Major)

Produce a short impact report:

```markdown
## Impact Analysis
- Affected files: [list with line counts]
- Affected modules: [e.g., auth, routing, db layer]
- New dependencies: [npm packages, env vars, services]
- Breaking changes: [API/schema/behavior]
- Risk level: Low | Medium | High
```

**Tools:** Use `explorer-agent` if codebase is large or unfamiliar.

### 🚦 GATE 1 — User Approval
Present the impact analysis. Ask: *"Proceed with this scope? (yes / revise / cancel)"*. Wait for answer. Do NOT skip.

---

## Phase 2: NFR Check (Major only)

Non-Functional Requirement assessment — one paragraph per axis, flag concerns:

| NFR | Question | Red Flag Triggers |
|---|---|---|
| Performance | Does this add latency / memory / bundle size? | > 10% degradation likely |
| Security | New attack surface? New secrets / tokens? | Any auth change |
| Scalability | Does this break at 10× load? | Unbounded loops, N+1 |
| Reliability | New failure modes? Rollback path? | No graceful fallback |
| Accessibility | Keyboard / screen reader impact? | New interactive UI |
| Observability | Logs / metrics / traces added? | New error path |

### 🚦 GATE 2 — NFR Approval
If any red flag triggered, present mitigation options and wait for user choice.

---

## Phase 3: Implementation Plan

Write a numbered change list — each item atomic and verifiable:

```markdown
## Plan
1. Create `src/feature/x.ts` — core logic (≈40 lines)
2. Wire into `src/app/page.tsx` — one import + one call site
3. Add `tests/feature/x.test.ts` — 3 test cases (happy path, error, edge)
4. Update `.env.example` — add `FEATURE_X_API_KEY`
5. Document in `README.md` — usage section
```

### 🚦 GATE 3 — Plan Approval
*"Plan ready. Start implementation? (yes / edit plan / cancel)"*

---

## Phase 4: Execute & Verify

Execute the plan in order. After each item:
- Run relevant checks: `npm run lint`, `npm test`, `npm run build`
- If check fails, stop and report; do not proceed to next item
- Update the plan file with `[x]` for completed items

At the end, run the full verification suite:

```bash
npm run lint          # must pass
npm test              # must pass
npm run type-check    # must pass
npm run build         # must succeed
```

**Do not claim completion if any check fails.** Report failure, propose fix, re-gate with user.

---

## Phase 5: Commit & Report

1. Stage changes: `git add <files from plan>` (not `git add .`)
2. Commit with a descriptive message:
   ```
   feat(<scope>): <one-line summary>

   - Change 1
   - Change 2

   Refs: PLAN-<slug>.md
   ```
3. Produce final report:

```markdown
## ✅ Enhancement Complete
- Tier: [Minor | Medium | Major]
- Files changed: N
- Tests added: N
- Verification: All checks passed
- Commit: <sha short> — <message>

### Next Steps
- Review the commit
- Run `/verify` before merging
- Deploy with `/deploy` when ready
```

---

## Error Handling

| Situation | Action |
|---|---|
| User denies at Gate 1/2/3 | Stop immediately, report current state, do NOT execute partial work |
| Check fails in Phase 4 | Stop, diagnose root cause, propose fix, re-gate |
| Unexpected file conflict | Stop, show diff, ask user which version wins |
| Request outside scope (e.g. security change in minor tier) | Re-detect scope, escalate tier, run additional phases |

---

## Anti-Patterns

- ❌ **Skipping gates** — every gate is there to catch scope creep and surprise changes
- ❌ **`git add .`** — always commit specific files from the plan
- ❌ **Claiming success without verification** — all checks must actually pass
- ❌ **Silent scope escalation** — if task grows, announce and re-gate
- ❌ **Partial implementation on denial** — if user says no at a gate, leave working tree clean

---

## Related

- `/plan` — for multi-session or major features, plan first, then `/enhance` per sub-task
- `/debug` — when the enhancement is "fix this bug"
- `/verify` — after completion, before merge
- `/refactor-clean` — when the enhancement is cleanup only

---

## Examples

```
/enhance add dark mode toggle
/enhance integrate Stripe payments
/enhance make profile page responsive
/enhance add search with algolia
```
