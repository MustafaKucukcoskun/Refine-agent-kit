---
name: django-patterns
description: Django production patterns — project structure, model design, DRF ViewSets, serializer validation, N+1 prevention, management commands, signals, Celery. Use when building Django/DRF applications.
version: 1.0.0
domain: python-backend
triggers: django, drf, django rest framework, orm
---

# Django Patterns

> Production-ready Django + DRF patterns. ORM-first, convention-driven.

---

## 1. Project Structure

```
project/
├── config/                  # Project-level config
│   ├── __init__.py
│   ├── settings/
│   │   ├── base.py         # Shared settings
│   │   ├── development.py  # Dev overrides
│   │   └── production.py   # Prod overrides
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── users/              # Feature app
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── managers.py     # Custom managers
│   │   ├── signals.py
│   │   ├── tasks.py        # Celery tasks
│   │   └── tests/
│   │       ├── test_models.py
│   │       └── test_views.py
│   └── posts/
├── manage.py
└── pyproject.toml
```

### Settings split

```python
# config/settings/base.py
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    # ...
    "rest_framework",
    "apps.users",
    "apps.posts",
]

# config/settings/development.py
from .base import *
DEBUG = True
DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}}

# config/settings/production.py
from .base import *
DEBUG = False
DATABASES = {"default": env.db("DATABASE_URL")}
```

---

## 2. Model Design

```python
from django.db import models
from .managers import PublishedManager

class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, db_index=True)
    author = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()          # Default
    published = PublishedManager()      # Custom: Post.published.all()

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["-created_at"])]
        verbose_name_plural = "posts"

    def __str__(self) -> str:
        return self.title
```

### Custom Manager

```python
# managers.py
from django.db import models

class PublishedManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_published=True)
```

---

## 3. DRF ViewSet vs APIView

| Use                       | When                                        |
| ------------------------- | ------------------------------------------- |
| `ModelViewSet`            | Standard CRUD with minimal customization    |
| `APIView`                 | Complex business logic, non-CRUD operations |
| `GenericAPIView` + mixins | Selective CRUD (e.g., list + create only)   |

```python
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_published", "author"]
    search_fields = ["title", "content"]
    ordering_fields = ["created_at"]

    def get_queryset(self):
        return Post.objects.select_related("author").prefetch_related("tags")

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
```

---

## 4. Serializer Validation

```python
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.name", read_only=True)

    class Meta:
        model = Post
        fields = ["id", "title", "slug", "content", "author", "author_name", "created_at"]
        read_only_fields = ["author", "slug"]

    def validate_title(self, value: str) -> str:
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters")
        return value

    def validate(self, data: dict) -> dict:
        # Cross-field validation
        if "draft" in data.get("title", "").lower() and data.get("is_published"):
            raise serializers.ValidationError("Draft posts cannot be published")
        return data
```

---

## 5. N+1 Prevention

```python
# ❌ N+1 problem
posts = Post.objects.all()
for post in posts:
    print(post.author.name)      # 1 query per post!
    print(post.tags.all())       # 1 query per post!

# ✅ Fixed
posts = (
    Post.objects
    .select_related("author")          # FK → JOIN (one-to-one, FK)
    .prefetch_related("tags")          # M2M → 2nd query (many-to-many)
)
```

| Method                   | Use for                | SQL             |
| ------------------------ | ---------------------- | --------------- |
| `select_related`         | ForeignKey, OneToOne   | JOIN            |
| `prefetch_related`       | ManyToMany, reverse FK | Separate query  |
| `Prefetch(queryset=...)` | Filtered prefetch      | Custom queryset |

---

## 6. Management Commands

```python
# apps/users/management/commands/seed_users.py
from django.core.management.base import BaseCommand
from apps.users.models import User

class Command(BaseCommand):
    help = "Seed database with test users"

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=10)

    def handle(self, *args, **options):
        count = options["count"]
        users = [User(email=f"user{i}@test.com", name=f"User {i}") for i in range(count)]
        User.objects.bulk_create(users, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f"Created {count} users"))
```

```bash
python manage.py seed_users --count 50
```

---

## 7. Signals — When to Use

| ✅ Use                    | ❌ Don't Use                            |
| ------------------------- | --------------------------------------- |
| Audit logging             | Complex business logic                  |
| Cache invalidation        | Multi-step workflows                    |
| Denormalization           | Anything that needs error handling      |
| Third-party notifications | Side effects that must be transactional |

```python
# apps/users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
```

```python
# apps/users/apps.py
class UsersConfig(AppConfig):
    name = "apps.users"
    def ready(self):
        import apps.users.signals  # noqa: F401
```

---

## 8. Celery Integration

```python
# config/celery.py
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")
app = Celery("project")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
```

```python
# apps/posts/tasks.py
from celery import shared_task

@shared_task(bind=True, max_retries=3)
def process_post_images(self, post_id: int):
    try:
        post = Post.objects.get(id=post_id)
        # Heavy processing...
    except Exception as exc:
        self.retry(exc=exc, countdown=60)
```

```python
# Usage in view
process_post_images.delay(post.id)
```

---

## Quick Reference

| Task         | Pattern                                               |
| ------------ | ----------------------------------------------------- |
| CRUD API     | `ModelViewSet` + `ModelSerializer`                    |
| Custom query | `get_queryset()` override                             |
| N+1 fix      | `select_related` (FK) / `prefetch_related` (M2M)      |
| Validation   | `validate_<field>` or `validate()` on serializer      |
| Background   | Celery `shared_task` + `.delay()`                     |
| Signals      | Only for side effects (logging, cache, notifications) |
| DB seed      | Management command + `bulk_create`                    |
| Settings     | Split base/dev/prod                                   |
