# Domain: Python Backend

> Bu dizin Python backend projesi (FastAPI/Django) içerir.
> Agent routing: Bu dizindeki dosyalar için aşağıdaki kurallar geçerlidir.

## Agent Routing

- **Primary:** `backend-specialist` — API design, business logic, Python patterns
- **Supporting:** `database-architect` — SQL, migrations, schema design
- **Security:** `security-auditor` — Auth, OWASP, input validation
- **Test:** `test-engineer` — Pytest, integration tests

## Skill Priority

| P0 (Kritik) | P1 (Önemli) | P2 (Destek) |
|-------------|-------------|-------------|
| python-patterns | postgres-patterns | supabase-postgres-best-practices |
| fastapi-pro / django-patterns | database-migrations | |
| clean-code | api-patterns | |

## Tech Stack

- Framework: FastAPI / Django
- Database: PostgreSQL / Supabase
- ORM: SQLAlchemy / Django ORM
- Testing: Pytest + httpx (async)
- Async: uvicorn + asyncio

## Python-Specific Rules

- Type hints zorunlu: `def get_user(user_id: int) -> User:`
- Pydantic model kullan (FastAPI): Request/response validation
- Async endpoint'lerde `await` doğru kullanılmalı
- Connection pooling: SQLAlchemy `create_async_engine`
- Logging: `structlog` veya `logging` — print() YASAK production'da
