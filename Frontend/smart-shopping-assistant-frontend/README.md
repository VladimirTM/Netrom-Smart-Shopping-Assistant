# Smart Shopping Assistant — Frontend

React 18 + TypeScript + Vite frontend for the Smart Shopping Assistant platform.

## Stack

| Tool | Version |
|------|---------|
| React | 18 |
| TypeScript | 5.x |
| Vite | 6.x |
| Material UI | 6.x |
| React Router | 6.x |
| Axios | latest |

## Getting Started

```bash
npm install
npm run dev      # starts dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## Project Structure

```
src/
├── api/
│   ├── base/http.ts          # Axios instance + JWT interceptor
│   ├── clients/              # Typed API clients (one per resource)
│   └── models/               # Raw backend response shapes
│
├── components/               # All pages and UI components
│   ├── Home/
│   ├── Shop/                 # Product listing + filters + AI search
│   ├── ProductDetail/        # Single product page with related products
│   ├── Wishlist/             # Wishlisted products (localStorage)
│   ├── Login/ Register/      # Auth pages
│   ├── CartDrawer/           # Slide-in cart + AI cart analysis
│   ├── Checkout/             # 3-step stepper checkout
│   ├── Orders/               # User order history
│   ├── ManageOrders/         # Admin order management
│   ├── Profile/              # Edit display name + change password
│   ├── Categories/ Products/ Promotions/ Banners/  # Admin CRUD pages
│   ├── Analytics/            # Admin dashboard
│   └── ActivityLog/          # Admin activity feed
│
├── context/
│   ├── AuthContext/          # JWT auth — login, logout, session restore
│   ├── CartContent/          # Cart state + API operations
│   ├── WishlistContext/      # localStorage wishlist per user
│   ├── ThemeContext/         # Light/dark mode toggle
│   └── ToastContext/         # Global snackbar notifications
│
└── utils/
    └── currency.ts           # RON formatter
```

## Environment

The API base URL is configured in `src/api/base/http.ts`. By default it points to `http://localhost:<backend-port>`. For a production build, update the base URL or set it via an environment variable.

## Architecture

See [FRONTEND_ARCHITECTURE.md](../../FRONTEND_ARCHITECTURE.md) in the repository root for a full deep-dive into every component, context, routing, API client, and data flow.
