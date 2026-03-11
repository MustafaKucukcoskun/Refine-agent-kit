# GEMINI.md — Antigravity Agent System (python-backend)

> This file defines the agent routing and skill system for this workspace.
> Global code quality rules are loaded from ~/.gemini/GEMINI.md.

---

@./base-protocol.md

---

## REQUEST CLASSIFIER (STEP 1)

| Type | Trigger | Action |
|------|---------|--------|
| **QUESTION** | "what is", "explain", "how does it work" | Text response |
| **SIMPLE CODE** | "fix", "add", "change" (single file) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement" | `{task-slug}.md` + Agent |
| **API DESIGN** | "endpoint", "api", "route", "schema" | `{task-slug}.md` + backend-specialist |
| **SLASH CMD** | /create, /debug, /verify, /deploy | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: PYTHON BACKEND CODE RULES

### Primary Agent: `backend-specialist`
### Supporting: `database-architect`, `security-auditor`

### Skill Priority

| Priority | Skills |
|----------|--------|
| **P0** | python-patterns, clean-code, api-patterns |
| **P1** | database-design, testing-patterns |
| **P2** | performance-profiling, clean-code |

### Python-Specific Rules

- **Type hints mandatory:** `def get_user(user_id: int) -> User:`
- **Use Pydantic models:** Request/response validation (FastAPI)
- **Use async correctly:** `await` with async endpoints, blocking I/O forbidden
- **Connection pooling:** SQLAlchemy `create_async_engine` + session management
- **Logging:** `structlog` or `logging` — `print()` FORBIDDEN in production
- **Error handling:** Domain-specific exception classes, generic `Exception` forbidden
- **Testing:** Unit + integration test for every endpoint, `pytest` + `httpx`

@./gemini-modes.md

### Final Checklist

Order: **Security → Lint → Schema → Tests → API Docs → Performance**

---

## TIER 2: API & DATABASE RULES

### API Design

- RESTful convention: Noun-based URLs, proper HTTP methods
- Versioning: `/api/v1/` prefix
- Pagination: Cursor-based for large datasets, offset for small
- Rate limiting: Per-endpoint configuration
- Input validation: Pydantic models at boundary, never trust client data

### Database

- Migrations: Version control with Alembic
- Indexes: Appropriate index for every query pattern
- N+1 prevention: Eager loading or batch queries
- Connection management: Pool size tuning, health checks

### Security

- Auth: JWT/OAuth2 with proper token rotation
- CORS: Restrictive by default, whitelist origins
- Input: SQL injection prevention (parameterized queries ONLY)
- Secrets: Environment variables, never in code

---

@./agents-reference.md

**Key Skills:** python-patterns, api-patterns, database-design, testing-patterns,
performance-profiling, clean-code

**Workflows:** /deploy, /migrate, /debug, /verify, /test, /code-review

---
