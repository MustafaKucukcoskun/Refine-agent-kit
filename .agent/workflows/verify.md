---
description: Verify project integrity with severity-tiered findings. Runs agent/skill file checks, workflow reference resolution, domain pack validation, linting, type checking, and test suite execution. Produces a structured report with critical/important/suggestion tiers and actionable fixes. Use before merging, before deploying, or when project consistency is suspected broken. Keywords: verify, validate, check, audit, integrity, pre-merge, pre-deploy.
---

# /verify — Project Integrity & Quality Verification

$ARGUMENTS

---

## Purpose

Run **non-destructive** checks across the project and produce a structured report with severity tiers. Never modifies code — only inspects and reports.

---

## When to Use

| Use when | Do NOT use for |
|---|---|
| Before merging to main | Deep code review → use `/code-review` |
| Before deploying | Security-focused audit → use `/security-review` |
| After a major `/enhance` | UX/design review → use manual review |
| Project consistency seems broken | Performance profiling → use perf tools |

---

## Phases

```
Phase 1: Inventory Scan  →  Phase 2: Static Checks  →  Phase 3: Test Execution
                                                              ↓
                                                Phase 4: Structured Report
```

---

## Phase 1: Inventory Scan

Collect facts about the project:

- Agent files present vs. referenced in `ARCHITECTURE.md`
- Skill packs present vs. referenced in domain JSONs
- Workflow frontmatter validity
- Domain config JSON parseability
- Cross-references: every `skills:` / `agents:` / `workflows:` reference resolves

**Tool:** if `tools/audit.js` exists, prefer it: `node tools/audit.js`.

---

## Phase 2: Static Checks

Run the project's own quality commands. Skip any that don't apply.

| Check | Command | Severity if fails |
|---|---|---|
| Lint | `npm run lint` | 🟡 Important |
| Type check | `npm run type-check` or `tsc --noEmit` | 🔴 Critical |
| Format | `npm run format:check` or `prettier --check` | 🟢 Suggestion |
| Schema | `npm run schema:validate` (if exists) | 🔴 Critical |
| Dep audit | `npm audit --audit-level=high` | 🟡 Important |
| Bundle size | `npm run size` (if exists) | 🟢 Suggestion |

Each command: run, capture output, classify result.

---

## Phase 3: Test Execution

**Tests are a blocker.** Do not skip unless user explicitly asks.

| Check | Command | Severity if fails |
|---|---|---|
| Unit tests | `npm test` | 🔴 Critical |
| Integration | `npm run test:integration` (if exists) | 🔴 Critical |
| E2E smoke | `npm run test:e2e:smoke` (if exists) | 🟡 Important |

If no test framework configured, report as: `🟢 Suggestion: No tests configured — consider adding test suite`.

---

## Phase 4: Structured Report

Produce a single report with this exact shape:

```markdown
## ✅ /verify Report — <project-name>

**Overall:** PASS | FAIL | PASS_WITH_WARNINGS
**Checks run:** X / Y
**Duration:** ~Ns

---

### 🔴 Critical Issues (N)
Issues that block merge/deploy.

1. **Type error in src/foo.ts:42** — `Property 'bar' does not exist on type 'Baz'`
   - Fix: Add `bar` to `Baz` interface in `src/types.ts`, or use optional chaining

### 🟡 Important Issues (N)
Should be fixed soon but not blocking.

1. **Lint warning in src/foo.ts:15** — `no-unused-vars`
   - Fix: Remove unused import or prefix with `_`

### 🟢 Suggestions (N)
Nice-to-have improvements.

1. **No test for `utils/parser.ts`** — add unit test before next release

---

### Inventory

| Check | Result |
|---|---|
| Agents | ✅ 21/21 files present |
| Skills | ✅ 54 packs, 0 orphans |
| Workflows | ✅ 30 workflows, all frontmatter valid |
| Domain JSONs | ✅ 13 domains, 0 parse errors |

### Static Checks

| Check | Result |
|---|---|
| Lint | ✅ 0 errors, 2 warnings |
| Type check | 🔴 1 error |
| Tests | 🟡 62 pass, 1 skip |

---

### Action Plan

**Blocker (fix before merge):**
1. [ ] Fix type error in `src/foo.ts:42`

**Next sprint (fix soon):**
1. [ ] Resolve 2 lint warnings
2. [ ] Investigate skipped test

**Backlog (future):**
1. [ ] Add test for `utils/parser.ts`
```

---

## Severity Framework

| Tier | Meaning | Examples |
|---|---|---|
| 🔴 **Critical** | Blocks merge/deploy; correctness broken | Type errors, failing tests, missing critical files |
| 🟡 **Important** | Quality regression; should fix soon | Lint warnings, skipped tests, high-severity vulns |
| 🟢 **Suggestion** | Optional improvement | Missing tests on new code, style nits, minor vulns |

---

## Exit Criteria

- **PASS** — zero critical, zero important
- **PASS_WITH_WARNINGS** — zero critical, ≥ 1 important
- **FAIL** — ≥ 1 critical

Print overall status at the top of the report so CI / humans can `grep` it.

---

## Anti-Patterns

- ❌ **Silent skip** — if a check can't run, report it with reason, don't hide
- ❌ **Fabricating results** — never claim a check passed without running it
- ❌ **Modifying code** — `/verify` is read-only; fixes happen in `/enhance`
- ❌ **All-critical or all-green reports** — triage properly into tiers
- ❌ **Stopping at first failure** — run all checks, aggregate report at end

---

## Related

- `/code-review` — deeper qualitative review
- `/security-review` — OWASP / threat-model focus
- `/enhance` — apply fixes to issues found here
- `/deploy` — gated by `/verify` passing

---

## Examples

```
/verify
/verify skip-tests    # rare — only if tests currently broken and user acknowledges
/verify --ci          # stricter thresholds for CI pipelines
```
