# Domain: C# Backend (.NET)

> Bu dizin C# / .NET backend projesi icerir.
> Agent routing: Bu dizindeki dosyalar icin asagidaki kurallar gecerlidir.

## Agent Routing

- **Primary:** `backend-specialist` — API design, business logic, C# patterns
- **Supporting:** `database-architect` — EF Core, migrations, schema design
- **Security:** `security-auditor` — Auth, OWASP, input validation

## Skill Priority

| P0 (Kritik) | P1 (Onemli) | P2 (Destek) |
|-------------|-------------|-------------|
| microsoft-dotnet-core | database-design | testing-patterns |
| api-patterns | clean-code | |

## Tech Stack

- Runtime: .NET 10
- Language: C# 13
- Framework: ASP.NET Core
- ORM: Entity Framework Core
- Testing: xUnit + FluentAssertions

## C#-Specific Rules

- Primary constructors tercih et: `class UserService(IRepository repo)`
- Records immutable data icin: `record UserDto(string Name, int Age);`
- Pattern matching: switch expressions ile temiz kontrol akisi
- `required` keyword: Zorunlu property'ler icin kullan
- Testing: xUnit + FluentAssertions, her endpoint icin test
- Async/await: `async Task<T>` pattern, `.Result` veya `.Wait()` YASAK
