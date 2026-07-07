---
description: Report current project health, agent/workflow activity, and captured learnings. Produces a structured dashboard with tech stack, feature status, health metrics, recent decisions, and actionable recommendations. Use to answer "where are we?" on a multi-session project. Keywords: status, dashboard, health, progress, summary, check-in.
---

# /status — Project Dashboard

$ARGUMENTS

---

## Purpose

Give a fact-based snapshot of project health and active work. **Never fabricate numbers** — if data is unavailable, say so explicitly.

---

## When to Use

| Use when | Do NOT use for |
|---|---|
| Returning to a project after a break | Asking "what should I do next?" → use `/plan` |
| Multi-session feature check-in | Verifying project integrity → use `/verify` |
| Showing stakeholders current state | Deep technical review → use `/code-review` |

---

## Sources of Truth

Read only — never write. Sources:

| Section | Source |
|---|---|
| Project info | `package.json`, `CODEBASE.md`, `.refine-kit.json` |
| Feature status | `docs/PLAN-*.md` (look for `[x]` vs `[ ]`) |
| Git activity | `git log --oneline -20`, `git status` |
| Agent activity | `_handoff/*/status.md` if exists |
| Memory | `_memory/NOTES.md` or `memory-bank/consolidated_learnings.md` if exists |
| Health metrics | Last `/verify` report if cached, or run quick sample |

If a source is missing, the corresponding section reads: `(no data available)`.

---

## Report Structure

```markdown
# 📊 Project Status — <project-name>

**Generated:** <ISO timestamp>
**Branch:** <git branch> (ahead N / behind M of origin)
**Last commit:** <sha short> · <message> · <relative time>

---

## 🏷️ Project

- **Name:** <from package.json>
- **Version:** <from package.json>
- **Tech stack:** <inferred from deps>
- **Domain:** <from .refine-kit.json>

## 🎯 Features

### Done (N)
- [x] product-listing
- [x] cart
- [x] checkout

### In Progress (N)
- [ ] admin-panel — started <date>, ~60% (by file count in PLAN)

### Planned (N)
- [ ] email-notifications
- [ ] referral-system

## 🩺 Health

| Metric | Value | Trend |
|---|---|---|
| Tests passing | 62/63 | → stable |
| Lint warnings | 2 | ↓ improving |
| Bundle size | 245KB | ↑ grew 8KB |
| Type coverage | 94% | → stable |

(Trends require prior `/status` runs; mark `—` if first run.)

## 🔄 Recent Activity

**Last 7 days:**
- N commits
- M PRs merged
- X issues closed

Top changed files:
- `src/cart/checkout.ts` (4 commits)
- `src/auth/middleware.ts` (3 commits)

## 🧠 Captured Learnings

From `_memory/NOTES.md` or `memory-bank/consolidated_learnings.md`:

- **Pattern:** Pydantic v2 migration required updating all `Config` → `model_config`
- **Gotcha:** `next/image` needs explicit `sizes` prop for responsive layouts
- **Decision:** Chose Zustand over Redux for new features (see `PLAN-state-migration.md`)

## 📌 Recommendations

Prioritized list of what to do next:

1. 🔴 **Fix failing test in `cart/checkout.test.ts`** — blocking release
2. 🟡 **Address bundle size regression** — investigate recent image imports
3. 🟢 **Consider: add test for new checkout util** — currently untested

## 🚪 Next Steps

```
- If stuck → /plan  for structured design
- Before merge → /verify
- Ready to ship → /deploy
```
```

---

## Section Logic

| Section | If data present | If absent |
|---|---|---|
| Project | Show fields | `(package.json not found)` |
| Features | Parse `docs/PLAN-*.md` for checkboxes | `(no PLAN files)` |
| Health | Run light checks OR read cached | `(no /verify report yet — run /verify)` |
| Recent | `git log` parsing | `(not a git repo)` |
| Learnings | Read memory file | `(no learnings captured yet)` |
| Recommendations | Derive from Health + Learnings | Generic suggestions |

---

## Anti-Patterns

- ❌ **Fabricating metrics** — every number must have a source
- ❌ **Generic recommendations** — "add more tests" without pointing at a specific file
- ❌ **Running heavy checks** — don't run a 60s lint just for `/status`; defer to `/verify`
- ❌ **Modifying files** — read-only, always
- ❌ **Including every commit** — last 7 days or last 20, not full history

---

## Memory Integration

If `_memory/NOTES.md` exists, pick up to 3 recent learnings. If `memory-bank/consolidated_learnings.md` exists (Cline convention), prefer that. If neither exists, add a suggestion: `Consider starting a learnings log at _memory/NOTES.md for multi-session context`.

---

## Related

- `/verify` — run when Health section has stale or missing data
- `/plan` — when Recommendations suggest structured next steps
- `/enhance` — when specific item needs implementation

---

## Examples

```
/status
/status features        # focus on feature completion only
/status health          # focus on quality metrics only
```
