---
name: refactoring-patterns
description: Systematic refactoring catalog. Code smell detection, safe transformation patterns, legacy modernization strategies. Decision-first approach.
allowed-tools: Read, Write, Edit, Grep, Glob
version: 1.0
priority: HIGH
---

# Refactoring Patterns

> Systematic transformation of code structure WITHOUT changing behavior.
> **Every refactoring starts with a passing test.**

---

## ⚠️ The Golden Rule

```
1. Understand the code (read, trace, document)
2. Write a test that captures current behavior
3. Verify the test passes on the EXISTING code
4. ONLY THEN refactor
5. Verify the test still passes
```

> Refactoring without tests is gambling. Don't gamble.

---

## 1. Code Smell → Refactoring Map

| Smell | Detection | Refactoring | Risk |
|-------|-----------|-------------|------|
| **Long Method** (>40 lines) | Line count, multiple indent levels | Extract Method | Low |
| **God Class** (>300 lines, >10 methods) | Too many responsibilities | Extract Class, Move Method | Medium |
| **Feature Envy** | Method uses another class's data more than its own | Move Method | Low |
| **Primitive Obsession** | Strings/ints used instead of domain types | Replace Primitive with Object | Medium |
| **Shotgun Surgery** | One change requires editing many files | Move Method, Inline Class | High |
| **Divergent Change** | One file changes for multiple unrelated reasons | Extract Class (split by concern) | Medium |
| **Long Parameter List** (>3 params) | Function signature | Introduce Parameter Object | Low |
| **Data Clumps** | Same group of fields appears together repeatedly | Extract Class | Low |
| **Switch Statements** | Repeated switch/if-else on same value | Replace Conditional with Polymorphism | Medium |
| **Speculative Generality** | Abstract classes, factory for 1 implementation | Collapse Hierarchy, Inline | Low |
| **Dead Code** | Unused functions, unreachable branches | Remove (after grep confirms unused) | Low |
| **Comments Explaining What** | Comments describing obvious logic | Rename + Extract Method (make code self-documenting) | Low |

---

## 2. Safe Refactoring Patterns

### Extract Method

**When:** Function does multiple things, deep nesting, or needs comments to explain sections.

```
Before:
  function processOrder(order) {
    // validate
    [10 lines of validation]
    // calculate total
    [15 lines of calculation]
    // send email
    [8 lines of email logic]
  }

After:
  function processOrder(order) {
    validateOrder(order);
    const total = calculateTotal(order);
    sendConfirmation(order, total);
  }
```

**Safety:** Ensure extracted function receives all needed variables as parameters. Don't share mutable state.

### Guard Clauses (Replace Nested Conditionals)

**When:** Deep if/else nesting (arrow anti-pattern).

```
Before:
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        doWork();
      }
    }
  }

After:
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission) return;
  doWork();
```

**Safety:** Verify each early return matches the original else behavior (which is usually "do nothing").

### Replace Conditional with Polymorphism

**When:** Same switch/if-else repeats in multiple places based on a "type" field.

```
Before:
  if (shape.type === 'circle') area = pi * r * r;
  else if (shape.type === 'rect') area = w * h;

After:
  class Circle { area() { return pi * this.r * this.r; } }
  class Rect { area() { return this.w * this.h; } }
```

**Safety:** Only worth it when the same conditional appears 3+ times. For 1-2 occurrences, a simple if/else is cleaner (YAGNI).

### Strangler Fig Pattern

**When:** Large legacy module that can't be rewritten at once.

```
Strategy:
  1. Create a new interface/facade in front of the old code
  2. New features use the new interface
  3. Gradually migrate old callers to the new interface
  4. Old code withers as it loses callers
  5. Remove old code when no callers remain
```

**Safety:** The old and new implementations must coexist. Route traffic gradually. Monitor for behavior differences.

### Introduce Parameter Object

**When:** 4+ parameters, especially when the same group of params appears in multiple functions.

```
Before:
  createUser(name, email, age, role, department, startDate)

After:
  createUser(userInput: CreateUserInput)
  // where CreateUserInput is a typed object/class/Pydantic model
```

**Safety:** Update all callers in the same commit. Don't leave half-migrated signatures.

---

## 3. Decision Framework

### Should I Refactor This?

```
Is there a bug or feature request in this area?
├── YES → Refactor as part of the change (Boy Scout Rule)
│         "Leave the campground cleaner than you found it"
│
└── NO → Is it causing ongoing pain?
    ├── YES → Schedule a dedicated refactoring task
    │         (with tests FIRST, then refactor)
    │
    └── NO → Leave it alone
              "If it ain't broke, don't fix it"
```

### How Much to Refactor?

```
Minimum Viable Refactoring:
├── Fix the specific smell causing pain
├── Don't "while I'm here" refactor nearby code
├── One logical change per commit
└── Stop when tests pass and smell is gone

Maximum Scope:
├── If the area is heavily tested: broader refactoring OK
├── If the area has zero tests: write tests FIRST, limit scope
├── If deadline pressure: do the minimum, create tech debt ticket
└── NEVER refactor + add features in the same commit
```

---

## 4. Legacy Modernization Patterns

### Callback → Promise → Async/Await

```
Phase 1: Wrap callbacks in Promises
  function readFileAsync(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => err ? reject(err) : resolve(data));
    });
  }

Phase 2: Use async/await
  async function readConfig() {
    const data = await readFileAsync('config.json');
    return JSON.parse(data);
  }
```

### Class Components → Hooks (React)

```
Phase 1: Identify state and lifecycle methods
Phase 2: Map each to hooks
  state → useState
  componentDidMount → useEffect(fn, [])
  componentDidUpdate → useEffect(fn, [deps])
  componentWillUnmount → useEffect return cleanup
Phase 3: Convert one component at a time
```

### Monolith → Services

```
1. Identify bounded contexts (areas that change independently)
2. Draw dependency arrows between them
3. Extract the one with FEWEST incoming arrows first
4. Create API boundary (REST/gRPC/message queue)
5. Dual-write period (old path + new service, compare results)
6. Cut over when confident
7. Repeat for next bounded context
```

---

## 5. Anti-Patterns (Refactoring Gone Wrong)

| ❌ Mistake | ✅ Fix |
|-----------|-------|
| Refactor without tests | Write characterization tests first |
| Refactor + add feature in same commit | Separate commits: refactor, then feature |
| Rename everything at once | Rename incrementally, verify at each step |
| Abstract too early (1 implementation) | Wait for 3 concrete cases before abstracting |
| Rewrite from scratch | Strangler Fig: wrap and migrate incrementally |
| "While I'm here" scope creep | Fix only the identified smell, create tickets for others |
| Over-DRY (extract code used once) | Inline code used in only one place |
| Force patterns where they don't fit | Use the simplest solution that removes the smell |

---

## 6. Verification Checklist

After every refactoring session:

- [ ] All existing tests still pass
- [ ] No new test was needed to "make it work" (behavior didn't change)
- [ ] No `// TODO: fix later` left behind
- [ ] Imports are clean (no unused, no circular)
- [ ] Commit message describes the refactoring (not "cleanup" or "refactor")
- [ ] Dependent files updated (no broken references)
