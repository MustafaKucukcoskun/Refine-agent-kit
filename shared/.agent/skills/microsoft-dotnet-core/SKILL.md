---
name: microsoft-dotnet-core
description: ASP.NET Core production patterns — minimal API vs controllers, dependency injection, middleware, Entity Framework Core, configuration, modern C#, CancellationToken, xUnit integration testing. Use when building .NET/C# backend applications.
version: 1.0.0
domain: csharp-backend
triggers: dotnet, csharp, asp.net, entity framework, ef core, csproj
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# ASP.NET Core / .NET Patterns

> Production-ready .NET patterns. Modern C#, DI-first, async-native.

---

## 1. Minimal API vs Controller-Based

### Decision

| Use                  | When                                                     |
| -------------------- | -------------------------------------------------------- |
| **Minimal API**      | Microservices, simple endpoints, fewer conventions       |
| **Controller-based** | Large apps, team conventions, attribute routing, filters |

### Minimal API

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapGet("/products", async (AppDbContext db, CancellationToken ct) =>
    await db.Products.ToListAsync(ct));

app.MapPost("/products", async (CreateProductRequest req, AppDbContext db, CancellationToken ct) =>
{
    var product = new Product { Name = req.Name, Price = req.Price };
    db.Products.Add(product);
    await db.SaveChangesAsync(ct);
    return Results.Created($"/products/{product.Id}", product);
});

app.Run();
```

### Controller-Based

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await db.Products.ToListAsync(ct));

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductRequest req, CancellationToken ct)
    {
        var product = new Product { Name = req.Name, Price = req.Price };
        db.Products.Add(product);
        await db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetAll), new { id = product.Id }, product);
    }
}
```

---

## 2. Dependency Injection

```csharp
// Registration
builder.Services.AddSingleton<ICacheService, RedisCacheService>();   // One instance
builder.Services.AddScoped<IUserService, UserService>();             // Per request
builder.Services.AddTransient<IEmailService, SmtpEmailService>();    // Per injection

// Usage via primary constructor (C# 12+)
public class UserService(AppDbContext db, IEmailService email) : IUserService
{
    public async Task<User?> GetByIdAsync(int id, CancellationToken ct)
        => await db.Users.FindAsync([id], ct);
}
```

### Lifetime Rules

| Lifetime      | Scope           | Use For                   |
| ------------- | --------------- | ------------------------- |
| **Singleton** | App lifetime    | Config, cache, HttpClient |
| **Scoped**    | HTTP request    | DbContext, user context   |
| **Transient** | Every injection | Stateless services        |

> ⚠️ Never inject Scoped into Singleton (captive dependency).

---

## 3. Middleware Pipeline

```csharp
var app = builder.Build();

// Order matters! Request flows top-to-bottom, response bottom-to-top
app.UseExceptionHandler("/error");      // 1. Exception handling (outermost)
app.UseHsts();                          // 2. HTTPS
app.UseStaticFiles();                   // 3. Static files (short-circuit)
app.UseRouting();                       // 4. Route matching
app.UseCors("AllowAll");                // 5. CORS
app.UseAuthentication();                // 6. Auth: who are you?
app.UseAuthorization();                 // 7. Auth: can you do this?
app.MapControllers();                   // 8. Endpoint execution
```

### Custom Middleware

```csharp
app.Use(async (context, next) =>
{
    var sw = Stopwatch.StartNew();
    await next(context);
    sw.Stop();
    context.Response.Headers.Append("X-Response-Time", $"{sw.ElapsedMilliseconds}ms");
});
```

---

## 4. Entity Framework Core

### DbContext

```csharp
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}

// Entity configuration (separate file)
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(u => u.Email).IsUnique();
        builder.Property(u => u.Name).HasMaxLength(100).IsRequired();
    }
}
```

### Migrations

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet ef migrations remove  # Undo last migration (not applied)
```

### Async Query Patterns

```csharp
// ✅ Always pass CancellationToken
public async Task<List<Product>> GetActiveProductsAsync(CancellationToken ct)
    => await db.Products
        .Where(p => p.IsActive)
        .OrderByDescending(p => p.CreatedAt)
        .AsNoTracking()       // Read-only? Skip change tracking
        .ToListAsync(ct);

// ✅ Include for eager loading (N+1 prevention)
var orders = await db.Orders
    .Include(o => o.Items)
    .ThenInclude(i => i.Product)
    .Where(o => o.UserId == userId)
    .ToListAsync(ct);
```

---

## 5. Configuration

```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=mydb;Username=user;Password=pass"
  },
  "Jwt": {
    "Secret": "your-secret-key",
    "ExpiresInHours": 24
  }
}
```

```csharp
// Options pattern
public record JwtSettings
{
    public required string Secret { get; init; }
    public required int ExpiresInHours { get; init; }
}

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

// Usage
public class AuthService(IOptions<JwtSettings> jwtOptions)
{
    private readonly JwtSettings _jwt = jwtOptions.Value;
}
```

---

## 6. Modern C# Features

```csharp
// Records — immutable DTOs
public record CreateProductRequest(string Name, decimal Price);
public record ProductResponse(int Id, string Name, decimal Price, DateTime CreatedAt);

// Primary constructors (C# 12)
public class ProductService(AppDbContext db, ILogger<ProductService> logger)
{
    public async Task<Product> CreateAsync(CreateProductRequest req, CancellationToken ct)
    {
        logger.LogInformation("Creating product: {Name}", req.Name);
        var product = new Product { Name = req.Name, Price = req.Price };
        db.Products.Add(product);
        await db.SaveChangesAsync(ct);
        return product;
    }
}

// Pattern matching
public string GetPriceCategory(decimal price) => price switch
{
    < 10m => "Budget",
    >= 10m and < 100m => "Standard",
    >= 100m => "Premium",
};

// Required members
public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required decimal Price { get; set; }
}
```

---

## 7. CancellationToken

```csharp
// ✅ Always accept and forward CancellationToken
[HttpGet("{id}")]
public async Task<IActionResult> GetProduct(int id, CancellationToken ct)
{
    var product = await db.Products.FindAsync([id], ct);
    return product is null ? NotFound() : Ok(product);
}

// ✅ Check in long-running operations
public async Task ProcessBatchAsync(IEnumerable<int> ids, CancellationToken ct)
{
    foreach (var id in ids)
    {
        ct.ThrowIfCancellationRequested();
        await ProcessOneAsync(id, ct);
    }
}
```

---

## 8. Integration Testing

```csharp
// WebApplicationFactory pattern
public class ApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Replace real DB with in-memory
                services.RemoveAll<DbContextOptions<AppDbContext>>();
                services.AddDbContext<AppDbContext>(opts =>
                    opts.UseInMemoryDatabase("TestDb"));
            });
        }).CreateClient();
    }

    [Fact]
    public async Task GetProducts_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/products");
        response.EnsureSuccessStatusCode();
        var products = await response.Content.ReadFromJsonAsync<List<ProductResponse>>();
        Assert.NotNull(products);
    }
}
```

---

## Quick Reference

| Task         | Pattern                                                |
| ------------ | ------------------------------------------------------ |
| Simple API   | Minimal API (`app.MapGet/Post/Put/Delete`)             |
| Complex API  | Controller + `[ApiController]`                         |
| DI           | `AddSingleton/Scoped/Transient` + primary constructors |
| ORM          | EF Core + `IEntityTypeConfiguration` + migrations      |
| Config       | `IOptions<T>` + `appsettings.json`                     |
| Auth         | `UseAuthentication` + `UseAuthorization` middleware    |
| Testing      | `WebApplicationFactory` + `xUnit`                      |
| Cancellation | `CancellationToken` in every async method              |
