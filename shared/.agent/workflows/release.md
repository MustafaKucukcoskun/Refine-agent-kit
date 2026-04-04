---
description: CLI tool release pipeline. Version bump, changelog generation, npm/PyPI publish, git tag, and GitHub release. Use for package publishing, version management, or release automation.
---

# /release - Release Pipeline

$ARGUMENTS

---

## Purpose

Guides the full release process for CLI tools — from version decision to published package. Handles semver bumping, changelog generation, registry publishing, git tagging, and GitHub release creation.

---

## Pre-flight Checks

> **GATE:** All checks must pass before release.

1. **Clean working tree**
   ```bash
   git status --porcelain
   # Must be empty — no uncommitted changes
   ```

2. **Tests pass**
   ```bash
   npm test   # or: pytest, cargo test, dotnet test
   ```

3. **On correct branch**
   ```bash
   git branch --show-current
   # Must be: main, master, or release branch
   ```

4. **Authenticated to registry**
   ```bash
   npm whoami          # Node.js
   # or: twine check   # Python
   ```

---

## Domain Adaptation

| Runtime | Version File | Publish Command | Tag Format |
|---------|-------------|-----------------|------------|
| Node.js | package.json | `npm publish` | `v1.2.3` |
| Python | pyproject.toml / setup.cfg | `twine upload dist/*` | `v1.2.3` |
| Rust | Cargo.toml | `cargo publish` | `v1.2.3` |
| Go | git tag (no file) | `git push --tags` | `v1.2.3` |

---

## Step 1: Decide Version

**Semver rules:**
| Change Type | Bump | Example |
|-------------|------|---------|
| Breaking API change | MAJOR | 1.0.0 → 2.0.0 |
| New feature (backward compatible) | MINOR | 1.0.0 → 1.1.0 |
| Bug fix | PATCH | 1.0.0 → 1.0.1 |

> **GATE:** ASK user which version bump is appropriate. DO NOT auto-decide.

---

## Step 2: Bump Version

**Node.js:**
```bash
npm version patch   # or: minor, major
# This updates package.json AND creates git tag
```

**Python (with bump-my-version):**
```bash
bump-my-version bump patch  # or: minor, major
```

**Manual:** Edit version file directly, then:
```bash
git add -A && git commit -m "chore: bump version to X.Y.Z"
git tag vX.Y.Z
```

---

## Step 3: Generate Changelog

```bash
# If using conventional commits:
npx conventional-changelog -p angular -i CHANGELOG.md -s

# Or manual: summarize commits since last tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

> Add changelog entry to commit if not auto-generated.

---

## Step 4: Publish to Registry

**Node.js:**
```bash
# Dry run first
npm publish --dry-run

# Actual publish (may prompt for OTP if 2FA enabled)
npm publish
```

**Python:**
```bash
python -m build
twine check dist/*
twine upload dist/*
```

> **CRITICAL:** `npm publish` is **irreversible** for that version number. Always `--dry-run` first.

---

## Step 5: Push Tags + GitHub Release

```bash
git push origin main --follow-tags
```

```bash
# Create GitHub release
gh release create vX.Y.Z \
  --title "vX.Y.Z" \
  --notes "$(cat CHANGELOG.md | head -30)" \
  --latest
```

---

## Step 6: Post-Release Verification

```bash
# Verify published package
npx <package-name>@latest --version   # Node.js
# or: pip install <package>==X.Y.Z     # Python

# Verify tag
git ls-remote --tags origin | tail -3
```

---

## Output Format

````markdown
## 📦 Release Complete

**Package:** [name]
**Version:** [old] → [new]
**Registry:** [npm/PyPI/crates.io]
**Tag:** vX.Y.Z

### Checklist
- [ ] Tests pass
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Published to registry
- [ ] Git tag pushed
- [ ] GitHub release created
- [ ] Post-install verification

### Changelog Summary
- [bullet points of changes]
````

---

## Key Principles

- **Dry-run before publish** — always. Registry publishes are permanent.
- **Tag format consistency** — use `vX.Y.Z` (with `v` prefix) everywhere
- **Never skip tests** — a broken published version harms all users
- **2FA/OTP** — npm requires OTP for publish if 2FA is enabled. Have authenticator ready.
- **`files` field** — verify package.json `files` array includes everything that should ship and excludes dev-only files
