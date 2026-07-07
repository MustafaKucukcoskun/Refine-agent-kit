---
description: Test-Driven Development cycle. Write failing test first, then implement.
---

# /tdd - Test-Driven Development Cycle

$ARGUMENTS

---

## Purpose

Run the RED → GREEN → REFACTOR cycle for a new feature or fix. Unlike `/test` (which runs existing tests), `/tdd` writes the test FIRST.

---

## Behavior

When `/tdd` is triggered:

1. **RED — Write failing test**
   - Understand the feature requirement
   - Write a test that describes the expected behavior
   - Run it — it MUST fail (proves test is meaningful)
   - If it passes without implementation, test is wrong

2. **GREEN — Write minimum code**
   - Implement only enough code to pass the test
   - No extra features, no premature optimization
   - Run the test — it MUST pass

3. **REFACTOR — Clean up**
   - Improve code quality (naming, duplication, structure)
   - Run tests again — they MUST still pass
   - Apply clean-code principles

4. **Repeat**
   - Next requirement → back to RED
   - Stop when feature is complete

---

## Output Format

````markdown
## 🔴🟢🔄 TDD: [Feature]

### Cycle 1

**🔴 RED — Test:**

```[language]
// test code
```

**Result:** ❌ FAIL — [reason]

**🟢 GREEN — Implementation:**

```[language]
// minimum code to pass
```

**Result:** ✅ PASS

**🔄 REFACTOR:**
[What was improved and why]

### Cycle 2

[Next requirement...]
````

---

## Examples

```

/tdd user registration with email validation
/tdd shopping cart total calculation
/tdd API endpoint for creating posts

```

---

## Key Principles

- **Test first** — never write implementation before test
- **Minimum code** — resist adding "while I'm here" features
- **Fast cycles** — each RED-GREEN-REFACTOR should be minutes, not hours
- **One behavior per test** — don't combine multiple assertions
