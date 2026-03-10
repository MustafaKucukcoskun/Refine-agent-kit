---
description: Build/CI error analysis and fix. Reads full stack trace, categorizes, finds root cause, and applies minimum fix. Adapts to project domain.
---

# /build-fix - Build Error Analysis & Fix

$ARGUMENTS

---

## Purpose

Analyze build or CI/CD errors systematically and fix with minimum changes.
Automatically detects the project's build system and applies domain-appropriate fixes.

---

## Domain Adaptation

**MANDATORY:** Detect build system FIRST, then diagnose using domain tools.

| Domain | Build Command | Type Checker | Linter | Package Manager |
|--------|--------------|--------------|--------|-----------------|
| next-web | `npm run build` | `npx tsc --noEmit` | `npx eslint .` | npm / pnpm / yarn |
| python-backend | `python -m build` | `mypy .` | `ruff check .` | pip / uv / poetry |
| python-ml | `python -m build` | `mypy .` | `ruff check .` | pip / uv / conda |
| python-data | `python -m build` | `mypy .` | `ruff check .` | pip / uv / conda |
| mobile-flutter | `flutter build` | `dart analyze` | `flutter analyze` | pub |
| mobile-rn | `npx react-native build-android` | `npx tsc --noEmit` | `npx eslint .` | npm / yarn |
| electron-desktop | `npm run build` | `npx tsc --noEmit` | `npx eslint .` | npm / pnpm |
| chrome-extension | `npm run build` | `npx tsc --noEmit` | `npx eslint .` | npm |
| cli-tool | `npm run build` / `python -m build` | varies | varies | varies |
| csharp-backend | `dotnet build` | (built-in) | `dotnet format --verify-no-changes` | NuGet |
| godot-game | `godot --headless --export-release` | (GDScript static) | — | — |
| unity-game | Unity Editor Build | (Roslyn) | — | NuGet |
| phaser-game | `npm run build` (Vite) | `npx tsc --noEmit` | `npx eslint .` | npm |

---

## Behavior

When `/build-fix` is triggered:

1. **Read the full error**
   - Entire stack trace, not just last line
   - Identify the FIRST error (cascading errors stem from it)
   - Note file paths and line numbers

2. **Categorize the error**

   **Universal categories:**
   - **Dependency:** missing/incompatible package
   - **Syntax:** typo, missing bracket, wrong import
   - **Type:** type mismatch, missing type
   - **Config:** wrong build config, env variable
   - **Runtime:** module resolution, path issues

   **Domain-specific categories:**
   | Domain | Extra Error Types |
   |--------|-------------------|
   | next-web | RSC boundary, hydration mismatch, middleware edge runtime |
   | python-* | IndentationError, circular import, missing `__init__.py` |
   | mobile-flutter | Gradle sync, CocoaPods, platform channel mismatch |
   | mobile-rn | Metro bundler, native module link, Gradle version |
   | csharp-backend | NuGet restore, target framework mismatch, nullable warning |
   | godot-game | Scene dependency, autoload path, resource not found |
   | unity-game | Assembly definition, script compilation order, shader error |
   | electron-desktop | IPC type mismatch, preload script path, CSP violation |
   | chrome-extension | Manifest validation, CSP, permission missing |

3. **Find root cause**
   - Trace the error to its origin
   - Check recent changes (`git diff`)
   - Verify environment and versions

4. **Apply minimum fix**
   - Change as few files as possible
   - Don't refactor — just fix the build
   - Document what caused it

5. **Verify**
   - Run the domain-appropriate build command
   - Confirm no new errors introduced

---

## Output Format

````markdown
## Build Fix: [Error Summary]

### Error Category

[dependency | syntax | type | config | runtime | domain-specific]

### Root Cause

[What caused the build failure]

### Fix Applied

```diff
- old line
+ new line
```

### Verification

[Build command output] — Pass / Still failing (next steps)
````

---

## Examples

```
/build-fix TypeScript error TS2339
/build-fix npm install fails
/build-fix Vercel deployment error
/build-fix Module not found
/build-fix pytest ImportError
/build-fix dotnet build CS0246
/build-fix flutter build gradle sync failed
/build-fix godot export error
```

---

## Key Principles

- **Read the FIRST error** — later errors are often cascading
- **Minimum change** — don't refactor during a build fix
- **Check recent changes** — usually the cause is in the last commit
- **Verify after fix** — always run the build again
- **Use domain tools** — never run `npm run build` on a Python project
