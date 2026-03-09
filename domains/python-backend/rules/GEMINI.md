# GEMINI.md — Antigravity Agent System (python-backend)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanımlar.
> Global kod kalitesi kuralları ~/.gemini/GEMINI.md'den yüklenir.

---

## CRITICAL: AGENT & SKILL PROTOCOL (ONCE OKU)

**ZORUNLU:** Her implementasyondan ONCE ilgili agent dosyasini ve skill'lerini oku.

### Skill Loading

`Agent aktif → frontmatter "skills:" kontrol → SKILL.md oku → Ilgili section'lari oku`

- **Selective:** TUM dosyalari okuma. Once `SKILL.md`, sonra sadece request'e uyan section.
- **Priority:** P0 (GEMINI.md) > P1 (Agent .md) > P2 (SKILL.md). Hepsi baglayici.
- **Enforcement:** `Read → Understand WHY → Apply PRINCIPLES → Code`. Skip yasak.

---

## REQUEST CLASSIFIER (ADIM 1)

| Tip              | Trigger                                     | Aksiyon                                |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| **SORU**         | "what is", "explain", "nasil calisir"       | Text yanit, arac yok                   |
| **SURVEY**       | "analyze", "listele", "overview"            | Session intel, dosya yok               |
| **SIMPLE CODE**  | "fix", "ekle", "degistir" (tek dosya)       | Inline edit                            |
| **COMPLEX CODE** | "build", "create", "implement", "yaz"       | `{task-slug}.md` + Agent               |
| **API DESIGN**   | "endpoint", "api", "route", "schema"        | `{task-slug}.md` + backend-specialist  |
| **SLASH CMD**    | /create, /debug, /verify, /code-review      | Command flow                           |

---

## INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATIK)

**HER request'ten once otomatik agent sec ve bildir.**

### Protocol

1. **Sessiz Analiz:** Domain tespit et (API? Database? Auth? Business Logic?)
2. **Agent Sec:** En uygun specialist
3. **Bildir:** `**Applying knowledge of @[agent-name]...**`
4. **Uygula:** Agent .md dosyasini oku → kurallari uygula

### ROUTING CHECKLIST (Her kod yanitindan once ZORUNLU)

| #   | Kontrol                                       | Basarisiz →                                 |
| --- | --------------------------------------------- | ------------------------------------------- |
| 1   | Dogru agent domain tespit edildi mi?          | STOP. Analiz et.                            |
| 2   | Agent .md dosyasi OKUNDU mu?                  | STOP. `.agent/agents/{agent}.md` ac ve oku. |
| 3   | `Applying @[agent]...` yazildi mi?            | STOP. Ekle.                                 |
| 4   | Agent frontmatter'daki skill'ler yuklendi mi? | STOP. `skills:` oku.                        |

- Agent belirlemeden kod = **PROTOCOL VIOLATION**
- Agent kurallarini yoksaymak = **QUALITY FAILURE**

---

## File Dependency Awareness

Herhangi bir dosyayi degistirmeden once:

1. `CODEBASE.md` kontrol et (yoksa `session_manager.py` ile uret)
2. Bagimli dosyalari tespit et
3. Etkilenen TUM dosyalari birlikte guncelle

### System Map

**ZORUNLU:** Session basinda `ARCHITECTURE.md` oku. Agent, Skill ve Script yapisini anla.

---

## TIER 1: PYTHON BACKEND KOD KURALLARI

### Primary Agent: `backend-specialist`
### Supporting: `database-architect`, `security-auditor`
### Testing: `test-engineer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | python-patterns, clean-code, api-patterns |
| **P1** | postgres-patterns, database-migrations, testing-patterns |
| **P2** | supabase-postgres-best-practices, performance-profiling |

### Python-Specific Rules

- **Type hints zorunlu:** `def get_user(user_id: int) -> User:`
- **Pydantic model kullan:** Request/response validation (FastAPI)
- **Async dogru kullan:** `await` ile async endpoint'ler, blocking I/O yasak
- **Connection pooling:** SQLAlchemy `create_async_engine` + session management
- **Logging:** `structlog` veya `logging` — `print()` YASAK production'da
- **Error handling:** Domain-specific exception class'lari, generic `Exception` yasak
- **Testing:** Her endpoint icin unit + integration test, `pytest` + `httpx`

### Gemini Mode Mapping

| Mod      | Agent             | Davranis                                       |
| -------- | ----------------- | ---------------------------------------------- |
| **plan** | `project-planner` | 4-asama metodoloji. Phase 4'e kadar KOD YAZMA. |
| **ask**  | —                 | Sadece anlamaya odaklan. Soru sor.             |
| **edit** | `orchestrator`    | Execute. Once `{task-slug}.md` kontrol et.     |

**Plan Mode (4 Faz):**
1. ANALYSIS → Arastir, soru sor
2. PLANNING → `{task-slug}.md`, gorev plani
3. SOLUTIONING → Mimari, tasarim (KOD YOK!)
4. IMPLEMENTATION → Kod + testler

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

## Final Checklist

"Son kontroller", "final checks" → `python .agent/scripts/checklist.py .`
Sira: **Security → Lint → Schema → Tests → API Docs → Performance**

---

## QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** clean-code, intelligent-routing, python-patterns, api-patterns,
postgres-patterns, database-migrations, testing-patterns, performance-profiling,
supabase-postgres-best-practices, context-engineering, code-review-checklist

**Workflows:** /create, /debug, /verify, /code-review, /deploy

**Scripts:** `verify_all.py`, `checklist.py`, `session_manager.py`, `setup-agent.py`,
`auto_preview.py`, `verify_project_tmp.py`

---
