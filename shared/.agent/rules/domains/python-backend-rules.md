# python-backend Domain Rules

## Activation Condition

"fastapi" or "django" present in pyproject.toml.

## Project Type Distinction

- FastAPI → async-first, Pydantic v2, motor/SQLAlchemy async
- Django → ORM-first, DRF, sync (async views optional)

## Primary Agent

backend-specialist

## Dependency Management

- pyproject.toml + uv preferred (requirements.txt second choice)
- Type hints mandatory (mypy or pyright)

## Test

- pytest mandatory
- FastAPI: httpx + AsyncClient
- Django: Django test client or pytest-django
