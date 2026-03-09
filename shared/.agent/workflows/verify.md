---
description: Project integrity verification. Checks agent/skill files, workflow references, imports, and config consistency.
---

# /verify - Project Integrity Check

$ARGUMENTS

---

## Purpose

Verify project integrity — check that all referenced files exist, imports resolve, and configurations are consistent.

---

## Behavior

When `/verify` is triggered:

1. **Agent & Skill file check**
   - Every agent listed in `.agent/ARCHITECTURE.md` → file exists in `agents/`?
   - Every skill listed in `.agent/ARCHITECTURE.md` → `skills/{name}/SKILL.md` exists?
   - Any orphan files not listed in `.agent/ARCHITECTURE.md`?

2. **Workflow reference check**
   - Every workflow in `workflows/` → has valid YAML frontmatter?
   - Cross-references to agents/skills → targets exist?

3. **Domain pack check**
   - Every domain in `domains/` → has matching rules file?
   - Trigger conditions valid?
   - Referenced skills exist?

---

## Output Format

```markdown
## ✅ Project Verification: [Project Name]

### Results

| Check        | Status  | Details         |
| ------------ | ------- | --------------- |
| Agent files  | ✅ / 🔴 | [missing files] |
| Skill files  | ✅ / 🔴 | [missing files] |
| Workflows    | ✅ / 🔴 | [broken refs]   |
| Domain packs | ✅ / 🔴 | [issues]        |

### Issues Found

1. 🔴 [Critical issue]
2. 🟡 [Warning]

### Summary

Passed: X/Y checks
```

---

## Examples

```
/verify
/verify agents only
/verify dependencies
```

---

## Key Principles

- **Exhaustive** — check everything, don't skip
- **Non-destructive** — only read, never modify
- **Clear report** — pass/fail with specific details
- **Actionable** — for each failure, suggest fix
