---
description: Build/CI error analysis and fix. Reads full stack trace, categorizes, finds root cause, and applies minimum fix.
---

# /build-fix - Build Error Analysis & Fix

$ARGUMENTS

---

## Purpose

Analyze build or CI/CD errors systematically and fix with minimum changes.

---

## Behavior

When `/build-fix` is triggered:

1. **Read the full error**
   - Entire stack trace, not just last line
   - Identify the FIRST error (cascading errors stem from it)
   - Note file paths and line numbers

2. **Categorize the error**
   - Dependency: missing/incompatible package
   - Syntax: typo, missing bracket, wrong import
   - Type: TypeScript/type mismatch
   - Config: wrong build config, env variable
   - Runtime: module resolution, path issues

3. **Find root cause**
   - Trace the error to its origin
   - Check recent changes (git diff)
   - Verify environment (Node version, .env)

4. **Apply minimum fix**
   - Change as few files as possible
   - Don't refactor — just fix the build
   - Document what caused it

5. **Verify**
   - Run the build again
   - Confirm no new errors introduced

---

## Output Format

````markdown
## 🔧 Build Fix: [Error Summary]

### Error Category

[dependency | syntax | type | config | runtime]

### Root Cause

🎯 [What caused the build failure]

### Fix Applied

```diff
- old line
+ new line
```
````

### Verification

✅ Build passes / ❌ Still failing (next steps)

```

---

## Examples

```

/build-fix TypeScript error TS2339
/build-fix npm install fails
/build-fix Vercel deployment error
/build-fix Module not found

```

---

## Key Principles

- **Read the FIRST error** — later errors are often cascading
- **Minimum change** — don't refactor during a build fix
- **Check recent changes** — usually the cause is in the last commit
- **Verify after fix** — always run build again
```
