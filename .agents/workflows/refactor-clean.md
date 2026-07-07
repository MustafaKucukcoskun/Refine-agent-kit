---
description: Systematic refactoring workflow for cleaning and improving working code without breaking behavior. Detects code smells, applies safe transformations, and verifies with tests after each step.
---

# Refactor & Clean

Systematic workflow for improving code quality without changing external behavior.

## Task to Refactor
$ARGUMENTS

---

## Golden Rule

> **External behavior must not change.** All existing tests must pass before, during, and after refactoring. If there are no tests, write them first.

---

## Pre-Flight

Before starting ANY refactoring:

```
1. Run existing tests -> MUST pass (use /test or domain-specific runner)
2. If tests fail -> FIX tests first, THEN refactor
3. If no tests exist -> Write characterization tests first (capture current behavior)
4. Commit current state (clean starting point for rollback)
```

> VIOLATION: Starting refactoring without passing tests = guaranteed breakage.

---

## Step 1: Analyze — Detect Code Smells

Read the target code and identify issues from this checklist:

### Structural Smells

| Smell | Detection | Threshold |
| --- | --- | --- |
| **Long function** | Function exceeds reasonable length | >30 lines -> split |
| **Deep nesting** | More than 3 levels of indentation | >3 levels -> early return |
| **God class/module** | File handles too many responsibilities | >300 lines -> split |
| **Duplicate code** | Similar blocks in 2+ locations | 3+ lines repeated -> extract |
| **Feature envy** | Function uses more of another class's data | Excessive cross-references -> move |

### Naming Smells

| Smell | Detection | Fix |
| --- | --- | --- |
| **Single-letter vars** | `x`, `d`, `t` outside loops | Rename to intent |
| **Misleading names** | Name suggests wrong behavior | Rename to match behavior |
| **Inconsistent naming** | Mix of conventions | Standardize (camelCase/snake_case) |
| **Magic numbers** | Hardcoded `86400`, `3.14` | Extract to named constant |

### Architecture Smells

| Smell | Detection | Fix |
| --- | --- | --- |
| **Shotgun surgery** | One change requires editing 5+ files | Consolidate related logic |
| **Leaky abstraction** | Internal details exposed to callers | Create proper interface |
| **Dead code** | Unreachable functions, unused imports | Delete (git has history) |
| **Premature abstraction** | Abstract class with single implementation | Inline until second use case |

---

## Step 2: Plan — Prioritize Transformations

Rank detected smells by impact:

1. **Bugs hiding behind complexity** — Fix these first (deep nesting, unclear control flow)
2. **Readability blockers** — Names, magic numbers, long functions
3. **Duplication** — Extract shared logic
4. **Structure** — File/class organization

> Rule: Fix ONE smell at a time. Test after each change. Never batch multiple refactorings into one step.

---

## Step 3: Execute — Apply Safe Transformations

### Transformation Catalog

| Pattern | When | How |
| --- | --- | --- |
| **Extract function** | Long function, duplicate block | Move block to new function with clear name |
| **Early return** | Deep nesting, guard clauses | Invert condition, return early |
| **Inline temp** | Variable used once, adds no clarity | Replace variable with expression |
| **Rename** | Misleading or unclear name | Change name, update all references |
| **Extract constant** | Magic number/string | Create named constant at module level |
| **Move function** | Feature envy, wrong module | Move to the class/module it accesses most |
| **Replace conditional with polymorphism** | Long if/switch chains | Create strategy/handler per case |
| **Decompose conditional** | Complex boolean expressions | Extract to descriptively-named function |

### Per-Change Protocol

```
FOR EACH transformation:
  1. Describe what you're changing and why
  2. Apply the single transformation
  3. Run tests -> MUST pass
  4. If tests fail -> REVERT and reconsider approach
  5. If tests pass -> move to next transformation
```

---

## Step 4: Verify — Post-Refactoring Checks

After all transformations are applied:

```
1. Run full test suite -> MUST pass
2. Check test coverage -> must not drop below pre-refactoring level
3. Review diff -> ensure no behavioral changes leaked in
4. Check for accidentally removed functionality
```

---

## Output Format

```markdown
## Refactoring Report

### Target
[File(s) or scope that was refactored]

### Smells Detected
| # | Smell | Location | Severity |
| --- | --- | --- | --- |
| 1 | Long function (45 lines) | src/auth.ts:handleLogin | High |
| 2 | Magic number | src/config.ts:23 | Medium |
| 3 | Dead import | src/utils.ts:1 | Low |

### Transformations Applied
| # | Transformation | What Changed | Tests |
| --- | --- | --- | --- |
| 1 | Extract function | Split handleLogin into validateInput + createSession | PASS |
| 2 | Extract constant | 86400 -> SESSION_TIMEOUT_SECONDS | PASS |
| 3 | Remove dead code | Removed unused import | PASS |

### Before/After Metrics
| Metric | Before | After |
| --- | --- | --- |
| Longest function | 45 lines | 18 lines |
| Max nesting depth | 4 | 2 |
| Test coverage | 87% | 87% |

### Summary
[One paragraph describing what improved and why]
```

---

## What NOT to Refactor

- **Working code that's clear enough** — "If it ain't broke" applies to readable code too
- **Code about to be deleted** — Don't polish code scheduled for removal
- **Code you don't understand yet** — Read and comprehend first, refactor second
- **Performance-critical hot paths** — Clarity refactoring may hurt performance; measure first

---

**Begin refactoring now. Verify tests pass, detect smells, apply one transformation at a time, test after each change.**
