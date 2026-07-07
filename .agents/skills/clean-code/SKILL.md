---
name: clean-code
description: Pragmatic coding standards — SRP, DRY, KISS, YAGNI — enforcing concise, readable, unsurprising code. Applies on EVERY code modification to prevent over-engineering, unnecessary abstractions, verbose docstrings, defensive nothing-checks, and AI-generated filler. Global quality gate loaded for all coding agents. Keywords: clean code, refactor, code quality, simplicity, DRY, SOLID, conciseness, anti-slop.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 2.0
priority: CRITICAL
---

# Clean Code — Pragmatic AI Coding Standards

> **CRITICAL SKILL** — Be **concise, direct, solution-focused**. This is the quality floor for every code change across every domain.

## When to Use vs. Related Skills

| You want to… | Use |
|---|---|
| Apply quality gate to any code change | **clean-code** (this — always) |
| Refactor existing messy code | `refactoring-patterns` + clean-code |
| Choose between tech/architecture options | `architecture` |
| Review a PR | `code-review-checklist` + clean-code |
| Lint/format automatically | `lint-and-validate` |

---

## Core Principles

| Principle | Rule |
|-----------|------|
| **SRP** | Single Responsibility - each function/class does ONE thing |
| **DRY** | Don't Repeat Yourself - extract duplicates, reuse |
| **KISS** | Keep It Simple - simplest solution that works |
| **YAGNI** | You Aren't Gonna Need It - don't build unused features |
| **Boy Scout** | Leave code cleaner than you found it |

---

## Naming Rules

| Element | Convention |
|---------|------------|
| **Variables** | Reveal intent: `userCount` not `n` |
| **Functions** | Verb + noun: `getUserById()` not `user()` |
| **Booleans** | Question form: `isActive`, `hasPermission`, `canEdit` |
| **Constants** | SCREAMING_SNAKE: `MAX_RETRY_COUNT` |

> **Rule:** If you need a comment to explain a name, rename it.

---

## Function Rules

| Rule | Description |
|------|-------------|
| **Small** | Max 20 lines, ideally 5-10 |
| **One Thing** | Does one thing, does it well |
| **One Level** | One level of abstraction per function |
| **Few Args** | Max 3 arguments, prefer 0-2 |
| **No Side Effects** | Don't mutate inputs unexpectedly |

---

## Code Structure

| Pattern | Apply |
|---------|-------|
| **Guard Clauses** | Early returns for edge cases |
| **Flat > Nested** | Avoid deep nesting (max 2 levels) |
| **Composition** | Small functions composed together |
| **Colocation** | Keep related code close |

---

## AI Coding Style

| Situation | Action |
|-----------|--------|
| User asks for feature | Write it directly |
| User reports bug | Fix it, don't explain |
| No clear requirement | Ask, don't assume |

---

## Anti-Patterns (DON'T)

| ❌ Pattern | ✅ Fix |
|-----------|-------|
| Comment every line | Delete obvious comments |
| Helper for one-liner | Inline the code |
| Factory for 2 objects | Direct instantiation |
| utils.ts with 1 function | Put code where used |
| "First we import..." | Just write code |
| Deep nesting | Guard clauses |
| Magic numbers | Named constants |
| God functions | Split by responsibility |

---

## 🔴 Before Editing ANY File (THINK FIRST!)

**Before changing a file, ask yourself:**

| Question | Why |
|----------|-----|
| **What imports this file?** | They might break |
| **What does this file import?** | Interface changes |
| **What tests cover this?** | Tests might fail |
| **Is this a shared component?** | Multiple places affected |

**Quick Check:**
```
File to edit: UserService.ts
└── Who imports this? → UserController.ts, AuthController.ts
└── Do they need changes too? → Check function signatures
```

> 🔴 **Rule:** Edit the file + all dependent files in the SAME task.
> 🔴 **Never leave broken imports or missing updates.**

---

## Summary

| Do | Don't |
|----|-------|
| Write code directly | Write tutorials |
| Let code self-document | Add obvious comments |
| Fix bugs immediately | Explain the fix first |
| Inline small things | Create unnecessary files |
| Name things clearly | Use abbreviations |
| Keep functions small | Write 100+ line functions |

> **Remember: The user wants working code, not a programming lesson.**

---

## 🔴 Self-Check Before Completing (MANDATORY)

**Before saying "task complete", verify:**

| Check | Question |
|-------|----------|
| ✅ **Goal met?** | Did I do exactly what user asked? |
| ✅ **Files edited?** | Did I modify all necessary files? |
| ✅ **Code works?** | Did I test/verify the change? |
| ✅ **No errors?** | Lint and TypeScript pass? |
| ✅ **Nothing forgotten?** | Any edge cases missed? |

> 🔴 **Rule:** If ANY check fails, fix it before completing.

---

## Verification Scripts (MANDATORY)

> 🔴 **CRITICAL:** Each agent runs ONLY their own skill's scripts after completing work.

### Agent → Script Mapping

| Agent | Script | Command |
|-------|--------|---------|
| **frontend-specialist** | UX Audit | `python .agent/skills/frontend-design/scripts/ux_audit.py .` |
| **frontend-specialist** | A11y Check | `python .agent/skills/frontend-design/scripts/accessibility_checker.py .` |
| **backend-specialist** | API Validator | `python .agent/skills/api-patterns/scripts/api_validator.py .` |
| **mobile-developer** | Mobile Audit | `python .agent/skills/mobile-design/scripts/mobile_audit.py .` |
| **database-architect** | Schema Validate | `python .agent/skills/database-design/scripts/schema_validator.py .` |
| **security-auditor** | Security Scan | `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .` |
| **seo-specialist** | SEO Check | `python .agent/skills/seo-fundamentals/scripts/seo_checker.py .` |
| **seo-specialist** | GEO Check | `python .agent/skills/geo-fundamentals/scripts/geo_checker.py .` |
| **performance-optimizer** | Lighthouse | `python .agent/skills/performance-profiling/scripts/lighthouse_audit.py <url>` |
| **test-engineer** | Test Runner | `python .agent/skills/testing-patterns/scripts/test_runner.py .` |
| **test-engineer** | Playwright | `python .agent/skills/webapp-testing/scripts/playwright_runner.py <url>` |
| **Any agent** | Lint Check | `python .agent/skills/lint-and-validate/scripts/lint_runner.py .` |
| **Any agent** | Type Coverage | `python .agent/skills/lint-and-validate/scripts/type_coverage.py .` |
| **Any agent** | i18n Check | `python .agent/skills/i18n-localization/scripts/i18n_checker.py .` |

> ❌ **WRONG:** `test-engineer` running `ux_audit.py`
> ✅ **CORRECT:** `frontend-specialist` running `ux_audit.py`

---

### 🔴 Script Output Handling (READ → SUMMARIZE → ASK)

**When running a validation script, you MUST:**

1. **Run the script** and capture ALL output
2. **Parse the output** - identify errors, warnings, and passes
3. **Summarize to user** in this format:

```markdown
## Script Results: [script_name.py]

### ❌ Errors Found (X items)
- [File:Line] Error description 1
- [File:Line] Error description 2

### ⚠️ Warnings (Y items)
- [File:Line] Warning description

### ✅ Passed (Z items)
- Check 1 passed
- Check 2 passed

**Should I fix the X errors?**
```

4. **Wait for user confirmation** before fixing
5. **After fixing** → Re-run script to confirm

> 🔴 **VIOLATION:** Running script and ignoring output = FAILED task.
> 🔴 **VIOLATION:** Auto-fixing without asking = Not allowed.
> 🔴 **Rule:** Always READ output → SUMMARIZE → ASK → then fix.

---

## AI-Slop Anti-Patterns (Reject these on sight)

These patterns signal AI-generated filler — remove or reject them when reviewing code:

| Anti-pattern | Example | Fix |
|---|---|---|
| **Narrator comments** | `// Loop through the users` above `for (const user of users)` | Delete the comment |
| **Restating types in JSDoc** | `@param {string} name - the name` | Delete — TypeScript already says it |
| **Defensive nothing-checks** | `if (!obj) return; const x = obj.x;` when `obj` is guaranteed | Delete the check |
| **Premature error wrapping** | `try { simpleAssign(); } catch(e) { throw e; }` | Delete the try/catch |
| **Fake extensibility** | `IUserServiceFactoryBuilderProvider` for a single use | Use a plain function |
| **Emojis in code** | `// 🎉 Yay! Successfully saved` | Delete |
| **"In this section..." prose** | `// This section handles X` above section | Delete — structure already shows it |
| **Leftover print/debug** | `console.log('got here');` | Delete before commit |
| **Empty try-catch** | `try { ... } catch {}` without intent | Either handle or propagate |
| **Renaming `_` vars on import** | `import { foo as _foo }` just to silence lint | Remove import OR actually use it |

## Edge Cases & Gotchas

| Situation | Right move |
|---|---|
| Deleted code you think might be needed | Actually delete it — git has history |
| Commented-out code "just in case" | Delete — it rots instantly |
| Copy-pasted block that's "almost identical" | Extract — but only if ≥3 uses and shape stable |
| Public API change | Deprecate with clear migration note, don't yank |
| Test that's flaky | Fix root cause or delete — never `skip` silently |
| Long function that's clear | Leave it — length alone isn't smell |
| Abstraction "for future needs" | Don't — wait until 3rd real use |

## Pre-Commit Checklist

- [ ] No narrator comments
- [ ] No emojis in code/logs
- [ ] No `console.log` / `print` leftovers
- [ ] No `// TODO` without issue link
- [ ] No commented-out code
- [ ] No abstractions for single use
- [ ] Tests added for new behavior
- [ ] Lint passes

## Related Skills

| Skill | When |
|---|---|
| `refactoring-patterns` | Systematic refactoring of existing code |
| `code-review-checklist` | PR / merge-time review |
| `lint-and-validate` | Automated enforcement |
| `systematic-debugging` | When "clean" code breaks |
| `testing-patterns` | Test design alongside code

