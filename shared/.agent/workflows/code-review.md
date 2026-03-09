---
description: Code review workflow. Systematic review for security, performance, readability, and test coverage.
---

# /code-review - Systematic Code Review

$ARGUMENTS

---

## Purpose

Perform a structured code review focusing on security, performance, readability, and test coverage.

---

## Behavior

When `/code-review` is triggered:

1. **Security scan**
   - Hardcoded secrets, credentials
   - SQL injection, XSS, input validation
   - Authentication/authorization gaps

2. **Performance check**
   - N+1 queries, unnecessary re-renders
   - Memory leaks, unbounded collections
   - Missing indexes, expensive operations

3. **Readability audit**
   - Naming conventions (self-documenting?)
   - Function length (max 40 lines)
   - Comment quality (why, not what)

4. **Test coverage**
   - Critical paths tested?
   - Edge cases covered?
   - Test quality (assertions meaningful?)

---

## Output Format

```markdown
## 📝 Code Review: [File/Scope]

### 🔴 Critical (Must Fix)

1. **[Issue]** — `file:line` — [explanation + fix]

### 🟡 Recommended

1. **[Issue]** — `file:line` — [explanation + suggestion]

### 🟢 Minor (Nice to Have)

1. **[Issue]** — `file:line` — [suggestion]

### ✅ Good Practices Found

- [Positive observation]

### Summary

| Category    | Issues |
| ----------- | ------ |
| Security    | X      |
| Performance | X      |
| Readability | X      |
| Tests       | X      |
```

---

## Examples

```
/code-review src/auth/login.ts
/code-review last 5 commits
/code-review PR #42
```

---

## Key Principles

- **Prioritize** — critical security > performance > readability
- **Be specific** — include file, line, and fix suggestion
- **Be constructive** — explain WHY, offer alternatives
- **Acknowledge good** — note positive patterns too
