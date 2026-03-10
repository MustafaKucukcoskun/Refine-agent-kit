---
description: Release CLI tool to npm or PyPI. Handles version bump, changelog, build, and publish.
---

# /release - Release CLI Tool

$ARGUMENTS

---

## Purpose

Version, build, and publish a CLI tool to the appropriate package registry (npm or PyPI).

---

## Sub-commands

```
/release              - Interactive release wizard
/release patch        - Bump patch version (1.0.0 → 1.0.1)
/release minor        - Bump minor version (1.0.0 → 1.1.0)
/release major        - Bump major version (1.0.0 → 2.0.0)
/release --dry-run    - Preview release without publishing
/release status       - Show current version and publish status
```

---

## Pre-Release Checklist

### Node.js CLI

```markdown
- [ ] All tests passing (`npm test`)
- [ ] Linting clean (`npx eslint .`)
- [ ] `bin` field in package.json correct
- [ ] `--help` output accurate
- [ ] CHANGELOG.md updated
- [ ] No hardcoded paths or credentials
- [ ] `npm pack` produces clean tarball
- [ ] `npx .` works locally
```

### Python CLI

```markdown
- [ ] All tests passing (`pytest`)
- [ ] Type check clean (`mypy .`)
- [ ] Linting clean (`ruff check .`)
- [ ] Entry points in pyproject.toml correct
- [ ] `--help` output accurate
- [ ] CHANGELOG.md updated
- [ ] `pip install -e .` works locally
- [ ] `python -m build` succeeds
```

---

## Behavior

1. **Detect package type** (Node.js or Python)
2. **Run pre-release checks** (tests, lint, build)
3. **Bump version**
   - Node.js: `npm version [patch|minor|major]`
   - Python: Update `pyproject.toml` version
4. **Update CHANGELOG**
5. **Build**
   - Node.js: `npm pack`
   - Python: `python -m build`
6. **Publish**
   - Node.js: `npm publish`
   - Python: `twine upload dist/*`
7. **Tag and push**
   - `git tag v[version]`
   - `git push && git push --tags`

---

## Output Format

````markdown
## Release: [package-name] v[version]

### Pre-Release Checks
- [Pass] Tests (X passed)
- [Pass] Lint (clean)
- [Pass] Build (success)
- [Pass] CLI help output verified

### Published
- **Registry:** npm / PyPI
- **Version:** v[version]
- **Package:** [package URL]

### Install Command
```bash
npm install -g [package-name]
# or
pip install [package-name]
```

### Git
- Tag: v[version]
- Commit: [hash]
````
