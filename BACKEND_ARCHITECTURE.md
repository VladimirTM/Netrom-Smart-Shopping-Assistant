# Backend Architecture — Smart Shopping Assistant

**Stack:** ASP.NET Core 10 · Entity Framework Core · PostgreSQL · OpenAI (gpt-4o-mini) · JWT (HS256) · BCrypt  
**Location:** `Backend/`

---

## Table of Contents

1. [Solution Structure](#1-solution-structure)
2. [Project Layers](#2-project-layers)
3. [Data Model & Entities](#3-data-model--entities)
4. [Repository Pattern](#4-repository-pattern)
5. [Service Layer](#5-service-layer)
6. [API Controllers & Endpoints](#6-api-controllers--endpoints)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [AI Integration](#8-ai-integration)
9. [Middleware Pipeline](#9-middleware-pipeline)
10. [Database Seeding](#10-database-seeding)
11. [Configuration Reference](#11-configuration-reference)

---

## 1. Solution Structure

```
Backend/
├── SmartShoppingAssistantLigaAc.Api/           # HTTP layer (controllers, Program.cs, DI wiring)
├── SmartShoppingAssistantLigaAc.BusinessLogic/ # Services, DTOs, AI agents, tools, models
└── SmartShoppingAssistantLigaAc.DataAccess/    # EF Core DbContext, entities, repositories, seeders
```

The three projects form a classic layered architecture. `Api` references both `BusinessLogic` and `DataAccess`. `BusinessLogic` references `DataAccess`. `DataAccess` has no internal references.

---

## 2. Project Layers

### 2.1 DataAccess

Contains all database concerns: EF Core entity classes, the `DbContext`, repository interfaces and implementations, EF migrations, and seeders.

**Key files:**

| Path | Role |
|------|------|
| `SmartShoppingAssistantDbContext.cs` | EF Core DbContext — all `DbSet<T>` registrations and Fluent API configuration calls |
| `SmartShoppingAssistantDbContextFactory.cs` | IDesignTimeDbContextFactory used by the `dotnet ef` CLI for migration generation |
| `Entities/` | One class per domain object |
| `Configurations/` | Fluent API config extracted from DbContext per entity |
| `Repositories/` | BaseRepository + specialised repositories |
| `Seeders/` | Category, Product, Promotion, Banner, and User seeders run on startup |
| `Migrations/` | EF-generated migration history |

### 2.2 BusinessLogic

Contains all application logic. Has no dependency on ASP.NET Core — only on `DataAccess`, `Microsoft.Extensions.Configuration`, and `Microsoft.Extensions.AI`.

**Key directories:**

| Path | Role |
|------|------|
| `Services/` | One service class per domain area; all implement an interface in `Services/Interfaces/` |
| `DTOs/` | Request and response shapes passed across layer boundaries |
| `Agents/` | AI agent classes built on `Microsoft.Agents.AI.ChatClientAgent` |
| `Tools/` | Static tool methods called by AI agents via `AIFunctionFactory.Create` |
| `Models/` | Structured response models for AI agent output (`PromotionAnalysis`, `AnalysisResponse`) |

### 2.3 Api

The entry point. Configures DI, middleware, authentication, and maps controllers.

**Key files:**

| Path | Role |
|------|------|
| `Program.cs` | DI registration, middleware pipeline, startup migrations and seeding |
| `Controllers/` | One controller per resource |
| `appsettings.Example.json` | Config template — copy to `appsettings.json` and fill in secrets |
| `Properties/launchSettings.json` | Local dev launch profiles |

---

## 3. Data Model & Entities

### Entity Overview

```
User ──< CartItem >── Product ──< Category
                         │
                         └──< Promotion ──── Category
                                  │
                                  └──── Product
Banner ──── Promotion

Order ──< OrderItem (snapshot of Product at purchase time)
User ──< Order

ActivityLog (append-only audit trail)
```

### Entities

#### User
```csharp
public class User
{
    public int Id { get; set; }
    public string Email { get; set; }          // stored lowercase, unique
    public string PasswordHash { get; set; }   // BCrypt hash
    public string Role { get; set; }           // "user" | "admin"
    public string? DisplayName { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<CartItem> CartItems { get; set; }
    public ICollection<Order> Orders { get; set; }
    public ICollection<WishlistItem> WishlistItems { get; set; }
}
```

#### Product
```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }

    public ICollection<Category> Categories { get; set; }
    public ICollection<Promotion> Promotions { get; set; }
}
```

#### Category
```csharp
public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }

    public ICollection<Product> Products { get; set; }
    public ICollection<Promotion> Promotions { get; set; }
}
```
Product ↔ Category is a many-to-many join table managed by EF Core.

#### CartItem
```csharp
public class CartItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public int UserId { get; set; }

    public Product Product { get; set; }
    public User User { get; set; }
}
```
Cart is modelled as a flat list of `CartItem` rows scoped to a `UserId` (non-nullable — every cart item must belong to a user). There is no `Cart` aggregate entity — the service layer aggregates items into a `CartGetDTO` with totals and applied promotions on each read.

#### Order / OrderItem
```csharp
public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<OrderItem> Items { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; }           // Pending | Confirmed | Shipped | Delivered | Cancelled
    public DateTime PlacedAt { get; set; }
    public string ShippingName { get; set; }
    public string ShippingAddress { get; set; }
    public string ShippingCity { get; set; }
    public string ShippingPostalCode { get; set; }
    public string ShippingPhone { get; set; }
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; }      // snapshot at purchase time
    public decimal Price { get; set; }           // snapshot at purchase time
    public int Quantity { get; set; }
    public decimal Subtotal { get; set; }
}
```
`OrderItem` intentionally denormalises `ProductName` and `Price` — if the product changes after the order is placed the historical order still shows the original values.

#### Promotion
```csharp
public class Promotion
{
    public int Id { get; set; }
    public string Name { get; set; }
    public PromotionType Type { get; set; }      // Quantity | CartTotal
    public decimal Threshold { get; set; }
    public PromotionReward Reward { get; set; }  // FreeItems | PercentDiscount
    public int RewardValue { get; set; }
    public int? ProductId { get; set; }          // null = category-wide or cart-wide
    public int? CategoryId { get; set; }         // null = product-specific or cart-wide
    public bool IsActive { get; set; }

    public Product? Product { get; set; }
    public Category? Category { get; set; }
}
```

**Promotion enums:**

| Enum | Values |
|------|--------|
| `PromotionType` | `Quantity` (0) — triggers when N items are in the cart; `CartTotal` (1) — triggers when cart value exceeds threshold |
| `PromotionReward` | `FreeItems` (0) — N free items added; `PercentDiscount` (1) — N% off the applicable items |

#### Banner
```csharp
public class Banner
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string? Subtitle { get; set; }
    public string? ImageUrl { get; set; }
    public string? LinkTo { get; set; }
    public int? PromotionId { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }

    public Promotion? Promotion { get; set; }
}
```

#### ActivityLog
```csharp
public class ActivityLog
{
    public int Id { get; set; }
    public string Action { get; set; }       // e.g. "ProductCreated", "BannerDeleted"
    public string EntityType { get; set; }   // e.g. "Product", "Banner"
    public int EntityId { get; set; }
    public string EntityName { get; set; }
    public int? ActorId { get; set; }        // null for system actions
    public string? ActorEmail { get; set; }
    public DateTime OccurredAt { get; set; }
}
```
Append-only. Written by controllers (Product, Category, Promotion, Banner) after successful mutations. Read by `GET /api/admin/activity-log`.

#### WishlistItem
```csharp
public class WishlistItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int UserId { get; set; }

    public Product Product { get; set; }
    public User User { get; set; }
}
```
Configured with a **unique index on `(UserId, ProductId)`** — prevents duplicate entries without application-level locking. Cascade deletes on both FK sides: deleting a user or a product removes their associated wishlist rows. The service's `AddAsync` is idempotent — it checks for an existing row before inserting.

---

## 4. Repository Pattern

### IRepository\<T\> (generic)

```csharp
public interface IRepository<TEntity>
{
    IQueryable<TEntity> GetAllAsQueryable();
    Task<TEntity> GetByIdAsync(int id);
    Task<List<TEntity>> GetAllAsync();
    Task<TEntity> AddAsync(TEntity entity);
    Task<TEntity> UpdateAsync(TEntity entity);
    Task DeleteAsync(int id);
    Task DeleteAllAsync();
}
```

`BaseRepository<TEntity>` is the default implementation. It uses `context.Set<TEntity>()` to avoid a `DbSet` property per entity — the same implementation works for any entity type registered in the context.

### Specialised Repositories

Extend `BaseRepository<T>` with domain-specific queries:

| Repository | Extra methods |
|-----------|---------------|
| `IProductRepository` / `ProductRepository` | `GetAllWithDetailsAsync(categoryId?)`, `GetWithDetailsAsync(id)`, `GetRelatedAsync(id)` |
| `ICartItemRepository` / `CartItemRepository` | `GetAllByUserIdAsync(userId)`, `GetByProductAndUserAsync(productId, userId)`, `GetByIdForUserAsync(id, userId)` |
| `IOrderRepository` / `OrderRepository` | `GetByUserIdAsync(userId)`, `GetByIdWithItemsAsync(id)`, `GetAllWithUserAsync()` |
| `IPromotionRepository` / `PromotionRepository` | `GetAllActiveAsync()`, `GetByProductIdAsync(productId)`, `GetByCategoryIdAsync(categoryId)` |
| `IUserRepository` / `UserRepository` | `FindByEmailAsync(email)` |
| `IActivityLogRepository` / `ActivityLogRepository` | `GetLatestAsync(limit)` |
| `IWishlistRepository` / `WishlistRepository` | `GetAllForUserAsync(userId)`, `FindByUserAndProductAsync(userId, productId)` |

### DI Registration (Program.cs)

```csharp
// Generic base
builder.Services.AddScoped<IRepository<Category>, BaseRepository<Category>>();

// Specialised (registered under their own interface)
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICartItemRepository, CartItemRepository>();
```

When a service needs both generic and specialised operations, it receives the specialised interface. When only basic CRUD is needed, it receives `IRepository<T>`.

---

## 5. Service Layer

Each service is registered as `Scoped` (one instance per HTTP request).

| Service Interface | Implementation | Responsibilities |
|---|---|---|
| `IAuthService` | `AuthService` | Register (BCrypt hash), Login (BCrypt verify + JWT), GetCurrentUser, UpdateProfile, ChangePassword |
| `IProductService` | `ProductService` | CRUD + category assignment + related products + stock management |
| `ICategoryService` | `CategoryService` | CRUD categories |
| `IPromotionService` | `PromotionService` | CRUD promotions + `GetApplicablePromotionsAsync(cartItems)` |
| `ICartItemService` | `CartItemService` | Add/update/remove cart items; `GetAllAsync` builds `CartGetDTO` with applied promotions; `AnalyzeCartAsync` orchestrates AI agents |
| `IOrderService` | `OrderService` | `PlaceOrderAsync` (clears cart, creates order + items, decrements stock); `GetOrdersAsync`; `GetAllOrdersAsync`; `UpdateOrderStatusAsync` |
| `IBannerService` | `BannerService` | CRUD banners |
| `IAnalyticsService` | `AnalyticsService` | Aggregated summary: total revenue, total orders, top products, promotion usage |
| `IActivityLogService` | `ActivityLogService` | `LogAsync(action, entityType, entityId, entityName, actorId, actorEmail)` |
| `IWishlistService` | `WishlistService` | `GetAsync` (list product IDs), `AddAsync` (idempotent add), `RemoveAsync` |
| `IAiSearchService` | `AiSearchService` | Semantic product search using OpenAI embeddings/completions |

### Cart Analysis Flow (`AnalyzeCartAsync`)

```
CartItemService.AnalyzeCartAsync(userId)
    │
    ├─ Load cart items (with product + categories)
    ├─ Serialize cart to JSON
    │
    ├─ PromotionCheckerAgent.Build(cartJson)
    │      └─ ChatClientAgent runs with tool: GetPromotionsForProduct(productId)
    │         Returns: PromotionAnalysis { activeDeals[], nearMissDeals[] }
    │
    ├─ SuggestionComposerAgent.Build(cartJson, categoriesJson)
    │      Receives PromotionAnalysis from previous agent
    │      └─ ChatClientAgent runs with tool: SearchProductsByCategory(categoryId)
    │         Returns: AnalysisResponse { suggestions[], summary }
    │
    └─ Return AnalysisResponse to controller → 200 OK
```

The two agents are called sequentially. The `PromotionCheckerAgent` uses structured output (`ResponseFormat = ChatResponseFormat.ForJsonSchema<PromotionAnalysis>()`) to guarantee a parseable response. The output is passed to `SuggestionComposerAgent` as part of its conversation context.

---

## 6. API Controllers & Endpoints

All routes are prefixed with `/api`.

### Auth — `AuthController`
`[Route("api/auth")]`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | Public (rate limited) | Register a new user; returns `AuthResponse { token, role, email, userId }` |
| POST | `/auth/login` | Public (rate limited) | Login; returns `AuthResponse` |
| GET | `/auth/me` | `[Authorize]` | Returns current user profile |
| PUT | `/auth/me` | `[Authorize]` | Update display name |
| PUT | `/auth/me/password` | `[Authorize]` | Change password (requires current password) |

Rate limiting: 10 requests / 60s per IP on `/register` and `/login` via the `"auth"` fixed-window limiter.

### Products — `ProductController`
`[Route("api/products")]`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/products` | Public | List all products; optional `?categoryId=` filter |
| GET | `/products/{id}` | Public | Get single product with categories, promotions, stock |
| GET | `/products/{id}/related` | Public | Get related products (same category) |
| POST | `/products` | Admin | Create product; logs `ProductCreated` |
| PUT | `/products/{id}` | Admin | Update product; logs `ProductUpdated` |
| DELETE | `/products/{id}` | Admin | Delete product; logs `ProductDeleted` |

### Categories — `CategoryController`
`[Route("api/categories")]`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/categories` | Public | List all categories |
| POST | `/categories` | Admin | Create category; logs `CategoryCreated` |
| PUT | `/categories/{id}` | Admin | Update category; logs `CategoryUpdated` |
| DELETE | `/categories/{id}` | Admin | Delete category; logs `CategoryDeleted` |

### Promotions — `PromotionController`
`[Route("api/promotions")]`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/promotions` | Public | List all promotions |
| POST | `/promotions` | Admin | Create promotion; logs `PromotionCreated` |
| PUT | `/promotions/{id}` | Admin | Update promotion; logs `PromotionUpdated` |
| DELETE | `/promotions/{id}` | Admin | Delete promotion; logs `PromotionDeleted` |

### Banners — `BannerController`
`[Route("api/banners")]`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/banners` | Public | List banners; `?activeOnly=true` filters inactive |
| GET | `/banners/{id}` | Public | Get single banner |
| POST | `/banners` | Admin | Create banner; logs `BannerCreated` |
| PUT | `/banners/{id}` | Admin | Update banner; logs `BannerUpdated` |
| DELETE | `/banners/{id}` | Admin | Delete banner; logs `BannerDeleted` |

### Cart — `CartItemController`
`[Route("api/cart")]` — entire controller requires `[Authorize]`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/cart` | Get full cart with items, applied promotions, and total |
| GET | `/cart/items/{id}` | Get single cart item (403 if not owned by caller) |
| POST | `/cart/items` | Add item to cart; body: `{ productId, quantity }` |
| PUT | `/cart/items/{id}` | Update item quantity (403 if not owned) |
| DELETE | `/cart/items/{id}` | Remove single item (403 if not owned) |
| DELETE | `/cart` | Clear entire cart |
| POST | `/cart/analyze` | Trigger AI cart analysis; returns `AnalysisResponse` |

All cart mutations return the updated `CartGetDTO` so the frontend stays in sync without a second fetch.

### Orders — `OrderController`
`[Route("api/orders")]` — requires `[Authorize]`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/orders` | Place order from current cart; body: `PlaceOrderRequest` (shipping details) |
| GET | `/orders` | Get caller's order history |

### Admin Orders — `AdminOrderController`
`[Route("api/admin/orders")]` — requires `[Authorize(Roles = "admin")]`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/orders` | Get all orders across all users |
| PUT | `/admin/orders/{id}/status` | Update order status; body: `{ status }` |

Valid statuses: `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`.

### Analytics — `AnalyticsController`
`[Route("api/analytics")]` — requires Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | `/analytics/summary` | Returns `AnalyticsSummaryDTO` with totals, top products, promotion usage |

### Activity Log — `ActivityLogController`
`[Route("api/admin/activity-log")]` — requires Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/activity-log` | Get latest N entries; `?limit=50` (default 50) |

### Wishlist — `WishlistController`
`[Route("api/wishlist")]` — entire controller requires `[Authorize]`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/wishlist` | Get the caller's wishlist as `WishlistGetDTO { productIds: int[] }` |
| POST | `/wishlist/{productId}` | Add product to wishlist; returns updated wishlist (idempotent) |
| DELETE | `/wishlist/{productId}` | Remove product from wishlist; returns updated wishlist |

All three endpoints resolve the caller's `UserId` from the JWT `NameIdentifier` claim and pass it to the service. Every response is the full updated `WishlistGetDTO` — the frontend never needs to re-fetch after a mutation.

### AI Search — `AiController`
`[Route("api/ai")]`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/ai/search` | Public | Semantic product search; body: `{ query }` |

---

## 7. Authentication & Authorization

### JWT Token

Generated by `AuthService.GenerateToken(user)` using `HmacSha256`. Token carries three claims:

| Claim | Value |
|-------|-------|
| `ClaimTypes.NameIdentifier` | `user.Id` (int, as string) |
| `ClaimTypes.Email` | `user.Email` |
| `ClaimTypes.Role` | `user.Role` ("user" \| "admin") |

Expiry is configurable via `Jwt:ExpiresInDays` (default 7 days).

### Validation

```csharp
TokenValidationParameters
{
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = config["Jwt:Issuer"],
    ValidAudience = config["Jwt:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]))
}
```

### Authorization Attributes

| Attribute | Used on | Effect |
|-----------|---------|--------|
| `[Authorize]` | Cart, Order controllers | Any authenticated user |
| `[Authorize(Roles = "admin")]` | Admin endpoints | Only users with Role = "admin" |
| No attribute | Products GET, Categories GET, etc. | Fully public |

### Password Hashing

`BCrypt.Net.BCrypt.HashPassword(password)` on registration. `BCrypt.Net.BCrypt.Verify(input, hash)` on login and password change. BCrypt automatically incorporates a random salt and work factor — no separate salt column is needed.

### Rate Limiting

A fixed-window limiter named `"auth"` is applied to `/register` and `/login`:

```csharp
options.AddFixedWindowLimiter("auth", o => {
    o.PermitLimit = 10;
    o.Window = TimeSpan.FromMinutes(1);
    o.QueueLimit = 0;
});
```

Exceeding the limit returns HTTP `429 Too Many Requests`.

---

## 8. AI Integration

### OpenAI / Microsoft.Extensions.AI

The backend uses `Microsoft.Extensions.AI` (the .NET AI abstraction layer) backed by the official `OpenAI` NuGet package.

```csharp
builder.Services.AddSingleton<IChatClient>(
    new OpenAIClient(openAiApiKey)
        .GetChatClient(openAiModel)
        .AsIChatClient()
        .AsBuilder()
        .UseFunctionInvocation()   // enables automatic tool call dispatch
        .Build());
```

A single `IChatClient` singleton is registered with `.UseFunctionInvocation()` enabled — the middleware layer automatically dispatches tool calls to the registered functions without manual loop handling in the agent code.

### PromotionCheckerAgent

Built from `Microsoft.Agents.AI.ChatClientAgent`. Receives the serialised cart JSON as a system instruction.

**Tool:** `GetPromotionsForProduct(productId)` — calls `IPromotionService.GetByProductIdAsync` and `GetByCategoryIdAsync`, returning all active promotions that apply to the product or its categories.

**Output:** `PromotionAnalysis` (structured JSON) containing:
- `activeDeals[]` — promotions whose threshold is already met
- `nearMissDeals[]` — promotions within 1 item or 20% cart value of the threshold

### SuggestionComposerAgent

Receives the cart JSON, the serialised categories, and the `PromotionAnalysis` output from `PromotionCheckerAgent` as conversation context.

**Tool:** `SearchProductsByCategory(categoryId)` — calls `IProductService.GetAllAsync(categoryId)`.

**Output:** `AnalysisResponse` (structured JSON) containing:
- `suggestions[]` — up to 5 products with `productId`, `name`, `price`, `imageUrl`, `quantity`, `reason`, `savings`
- `summary` — brief plain-text cart analysis

### AI Semantic Search

`AiSearchService` calls the `IChatClient` to parse the user's free-text query into a structured JSON object and then queries the database. Exposed via `POST /api/ai/search`.

The prompt instructs the model to return:
```json
{
  "categoryIds": [<IDs of categories whose names match words in the query>],
  "keywords":    ["<product-attribute terms only: color, material, genre, brand, model, use-case — excludes words already mapped to a category>"]
}
```

`categoryIds` and `keywords` are resolved separately: the service first calls `GetAllAsync(categoryId)` for each matched category, then applies keyword filtering on the results. Keeping category-word → category ID mapping separate from attribute keyword extraction prevents the same word from appearing in both lists, which would double-filter and eliminate results.

---

## 9. Middleware Pipeline

The middleware pipeline in `Program.cs` is order-sensitive:

```
Migrations + Seeding (startup, not middleware)
    ↓
MapOpenApi (dev only — serves /openapi/v1.json)
SwaggerUI (dev only — serves /swagger)
    ↓
UseCors("FrontendPolicy")
    ↓
UseHttpsRedirection
    ↓
UseRateLimiter
    ↓
UseAuthentication    ← must come before UseAuthorization
    ↓
UseAuthorization
    ↓
MapControllers
```

**CORS Policy (`"FrontendPolicy"`):**
- Development: `AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()`
- Production: origins restricted to `Cors:AllowedOrigins` config section (defaults to `["http://localhost:5173"]`)

**Startup tasks (before `app.Run()`):**
1. `db.Database.MigrateAsync()` — applies pending EF migrations on every startup
2. `seeder.SeedAsync()` — idempotent seed of categories, products, promotions, banners, and the default admin user

---

## 10. Database Seeding

`DatabaseSeeder` orchestrates the individual seeders in order:

```
CategorySeeder → ProductSeeder → PromotionSeeder → BannerSeeder → UserSeeder
```

Each seeder checks whether data already exists before inserting. Running seeders multiple times is safe (idempotent).

**Default admin credentials (UserSeeder):**

| Field | Value |
|-------|-------|
| Email | `admin@shop.com` |
| Password | `Admin123!` |
| Role | `admin` |

Change these credentials before deploying to a non-development environment.

---

## 11. Configuration Reference

Copy `appsettings.Example.json` to `appsettings.json` and fill in secrets. Never commit `appsettings.json`.

```json
{
  "ConnectionStrings": {
    "SmartShoppingAssistantContext": "User ID=...;Password=...;Host=localhost;Port=5432;Database=SmartShoppingAssistant;Pooling=true;"
  },
  "OpenAI": {
    "ApiKey": "<your-openai-api-key>",
    "ModelId": "gpt-4o-mini"
  },
  "Jwt": {
    "Key": "<at-least-32-character-random-secret>",
    "Issuer": "SmartShoppingAssistant",
    "Audience": "SmartShoppingAssistant",
    "ExpiresInDays": 7
  },
  "Cors": {
    "AllowedOrigins": ["https://your-frontend-domain.com"]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

For local development, use [.NET User Secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) to avoid storing secrets in files:

```bash
cd Backend/SmartShoppingAssistantLigaAc.Api
dotnet user-secrets set "Jwt:Key" "<your-key>"
dotnet user-secrets set "OpenAI:ApiKey" "<your-openai-key>"
```

The `UserSecretsId` is already configured in `SmartShoppingAssistantLigaAc.Api.csproj`.
