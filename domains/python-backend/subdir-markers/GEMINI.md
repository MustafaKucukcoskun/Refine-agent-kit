# Domain: Python Backend

> This directory contains a Python backend project (FastAPI/Django).
> Agent routing: The following rules apply to files in this directory.

## Agent Routing

- **Primary:** `backend-specialist` — API design, business logic, Python patterns
- **Supporting:** `database-architect` — SQL, migrations, schema design
- **Security:** `security-auditor` — Auth, OWASP, input validation
- **Test:** `test-engineer` — Pytest, integration tests

## Skill Priority

| P0 (Critical) | P1 (Important) | P2 (Supporting) |
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

- Type hints mandatory: `def get_user(user_id: int) -> User:`
- Use Pydantic models (FastAPI): Request/response validation
- `await` must be used correctly in async endpoints
- Connection pooling: SQLAlchemy `create_async_engine`
- Logging: `structlog` or `logging` — print() FORBIDDEN in production
