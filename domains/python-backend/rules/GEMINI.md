# GEMINI.md — Antigravity Agent System (python-backend)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanimlar.
> Global kod kalitesi kurallari ~/.gemini/GEMINI.md'den yuklenir.

---

@./base-protocol.md

---

## REQUEST CLASSIFIER (ADIM 1)

| Tip | Trigger | Aksiyon |
|-----|---------|---------|
| **SORU** | "what is", "explain", "nasil calisir" | Text yanit |
| **SIMPLE CODE** | "fix", "ekle", "degistir" (tek dosya) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement" | `{task-slug}.md` + Agent |
| **API DESIGN** | "endpoint", "api", "route", "schema" | `{task-slug}.md` + backend-specialist |
| **SLASH CMD** | /create, /debug, /verify, /deploy | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: PYTHON BACKEND KOD KURALLARI

### Primary Agent: `backend-specialist`
### Supporting: `database-architect`, `security-auditor`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | python-patterns, clean-code, api-patterns |
| **P1** | database-design, testing-patterns |
| **P2** | performance-profiling, clean-code |

### Python-Specific Rules

- **Type hints zorunlu:** `def get_user(user_id: int) -> User:`
- **Pydantic model kullan:** Request/response validation (FastAPI)
- **Async dogru kullan:** `await` ile async endpoint'ler, blocking I/O yasak
- **Connection pooling:** SQLAlchemy `create_async_engine` + session management
- **Logging:** `structlog` veya `logging` — `print()` YASAK production'da
- **Error handling:** Domain-specific exception class'lari, generic `Exception` yasak
- **Testing:** Her endpoint icin unit + integration test, `pytest` + `httpx`

@./gemini-modes.md

### Final Checklist

Sira: **Security → Lint → Schema → Tests → API Docs → Performance**

---

## TIER 2: API & DATABASE KURALLARI

### API Design

- RESTful convention: Noun-based URLs, proper HTTP methods
- Versioning: `/api/v1/` prefix
- Pagination: Cursor-based for large datasets, offset for small
- Rate limiting: Per-endpoint configuration
- Input validation: Pydantic models at boundary, never trust client data

### Database

- Migrations: Alembic ile versiyon kontrol
- Indexes: Her query pattern icin uygun index
- N+1 prevention: Eager loading veya batch queries
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
