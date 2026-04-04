---
description: ASP.NET Core project scaffolding. Generates solution structure with controllers, EF Core, authentication, and Docker configuration. Use for new .NET projects, solution setup, or architecture initialization.
---

# /scaffold - ASP.NET Core Project Scaffold

$ARGUMENTS

---

## Purpose

Generates a production-ready ASP.NET Core project structure — from solution creation to Docker configuration. Handles project type selection, Entity Framework Core setup, authentication scaffolding, and launch profile configuration.

---

## Pre-flight Checks

> **GATE:** Verify SDK is installed.

```bash
dotnet --list-sdks
# Requires .NET 8.0+ SDK
```

---

## Step 1: Solution & Project Creation

> **GATE:** ASK user which project type is needed. Do not auto-decide.

| Template | Command | Best For |
|----------|---------|----------|
| Web API (minimal) | `dotnet new webapi -n MyApi` | REST APIs, microservices |
| Web API (controllers) | `dotnet new webapi -n MyApi --use-controllers` | Traditional MVC-style APIs |
| MVC | `dotnet new mvc -n MyWeb` | Server-rendered web apps |
| Blazor Server | `dotnet new blazor -n MyApp --interactivity Server` | Interactive SPA (server-side) |
| Blazor WASM | `dotnet new blazor -n MyApp --interactivity WebAssembly` | Interactive SPA (client-side) |
| Worker Service | `dotnet new worker -n MyWorker` | Background jobs, message consumers |

```bash
# Create solution
dotnet new sln -n MySolution

# Create project
dotnet new webapi -n MyApi --use-controllers

# Add to solution
dotnet sln add MyApi/MyApi.csproj
```

---

## Step 2: Project Structure

```
MySolution/
├── MySolution.sln
├── MyApi/
│   ├── MyApi.csproj
│   ├── Program.cs
│   ├── Controllers/
│   │   └── WeatherForecastController.cs
│   ├── Models/
│   ├── Services/
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Migrations/
│   ├── Properties/
│   │   └── launchSettings.json
│   ├── appsettings.json
│   └── appsettings.Development.json
├── MyApi.Tests/
│   └── MyApi.Tests.csproj
├── Dockerfile
├── .dockerignore
└── docker-compose.yml
```

> Create `Models/`, `Services/`, `Data/` directories manually — templates don't include them.

---

## Step 3: Entity Framework Core Setup

```bash
# Add EF Core packages
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL  # or: SqlServer, Sqlite

# Install EF tool
dotnet tool install --global dotnet-ef
```

**DbContext registration in Program.cs:**
```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
```

**Connection string in appsettings.Development.json:**
```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Database=mydb;Username=postgres;Password=postgres"
  }
}
```

> **CRITICAL:** Never put real credentials in `appsettings.json`. Use `dotnet user-secrets` for development, environment variables for production.

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;..."
```

---

## Step 4: Authentication Setup

| Auth Type | Package | Best For |
|-----------|---------|----------|
| JWT Bearer | `Microsoft.AspNetCore.Authentication.JwtBearer` | API-to-API, mobile clients |
| ASP.NET Identity | `Microsoft.AspNetCore.Identity.EntityFrameworkCore` | Full user management |
| OAuth2/OIDC | `Microsoft.AspNetCore.Authentication.OpenIdConnect` | Third-party login |

```bash
# JWT Bearer setup
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

> **GATE:** ASK user which auth strategy is needed before implementing.

---

## Step 5: Docker Configuration

**Dockerfile:**
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MyApi/MyApi.csproj", "MyApi/"]
RUN dotnet restore "MyApi/MyApi.csproj"
COPY . .
RUN dotnet publish "MyApi/MyApi.csproj" -c Release -o /app/publish

FROM base AS final
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MyApi.dll"]
```

---

## Step 6: Initial Migration & Test Run

```bash
# Create initial migration
dotnet ef migrations add InitialCreate --project MyApi

# Apply migration
dotnet ef database update --project MyApi

# Run
dotnet run --project MyApi
```

> Verify Swagger UI at `https://localhost:PORT/swagger`

---

## Output Format

````markdown
## 🏗️ ASP.NET Core Project Scaffolded

**Solution:** [name]
**Project type:** [webapi/mvc/blazor/worker]
**Target framework:** net8.0
**Database:** [PostgreSQL/SqlServer/SQLite]
**Auth:** [JWT/Identity/None]

### Created Structure
- [ ] Solution + project created
- [ ] EF Core configured
- [ ] DbContext registered
- [ ] Auth scaffolded
- [ ] Docker configuration
- [ ] Test project added
- [ ] Initial migration created
- [ ] App runs successfully

### Next Steps
- Define domain models in `Models/`
- Add service layer in `Services/`
- Create controllers for domain entities
- Write integration tests
````

---

## Key Principles

- **Nullable reference types** are ON by default since .NET 8 — design models accordingly
- **Minimal API vs Controllers** — minimal for simple microservices, controllers for complex APIs. Hard to change later.
- **`user-secrets`** for dev, **environment variables** for prod — never hardcode connection strings
- **Multi-stage Docker builds** — keep runtime image small by using `aspnet` base (not `sdk`)
- **Test project** — always create alongside main project (`dotnet new xunit -n MyApi.Tests`)
