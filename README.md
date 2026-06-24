# Smart Shopping Assistant

A full-stack e-commerce platform with AI-powered cart analysis and semantic product search.

Built as part of the **Liga AC** program at Netrom.

---

## Features

### Customer
- Browse and filter products by category, price, promotions, and stock availability
- Semantic AI product search powered by OpenAI
- Add products to a persistent, user-scoped cart; "Add to Cart" is disabled once the in-cart quantity reaches available stock
- Adjust cart item quantities via direct numeric input or ±1 buttons, clamped to [1, stockQuantity]
- AI cart analysis: detects active promotions and near-miss deals, suggests products to unlock savings
- Wishlist (server-persisted per user, survives across devices and browser sessions)
- Checkout with shipping details and order placement
- Order history with full order breakdown
- Profile management: display name + password change
- Dark / light mode toggle

### Admin
- Full CRUD for Products, Categories, Promotions, and Banners
- Manage orders across all users and update order status (cancellation restores product stock)
- Analytics dashboard: revenue, order counts, top products, promotion usage
- Real-time activity log feed (embedded widget in admin home + dedicated paginated page at `/activity-log`)

### Security
- JWT authentication (HS256, 7-day expiry); key length enforced ≥ 32 chars on startup
- BCrypt password hashing; password change rotates `SecurityStamp` to invalidate all existing tokens
- Role-based authorization (`user` / `admin`)
- Rate limiting on auth endpoints (10 req/min per IP)
- Security headers on every response (X-Content-Type-Options, X-Frame-Options, Referrer-Policy; HSTS + CSP in production)
- Server-side stock validation on cart mutations (prevents over-ordering)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, React Router v6, Material UI v6, Axios |
| Backend | ASP.NET Core 10, Entity Framework Core, PostgreSQL |
| AI | OpenAI (gpt-4o-mini) via Microsoft.Extensions.AI + Microsoft.Agents.AI |
| Auth | JWT Bearer (JwtBearer middleware), BCrypt.Net |

---

## Project Structure

```
Smart-Shopping-Assistant/
├── Backend/
│   ├── SmartShoppingAssistantLigaAc.Api/           # HTTP layer, DI, Program.cs
│   ├── SmartShoppingAssistantLigaAc.BusinessLogic/ # Services, DTOs, AI agents
│   └── SmartShoppingAssistantLigaAc.DataAccess/    # EF Core, entities, repositories
│
└── Frontend/
    └── smart-shopping-assistant-frontend/
        └── src/
            ├── api/           # Axios HTTP client + typed API clients
            ├── components/    # All pages and UI components
            ├── context/       # Auth, Cart, Wishlist, Theme, Toast contexts
            └── utils/         # Currency formatter
```

---

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) and npm
- [PostgreSQL 15+](https://www.postgresql.org/)
- An [OpenAI API key](https://platform.openai.com/api-keys)

---

### Backend Setup

1. **Create the database**

   Create a PostgreSQL database named `SmartShoppingAssistant` (or adjust the connection string).

2. **Configure secrets**

   Copy the example config and fill in your values:

   ```bash
   cd Backend/SmartShoppingAssistantLigaAc.Api
   cp appsettings.Example.json appsettings.json
   ```

   Then edit `appsettings.json`:

   ```json
   {
     "ConnectionStrings": {
       "SmartShoppingAssistantContext": "User ID=<user>;Password=<password>;Host=localhost;Port=5432;Database=SmartShoppingAssistant;"
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
     }
   }
   ```

   Alternatively use .NET User Secrets to avoid storing secrets in files:

   ```bash
   dotnet user-secrets set "Jwt:Key" "<your-key>"
   dotnet user-secrets set "OpenAI:ApiKey" "<your-key>"
   dotnet user-secrets set "ConnectionStrings:SmartShoppingAssistantContext" "<your-connection-string>"
   ```

3. **Run the backend**

   ```bash
   cd Backend/SmartShoppingAssistantLigaAc.Api
   dotnet run
   ```

   On first startup, EF Core migrations are applied automatically and the database is seeded with sample categories, products, promotions, and banners.

4. **Default admin account** (created by seeder)

   | Field | Value |
   |-------|-------|
   | Email | `admin@shop.com` |
   | Password | `Admin123!` |

   Change these credentials before deploying to any non-development environment.

5. **API docs**

   Swagger UI is available at `http://localhost:<port>/swagger` in development.

---

### Frontend Setup

```bash
cd Frontend/smart-shopping-assistant-frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` and points to the backend at `http://localhost:<port>` (configured in the API clients).

---

## Documentation

| File | Contents |
|------|----------|
| [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md) | Layers, entities, repositories, services, all API endpoints, auth, AI agents, middleware pipeline |
| [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md) | Component tree, context layer, routing, all pages, API clients, data flow |
| [AUTH_SYSTEM.md](AUTH_SYSTEM.md) | JWT auth deep-dive: token generation, middleware, loading state, global 401 handler |

---

## API Overview

| Resource | Public endpoints | Protected (user) | Admin only |
|----------|-----------------|------------------|------------|
| Auth | POST `/api/auth/register`, POST `/api/auth/login` | GET/PUT `/api/auth/me`, PUT `/api/auth/me/password` | — |
| Products | GET `/api/products` (`?categoryId=` / `?name=`), GET `/api/products/{id}`, GET `/api/products/{id}/related`, POST `/api/products/batch` | — | POST/PUT/DELETE `/api/products` |
| Categories | GET `/api/categories` | — | POST/PUT/DELETE `/api/categories` |
| Promotions | GET `/api/promotions` | — | POST/PUT/DELETE `/api/promotions` |
| Banners | GET `/api/banners` | — | POST/PUT/DELETE `/api/banners` |
| Cart | — | GET/POST/PUT/DELETE `/api/cart`, POST `/api/cart/analyze` | — |
| Wishlist | — | GET/POST/DELETE `/api/wishlist/{productId}` | — |
| Orders | — | POST/GET `/api/orders` | GET/PUT `/api/admin/orders` |
| Analytics | — | — | GET `/api/analytics/summary` |
| Activity Log | — | — | GET `/api/admin/activity-log?limit=&offset=` |
| AI Search | POST `/api/ai/search` | — | — |

---

## Environment Notes

- The backend applies EF Core migrations and seeds data on every startup — safe to run multiple times (idempotent seeders).
- CORS in development allows any origin. In production, set `Cors:AllowedOrigins` in config.
- The wishlist is server-persisted in the `WishlistItems` table — items survive across devices and browser sessions.
