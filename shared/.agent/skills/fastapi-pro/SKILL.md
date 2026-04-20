---
name: fastapi-pro
description: Production FastAPI patterns — Pydantic v2 models, async dependency injection, router architecture, OAuth2/JWT auth, SQLAlchemy 2.x async, lifespan events, background tasks, middleware, error handling, pytest + httpx testing. Use when building a new FastAPI service, migrating from Flask, adding auth, wiring a DB, or debugging async behavior. Keywords: FastAPI, Pydantic, async API, Python backend, REST, OAuth2, JWT, SQLAlchemy async, uvicorn.
version: 1.0.0
domain: python-backend
triggers: fastapi, pydantic, async api, python api
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# FastAPI Pro Patterns

> Production-ready FastAPI patterns. Pydantic v2, async-first, type-safe.

## When to Use vs. Related Skills

| You want to… | Use |
|---|---|
| New FastAPI endpoint / service | **fastapi-pro** (this) |
| General Python code quality | `python-patterns` + this |
| Async concurrency patterns | `async-python-patterns` + this |
| Database schema design | `database-design` + this |
| Django web app (not API) | `django-patterns` (not this) |
| Deployment to prod | `deployment-procedures` + this |

---

## 1. Pydantic v2 Models

```python
from pydantic import BaseModel, Field, field_validator, model_validator, ConfigDict

class UserCreate(BaseModel):
    model_config = ConfigDict(strict=True, str_strip_whitespace=True)

    email: str = Field(..., min_length=5, max_length=255)
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=13, le=120)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if "@" not in v:
            raise ValueError("Invalid email format")
        return v.lower()

    @model_validator(mode="after")
    def check_consistency(self) -> "UserCreate":
        # Cross-field validation
        return self

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # ORM mode

    id: int
    email: str
    name: str
```

---

## 2. Dependency Injection

```python
from fastapi import Depends, HTTPException, status
from typing import Annotated

# Simple dependency
async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        await db.close()

DbDep = Annotated[AsyncSession, Depends(get_db)]

# Chained dependency
async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: DbDep,
) -> User:
    user = await db.get(User, decode_token(token).sub)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

# Usage in endpoint
@router.get("/me")
async def read_me(user: CurrentUser) -> UserResponse:
    return user
```

### Override for testing

```python
app.dependency_overrides[get_db] = lambda: test_db_session
```

---

## 3. Router Architecture

```
app/
├── main.py              # FastAPI app + lifespan
├── core/
│   ├── config.py        # Settings (Pydantic BaseSettings)
│   ├── security.py      # JWT / OAuth2
│   └── database.py      # Engine + session
├── api/
│   ├── __init__.py
│   ├── deps.py          # Shared dependencies
│   └── v1/
│       ├── __init__.py
│       ├── router.py    # Include all routers
│       ├── users.py     # /api/v1/users
│       └── posts.py     # /api/v1/posts
├── models/              # SQLAlchemy models
├── schemas/             # Pydantic schemas
└── services/            # Business logic
```

```python
# api/v1/router.py
from fastapi import APIRouter
from .users import router as users_router
from .posts import router as posts_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(posts_router, prefix="/posts", tags=["posts"])
```

---

## 4. Async Endpoints & Background Tasks

```python
from fastapi import BackgroundTasks

async def send_welcome_email(email: str):
    # Long-running task — runs after response is sent
    await email_service.send(to=email, template="welcome")

@router.post("/users", status_code=201)
async def create_user(
    data: UserCreate,
    db: DbDep,
    bg: BackgroundTasks,
) -> UserResponse:
    user = User(**data.model_dump())
    db.add(user)
    await db.commit()
    await db.refresh(user)
    bg.add_task(send_welcome_email, user.email)
    return user
```

---

## 5. Exception Handling

```python
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse

class AppException(Exception):
    def __init__(self, status_code: int, detail: str, code: str):
        self.status_code = status_code
        self.detail = detail
        self.code = code

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.code, "detail": exc.detail},
    )

# Usage
raise AppException(404, "User not found", "USER_NOT_FOUND")
```

---

## 6. OAuth2 / JWT Authentication

```python
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from datetime import datetime, timedelta

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + expires_delta
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

@router.post("/auth/token")
async def login(form: OAuth2PasswordRequestForm = Depends(), db: DbDep = None):
    user = await authenticate_user(db, form.username, form.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_access_token({"sub": str(user.id)}), "token_type": "bearer"}
```

---

## 7. SQLAlchemy Async Session

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

# Dependency
async def get_db():
    async with async_session() as session:
        async with session.begin():
            yield session
```

---

## 8. Lifespan Events

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    redis = await aioredis.from_url("redis://localhost")
    app.state.redis = redis
    yield
    # Shutdown
    await redis.close()

app = FastAPI(lifespan=lifespan)
```

---

## Quick Reference

| Task            | Pattern                                           |
| --------------- | ------------------------------------------------- |
| Validation      | Pydantic v2 `field_validator` / `model_validator` |
| Auth            | `OAuth2PasswordBearer` + JWT + `Depends` chain    |
| DB session      | `async_sessionmaker` + `yield` dependency         |
| Background work | `BackgroundTasks` (simple) or Celery (heavy)      |
| Errors          | Custom `Exception` + `exception_handler`          |
| Config          | `BaseSettings` with `.env` file                   |
| Testing         | `httpx.AsyncClient` + `dependency_overrides`      |

---

## Error Handling Pattern

```python
from fastapi import Request, status
from fastapi.responses import JSONResponse

class AppError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code

class NotFoundError(AppError):
    def __init__(self, resource: str, id: str):
        super().__init__(
            code="NOT_FOUND",
            message=f"{resource} {id} not found",
            status_code=status.HTTP_404_NOT_FOUND,
        )

@app.exception_handler(AppError)
async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.code, "message": exc.message},
    )

# Usage:
@router.get("/users/{id}")
async def get_user(id: str) -> UserOut:
    user = await repo.find(id)
    if not user:
        raise NotFoundError("user", id)
    return user
```

## Testing Pattern

```python
# conftest.py
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.main import app
from app.deps import get_db

@pytest.fixture
async def db_session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    # ... schema setup
    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    async with session_factory() as session:
        yield session

@pytest.fixture
async def client(db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()

# test_users.py
async def test_get_user_404(client):
    r = await client.get("/users/nope")
    assert r.status_code == 404
    assert r.json()["code"] == "NOT_FOUND"

async def test_create_user_happy(client):
    r = await client.post("/users", json={"email": "a@b.com", "name": "Ada", "age": 30})
    assert r.status_code == 201
    assert r.json()["email"] == "a@b.com"
```

## Pitfalls

| Pitfall | Fix |
|---|---|
| Blocking I/O inside async endpoint | Use async driver (asyncpg, httpx) — NEVER `requests`/`psycopg2` in async |
| `session.commit()` inside iteration | Commit once at end; use bulk operations |
| Leaking DB sessions | Use `Depends(get_db)` with `yield` — FastAPI closes on response |
| No request/response models | Always declare `response_model=UserOut` — security + docs |
| Sync validators doing I/O | Keep validators pure; do lookups in the service layer |
| `async def` without actual awaits | Use plain `def` — it will run in thread pool correctly |
| Global mutable state (caches) | Use `lru_cache` on dep providers, not module-level dicts |
