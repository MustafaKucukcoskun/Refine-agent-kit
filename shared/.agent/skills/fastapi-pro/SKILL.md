---
name: fastapi-pro
description: FastAPI advanced patterns — Pydantic v2 models, dependency injection, router architecture, async patterns, OAuth2/JWT auth, SQLAlchemy async, lifespan events. Use when building FastAPI applications.
version: 1.0.0
domain: python-backend
triggers: fastapi, pydantic, async api, python api
---

# FastAPI Pro Patterns

> Production-ready FastAPI patterns. Pydantic v2, async-first, type-safe.

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
