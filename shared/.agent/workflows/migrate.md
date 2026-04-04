---
description: Database migration workflow with Alembic/SQLAlchemy or Django ORM. Generates, reviews, and applies schema migrations safely. Use for schema changes, database versioning, migration review, or rollback planning.
---

# /migrate - Database Migration

$ARGUMENTS

---

## Purpose

Guides safe database schema migrations — from model change detection through production deployment. Handles autogeneration, migration review, staging dry-runs, and rollback verification. Supports both Alembic (SQLAlchemy/FastAPI) and Django migration systems.

---

## Framework Detection

> **GATE:** Detect migration framework before proceeding.

| Signal | Framework | Commands |
|--------|-----------|----------|
| `alembic.ini` or `alembic/` exists | Alembic (SQLAlchemy) | `alembic revision`, `alembic upgrade` |
| `manage.py` exists | Django | `python manage.py makemigrations`, `migrate` |
| Neither | ASK user | — |

---

## Pre-flight Checks

> **GATE:** All checks must pass before generating migration.

1. **Database reachable**
   ```bash
   # Alembic: verify connection
   alembic current

   # Django:
   python manage.py dbshell
   ```

2. **No pending migrations**
   ```bash
   # Alembic: head matches current
   alembic heads
   alembic current
   # Both should show same revision

   # Django:
   python manage.py showmigrations | grep "\[ \]"
   # Should return nothing (all applied)
   ```

3. **Models are valid**
   ```bash
   # Django:
   python manage.py check

   # Alembic/SQLAlchemy: import models without error
   python -c "from app.models import *"
   ```

---

## Step 1: Generate Migration

### Alembic (SQLAlchemy)

```bash
# Autogenerate from model diff
alembic revision --autogenerate -m "add user preferences table"

# Output: alembic/versions/xxxx_add_user_preferences_table.py
```

### Django

```bash
# Generate migrations
python manage.py makemigrations

# With explicit app name (recommended):
python manage.py makemigrations myapp -n "add_user_preferences"
```

---

## Step 2: Review Migration (CRITICAL)

> **GATE:** NEVER apply a migration without reviewing the generated code. Autogenerate has known blind spots.

### Alembic Autogenerate Blind Spots

| Change | Autogenerate Does | You Must Do |
|--------|------------------|-------------|
| Add table | ✅ Detects | — |
| Add column | ✅ Detects | — |
| Drop table/column | ✅ Detects | Verify intentional |
| **Rename table/column** | ❌ Generates DROP + CREATE | Write `op.rename_table()` manually |
| **Change column type** | ⚠️ Sometimes misses | Verify `op.alter_column()` |
| **Add enum values** | ❌ Misses | Write `op.execute()` for ALTER TYPE |
| **Index changes** | ⚠️ Partial | Verify index operations |
| **Data migrations** | ❌ Never generates | Write `op.execute()` with SQL |
| **Default values** | ⚠️ Partial | Check `server_default` vs app default |

### Review Checklist

```bash
# Read the generated migration file
cat alembic/versions/xxxx_*.py
```

- [ ] **No destructive ops unless intended** — `drop_table`, `drop_column` are irreversible
- [ ] **Rename detection** — if you renamed a column, verify it's `alter_column` not `drop + add`
- [ ] **Data preservation** — if changing column type, add data migration step BEFORE type change
- [ ] **Downgrade works** — verify `downgrade()` function reverses the upgrade correctly
- [ ] **Indexes** — new foreign keys should have indexes for query performance

---

## Step 3: Test on Copy/Staging

```bash
# Alembic: dry-run with SQL output
alembic upgrade head --sql > migration_preview.sql
cat migration_preview.sql

# Apply to staging database
DATABASE_URL=postgresql://user:pass@staging:5432/db alembic upgrade head

# Django:
python manage.py migrate --database=staging
# Or: run against a local copy
python manage.py sqlmigrate myapp 0003_add_user_preferences
```

> **CRITICAL:** Never test migrations on production first. Always validate on a copy or staging environment.

---

## Step 4: Apply Migration

```bash
# Alembic: apply
alembic upgrade head

# Verify current revision matches
alembic current

# Django:
python manage.py migrate
python manage.py showmigrations
```

---

## Step 5: Verify Rollback Plan

```bash
# Alembic: test downgrade
alembic downgrade -1

# Verify rollback worked
alembic current

# Re-apply
alembic upgrade head

# Django:
python manage.py migrate myapp 0002_previous_migration
```

> **GATE:** Rollback must work cleanly. If downgrade fails, fix it BEFORE deploying to production.

---

## Production Deployment Considerations

| Strategy | When to Use | Risk |
|----------|------------|------|
| Direct apply | Small, fast migrations | Brief table lock |
| Maintenance window | ALTER on large tables | Downtime required |
| Blue-green deploy | Zero-downtime required | Complex setup |
| Expand-contract | Column rename/type change | Two-phase migration |

### Expand-Contract Pattern (Zero-Downtime Rename)
```
Migration 1: ADD new_column (keep old_column)
Deploy: Code writes to BOTH columns
Migration 2: Copy data old → new
Migration 3: DROP old_column
```

---

## Output Format

````markdown
## 🗄️ Database Migration

**Framework:** [Alembic / Django]
**Migration:** [revision id or name]
**Description:** [what changed]

### Changes
| Operation | Table | Column | Details |
|-----------|-------|--------|---------|
| [ADD/ALTER/DROP] | [table] | [column] | [specifics] |

### Review
- [ ] Generated code reviewed
- [ ] No unintended destructive ops
- [ ] Rename detection verified
- [ ] Downgrade function correct
- [ ] Tested on staging/copy

### Applied
- [ ] Staging: ✅
- [ ] Production: ✅
- [ ] Rollback verified

### SQL Preview
```sql
[key SQL statements]
```
````

---

## Key Principles

- **Always review autogenerated migrations** — autogenerate is a starting point, not a finished product
- **Renames are the #1 trap** — Alembic generates DROP + CREATE instead of RENAME. Always check.
- **Downgrade must work** — if rollback is broken, you have no safety net in production
- **`alembic_version` table drift** — if environments diverge, `alembic stamp head` can resync (use carefully)
- **Data migrations are code** — write them as separate migration files, not mixed with schema changes
- **Never skip staging** — even "simple" migrations can lock tables or cause unexpected downtime on large datasets
