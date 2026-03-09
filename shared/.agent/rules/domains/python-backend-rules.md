# python-backend Domain Kuralları

## Aktif Olma Koşulu

pyproject.toml içinde "fastapi" veya "django" mevcut.

## Proje Tipi Ayrımı

- FastAPI → async-first, Pydantic v2, motor/SQLAlchemy async
- Django → ORM-first, DRF, sync (async views isteğe bağlı)

## Primary Agent

backend-specialist

## Dependency Management

- pyproject.toml + uv tercih edilir (requirements.txt ikinci tercih)
- Type hints zorunlu (mypy veya pyright)

## Test

- pytest zorunlu
- FastAPI: httpx + AsyncClient
- Django: Django test client veya pytest-django
