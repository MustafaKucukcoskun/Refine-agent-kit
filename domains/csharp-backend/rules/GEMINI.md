# GEMINI.md — Antigravity Agent System (csharp-backend)

> This file defines the agent routing and skill system for this workspace.
> Global code quality rules are loaded from ~/.gemini/GEMINI.md.

---

@./base-protocol.md

---

## REQUEST CLASSIFIER (STEP 1)

| Type | Trigger | Action |
|------|---------|--------|
| **QUESTION** | "what is", "explain", "how does it work" | Text response |
| **SIMPLE CODE** | "fix", "add", "change" (single file) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement" | `{task-slug}.md` + Agent |
| **API DESIGN** | "endpoint", "api", "controller", "schema" | `{task-slug}.md` + backend-specialist |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: C# BACKEND CODE RULES

### Primary Agent: `backend-specialist`
### Supporting: `database-architect`, `security-auditor`

### Skill Priority

| Priority | Skills |
|----------|--------|
| **P0** | microsoft-dotnet-core, api-patterns |
| **P1** | database-design, clean-code |
| **P2** | testing-patterns |

### C#-Specific Rules

- **Primary constructors:** Prefer `class UserService(IRepository repo)` pattern.
- **Records:** Use `record UserDto(string Name, int Age);` for immutable data.
- **Pattern matching:** Clean control flow with `switch` expressions. If-else chains FORBIDDEN (3+ branches).
- **required keyword:** Use `required` for mandatory properties.
- **Async/await:** `async Task<T>` pattern. `.Result` or `.Wait()` ABSOLUTELY FORBIDDEN (deadlock risk).
- **Nullable reference types:** `#nullable enable` mandatory. `null!` suppress FORBIDDEN.
- **Testing:** xUnit + FluentAssertions. Unit + integration test for every endpoint.

@./gemini-modes.md

### Final Checklist

Order: **Security → Lint (dotnet format) → Schema → Tests → API Docs (Swagger) → Performance**

---

## TIER 2: API & DATABASE RULES

### API Design (ASP.NET Core)

- Minimal API or Controller: Choose based on project size (small → Minimal, large → Controller)
- Versioning: `/api/v1/` prefix, `Asp.Versioning.Http` package
- Validation: FluentValidation or Data Annotations
- Response: `Results.Ok()`, `Results.NotFound()`, `Results.Problem()` pattern
- Middleware: Exception handling, logging, correlation ID

### Database (Entity Framework Core)

- Migrations: Version control with `dotnet ef migrations add`
- DbContext: Scoped lifetime, `IDbContextFactory` for background services
- Queries: IQueryable composition, raw SQL only when necessary
- Bulk operations: EF Core 8+ `ExecuteUpdate`, `ExecuteDelete`
- Indexes: Appropriate index for every query pattern, `.HasIndex()` configuration

### Security

- Authentication: JWT Bearer + Identity or OAuth2/OIDC
- Authorization: Policy-based authorization, `[Authorize(Policy = "...")]`
- CORS: Named policies, restrictive defaults
- Input: Model binding + validation, SQL injection prevention automatic (EF Core)
- Secrets: `IConfiguration` + Secret Manager / Azure Key Vault

---

@./agents-reference.md

**Key Skills:** microsoft-dotnet-core, api-patterns, database-design, clean-code, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /scaffold

---
