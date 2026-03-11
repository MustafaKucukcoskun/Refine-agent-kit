# Domain: C# Backend (.NET)

> This directory contains a C# / .NET backend project.
> Agent routing: The following rules apply to files in this directory.

## Agent Routing

- **Primary:** `backend-specialist` — API design, business logic, C# patterns
- **Supporting:** `database-architect` — EF Core, migrations, schema design
- **Security:** `security-auditor` — Auth, OWASP, input validation

## Skill Priority

| P0 (Critical) | P1 (Important) | P2 (Supporting) |
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

- Prefer primary constructors: `class UserService(IRepository repo)`
- Use records for immutable data: `record UserDto(string Name, int Age);`
- Pattern matching: Clean control flow with switch expressions
- `required` keyword: Use for mandatory properties
- Testing: xUnit + FluentAssertions, test for every endpoint
- Async/await: `async Task<T>` pattern, `.Result` or `.Wait()` FORBIDDEN
