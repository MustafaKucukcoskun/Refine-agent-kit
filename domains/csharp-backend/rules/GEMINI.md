# GEMINI.md — Antigravity Agent System (csharp-backend)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanimlar.
> Global kod kalitesi kurallari ~/.gemini/GEMINI.md'den yuklenir.

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
| **API DESIGN**   | "endpoint", "api", "controller", "schema"   | `{task-slug}.md` + backend-specialist  |
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

## TIER 1: C# BACKEND KOD KURALLARI

### Primary Agent: `backend-specialist`
### Supporting: `database-architect`, `security-auditor`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | microsoft-dotnet-core, api-patterns |
| **P1** | database-design, clean-code |
| **P2** | testing-patterns |

### C#-Specific Rules

- **Primary constructors:** `class UserService(IRepository repo)` pattern tercih et.
- **Records:** Immutable data icin `record UserDto(string Name, int Age);` kullan.
- **Pattern matching:** `switch` expressions ile temiz kontrol akisi. If-else zincirleri YASAK (3+ branch).
- **required keyword:** Zorunlu property'ler icin `required` kullan.
- **Async/await:** `async Task<T>` pattern. `.Result` veya `.Wait()` KESINLIKLE YASAK (deadlock riski).
- **Nullable reference types:** `#nullable enable` zorunlu. `null!` suppress YASAK.
- **Testing:** xUnit + FluentAssertions. Her endpoint icin unit + integration test.

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

### API Design (ASP.NET Core)

- Minimal API veya Controller: Proje boyutuna gore sec (kucuk → Minimal, buyuk → Controller)
- Versioning: `/api/v1/` prefix, `Asp.Versioning.Http` paketi
- Validation: FluentValidation veya Data Annotations
- Response: `Results.Ok()`, `Results.NotFound()`, `Results.Problem()` pattern
- Middleware: Exception handling, logging, correlation ID

### Database (Entity Framework Core)

- Migrations: `dotnet ef migrations add` ile versiyon kontrol
- DbContext: Scoped lifetime, `IDbContextFactory` for background services
- Queries: IQueryable composition, raw SQL sadece gerektiginde
- Bulk operations: EF Core 8+ `ExecuteUpdate`, `ExecuteDelete`
- Indexes: Her query pattern icin uygun index, `.HasIndex()` configuration

### Security

- Authentication: JWT Bearer + Identity veya OAuth2/OIDC
- Authorization: Policy-based authorization, `[Authorize(Policy = "...")]`
- CORS: Named policies, restrictive defaults
- Input: Model binding + validation, SQL injection prevention otomatik (EF Core)
- Secrets: `IConfiguration` + Secret Manager / Azure Key Vault

---

## Final Checklist

"Son kontroller", "final checks" → `python .agent/scripts/checklist.py .`
Sira: **Security → Lint (dotnet format) → Schema → Tests → API Docs (Swagger) → Performance**

---

## QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** clean-code, intelligent-routing, microsoft-dotnet-core, api-patterns,
database-design, testing-patterns, performance-profiling, context-engineering, code-review-checklist

**Workflows:** /create, /debug, /verify, /code-review

**Scripts:** `verify_all.py`, `checklist.py`, `session_manager.py`, `setup-agent.py`,
`auto_preview.py`, `verify_project_tmp.py`

---
