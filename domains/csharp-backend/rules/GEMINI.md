# GEMINI.md — Antigravity Agent System (csharp-backend)

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
| **API DESIGN** | "endpoint", "api", "controller", "schema" | `{task-slug}.md` + backend-specialist |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

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

@./gemini-modes.md

### Final Checklist

Sira: **Security → Lint (dotnet format) → Schema → Tests → API Docs (Swagger) → Performance**

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

@./agents-reference.md

**Key Skills:** microsoft-dotnet-core, api-patterns, database-design, clean-code, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /scaffold

---
