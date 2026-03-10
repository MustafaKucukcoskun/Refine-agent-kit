---
description: Scaffold ASP.NET Core project components. Controllers, services, entities, and migrations.
---

# /scaffold - ASP.NET Core Scaffolding

$ARGUMENTS

---

## Purpose

Generate boilerplate code for ASP.NET Core projects — controllers, services, DTOs, entities, and database context.

---

## Sub-commands

```
/scaffold controller [name]   - Create API controller with CRUD
/scaffold service [name]      - Create service + interface
/scaffold entity [name]       - Create entity + DbContext update
/scaffold dto [name]          - Create request/response DTOs
/scaffold full [name]         - Full stack: entity → service → controller → DTOs
/scaffold migration [name]    - Create EF migration
```

---

## Behavior

### Full Stack Scaffold

When `/scaffold full User` is called:

1. **Entity** → `Models/User.cs`
   ```csharp
   public class User
   {
       public int Id { get; set; }
       public required string Name { get; set; }
       public required string Email { get; set; }
       public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
   }
   ```

2. **DbContext update** → `Data/AppDbContext.cs`
   ```csharp
   public DbSet<User> Users => Set<User>();
   ```

3. **DTOs** → `DTOs/UserDto.cs`
   ```csharp
   public record CreateUserRequest(string Name, string Email);
   public record UserResponse(int Id, string Name, string Email, DateTime CreatedAt);
   ```

4. **Service** → `Services/IUserService.cs` + `Services/UserService.cs`

5. **Controller** → `Controllers/UsersController.cs`
   - GET /api/users
   - GET /api/users/{id}
   - POST /api/users
   - PUT /api/users/{id}
   - DELETE /api/users/{id}

6. **Migration**
   ```bash
   dotnet ef migrations add AddUsers
   dotnet ef database update
   ```

---

## Output Format

````markdown
## Scaffold: [Name]

### Files Created
| File | Type | Path |
|------|------|------|
| User.cs | Entity | Models/ |
| UserDto.cs | DTOs | DTOs/ |
| IUserService.cs | Interface | Services/ |
| UserService.cs | Service | Services/ |
| UsersController.cs | Controller | Controllers/ |

### DI Registration
```csharp
builder.Services.AddScoped<IUserService, UserService>();
```

### Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/users | List all |
| GET | /api/users/{id} | Get by ID |
| POST | /api/users | Create |
| PUT | /api/users/{id} | Update |
| DELETE | /api/users/{id} | Delete |
````

---

## Key Principles

- **Follow project conventions** — match existing naming and structure
- **Minimal generation** — only create what's needed
- **DI-friendly** — always use interfaces
- **No over-engineering** — simple CRUD doesn't need repository pattern on top of EF
