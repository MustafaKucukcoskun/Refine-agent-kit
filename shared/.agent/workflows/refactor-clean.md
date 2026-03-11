---
description: Clean and improve working code without breaking it
---

Goal: Clean and improve working code without breaking it
Rule: External behavior must not change during refactoring (tests must pass)

Steps:

1. Verify existing tests pass (/verify or /test)
2. Identify code smells:
   - Long functions (>20 lines → split)
   - Magic number/string → named constant
   - Duplicate code → extract function/method
   - Deep nesting → early return pattern
3. Make changes in small steps — test after each step
4. Name improvements: are variable, function, class names descriptive?
5. Final check: did test coverage drop?

Usage: /refactor-clean [file or scope]
