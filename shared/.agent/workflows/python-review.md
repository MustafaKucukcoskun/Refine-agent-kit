---
description: Python-specific code review. Type safety, async correctness, PEP compliance, import hygiene, security patterns. Deeper than generic /code-review.
---

# /python-review - Python Code Review

$ARGUMENTS

---

## Purpose

Perform a Python-specific code review that catches issues generic `/code-review` misses: async traps, type hint gaps, PEP violations, import anti-patterns, and Python-specific security pitfalls.

---

## When to Use

| Use `/python-review` | Use `/code-review` |
|---|---|
| Python files, FastAPI/Django endpoints | Multi-language or non-Python code |
| Async correctness matters | General architecture review |
| Type safety audit needed | Cross-cutting concerns |

---

## Behavior

When `/python-review` is triggered:

### 1. Type Safety Audit

- [ ] All public function parameters typed
- [ ] Return types declared (no implicit `-> None` on complex functions)
- [ ] `Optional[X]` used instead of `X | None` for Python 3.9 compat (check pyproject.toml `requires-python`)
- [ ] Pydantic models used for API request/response (not raw dicts)
- [ ] No `Any` type used as escape hatch without justification
- [ ] Generic types correct (`list[Item]` not `list`)

### 2. Async Correctness

- [ ] No sync calls inside `async def` (`requests.get`, `time.sleep`, sync ORM)
- [ ] `await` not missing on coroutine calls
- [ ] `asyncio.gather` used for parallel I/O (not sequential awaits)
- [ ] `asyncio.wait_for` or `asyncio.timeout` wraps external API calls
- [ ] Background tasks use `asyncio.create_task` with proper reference retention
- [ ] No `asyncio.run()` called from inside running event loop
- [ ] CPU-bound work offloaded to `asyncio.to_thread` or `ProcessPoolExecutor`

### 3. PEP & Style Compliance

- [ ] PEP 8 naming: `snake_case` functions, `PascalCase` classes, `UPPER_SNAKE` constants
- [ ] PEP 257 docstrings on public modules/classes/functions
- [ ] No wildcard imports (`from module import *`)
- [ ] Imports ordered: stdlib → third-party → local (PEP 8 / isort)
- [ ] No circular imports (check import-time side effects)
- [ ] f-strings preferred over `.format()` or `%` for Python 3.6+

### 4. Error Handling

- [ ] No bare `except:` or `except Exception:` without re-raise
- [ ] `except` blocks don't silently swallow errors
- [ ] Custom exceptions for business logic (not generic `ValueError` for everything)
- [ ] FastAPI: `HTTPException` with correct status codes (not 500 for validation)
- [ ] Django: proper use of `Http404`, `PermissionDenied`
- [ ] Context managers (`with`) for resource cleanup (files, DB connections)

### 5. Security (Python-Specific)

- [ ] No `eval()`, `exec()`, or `__import__()` with user input
- [ ] `subprocess` calls use list args, not `shell=True`
- [ ] SQL queries parameterized (SQLAlchemy `bindparam`, Django ORM)
- [ ] `pickle.load` never used on untrusted data
- [ ] File paths validated (`os.path.abspath` + prefix check) before open
- [ ] `SECRET_KEY`, DB credentials in env vars, not in source

### 6. Dependency & Project Hygiene

- [ ] `pyproject.toml` or `requirements.txt` pinned (not `>=` without upper bound)
- [ ] Lock file present (`poetry.lock`, `uv.lock`, `pip-compile` output)
- [ ] No unused imports
- [ ] No unused variables (especially in except blocks: `except SomeError as e:` where `e` unused)
- [ ] `__init__.py` files don't contain business logic

---

## Output Format

````markdown
## 🐍 Python Review: [File/Scope]

### 🔴 Critical (Must Fix)

1. **[Category: Issue]** — `file:line`
   ```python
   # Bad
   [offending code]
   # Fix
   [corrected code]
   ```

### 🟡 Recommended

1. **[Category: Issue]** — `file:line` — [explanation + fix]

### 🟢 Minor / Style

1. **[Category: Issue]** — `file:line` — [suggestion]

### ✅ Good Python Practices Found

- [Positive observations]

### Summary

| Category         | Issues |
| ---------------- | ------ |
| Type Safety      | X      |
| Async            | X      |
| PEP Compliance   | X      |
| Error Handling   | X      |
| Security         | X      |
| Hygiene          | X      |

**Python version target:** [detected from pyproject.toml]
**Framework:** [FastAPI / Django / Flask / None]
````

---

## Examples

```
/python-review src/api/routes/users.py
/python-review app/ --focus async
/python-review last 3 commits
```

---

## Key Principles

- **Python-specific first** — don't repeat generic review; focus on what only Python has
- **Show the fix** — include corrected code, not just the problem
- **Detect the framework** — adapt checks to FastAPI vs Django vs Flask
- **Version-aware** — check `requires-python` before flagging syntax issues
- **Async is the #1 trap** — sync-in-async bugs are invisible until production load
