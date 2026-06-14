# Frontend Architecture — Smart Shopping Assistant

**Stack:** React 18, TypeScript, Vite, React Router v6, Material UI (MUI) v6, Axios  
**Location:** `Frontend/smart-shopping-assistant-frontend/`

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Bootstrap & Entry Point](#2-bootstrap--entry-point)
3. [Global Theme](#3-global-theme)
4. [Context Layer](#4-context-layer)
   - 4.1 [Auth Context](#41-auth-context)
   - 4.2 [Cart Context](#42-cart-context)
   - 4.3 [Wishlist Context](#43-wishlist-context)
   - 4.4 [Theme Context](#44-theme-context)
   - 4.5 [Role Context (Legacy)](#45-role-context-legacy)
   - 4.6 [Toast Context](#46-toast-context)
5. [Application Shell & Routing](#5-application-shell--routing)
6. [NavBar](#6-navbar)
7. [Home Page](#7-home-page)
8. [Shop Page](#8-shop-page)
9. [Product Detail Page](#9-product-detail-page)
10. [Wishlist Page](#10-wishlist-page)
11. [Login & Register Pages](#11-login--register-pages)
12. [Cart Drawer](#12-cart-drawer)
13. [Checkout Page](#13-checkout-page)
14. [Orders Page](#14-orders-page)
15. [Manage Orders Page (Admin)](#15-manage-orders-page-admin)
16. [Profile Page](#16-profile-page)
17. [HTTP Layer](#17-http-layer)
18. [API Models vs Frontend Types](#18-api-models-vs-frontend-types)
    - 15.1 [Cart](#151-cart)
    - 15.2 [Product](#152-product)
    - 15.3 [Category](#153-category)
    - 15.4 [Promotion](#154-promotion)
    - 15.5 [Banner](#155-banner)
    - 15.6 [Analytics](#156-analytics)
    - 15.7 [Activity Log](#157-activity-log)
    - 15.8 [Order](#158-order)
19. [API Clients](#19-api-clients)
20. [Admin Pages — Shared CRUD Pattern](#20-admin-pages--shared-crud-pattern)
    - 20.1 [Categories](#201-categories)
    - 20.2 [Products](#202-products)
    - 20.3 [Promotions](#203-promotions)
    - 20.4 [Banners](#204-banners)
    - 20.5 [Analytics Dashboard](#205-analytics-dashboard)
    - 20.6 [Activity Log Component](#206-activity-log-component)
21. [Shared / Common Components](#21-shared--common-components)
22. [End-to-End Data Flow](#22-end-to-end-data-flow)
23. [Key Design Decisions](#23-key-design-decisions)

---

## 1. Project Structure

```
src/
├── main.tsx                          # React entry point
├── App.tsx                           # Root component, routing, context wiring
├── theme.ts                          # createAppTheme(mode) — light + dark MUI theme
├── index.css / App.css               # Global baseline styles
│
├── api/
│   ├── base/
│   │   └── http.ts                   # Axios instance + request interceptor (JWT) + typed HTTP helpers
│   ├── clients/
│   │   ├── ActivityLogApiClient.ts   # getLatest(limit)
│   │   ├── AiApiClient.ts            # semanticSearch(query) → Product[]
│   │   ├── AnalyticsApiClient.ts     # getSummary()
│   │   ├── AuthApiClient.ts          # login(), register(), me()
│   │   ├── BannerApiClient.ts        # getAll(activeOnly), create, update, remove
│   │   ├── CartApiClient.ts
│   │   ├── CategoryApiClient.ts
│   │   ├── OrderApiClient.ts         # ordersApi: place(shippingAddress), getAll() | adminOrdersApi: getAll(), updateStatus()
│   │   ├── ProductApiClient.ts
│   │   ├── PromotionApiClient.ts
│   │   └── UserApiClient.ts          # getProfile(), updateProfile(), changePassword()
│   └── models/
│       ├── ActivityLogModel.ts       # Raw backend JSON for activity log entries
│       ├── AnalysisModel.ts          # AI cart analysis response shape
│       ├── AnalyticsSummaryModel.ts  # Analytics summary + TopProduct + PromotionUsage
│       ├── BannerModel.ts            # Raw backend JSON shape for banners
│       ├── CartModel.ts              # Raw backend JSON shapes
│       ├── CategoryModel.ts
│       ├── OrderModel.ts             # OrderItemModel + OrderModel + AdminOrderModel + ShippingAddressInput
│       ├── ProductModel.ts           # Includes stockQuantity
│       └── PromotionModel.ts
│
├── context/
│   ├── AuthContext/
│   │   ├── auth-context.ts           # AuthContextValue + useAuth() hook
│   │   └── AuthProvider.tsx          # JWT session management, localStorage persistence
│   ├── CartContent/
│   │   ├── cart-context.ts           # Context object + useCart hook
│   │   └── CartProvider.tsx          # Auth-aware cart state + API orchestration
│   ├── RoleContext/                  # Legacy dev-only role toggle (not used for real auth)
│   │   ├── role-context.ts
│   │   └── RoleProvider.tsx
│   ├── ThemeContext/
│   │   ├── theme-context.ts          # ThemeContextValue + useThemeMode() hook
│   │   └── AppThemeProvider.tsx      # Dark/light mode toggle, localStorage persistence
│   └── WishlistContext/
│       ├── wishlist-context.ts       # WishlistContextValue + useWishlist() hook
│       └── WishlistProvider.tsx      # API-backed wishlist per authenticated user
│
├── utils/
│   └── currency.ts                   # fmt() — Intl.NumberFormat RON formatter
│
└── components/
    ├── common/
    │   ├── ConfirmDialog/index.tsx   # Generic delete confirmation dialog
    │   └── PageHeader/index.tsx      # Title + "Add" button row
    ├── shared/
    │   └── types/
    │       ├── Analysis.ts           # Frontend AI analysis types + mapper
    │       ├── Banner.ts             # Frontend Banner type + toBanner() mapper
    │       ├── Cart.ts               # Frontend Cart types + mapper functions
    │       ├── Category.ts
    │       ├── Product.ts            # Includes stockQuantity
    │       └── Promotion.ts
    ├── ActivityLog/index.tsx         # Activity log feed card (auto-refreshes every 60s)
    ├── Analytics/index.tsx           # /analytics — stat cards + top products + promotions tables
    ├── Banners/
    │   ├── index.tsx                 # /banners — CRUD table
    │   └── BannerFormDialog/index.tsx
    ├── CartDrawer/
    │   ├── index.tsx                 # "Proceed to Checkout" → navigate("/checkout")
    │   └── AnalyzeDialog/index.tsx   # AI cart analysis dialog
    ├── Categories/
    │   ├── index.tsx
    │   └── CategoryFormDialog/index.tsx
    ├── Checkout/index.tsx            # /checkout — 3-step MUI Stepper (Review → Shipping → Confirm)
    ├── Home/index.tsx
    ├── Login/index.tsx               # /login page
    ├── ManageOrders/index.tsx        # /manage-orders — admin order management (status updates)
    ├── NavBar/index.tsx              # Avatar dropdown: Profile + Order History links
    ├── NotFound/index.tsx
    ├── Orders/index.tsx              # /orders — accordion list of past orders
    ├── ProductDetail/index.tsx       # /shop/:productId
    ├── Products/
    │   ├── index.tsx
    │   └── ProductFormDialog/index.tsx
    ├── Profile/index.tsx             # /profile — display name edit + password change
    ├── Promotions/
    │   ├── index.tsx
    │   └── PromotionFormDialog/index.tsx
    ├── Register/index.tsx            # /register page
    ├── Shop/index.tsx                # AI mode toggle + debounced semantic search
    └── Wishlist/index.tsx            # /wishlist page
```

---

## 2. Bootstrap & Entry Point

**File:** `src/main.tsx`

```tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppThemeProvider>
  </StrictMode>,
);
```

This is the single mount point of the entire React application. Every wrapper applied here is global — it affects every component in the tree.

### Wrapper breakdown (outer to inner)

| Wrapper | Purpose |
|---|---|
| `StrictMode` | Development-only double-render to detect side effects; no effect in production |
| `AppThemeProvider` | Combines `ThemeContext` + MUI `ThemeProvider` + `CssBaseline`. Reads the `"themeMode"` key from `localStorage` on mount to restore the user's light/dark preference. Exposes `useThemeMode()` to toggle the mode from any component. |
| `BrowserRouter` | Provides React Router's history context using the HTML5 History API; enables `<Link>`, `<NavLink>`, `<Navigate>`, `useNavigate`, and `useLocation` for all descendants |

`StrictMode` causes every component to render, unmount, and remount in development. This is intentional: it surfaces bugs where cleanup functions are missing in `useEffect`.

`document.getElementById("root")!` — the `!` non-null assertion tells TypeScript the element exists. If it doesn't exist at runtime, `createRoot` will throw. The element is defined in `index.html`.

`AppThemeProvider` replaces the previous static `ThemeProvider theme={theme}` wrapper. The theme is now dynamic — `createAppTheme(mode)` is called with the current `"light"` or `"dark"` mode and the result is passed to MUI's `ThemeProvider` inside `AppThemeProvider`. `CssBaseline` also lives inside it.

---

## 3. Global Theme

**File:** `src/theme.ts`

The theme is a **function** rather than a static object so that it can produce both light and dark variants:

```ts
export function createAppTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary:    { light: "#D4C200", main: "#B5A000", dark: isDark ? "#D4C200" : "#7A7000", contrastText: "#1a1a00" },
      secondary:  { light: "#E8B840", main: "#C88000", dark: isDark ? "#E8B840" : "#8A5800", contrastText: "#ffffff" },
      success:    { main: isDark ? "#8BC34A" : "#5A7A00", contrastText: isDark ? "#1a1a00" : "#ffffff" },
      background: isDark ? { default: "#141408", paper: "#1e1e0e" } : { default: "#FAFAF2", paper: "#FFFFFF" },
      text:       isDark ? { primary: "#EDE8B0", secondary: "#B8B06A" } : { primary: "#2C2800", secondary: "#6E6800" },
      divider:    isDark ? "#3a3818" : "#D4C890",
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: "system-ui, sans-serif",
      h1: { fontWeight: 700 }, h2: { fontWeight: 700 },
      h3: { fontWeight: 600 }, h5: { fontWeight: 600 },
    },
    components: {
      MuiButton:        { styleOverrides: { root: { textTransform: "none", fontWeight: 600 } } },
      MuiPaper:         { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiCard:          { styleOverrides: { root: isDark ? { border: "1px solid #3a3818" } : {} } },
      MuiChip:          { styleOverrides: { root: isDark ? { borderColor: "#3a3818" } : {} } },
      MuiOutlinedInput: { styleOverrides: { notchedOutline: isDark ? { borderColor: "#3a3818" } : {} } },
    },
  });
}

export default createAppTheme("light");
```

`AppThemeProvider` calls `createAppTheme(mode)` with the current `mode` state, producing a new theme object whenever the user toggles dark mode.

### How the theme propagates

MUI components are styled internally using the `sx` prop and `styled()`. They read palette tokens via CSS variables injected by `ThemeProvider`. When you write `color="primary"` on a `Badge`, `Chip`, or `Button`, MUI resolves it to `#B5A000`. When you write `color: "primary.dark"` in `sx`, MUI resolves it to the mode-appropriate dark token.

### Key design decisions in the theme

**`shape.borderRadius: 8`** — this becomes MUI's baseline border radius unit. A component with `borderRadius: 3` in `sx` gets `3 * 8 = 24px`. All cards, dialogs, buttons, and inputs inherit softly rounded corners automatically.

**`MuiButton.root.textTransform: "none"`** — MUI buttons default to forcing uppercase text. This override removes that globally, so "Add to Cart" stays as written rather than becoming "ADD TO CART".

**`MuiPaper.root.backgroundImage: "none"`** — MUI applies a subtle gradient on elevated Paper components in dark mode. This override disables that to keep cards clean in both modes.

**`palette.success.main`** — overrides MUI's default green. In dark mode it brightens (`#8BC34A`) so the color has sufficient contrast on dark paper. In light mode it stays as the darker `#5A7A00`. Used in the Promotions page and CartDrawer for applied promotion discounts.

**Dark mode card borders** — in dark mode a `1px solid #3a3818` border is added to `MuiCard` and `MuiOutlinedInput` since the dark paper background doesn't produce enough contrast with shadows alone.

---

## 4. Context Layer

The app uses React's built-in Context API (no Redux, no Zustand, no external state library). Four active contexts are defined: auth, cart, wishlist, and theme.

### 4.1 Auth Context

**Files:** `src/context/AuthContext/auth-context.ts` + `AuthProvider.tsx`

```ts
// auth-context.ts
export interface AuthUser {
  userId: number;
  email: string;
  role: "user" | "admin";
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;          // true while GET /auth/me is in-flight on initial mount
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
```

```tsx
// AuthProvider.tsx (simplified)
function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser]   = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY));
  const navigate = useNavigate();
  const logoutRef = useRef<() => void>(() => {});

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  logoutRef.current = logout;

  // Register a global 401 handler so any API call with an expired token auto-logs out
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logoutRef.current();
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  // On mount (or token change), validate the stored token with the backend
  useEffect(() => {
    if (!token) { setUser(null); setLoading(false); return; }
    authApi.me().then(setUser).catch(() => {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null); setUser(null);
    }).finally(() => setLoading(false));
  }, [token]);

  function login(newToken: string, newUser: AuthUser) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Implementation details:**

- `token` is initialised with a lazy `useState` initialiser that reads `localStorage` once on mount. This restores the session across page refreshes without an extra render.
- `loading` starts as `true` only when a token is already in localStorage (there is something to validate). It is set to `false` in `.finally()` after `GET /auth/me` resolves or rejects. If there is no stored token, `loading` starts as `false` immediately — no network call is made.
- Route guards (`ProtectedRoute`, `PublicOnlyRoute`, `AdminRoute`) all read `loading` and return `null` while it is true. This prevents the flash where a still-authenticating user is briefly treated as unauthenticated and redirected to `/login`.
- `isAuthenticated: !!user` — a derived boolean. All components that need to know if someone is logged in read this single value.
- **Global 401 handler:** `setUnauthorizedHandler` (from `http.ts`) registers a callback that is invoked by the Axios response interceptor whenever any API call returns HTTP 401. This means an expired token silently logs the user out and redirects to `/login` without any per-call handling. The callback is stored in `logoutRef` to avoid stale closure issues.
- The `Axios` request interceptor in `http.ts` reads `localStorage[TOKEN_KEY]` before every request and injects `Authorization: Bearer <token>`. This is set up once at module load time — no per-call handling needed.

### 4.2 Cart Context

**Files:** `src/context/CartContent/cart-context.ts` + `CartProvider.tsx`

```ts
// cart-context.ts
export interface CartContextValue {
  cart: Cart | null;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeProduct: (cartItemId: number) => Promise<void>;
  refreshCart: () => Promise<void> | void;  // re-fetches cart; used by Checkout after placing an order
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
```

```tsx
// CartProvider.tsx
function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);

  const loadCart = () => {
    if (!isAuthenticated) return Promise.resolve();
    return cartApi.getCart().then(setCart).catch(() => setCart(null));
  };

  async function addItem(productId: number, quantity: number) {
    try {
      await cartApi.addItem({ productId, quantity });
      loadCart();
    } catch (err) {
      loadCart();
      throw err;   // re-throw so callers can show an error toast
    }
  }

  async function updateQuantity(cartItemId: number, quantity: number) {
    try {
      await cartApi.updateItem(cartItemId, { quantity });
      loadCart();
    } catch (err) {
      loadCart();
      throw err;
    }
  }

  async function removeProduct(cartItemId: number) {
    try {
      await cartApi.removeItem(cartItemId);
      loadCart();
    } catch (err) {
      loadCart();
      throw err;
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);   // clear cart state on logout
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider value={{ cart, open, openCart: () => setOpen(true), closeCart: () => setOpen(false), addItem, updateQuantity, removeProduct, refreshCart: loadCart }}>
      {children}
    </CartContext.Provider>
  );
}
```

**Implementation details:**

- `cart` starts as `null`. Components that use it must handle the null case — for example, CartDrawer treats `cart === null` the same as an empty cart (shows the empty state). The NavBar badge uses `?? 0` to default to zero.
- `CartProvider` reads `isAuthenticated` from `AuthContext`. The `useEffect` dependency on `isAuthenticated` means the cart is loaded on login and cleared on logout automatically. Unauthenticated users have no cart state.
- `open` controls the CartDrawer's visibility. It is stored in CartProvider (not in CartDrawer itself) because NavBar needs to call `openCart()` while CartDrawer needs `open` and `closeCart()`. Both are different components with no parent-child relationship, so context is the right place for this shared UI state.
- **Mutation pattern:** Every mutation (add, update, remove) wraps the API call in try/catch. On both success and failure, `loadCart()` is called to resync the cart from the server. On failure the error is **re-thrown** so the calling component can show an error toast. Previously errors were silently swallowed.
- `updateQuantity` and `removeProduct` take `cartItemId` (the `CartItem.Id`), not `productId`. The backend cart item endpoints are keyed by cart item ID.
- `loadCart` returns the Promise from `cartApi.getCart()` so `refreshCart` can be awaited by callers (e.g. `Checkout` awaiting cart clear after order placement).
- `refreshCart` is `loadCart` exposed directly in the context value.

---

### 4.3 Wishlist Context

**Files:** `src/context/WishlistContext/wishlist-context.ts` + `WishlistProvider.tsx`

```ts
// wishlist-context.ts
export interface WishlistContextValue {
  items: Set<number>;                        // set of wishlisted product IDs
  toggle: (productId: number) => Promise<void>;
  has: (productId: number) => boolean;
}
```

```tsx
// WishlistProvider.tsx (simplified)
function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<Set<number>>(new Set());

  // Sync from server when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      wishlistApi
        .getWishlist()
        .then((data) => setItems(new Set(data.productIds)))
        .catch(() => setItems(new Set()));
    } else {
      setItems(new Set());   // clear on logout
    }
  }, [isAuthenticated]);

  const toggle = useCallback(
    async (productId: number) => {
      const inWishlist = items.has(productId);
      try {
        const data = inWishlist
          ? await wishlistApi.removeItem(productId)
          : await wishlistApi.addItem(productId);
        setItems(new Set(data.productIds));   // server is source of truth
      } catch {
        // keep existing state on error
      }
    },
    [items]
  );

  const has = useCallback((productId: number) => items.has(productId), [items]);
  ...
}
```

**Implementation details:**

- The wishlist is **server-persisted** via `GET/POST/DELETE /api/wishlist`. `localStorage` is no longer used.
- `useEffect` depends on `isAuthenticated`. On login it fetches the user's saved wishlist; on logout it resets to an empty set.
- `toggle` is now `async` — it calls the API and updates state from the server response so the UI is always in sync with the database.
- `Set<number>` is still used for O(1) `has()` lookups, but the set is now hydrated from the server on each login rather than from `localStorage`.
- Errors during `toggle` are swallowed silently — the existing `items` state is preserved, preventing an inconsistent UI.

---

### 4.4 Theme Context

**Files:** `src/context/ThemeContext/theme-context.ts` + `AppThemeProvider.tsx`

```ts
// theme-context.ts
interface ThemeContextValue {
  mode: "light" | "dark";
  toggleMode: () => void;
}

export function useThemeMode(): ThemeContextValue { ... }
```

```tsx
// AppThemeProvider.tsx (simplified)
function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">(() =>
    localStorage.getItem("themeMode") === "dark" ? "dark" : "light"
  );

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", next);
      return next;
    });
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
```

**Implementation details:**

- `AppThemeProvider` is the outermost wrapper in `main.tsx` — it must be above `BrowserRouter` so the entire app (including route transitions) is theme-aware from the first render.
- `useMemo(() => createAppTheme(mode), [mode])` — the theme object is only recreated when the mode changes, not on every render.
- `toggleMode` is called by the `DarkModeIcon` / `LightModeIcon` `IconButton` in the NavBar.

---

### 4.5 Role Context (Legacy)

**Files:** `src/context/RoleContext/role-context.ts` + `RoleProvider.tsx`

> **Note:** `RoleContext` is no longer used for real authentication. The app uses `AuthContext` for JWT-based auth. `RoleProvider` and its files remain in the codebase but are not mounted in `App.tsx` and are not used by any active component. Real role checks go through `useAuth().user?.role`.

The files are kept to avoid breaking any experimental code that may reference them, but can be safely deleted in a future cleanup.

---

### 4.6 Toast Context

**Files:** `src/context/ToastContext/ToastProvider.tsx` + `toast-context.ts`

Provides a global snackbar notification system. Any component can call `useToast()` to show a success, error, or info message without prop-drilling.

```ts
export interface ToastContextValue {
  showToast: (message: string, severity?: "success" | "error" | "warning" | "info") => void;
}
```

`ToastProvider` renders a single MUI `Snackbar` + `Alert` at the root level. The `showToast` function updates local state to open the snackbar with the given message and severity. The snackbar auto-hides after a set duration.

`ToastProvider` is nested inside `WishlistProvider` and outside `AppRoutes` in `App.tsx`:

```tsx
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
```

---

## 5. Application Shell & Routing

**File:** `src/App.tsx`

Three route guard components are defined:

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;   // suspend render until /auth/me resolves
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === "admin" ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Box className="app">
      <NavBar />
      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/login"             element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register"          element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/shop"              element={<Shop />} />
        <Route path="/shop/:productId"   element={<ProductDetail />} />
        <Route path="/wishlist"          element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/checkout"          element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders"            element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile"           element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/categories"        element={<AdminRoute><Categories /></AdminRoute>} />
        <Route path="/products"          element={<AdminRoute><Products /></AdminRoute>} />
        <Route path="/promotions"        element={<AdminRoute><Promotions /></AdminRoute>} />
        <Route path="/banners"           element={<AdminRoute><Banners /></AdminRoute>} />
        <Route path="/analytics"         element={<AdminRoute><Analytics /></AdminRoute>} />
        <Route path="/manage-orders"     element={<AdminRoute><ManageOrders /></AdminRoute>} />
        <Route path="*"                  element={<NotFound />} />
      </Routes>
      <CartDrawer />
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
```

### Provider nesting order

`AuthProvider` is outermost — `CartProvider`, `WishlistProvider`, and `ToastProvider` all call `useAuth()` or depend on it indirectly, so they must be nested inside it. `ToastProvider` is the innermost wrapper so it can access auth state for conditional notifications.

### Route guards

| Guard | Behaviour |
|-------|-----------|
| `ProtectedRoute` | Returns `null` while auth is loading; redirects unauthenticated users to `/login` |
| `PublicOnlyRoute` | Returns `null` while loading; redirects already-authenticated users to `/` |
| `AdminRoute` | Returns `null` while loading; redirects unauthenticated to `/login`; redirects non-admin to `/` |

All guards read `loading` from `useAuth()` and render nothing (`null`) until the initial `/auth/me` call resolves. This prevents the auth flicker where a user with a stored token is briefly seen as unauthenticated on page load. All redirects use `replace` so the back button doesn't loop.

### Public routes

`/shop` and `/shop/:productId` are intentionally public — guests can browse products without logging in. Only actions that touch user-specific data (cart, wishlist) require auth.

### Why `CartDrawer` is outside `<Routes>`

CartDrawer is placed after the closing `</Routes>` tag, inside the same `Box`. This means it is mounted once for the entire application lifetime and is never unmounted when routes change. A slide-in drawer should persist its open/close state across navigation, and keeping it outside the route tree ensures that.

### Route matching

React Router v6 uses exact matching by default — `/` matches only `/`, not `/shop`. The `path="*"` wildcard catches anything that doesn't match any other route and renders the 404 page.

---

## 6. NavBar

**File:** `src/components/NavBar/index.tsx`

The NavBar is an MUI `AppBar` set to `position="sticky"` — it stays at the top of the viewport as the user scrolls.

### Auth-based UI

The NavBar reads both `useAuth()` and `useThemeMode()`. The rendered content is driven by the authenticated state:

- **Unauthenticated:** "Sign In" and "Register" buttons on the right.
- **Authenticated as user:** User avatar / email, a dropdown menu with "Profile", "Order History", and "Sign Out"; wishlist link, cart badge.
- **Authenticated as admin:** Admin navigation links (Categories, Products, Promotions, Banners, Analytics), user avatar with "Sign Out" only; no cart badge.

### Avatar dropdown (user-only menu items)

Non-admin users see two additional `MenuItem` entries above the divider and "Sign Out":

```tsx
{!isAdmin && (
  <MenuItem onClick={() => { setMenuAnchor(null); navigate("/profile"); }}>
    <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
    Profile
  </MenuItem>
)}
{!isAdmin && (
  <MenuItem onClick={() => { setMenuAnchor(null); navigate("/orders"); }}>
    <ListItemIcon><ReceiptLongIcon fontSize="small" /></ListItemIcon>
    Order History
  </MenuItem>
)}
```

These items close the menu and navigate directly. The `Divider` between them and "Sign Out" provides visual grouping.

### Conditional navigation links

```tsx
{user?.role === "admin" ? (
  <>
    <Button component={NavLink} to="/categories"    sx={navButtonSx}>Categories</Button>
    <Button component={NavLink} to="/products"      sx={navButtonSx}>Products</Button>
    <Button component={NavLink} to="/promotions"    sx={navButtonSx}>Promotions</Button>
    <Button component={NavLink} to="/banners"       sx={navButtonSx}>Banners</Button>
    <Button component={NavLink} to="/analytics"     sx={navButtonSx}>Analytics</Button>
    <Button component={NavLink} to="/manage-orders" sx={navButtonSx}>Orders</Button>
  </>
) : (
  <Button component={NavLink} to="/shop" sx={navButtonSx}>Shop</Button>
)}
```

MUI's `Button` accepts a `component` prop to replace the root element. `component={NavLink}` makes the button render as a React Router `NavLink` while keeping all MUI button styling. React Router automatically applies the CSS class `active` to `NavLink` when its route matches. The `navButtonSx` object contains:

```ts
"&.active": {
  backgroundColor: "rgba(255,255,255,0.15)",
  color: "#fff",
  fontWeight: 700,
}
```

The `Home` button uses the `end` prop (`<Button component={NavLink} to="/" end ...>`). Without `end`, the `/` route would match every path (since every path starts with `/`), making the Home button always appear active.

### Dark mode toggle

```tsx
<IconButton onClick={toggleMode} color="inherit">
  {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
</IconButton>
```

`toggleMode` comes from `useThemeMode()`. The icon swaps between sun and moon to indicate the current state and the action that will be taken.

### Cart badge

```tsx
{user?.role !== "admin" && isAuthenticated && (
  <IconButton onClick={openCart} ...>
    <Badge
      badgeContent={cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0}
      color="primary"
    >
      <ShoppingCartIcon />
    </Badge>
  </IconButton>
)}
```

`cart?.items.reduce(...)` — optional chaining handles the case where `cart` is `null` (still loading). `?? 0` provides the fallback. The badge shows total item units. Cart is only shown for authenticated non-admin users.

---

## 7. Home Page

**File:** `src/components/Home/index.tsx`

```tsx
function Home() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminHome /> : <UserHome />;
}
```

The Home component is a role-aware switch. It renders two completely separate layouts with no shared state or structure.

### UserHome

Composed of three stacked sections. On mount it fetches active banners from `GET /api/banners?activeOnly=true` via a dynamic import of `BannerApiClient` — the import is inside `useEffect` to avoid a hard dependency on the admin client for the user-facing bundle.

1. **Active banners strip** — rendered only when `activeBanners.length > 0`. Each banner is an MUI `Paper` card showing the image, title, and subtitle. If the banner has a `linkTo` URL, the card renders as an `<a>` tag with a hover shadow. Errors are silently swallowed — if the banners endpoint fails the rest of the page loads normally.

2. **Hero section** — a full-width box with a CSS `linear-gradient` background (`135deg, #5a4a00 → #867000 → #a08800`). Contains a `Chip` label, headline, subtitle, and a "Start Shopping" `Button` that navigates to `/shop`.

3. **Feature grid** — a `Container` with a `Grid` of 3 columns. Feature data is defined as a static array:
   ```ts
   const features = [
     { icon: <SmartToyIcon />, title: "AI-Powered Cart Analysis", description: "..." },
     { icon: <TrendingUpIcon />, title: "Smart Discount Stacking", description: "..." },
     { icon: <AutoAwesomeIcon />, title: "Personalised Suggestions", description: "..." },
   ];
   ```
   Rendered by `.map()` — no keys from data, `title` is used as key since it's unique and stable.

### AdminHome

A dashboard with quick-action cards and a live activity feed. The cards array is static:
```ts
const adminCards = [
  { icon: <CategoryIcon />,     title: "Categories",  to: "/categories",  cta: "Manage Categories" },
  { icon: <InventoryIcon />,    title: "Products",    to: "/products",    cta: "Manage Products" },
  { icon: <LocalOfferIcon />,   title: "Promotions",  to: "/promotions",  cta: "Manage Promotions" },
  { icon: <ViewCarouselIcon />, title: "Banners",     to: "/banners",     cta: "Manage Banners" },
  { icon: <BarChartIcon />,     title: "Analytics",   to: "/analytics",   cta: "View Analytics" },
];
```

Each card is an MUI `Paper` with `elevation={0}` (no shadow by default) and a `border` via `sx`. Hover effect is done with CSS transitions in `sx`:
```ts
transition: "box-shadow 0.2s, transform 0.2s",
"&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
```
`boxShadow: 6` is an MUI token that maps to a predefined elevation shadow level.

Below the card grid, `<ActivityLog />` is rendered as a full-width section. It fetches the 30 latest activity log entries from `GET /api/admin/activity-log?limit=30` and displays them as a list with entity-type icons and relative timestamps. It sets up a `setInterval` of 60 seconds in `useEffect` for auto-refresh, cleaning up on unmount.

---

## 8. Shop Page

**File:** `src/components/Shop/index.tsx`

This is the most complex page in the application. It combines data fetching, multi-criteria client-side filtering, and cart integration.

### State

```ts
const [products, setProducts] = useState<Product[]>([]);
const [categories, setCategories] = useState<Category[]>([]);
const [promotedProductIds, setPromotedProductIds] = useState<Set<number>>(new Set());
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

// filter state
const [search, setSearch] = useState("");
const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
const [sort, setSort] = useState<SortOption>("price-asc");
const [onPromotionOnly, setOnPromotionOnly] = useState(false);
const [inStockOnly, setInStockOnly] = useState(false);
```

In addition, the Shop uses `useCart()` for `addItem`, `useWishlist()` for `toggle` and `has`, and `useNavigate()` + `useSearchParams()` for URL-driven category pre-selection.

### Data fetching

```ts
useEffect(() => {
  Promise.all([productsApi.getAll(), categoriesApi.getAll()])
    .then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      if (prods.length > 0) {
        const prices = prods.map((p) => p.price);
        setPriceRange([Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]);
      }
    })
    .catch((err) => setError((err as Error).message))
    .finally(() => setLoading(false));
}, []);
```

Promotions are fetched separately to build `promotedProductIds` — a `Set<number>` of product IDs covered by at least one active promotion. This powers the "On Promotion" filter without polluting the product fetch.

`Promise.all` fires both API requests in parallel and waits for both to complete before updating state. This is faster than awaiting them sequentially.

After products load, the price slider range is dynamically set to `[min, max]` of actual product prices — `Math.floor` on min and `Math.ceil` on max ensures no product falls outside the initial slider range due to floating-point rounding.

### Client-side filtering with `useMemo`

```ts
const visibleProducts = useMemo(() => {
  let filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      p.categories.some((c) => selectedCategories.includes(c.id));
    const matchesPrice =
      p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchesPromotion = !onPromotionOnly || promotedProductIds.has(p.id);
    const matchesStock = !inStockOnly || p.stockQuantity > 0;
    return matchesSearch && matchesCategory && matchesPrice && matchesPromotion && matchesStock;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === "price-asc")  return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name-asc")   return a.name.localeCompare(b.name);
    return b.name.localeCompare(a.name);
  });

  return filtered;
}, [products, search, selectedCategories, priceRange, sort, onPromotionOnly, inStockOnly, promotedProductIds]);
```

All filtering is done **client-side** — products are fetched once on mount and then filtered in memory on every state change. `useMemo` ensures the filter + sort computation runs only when one of its dependencies actually changes, not on every render.

**Search:** Case-insensitive substring match on `p.name`. `.trim()` handles leading/trailing whitespace.

**Category filter:** `selectedCategories.length === 0` acts as "show all". When at least one is ticked, only products whose `categories` array contains at least one selected id pass.

**Price filter:** Inclusive range check. The slider updates `priceRange` in real time.

**Promotion filter:** `onPromotionOnly` is `false` by default (pass all). When `true`, only products whose `id` is in `promotedProductIds` pass.

**Stock filter:** `inStockOnly` is `false` by default. When `true`, only products with `stockQuantity > 0` pass.

**Sort:** The array is spread (`[...filtered]`) before sorting because `Array.prototype.sort` mutates in place. `String.prototype.localeCompare` handles correct alphabetical ordering.

### Product cards — wishlist and stock

Each product card shows a `FavoriteIcon` / `FavoriteBorderIcon` heart button that calls `toggle(product.id)` from `useWishlist()`. When `stockQuantity === 0`, the "Add to Cart" button is disabled and an "Out of stock" chip is shown. When `0 < stockQuantity < 5`, a "Low stock" amber chip appears. Clicking a product name or image navigates to `/shop/:productId`.

### Category toggle

```ts
const toggleCategory = (id: number) => {
  setSelectedCategories((prev) =>
    prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
  );
};
```

Uses the functional form of `setState` (receives `prev`) to avoid stale closure bugs. If the id is already selected, it removes it; otherwise it appends it.

### Product cards

Each product renders as an MUI `Card`. Image loading uses an `onError` fallback:

```tsx
onError={(e) => {
  const img = e.currentTarget as HTMLImageElement;
  img.src = `https://placehold.co/400x150/eeeeee/999999?text=${encodeURIComponent(product.name)}`;
}}
```

If the `imageUrl` is broken or empty, the image is replaced with a grey placeholder generated by placehold.co, displaying the product name as text. `encodeURIComponent` ensures special characters in product names don't break the URL.

### Adding to cart

```tsx
const [addingId, setAddingId] = useState<number | null>(null);

<Button
  disabled={addingId === product.id}
  startIcon={addingId === product.id ? <CircularProgress size={14} color="inherit" /> : <AddShoppingCartIcon />}
  onClick={async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (addingId !== null) return;
    setAddingId(product.id);
    try {
      await addItem(product.id, 1);
      showToast(`${product.name} added to cart`);
    } catch {
      showToast("Failed to add to cart.", "error");
    } finally {
      setAddingId(null);
    }
  }}
>Add to Cart</Button>
```

Guards at multiple levels: (1) **Auth check** — unauthenticated users are redirected to `/login`. (2) **Lock guard** — if another add is already in progress (`addingId !== null`), the click is ignored. (3) **Per-card loading** — `addingId` tracks which specific product is loading, disabling its button and swapping the icon for a `CircularProgress`. Toast feedback fires on success or failure via `useToast()`. After the API round-trip, `CartProvider` updates `cart` state and the NavBar badge re-renders automatically.

### Category pre-selection from URL

A dedicated `useEffect` reads `searchParams.get("categoryId")` and pre-selects the matching category in the filter panel:

```ts
useEffect(() => {
  const id = searchParams.get("categoryId");
  if (id) setSelectedCategories([Number(id)]);
}, [searchParams]);
```

This is **separate** from the data-fetch effect (which only runs on mount). Keeping them in separate effects ensures `searchParams` is listed in its own dependency array — removing the previous `eslint-disable` comment that was masking the stale-closure bug.

### AI semantic search mode

The search `TextField` has an `AutoAwesomeIcon` `IconButton` toggle to the right. When active it lights up with `color="primary"`.

```ts
// New state
const [aiMode, setAiMode]               = useState(false);
const [aiResults, setAiResults]         = useState<Product[] | null>(null);
const [aiLoading, setAiLoading]         = useState(false);

// Display source: AI results when active, local filtered results otherwise
const displayedProducts = aiMode && aiResults !== null ? aiResults : visibleProducts;
```

A `useEffect` with a 400 ms debounce fires `aiApi.semanticSearch(search)` whenever `aiMode` is on and `search` is non-empty:

```ts
useEffect(() => {
  if (!aiMode || !search.trim()) { setAiResults(null); return; }
  const timer = setTimeout(async () => {
    setAiLoading(true);
    try {
      setAiResults(await aiApi.semanticSearch(search));
    } finally {
      setAiLoading(false);
    }
  }, 400);
  return () => clearTimeout(timer);
}, [aiMode, search]);
```

While `aiLoading` is true, a `CircularProgress` spinner appears in the `TextField`'s `startAdornment`. The product count label and the product grid both use `displayedProducts` — switching AI mode on or off takes effect on the next debounce cycle without any other render-path changes.

---

## 9. Product Detail Page

**File:** `src/components/ProductDetail/index.tsx`  
**Route:** `/shop/:productId` (public)

### Data fetching

```ts
const { productId } = useParams<{ productId: string }>();

useEffect(() => {
  Promise.all([
    productsApi.getById(Number(productId)),
    productsApi.getRelated(Number(productId)),
  ]).then(([prod, related]) => {
    setProduct(prod);
    setRelatedProducts(related);
  }).catch(() => navigate("/shop"));
}, [productId]);
```

Both the product and its related products are fetched in parallel. If the product is not found (404), the catch block navigates back to `/shop`.

### Stock indicators

The page reads `product.stockQuantity` to drive the same stock UI as the Shop page:
- `stockQuantity === 0` — "Out of stock" chip, "Add to Cart" button disabled
- `0 < stockQuantity < 5` — "Low stock: N left" amber chip
- `stockQuantity >= 5` — no chip shown

### Category chips with navigation

Each category on the product is rendered as an MUI `Chip` with `onClick`. Clicking a category chip navigates to `/shop?categoryId=<id>`, which the Shop page reads from `useSearchParams()` to pre-select that category in the filter panel.

### Related products

Related products are fetched from `GET /api/products/{id}/related` (same-category products). Rendered as a horizontal scrollable row of cards below the main product. Clicking a related product navigates to its own `/shop/:productId` route.

### Back button

```tsx
<Button onClick={() => navigate(-1)}>Back</Button>
```

`navigate(-1)` goes back one step in the browser's history rather than always returning to `/shop`. This preserves the user's previous location (search, filter state) when they arrived from a search result or the wishlist.

### Wishlist integration

The wishlist toggle button calls `toggle(product.id)` from `useWishlist()` and fires a toast to confirm the action:

```tsx
onClick={() => {
  const wasWishlisted = isWishlisted(product.id);
  toggleWishlist(product.id);
  showToast(wasWishlisted ? "Removed from wishlist" : "Saved to wishlist", wasWishlisted ? "info" : "success");
}}
```

### Add to cart (ProductDetail)

Like the Shop page, "Add to Cart" checks `isAuthenticated` before calling `addItem`. If the user is a guest, they are redirected to `/login`. On success a toast confirms the item was added; on failure a toast shows the error. The same auth + toast pattern also applies to the related products row's "Add to Cart" buttons.

---

## 10. Wishlist Page

**File:** `src/components/Wishlist/index.tsx`  
**Route:** `/wishlist` (protected — requires login)

The wishlist is **server-persisted** — `WishlistProvider` loads product IDs from `GET /api/wishlist` on login. The Wishlist page reads the IDs from `useWishlist().items` and fetches full product details for each ID.

```ts
const { items } = useWishlist();

useEffect(() => {
  const ids = [...items];
  if (ids.length === 0) { setProducts([]); return; }

  Promise.all(ids.map((id) => productsApi.getById(id)))
    .then(setProducts)
    .catch((err) => setError((err as Error).message))
    .finally(() => setLoading(false));
}, [items]);
```

`Promise.all` fires one `GET /products/{id}` per wishlisted product in parallel. The `useEffect` dependency on `items` means the product list re-fetches whenever the wishlist changes (an item is added or removed), so the page stays up to date without a manual refresh. If a product has been deleted from the backend since it was wishlisted, the catch shows an error state rather than rendering partially.

Each product card has a heart `IconButton` that calls `toggle(product.id)` to remove it from the wishlist and shows a toast (`"Removed from wishlist"`). The page shows an empty state illustration when no items are wishlisted.

### Add to cart (Wishlist)

The "Add to Cart" button uses the same auth + `addingId` + toast pattern as the Shop page:

```tsx
const [addingId, setAddingId] = useState<number | null>(null);

onClick={async () => {
  if (!isAuthenticated) { navigate("/login"); return; }
  if (addingId !== null) return;
  setAddingId(product.id);
  try {
    await addItem(product.id, 1);
    showToast(`${product.name} added to cart`);
  } finally {
    setAddingId(null);
  }
}}
```

The button icon swaps for a `CircularProgress` while the add-to-cart request is in flight. Card hover now also has a subtle `transform: translateY(-2px)` lift.

---

## 11. Login & Register Pages

**Files:** `src/components/Login/index.tsx`, `src/components/Register/index.tsx`  
**Routes:** `/login`, `/register` (both wrapped in `PublicOnlyRoute`)

Both pages are wrapped in `PublicOnlyRoute` — if an authenticated user visits them they are redirected to `/` immediately.

### Login

```ts
const handleLogin = async () => {
  const result = await authApi.login({ email, password });
  login(result.token, { userId: result.userId, email: result.email, role: result.role });
  navigate("/");
};
```

Calls `POST /api/auth/login`. On success, calls `login()` from `useAuth()` which stores the token in `localStorage` and sets the user in `AuthContext`. After login the user is navigated to `/`.

### Register

```ts
const handleRegister = async () => {
  const result = await authApi.register({ email, password });
  login(result.token, { userId: result.userId, email: result.email, role: result.role });
  navigate("/");
};
```

Calls `POST /api/auth/register`. On success, automatically logs the user in with the returned token — no separate login step required after registration.

### Password visibility toggle

Both Login and Register include a show/hide password toggle in the password `TextField`:

```tsx
const [showPassword, setShowPassword] = useState(false);

<TextField
  type={showPassword ? "text" : "password"}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
```

`VisibilityIcon` (open eye) means "currently visible — click to hide". `VisibilityOffIcon` (eye with slash) means "currently hidden — click to reveal".

### Error handling

Both pages catch API errors and display them as MUI `Alert` components above the form. Common errors: "A user with this email already exists" (register), "Invalid email or password" (login).

---

## 12. Cart Drawer

**Files:** `src/components/CartDrawer/index.tsx` + `CartDrawer/AnalyzeDialog/index.tsx`

```tsx
function CartDrawer() {
  const { cart, open, closeCart, updateQuantity, removeProduct } = useCart();
  const [analyzeOpen, setAnalyzeOpen] = useState(false);

  const isEmpty = cart === null || cart.items.length === 0;
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  ...
}
```

A MUI `Drawer` anchored to the right (`anchor="right"`). Its `open` prop is driven directly from cart context. The drawer also contains an "Analyze with AI" button (AutoAwesomeIcon) that opens `AnalyzeDialog` — a dialog that calls `cartApi.analyzeCart()` and presents AI-generated suggestions with approve/decline actions.

### Empty state

When `cart === null` (initial load not yet complete) or `cart.items.length === 0`, the drawer shows an empty state with a large outlined cart icon and a "Continue Shopping" button that calls `closeCart()`. The `null` and empty cases are intentionally treated the same — while loading, the user sees "empty" rather than a spinner, which feels lighter.

### Item list

```tsx
{cart.items.map((item) => (
  <ListItem key={item.id} ...>
    {/* Product name + delete button */}
    <Typography>{item.productName}</Typography>
    <IconButton onClick={() => removeProduct(item.id)} color="error">
      <DeleteIcon />
    </IconButton>

    {/* Quantity controls */}
    <IconButton
      onClick={() => updateQuantity(item.id, item.quantity - 1)}
      disabled={item.quantity <= 1}
    >
      <RemoveIcon />
    </IconButton>
    <Typography>{item.quantity}</Typography>
    <IconButton
      onClick={() => updateQuantity(item.id, item.quantity + 1)}
      disabled={item.quantity >= item.stockQuantity}
    >
      <AddIcon />
    </IconButton>

    {/* Line total */}
    <Typography>{fmt(item.subtotal)}</Typography>
  </ListItem>
))}
```

The `−` button is `disabled` when `quantity <= 1` — the minimum quantity for a cart item is 1. The `+` button is `disabled` when `quantity >= item.stockQuantity` — prevents the user from adding more units than are in stock. If the user wants to remove an item entirely, they use the delete button.

`item.subtotal` is computed by the backend (price × quantity), not by the frontend.

`removeProduct(item.id)` passes `item.id` which is the **cart item ID** (not the product ID). The backend uses this to find and remove the specific cart line item.

### Currency formatting

```ts
// src/utils/currency.ts
export const fmt = (value: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(value);
```

Uses the browser-native `Intl.NumberFormat` API with Romanian locale and RON currency. This produces correctly formatted values like `1.299,99 RON`. The function is extracted to `src/utils/currency.ts` and imported into every component that displays monetary values (CartDrawer, Shop, ProductDetail, Wishlist).

### Applied promotions display

```tsx
{cart.appliedPromotions.map((promotion) => (
  <Box key={promotion.promotionName} sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography color="success.main" variant="body2">
      {promotion.promotionName}
    </Typography>
    <Typography color="success.main" variant="body2">
      -{fmt(Math.abs(promotion.discount))}
    </Typography>
  </Box>
))}
```

`cart.appliedPromotions` is an array of `{ promotionName: string, discount: number }` objects returned by the backend after each cart mutation. The frontend simply iterates and displays them. `Math.abs` is used defensively in case the backend returns negative discount values.

The promotion name is used as the `key` — this is acceptable here because promotion names are unique identifiers, and the array is re-fetched from the server on every mutation.

### Drawer footer — "Proceed to Checkout"

```tsx
const navigate = useNavigate();

<Button
  variant="contained"
  fullWidth
  onClick={() => { closeCart(); navigate("/checkout"); }}
>
  Proceed to Checkout
</Button>
```

`closeCart()` is called first to close the drawer before navigating — this avoids the drawer animating over the checkout page while the route change is happening.

### AnalyzeDialog

`AnalyzeDialog` calls `cartApi.analyzeCart()` (`POST /api/cart/analyze`) and presents the two-agent AI result. Key implementation details:

- `CircularProgress` is explicitly imported from MUI — not doing so causes a runtime crash when the loading state is first rendered.
- Loading stage messages are plain text (`"Reading your cart..."`, `"Checking promotions..."`, `"Composing suggestions..."`) with no emojis.
- `addingId` state tracks which suggestion card is currently being added to the cart, disabling the button and swapping its icon to `CircularProgress` during the request. Wrapped in `try/finally` to always clear the lock even if the add fails.

---

## 13. Checkout Page

**File:** `src/components/Checkout/index.tsx`

The Checkout page is a 3-step MUI `Stepper` flow — the full implementation of #30.

```tsx
const STEPS = ["Review Cart", "Shipping Details", "Confirm Order"];

function Checkout() {
  const { cart, refreshCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [shipping, setShipping]     = useState<ShippingForm>(emptyShipping);
  const [shippingErrors, setShippingErrors] = useState<Partial<ShippingForm>>({});
  const [placing, setPlacing]       = useState(false);
  ...
}
```

### Step 1 — Review Cart (`ReviewStep`)

An editable table of cart items. Each row has:
- `−` / `+` `IconButton` controls that call `updateQuantity(item.id, qty ± 1)` — the `−` button is disabled when `quantity <= 1`.
- A delete `IconButton` (red) that calls `removeProduct(item.id)`.
- Unit price and subtotal columns.

Changes are reflected immediately in the cart context (server round-trip via CartProvider).

### Step 2 — Shipping Details (`ShippingStep`)

A `Grid` form with controlled `TextField` components:

| Field | Required |
|-------|---------|
| Full Name | ✓ |
| Address | ✓ |
| City | ✓ |
| Postal Code | ✓ |
| Phone Number | ✓ |

Client-side validation runs in `validateShipping()` before advancing. Each field shows an inline helper-text error. No submission happens on this step — it only gates the transition to step 3.

### Step 3 — Confirm Order (`ConfirmStep`)

Read-only summary:
- **Shipping address** block (name, address, city + postal code, phone).
- **Order summary table** — product, qty, subtotal.
- **Applied promotions** and grand total at the bottom right.
- **"Place Order"** CTA button.

### Order placement flow

```ts
async function handlePlaceOrder() {
  setPlacing(true);
  try {
    const shippingAddress: ShippingAddressInput = { name, address, city, postalCode, phone };
    await ordersApi.place(shippingAddress);   // POST /api/orders { shippingAddress }
    await refreshCart();                      // clear cart context state
    showToast("Order placed successfully!", "success");
    navigate("/orders");
  } catch {
    showToast("Failed to place order. Please try again.", "error");
  } finally {
    setPlacing(false);
  }
}
```

The shipping address is sent as a nested `{ shippingAddress: { name, address, city, postalCode, phone } }` body. The backend persists it on the `Order` entity as flat columns (`ShippingName`, `ShippingAddress`, etc.).

### Navigation buttons

- **Back** — disabled on step 0; decrements `activeStep`.
- **Next** — visible on steps 0 and 1; runs shipping validation before advancing to step 2.
- **Place Order** — visible on step 2 only; shows a `CircularProgress` spinner while in flight.

### Empty cart guard

If `cart === null` or `cart.items.length === 0` on step 0, a placeholder message and "Go to Shop" button are shown.

---

## 14. Orders Page

**File:** `src/components/Orders/index.tsx`

Displays the authenticated user's order history. Calls `ordersApi.getAll()` once on mount.

### Layout

Each order is an MUI `Accordion`:

- **Summary (always visible):** order date (`PlacedAt` formatted with `toLocaleDateString`), total, and a status `Chip` — `warning` for Pending, `info` for Confirmed, `primary` for Shipped, `success` for Delivered, `error` for Cancelled.
- **Details (expanded):** a `Table` listing each order item — columns: Product Name, Quantity, Unit Price, Subtotal.

```tsx
{orders.map((order) => (
  <Accordion key={order.id}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Order #{order.id}</Typography>
      <Typography>{new Date(order.placedAt).toLocaleDateString("ro-RO")}</Typography>
      <Chip label={order.status} color={order.status === "Pending" ? "warning" : "success"} size="small" />
      <Typography>{fmt(order.total)}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Table size="small">
        {order.items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.productName}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{fmt(item.price)}</TableCell>
            <TableCell>{fmt(item.subtotal)}</TableCell>
          </TableRow>
        ))}
      </Table>
    </AccordionDetails>
  </Accordion>
))}
```

Orders are displayed in the order returned by the backend (`OrderByDescending(o => o.PlacedAt)` — most recent first).

### Empty state

When `orders.length === 0`, a centered message with a "Go Shopping" link is shown.

---

## 15. Manage Orders Page (Admin)

**File:** `src/components/ManageOrders/index.tsx`

An admin-only page at `/manage-orders` that shows all orders across all users and lets the admin update each order's status.

### Data loading

Calls `adminOrdersApi.getAll()` on mount — returns `AdminOrderModel[]`, which extends `OrderModel` with a `userEmail` field. Orders are sorted by `placedAt` descending (most recent first) by the backend.

### Layout

Each order is an MUI `Accordion`:

- **Summary (always visible):** order #, date, customer email, status `Chip` (colour-coded), total.
- **Details (expanded):** two columns:
  1. **Item table** — product name, unit price, qty, subtotal.
  2. **Shipping + status panel** — shipping address block (or "Not provided" for legacy orders), a `Select` dropdown with all valid statuses, and a "Cancel Order" quick-action button.

### Status update flow

```ts
async function handleStatusChange(orderId: number, status: string) {
  setUpdating(orderId);   // show spinner on that specific row
  try {
    await adminOrdersApi.updateStatus(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );                    // optimistic local update
    showToast(`Order #${orderId} status updated to ${status}`, "success");
  } catch {
    showToast("Failed to update order status.", "error");
  } finally {
    setUpdating(null);
  }
}
```

The `updating` state tracks which order ID is currently being saved — only that row's `Select` is disabled and a `CircularProgress` appears beneath it. All other rows remain interactive.

### Status colour map

```ts
const STATUS_COLORS = {
  Pending:   "warning",
  Confirmed: "info",
  Shipped:   "primary",
  Delivered: "success",
  Cancelled: "error",
};
```

---

## 16. Profile Page (User Account)

**File:** `src/components/Profile/index.tsx`

The user account management page. Loads the current user's profile on mount and presents three vertically stacked `Paper` sections.

### Data loading

```ts
useEffect(() => {
  userApi.getProfile()
    .then((p) => {
      setProfile(p);
      setDisplayName(p.displayName ?? "");
    })
    .finally(() => setLoading(false));
}, []);
```

`userApi.getProfile()` calls `GET /api/auth/me` and returns the full `UserProfile` object including `displayName`.

### Section 1 — Account Info (read-only)

Displays `email`, `role` (capitalized), and `createdAt` (formatted as Romanian locale date). No editable fields.

### Section 2 — Display Name

A controlled `TextField` pre-populated with the current `displayName`. "Save" button calls `userApi.updateProfile(displayName.trim() || null)`:
- `null` clears the display name (treated as "no nickname").
- On success, `showToast("Display name updated.", "success")` and the profile state is updated.
- On error, `showToast("Failed to update display name.", "error")`.

### Section 3 — Change Password

Three `TextField`s: Current Password, New Password, Confirm New Password. Client-side validation before the API call:
1. New password and confirm must match.
2. New password must be at least 6 characters.

Calls `userApi.changePassword(currentPassword, newPassword)` → `PUT /api/auth/me/password`. On success, all three fields are cleared and a success toast is shown. On error, the error message from the API (e.g., "Incorrect current password.") is displayed in an `Alert`.

---

## 17. HTTP Layer

**File:** `src/api/base/http.ts`

```ts
export const TOKEN_KEY = "auth_token";

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();   // global auto-logout on expired token
    }
    const data = error.response?.data;
    const message =
      typeof data === "string" && data !== ""
        ? data
        : error.message || "Request failed";
    return Promise.reject(new Error(message));
  },
);

export const http = {
  get:    async <T>(path: string): Promise<T> => (await api.get<T>(path)).data,
  post:   async <T>(path: string, body: unknown): Promise<T> => (await api.post<T>(path, body)).data,
  put:    async <T>(path: string, body: unknown): Promise<T> => (await api.put<T>(path, body)).data,
  remove: async <T>(path: string): Promise<T> => (await api.delete<T>(path)).data,
};
```

### Axios instance

`axios.create()` creates an isolated Axios instance (separate from the global `axios`). This means:
- The `baseURL` and headers are scoped to this instance — other libraries using the global `axios` won't be affected.
- `baseURL: import.meta.env.VITE_API_URL` reads from Vite's environment variables. In development this is typically `http://localhost:5000/api` (defined in `.env.local`). In production it would be the deployed API URL.

### Request interceptor (JWT)

The request interceptor runs before every outgoing request. It reads `localStorage[TOKEN_KEY]` and injects the `Authorization: Bearer <token>` header if a token exists. This means every API call in the app carries the JWT without any per-call handling. `TOKEN_KEY` is exported so `AuthProvider` can import the same constant rather than duplicating the string.

### Response interceptor

The interceptor runs on every failed response (HTTP 4xx, 5xx, or network errors).

**401 auto-logout:** If the server returns `401 Unauthorized`, `onUnauthorized?.()` is called. This triggers the handler registered by `AuthProvider.setUnauthorizedHandler` — which clears the stored token, resets auth state, and redirects to `/login`. This means an expired JWT is handled globally; no individual API client needs to handle 401.

**Error message normalisation:**

```ts
const data = error.response?.data;
const message =
  typeof data === "string" && data !== ""
    ? data
    : error.message || "Request failed";
return Promise.reject(new Error(message));
```

If the backend returns a plain string body (e.g., `"Category name already exists"`), that string is used directly as the error message. This allows backend validation errors to surface as readable messages in the UI's `Alert` components. If the response body is not a string, it falls back to Axios's generic error message.

The error is re-thrown as a standard `Error` object. All API clients catch errors with `(err as Error).message`, which works correctly with this pattern.

### Typed HTTP helpers

The `http` object wraps Axios and handles the `response.data` extraction. The generic type parameter `<T>` tells TypeScript what shape the response body should be. For example:

```ts
http.get<CartModel>("/cart")  // → Promise<CartModel>
```

TypeScript infers this throughout the call chain, giving type safety from the API client through to the mapper function and into the component.

---

## 18. API Models vs Frontend Types

Every domain has a parallel type system split across two files:

| File | Purpose |
|---|---|
| `api/models/*.ts` | Mirrors the **exact JSON shape** sent by the backend |
| `components/shared/types/*.ts` | The **frontend domain type** the rest of the app uses, plus mapper functions |

This separation has one key benefit: when the backend API changes its shape, only the model file and mapper need updating — all components continue using the stable frontend type.

### 15.1 Cart

**Backend model** (`api/models/CartModel.ts`):
```ts
interface CartItemModel {
  id: number; productId: number; productName: string;
  price: number; quantity: number; subtotal: number;
}
interface AppliedPromotionModel { promotionName: string; discount: number; }
interface CartModel {
  items: CartItemModel[];
  subtotal: number;
  appliedPromotions: AppliedPromotionModel[];
  totalDiscount: number;
  total: number;
}
interface CartItemCreateInput { productId: number; quantity: number; }
interface CartItemUpdateInput { quantity: number; }

// AI analysis types:
interface SuggestionModel {
  productId: number; name: string; price: number; quantity: number;
  reason: string; imageUrl: string | null; savings: number | null;
}
interface AnalysisResponseModel { summary: string; suggestions: SuggestionModel[]; }
```

**Frontend type** (`components/shared/types/Cart.ts`):
```ts
// Interfaces mirror the model almost exactly for Cart
// but mappers normalize nullability:

export function toCart(dto: CartModel): Cart {
  return {
    items: dto.items.map(toCartItem),
    subtotal: dto.subtotal,
    appliedPromotions: dto.appliedPromotions.map(toAppliedPromotion),
    totalDiscount: dto.totalDiscount,
    total: dto.total,
  };
}
```

The `AnalysisResponse` and `Suggestion` types exist for the AI cart analysis feature. `cartApi.analyzeCart()` is called from `CartDrawer/AnalyzeDialog/index.tsx` when the user clicks "Analyze with AI" in the cart drawer. The dialog displays the summary and allows approving/declining individual suggestions.

### 15.2 Product

**Backend model** (`api/models/ProductModel.ts`):
```ts
interface ProductModel {
  id: number; name: string;
  description?: string;   // optional — may be absent from API
  imageUrl?: string;      // optional — may be absent from API
  price: number;
  stockQuantity: number;  // added for stock status feature (#19)
  categories: ProductCategoryModel[];
}
```

**Frontend type + mapper** (`components/shared/types/Product.ts`):
```ts
interface Product {
  id: number; name: string;
  description: string;   // always a string
  imageUrl: string;      // always a string
  price: number;
  stockQuantity: number;
  categories: ProductCategory[];
}

export function toProduct(dto: ProductModel): Product {
  return {
    ...
    description: dto.description ?? "",  // normalize undefined → ""
    imageUrl: dto.imageUrl ?? "",        // normalize undefined → ""
    stockQuantity: dto.stockQuantity,
  };
}
```

The mapper converts `undefined` fields to empty strings. This means components never need to handle `undefined` — they can always do `product.description` without optional chaining. `stockQuantity` is always present (backend guarantees it).

### 15.3 Category

Same pattern as Product. The backend model allows optional `description`, the frontend type always has `description: string` with `?? ""` fallback in the mapper.

### 15.4 Promotion

**Backend model** (`api/models/PromotionModel.ts`):
```ts
export const PromotionType = {
  Quantity:  0,
  CartTotal: 1,
} as const;
export type PromotionType = (typeof PromotionType)[keyof typeof PromotionType];

export const PromotionReward = {
  FreeItems:       0,
  PercentDiscount: 1,
} as const;
export type PromotionReward = (typeof PromotionReward)[keyof typeof PromotionReward];

interface PromotionModel {
  id: number; name: string;
  type: PromotionType;       // numeric: 0 | 1
  threshold: number;
  reward: PromotionReward;   // numeric: 0 | 1
  rewardValue: number;
  productId?: number;        // optional scope
  categoryId?: number;       // optional scope
  isActive: boolean;
}
```

The enums are implemented as `const` objects rather than TypeScript `enum`. This is important because TypeScript `enum` values can behave unexpectedly with `JSON.stringify` (numeric enums stringify to numbers, but string enums stringify to strings). With `const` objects, `PromotionType.Quantity` is just the number `0` everywhere — no surprises.

The `as const` assertion makes the object's values readonly literal types (`0` and `1` rather than `number`). The derived `type` is `0 | 1`, which is what the backend expects.

**Frontend mapper** (`components/shared/types/Promotion.ts`):
```ts
export function toPromotion(dto: PromotionModel): Promotion {
  return {
    ...
    productId:  dto.productId  ?? null,   // undefined → null
    categoryId: dto.categoryId ?? null,   // undefined → null
  };
}
```

Optional fields are normalized to `null` (not `undefined`) in the frontend type. This is a deliberate choice — `null` is an explicit "no value" that can be serialized to JSON, while `undefined` disappears in `JSON.stringify`. Both approaches work for display, but `null` is more explicit.

### 15.5 Banner

**Backend model** (`api/models/BannerModel.ts`):
```ts
interface BannerModel {
  id: number; title: string;
  subtitle?: string; imageUrl?: string; linkTo?: string;
  promotionId?: number;
  isActive: boolean; displayOrder: number; createdAt: string;
}
interface BannerInput { title: string; subtitle?: string; imageUrl?: string; linkTo?: string; promotionId?: number; isActive: boolean; displayOrder: number; }
```

**Frontend type + mapper** (`components/shared/types/Banner.ts`):
```ts
interface Banner {
  id: number; title: string;
  subtitle: string | null; imageUrl: string | null; linkTo: string | null;
  promotionId: number | null;
  isActive: boolean; displayOrder: number; createdAt: string;
}
export function toBanner(dto: BannerModel): Banner { ... }
```

Optional string fields become `string | null` (not `string | undefined`), consistent with the Promotion mapper pattern.

### 15.6 Analytics

**Backend model** (`api/models/AnalyticsSummaryModel.ts`):
```ts
interface TopProductModel    { productId: number; name: string; cartAdditions: number; }
interface PromotionUsageModel { promotionId: number; name: string; usageCount: number; }
interface AnalyticsSummaryModel {
  totalCarts: number; estimatedRevenue: number;
  topProducts: TopProductModel[]; promotionUsage: PromotionUsageModel[];
}
```

There is no frontend-specific mapper for analytics — `AnalyticsSummaryModel` is used directly by the `Analytics` page component because the shape is flat and requires no normalisation.

### 15.7 Activity Log

**Backend model** (`api/models/ActivityLogModel.ts`):
```ts
interface ActivityLogModel {
  id: number; action: string; entityType: string;
  entityId: number; entityName: string;
  actorId?: number; actorEmail?: string; occurredAt: string;
}
```

No mapper needed — the `ActivityLog` component reads the model directly and formats the data for display inline (`formatAction`, `formatRelativeTime` helpers inside the component).

### 15.8 Order

**Backend model** (`api/models/OrderModel.ts`):
```ts
interface OrderItemModel {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface ShippingAddressInput {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface OrderModel {
  id: number;
  items: OrderItemModel[];
  total: number;
  status: string;           // "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled"
  placedAt: string;         // ISO 8601 UTC string
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingPhone: string;
}

interface AdminOrderModel extends OrderModel {
  userEmail: string;        // customer email — only present in admin responses
}
```

`ShippingAddressInput` is used by `ordersApi.place()` to send the shipping address to the backend. `AdminOrderModel` extends `OrderModel` and is used exclusively by `ManageOrders`. No mapper is needed — shapes are flat and all fields are required primitives.

---

## 19. API Clients

Each client is a plain `const` object (not a class, not a singleton class) with methods that call `http.*` and map results.

### Orders API Client (`api/clients/OrderApiClient.ts`)

```ts
export const ordersApi = {
  place:  (shippingAddress: ShippingAddressInput): Promise<OrderModel> =>
    http.post<OrderModel>("/orders", { shippingAddress }),
  getAll: (): Promise<OrderModel[]> => http.get<OrderModel[]>("/orders"),
};

export const adminOrdersApi = {
  getAll:       (): Promise<AdminOrderModel[]> => http.get<AdminOrderModel[]>("/admin/orders"),
  updateStatus: (id: number, status: string)   => http.put<void>(`/admin/orders/${id}/status`, { status }),
};
```

`ordersApi.place` now sends `{ shippingAddress }` in the request body — the backend binds this to `PlaceOrderRequest.ShippingAddress` and persists the shipping details on the `Order` entity.

`adminOrdersApi` is used exclusively by the `ManageOrders` admin page. Both calls require an admin JWT (the backend `AdminOrderController` is decorated with `[Authorize(Roles = "admin")]`).

`updateStatus` accepts one of the allowed status values: `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`. The backend validates the value and returns `204 No Content` on success.

### User API Client (`api/clients/UserApiClient.ts`)

```ts
export interface UserProfile {
  id: number;
  email: string;
  role: string;
  displayName: string | null;
  createdAt: string;
}

export const userApi = {
  getProfile:     (): Promise<UserProfile>            => http.get<UserProfile>("/auth/me"),
  updateProfile:  (displayName: string | null)        => http.put<UserProfile>("/auth/me", { displayName }),
  changePassword: (currentPassword, newPassword)      => http.put<void>("/auth/me/password", { currentPassword, newPassword }),
};
```

`getProfile` reuses `GET /auth/me` (the same endpoint as `AuthApiClient.me()` but returns the richer `UserProfile` type including `displayName`). `changePassword` returns `void` on success; on failure the backend returns `400` with a plain-text error message surfaced by the response interceptor.

### AI API Client (`api/clients/AiApiClient.ts`)

```ts
export const aiApi = {
  semanticSearch: async (query: string): Promise<Product[]> => {
    const data = await http.post<ProductModel[]>("/ai/search", { query });
    return data.map(toProduct);
  },
};
```

Posts to `POST /api/ai/search` (public endpoint — no auth required). Maps the raw `ProductModel[]` response to the frontend `Product[]` type with the shared `toProduct()` mapper. The Shop page calls this in a debounced `useEffect` when AI mode is active.

### Auth API Client (`api/clients/AuthApiClient.ts`)

```ts
export const authApi = {
  login:    async (data: LoginRequest): Promise<{ token: string; user: AuthUser }> => { ... },
  register: async (data: RegisterRequest): Promise<{ token: string; user: AuthUser }> => { ... },
  me:       async (): Promise<AuthUser> => { ... },
};
```

`login` and `register` both return a `{ token, user }` pair that `AuthProvider.login()` uses to populate context. `me` is called on page load to validate a stored token.

### Cart API Client (`api/clients/CartApiClient.ts`)

```ts
export const cartApi = {
  getCart:     async (): Promise<Cart>             => toCart(await http.get<CartModel>("/cart")),
  addItem:     async (data: CartItemCreateInput)   => toCart(await http.post<CartModel>("/cart/items", data)),
  updateItem:  async (id: number, data: CartItemUpdateInput) => toCart(await http.put<CartModel>(`/cart/items/${id}`, data)),
  removeItem:  async (id: number): Promise<Cart>   => toCart(await http.remove<CartModel>(`/cart/items/${id}`)),
  clearCart:   (): Promise<void>                   => http.remove<void>("/cart"),
  analyzeCart: async (): Promise<AnalysisResponse> => toAnalysisResponse(await http.post<AnalysisResponseModel>("/cart/analyze", {})),
};
```

`analyzeCart` sends `POST /cart/analyze` with an empty body. The backend performs AI analysis and returns a `summary` string and array of `suggestions`. It is connected to `CartDrawer/AnalyzeDialog`.

### Products API Client (`api/clients/ProductApiClient.ts`)

```ts
export const productsApi = {
  getAll:  async (): Promise<Product[]>               => (await http.get<ProductModel[]>("/products")).map(toProduct),
  getById: async (id: number): Promise<Product>       => toProduct(await http.get<ProductModel>(`/products/${id}`)),
  create:  async (data: ProductInput): Promise<Product> => toProduct(await http.post<ProductModel>("/products", data)),
  update:  async (id: number, data: ProductInput)     => toProduct(await http.put<ProductModel>(`/products/${id}`, data)),
  remove:  (id: number)                               => http.remove<void>(`/products/${id}`),
};
```

`getById` is used by `ProductDetail` and `Wishlist` pages to fetch a single product's full data. `remove` doesn't need a mapper since it returns `void`.

### Categories and Promotions API Clients

Follow the identical pattern: `getAll`, `create`, `update`, `remove`.

### Banners API Client (`api/clients/BannerApiClient.ts`)

```ts
export const bannersApi = {
  getAll:  async (activeOnly = false): Promise<Banner[]> => { ... },  // GET /banners?activeOnly=true
  create:  async (data: BannerInput):  Promise<Banner>   => { ... },
  update:  async (id, data):           Promise<Banner>   => { ... },
  remove:  (id: number):               Promise<void>     => http.remove(`/banners/${id}`),
};
```

`getAll(true)` is called by `UserHome` on mount (lazy import) to fetch only active banners for the carousel. `getAll()` with no argument is called by the admin `Banners` page to show all banners including inactive ones.

### Analytics API Client (`api/clients/AnalyticsApiClient.ts`)

```ts
export const analyticsApi = {
  getSummary: () => http.get<AnalyticsSummaryModel>("/analytics/summary"),
};
```

No mapper — the response is used directly. The endpoint requires an admin JWT (enforced by the backend `[Authorize(Roles = "admin")]` attribute).

### Activity Log API Client (`api/clients/ActivityLogApiClient.ts`)

```ts
export const activityLogApi = {
  getLatest: (limit = 50) => http.get<ActivityLogModel[]>(`/admin/activity-log?limit=${limit}`),
};
```

### Wishlist API Client (`api/clients/WishlistApiClient.ts`)

```ts
interface WishlistGetModel {
  productIds: number[];
}

export const wishlistApi = {
  getWishlist: ()                  => http.get<WishlistGetModel>("/wishlist"),
  addItem:     (productId: number) => http.post<WishlistGetModel>(`/wishlist/${productId}`, {}),
  removeItem:  (productId: number) => http.remove<WishlistGetModel>(`/wishlist/${productId}`),
};
```

Every mutation returns the updated `WishlistGetModel` — the provider calls `setItems(new Set(data.productIds))` directly from the response without needing a follow-up GET.

---

## 20. Admin Pages — Shared CRUD Pattern

All three admin pages (Categories, Products, Promotions) are built on exactly the same state pattern. Understanding one means understanding all three.

### State shape used by all three

```ts
// List state
const [items, setItems]       = useState<T[]>([]);
const [loading, setLoading]   = useState(true);
const [error, setError]       = useState("");

// Form dialog state (create or edit)
const [formOpen, setFormOpen] = useState(false);
const [editing, setEditing]   = useState<T | null>(null); // null = create mode

// Delete confirmation state
const [deleting, setDeleting]   = useState<T | null>(null);
const [confirmOpen, setConfirmOpen] = useState(false);
```

### Data loading

```ts
function loadItems() {
  api.getAll()
    .then((data) => { setItems(data); setError(""); })
    .catch((err) => setError((err as Error).message))
    .finally(() => setLoading(false));
}

useEffect(() => { loadItems(); }, []);
```

`loadItems` is a plain named function (not inside `useEffect`) so it can be called both from `useEffect` on mount and manually after any mutation. After create, update, or delete, `loadItems()` is called to refresh the table — this is a simple refetch strategy rather than local state mutation.

### Edit vs Create detection

The form dialog components receive `item: T | null`. They determine their mode with:
```ts
const isEditing = item !== null;
```
And initialize each field:
```ts
const [name, setName] = useState(item?.name ?? "");
```
When `item` is `null` (create mode), all fields start empty. When `item` is provided (edit mode), fields are pre-populated from the existing data.

### Delete flow (step by step)

1. User clicks the delete `IconButton` on a row.
2. `handleDeleteClick(item)` is called: sets `deleting = item`, `confirmOpen = true`.
3. `ConfirmDialog` renders (it's always mounted but `open={confirmOpen}` controls visibility).
4. User sees: "Are you sure you want to delete `{item.name}`?"
5. If they click "Delete" → `handleDelete()` runs: sets `confirmOpen = false`, calls `api.remove(deleting.id)`, then `loadItems()`.
6. If they click "Cancel" → `setConfirmOpen(false)`, `deleting` stays set but `ConfirmDialog` closes. It will be overwritten next time a delete is initiated.

### Form dialog open/close lifecycle

```tsx
{formOpen && (
  <CategoryFormDialog
    category={editing}
    onClose={() => setFormOpen(false)}
    onSaved={() => { setFormOpen(false); loadCategories(); }}
  />
)}
```

The dialog is conditionally rendered with `{formOpen && ...}` rather than always mounted with `open={formOpen}`. This means the dialog is **unmounted** when closed — its internal state (form fields, error messages, saving spinner) resets automatically. No need to manually clear form state on close.

`onSaved` both closes the dialog and triggers a data reload. `onClose` only closes (used for Cancel — no reload needed).

### 16.1 Categories

**File:** `src/components/Categories/index.tsx`

The simplest admin page. Table columns: Name, Description, Actions.

`CategoryFormDialog` fields: Name (required), Description (optional, multiline textarea).

Client-side validation in `handleSave`:
```ts
if (name.trim() === "") {
  setError("Name is required.");
  return;
}
```

### 16.2 Products

**File:** `src/components/Products/index.tsx`

Table columns: Name, Price (formatted `x.xx RON`), Categories (rendered as MUI `Chip` components), Description (truncated with `text-overflow: ellipsis`), Actions.

`ProductFormDialog` is more complex — it fetches categories on its own mount for the category multi-select:

```ts
useEffect(() => {
  categoriesApi.getAll().then(setCategories).catch(() => {});
}, []);
```

The `catch(() => {})` silently swallows the error — if categories fail to load, the multi-select stays empty but the rest of the form still works.

**Category multi-select implementation:**
```tsx
<Select
  multiple
  value={selectedCategoryIds}
  onChange={(e) => setSelectedCategoryIds(e.target.value as number[])}
  input={<OutlinedInput label="Categories" />}
  renderValue={(selected) =>
    categories
      .filter((c) => selected.includes(c.id))
      .map((c) => c.name)
      .join(", ")
  }
>
  {categories.map((category) => (
    <MenuItem key={category.id} value={category.id}>
      <Checkbox checked={selectedCategoryIds.includes(category.id)} />
      <ListItemText primary={category.name} />
    </MenuItem>
  ))}
</Select>
```

`renderValue` receives the array of selected IDs and converts them back to names by filtering the categories array. Each menu item has a `Checkbox` that visually reflects selection state — MUI's multiple Select doesn't show checkboxes by default, so they're added manually as children of `MenuItem`.

**Validation:**
```ts
const parsedPrice = parseFloat(price);
if (isNaN(parsedPrice) || parsedPrice < 0) {
  setError("Price must be a valid non-negative number.");
  return;
}
```
Price is stored as a string in state (from the text input) and converted to `float` in `handleSave`. Storing as string avoids controlled/uncontrolled input issues with numeric fields.

**Payload construction:**
```ts
const data = {
  name: name.trim(),
  description: description.trim() || undefined,  // empty string → omitted from request
  price: parsedPrice,
  imageUrl: imageUrl.trim() || undefined,        // empty string → omitted from request
  categoryIds: selectedCategoryIds,
};
```
Optional fields are converted from empty string to `undefined` so they're omitted from the JSON payload (not sent as `""`).

### 16.3 Promotions

**File:** `src/components/Promotions/index.tsx`

Table columns: Name, Type, Threshold, Reward, Value, Status (Active/Inactive chip), Actions.

Human-readable labels are defined as lookup objects using the numeric `const` enum values as keys:
```ts
const TYPE_LABELS: Record<PromotionType, string> = {
  [PromotionType.Quantity]:  "Quantity",
  [PromotionType.CartTotal]: "Cart Total",
};
const REWARD_LABELS: Record<PromotionReward, string> = {
  [PromotionReward.FreeItems]:       "Free Items",
  [PromotionReward.PercentDiscount]: "% Discount",
};
```

Threshold display is context-aware:
```tsx
{promotion.type === PromotionType.CartTotal
  ? `${promotion.threshold.toFixed(2)} RON`
  : `${promotion.threshold} items`}
```

`PromotionFormDialog` dynamically adapts its field labels and input `step` based on the selected type:
```tsx
<TextField
  label={type === PromotionType.Quantity ? "Threshold (items)" : "Threshold (RON)"}
  slotProps={{ htmlInput: {
    step: type === PromotionType.CartTotal ? 0.01 : 1
  }}}
/>
```

`productId` and `categoryId` are stored as strings in state and converted in `handleSave`:
```ts
productId:  productId  !== "" ? parseInt(productId,  10) : undefined,
categoryId: categoryId !== "" ? parseInt(categoryId, 10) : undefined,
```
These are optional fields — a promotion may be scoped to a specific product or category, or be global (neither set).

### 16.4 Banners

**File:** `src/components/Banners/index.tsx`

Follows the same CRUD pattern as Categories/Products/Promotions. Table columns: Title, Subtitle, Link URL, Display Order, Status (Active/Inactive chip), Actions.

`BannerFormDialog` fields: Title (required), Subtitle, Image URL, Link URL, Promotion ID (optional), Display Order (numeric), Active checkbox. All optional string fields are trimmed and converted to `undefined` if empty before sending to the API so the backend receives `null` rather than `""`.

The `displayOrder` field controls the rendering order in the UserHome banner carousel (sorted ascending by the backend).

### 16.5 Analytics Dashboard

**File:** `src/components/Analytics/index.tsx`

A read-only dashboard — no create/edit/delete. Calls `analyticsApi.getSummary()` once on mount.

**Layout:**
- 4 stat cards in a responsive `Grid` (xs=12, sm=6, md=3): Active Carts, Estimated Revenue, Top Products count, Active Promotions count. Each card has a coloured icon box, a label, and a prominent value.
- Two side-by-side tables below: "Top Products by Cart Additions" (top 5 products, ranked by total quantity across all carts) and "Active Promotions" (all active promotions with their usage count).

The `StatCard` is a local subcomponent (not exported) — it takes `icon`, `label`, and `value` props and renders a single card. It is defined inside the same file since it is only used here.

**Data source:** The backend `AnalyticsService` computes everything in SQL via EF Core `GroupBy` and `Sum` aggregations. Until orders are implemented (Group D), `promotionUsage.usageCount` is always `0` — the table still lists all active promotions as a useful overview.

### 16.6 Activity Log Component

**File:** `src/components/ActivityLog/index.tsx`

A non-page component rendered at the bottom of `AdminHome`. It is not a route — it has no `/activity-log` path.

**Auto-refresh:**
```ts
useEffect(() => {
  loadLogs();
  const interval = setInterval(loadLogs, 60_000);
  return () => clearInterval(interval);
}, []);
```
Fetches on mount and every 60 seconds. The cleanup function in the `useEffect` return clears the interval when `AdminHome` unmounts, preventing memory leaks and stale updates.

**Action formatting:**
```ts
function formatAction(log: ActivityLogModel): string {
  const verb = log.action
    .replace(log.entityType, "")  // strip entity type from action string
    .replace(/([A-Z])/g, " $1")   // insert space before each capital
    .trim().toLowerCase();
  return `${log.entityType} "${log.entityName}" ${verb}`;
}
```
This converts `"CategoryUpdated"` + `entityType = "Category"` + `entityName = "Electronics"` → `Category "Electronics" updated`.

**Entity icons:** A `Record<string, ReactNode>` maps `"Category"`, `"Product"`, `"Promotion"`, and `"Banner"` to their respective MUI icons. Unknown entity types fall back to `HistoryIcon`.

---

## 21. Shared / Common Components

### `PageHeader` (`components/common/PageHeader/index.tsx`)

A purely presentational component with no state:

```tsx
interface PageHeaderProps {
  title: string;
  actionLabel?: string;   // optional — button not rendered when absent
  onAction?: () => void;  // optional — button not rendered when absent
}

function PageHeader({ title, actionLabel, onAction }: PageHeaderProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>{title}</Typography>
      {actionLabel && onAction && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
```

`actionLabel` and `onAction` are optional — the button is only rendered when both are provided. Used on admin CRUD pages (with button) and on the Analytics read-only page (without button).

### `ConfirmDialog` (`components/common/ConfirmDialog/index.tsx`)

A generic confirmation dialog with no internal state:

```tsx
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```

All behavior is controlled by props. The confirm button is always styled `color="error"` (red) and `variant="contained"`. It is intentionally generic — the same component handles category deletion, product deletion, and promotion deletion.

### `NotFound` (`components/NotFound/index.tsx`)

A static 404 page with a large "404" heading in `primary.light` color and a "Go Home" button linking to `/`. No state, no API calls.

---

## 22. End-to-End Data Flow

### User adds a product to cart

```
User clicks "Add to Cart" button in Shop
  ↓
Shop: onClick={() => addItem(product.id, 1)}
  ↓
useCart() → CartProvider.addItem(productId=5, quantity=1)
  ↓
cartApi.addItem({ productId: 5, quantity: 1 })
  ↓
http.post<CartModel>("/cart/items", { productId: 5, quantity: 1 })
  ↓
axios.post("http://localhost:5000/api/cart/items", { productId: 5, quantity: 1 })
  ↓  [network request]
  ↑  CartModel JSON (with recalculated promotions, discounts, total)
toCart(CartModel) → Cart (frontend type)
  ↑
cartApi.addItem returns Cart
  ↑
CartProvider: await completes → calls loadCart()
  ↓
cartApi.getCart() → http.get<CartModel>("/cart") → toCart() → Cart
  ↓
CartProvider: setCart(freshCart)
  ↓
React re-renders all useCart() consumers:
  → NavBar: badge count updates
  → CartDrawer: items, subtotal, promotions, total all update
```

### Admin creates a product

```
Admin clicks "Add Product"
  ↓
Products: handleAdd() → setEditing(null), setFormOpen(true)
  ↓
ProductFormDialog renders (formOpen && ...) with product=null
  ↓
ProductFormDialog: useEffect → categoriesApi.getAll() → setCategories([...])
  [form renders with empty fields, categories loaded in multi-select]
  ↓
Admin fills in name, price, description, image URL, selects categories
  ↓
Admin clicks "Save" → handleSave()
  → client validation: name.trim() !== "", !isNaN(price), price >= 0
  → setSaving(true) → button shows spinner, disabled
  ↓
productsApi.create({ name, description, price, imageUrl, categoryIds })
  ↓
http.post<ProductModel>("/products", data)
  ↓  [network request]
  ↑  ProductModel JSON
toProduct(ProductModel) → Product
  ↑
productsApi.create returns Product
  ↑
handleSave: onSaved() callback fires
  ↓
Products: setFormOpen(false) → dialog unmounts
Products: loadProducts() → re-fetches full list → setProducts([...])
  ↓
Table re-renders with new product included
```

### Admin deletes a category

```
Admin clicks delete icon on a category row
  ↓
Categories: handleDeleteClick(category) → setDeleting(category), setConfirmOpen(true)
  ↓
ConfirmDialog: open=true, shows "Are you sure you want to delete 'Electronics'?"
  ↓
Admin clicks "Delete"
  ↓
Categories: handleDelete()
  → setConfirmOpen(false)  (dialog closes immediately)
  → await categoriesApi.remove(deleting.id)
  → http.remove<void>("/categories/3")
  ↓  [network request]
  ↑  204 No Content
  ↑
  → loadCategories()  (refetch the list)
  → setCategories([...])  (table re-renders without deleted category)
```

---

## 23. Key Design Decisions

### Client-side filtering, not server-side pagination

The Shop page fetches ALL products in one request and filters them in the browser with `useMemo`. This is fast for small-to-medium catalogues but would not scale to thousands of products. The current architecture would need a move to server-side pagination and filtering (`GET /products?search=x&categoryId=y&page=1`) for larger datasets.

### Server is the single source of truth for cart calculations

The frontend never calculates prices, discounts, or totals. Every cart mutation goes to the server and returns a complete recalculated `Cart` object. This prevents any possibility of frontend discount calculation bugs and means promotion logic only lives in one place (the backend).

### No optimistic UI updates

Cart mutations wait for the server response before updating state (`await api.call() → then loadCart()`). The UI does not speculatively update before the server confirms. This is simpler and correct, but means there is a slight delay between clicking "Add to Cart" and seeing the badge count increment.

### JWT token as the single auth source of truth

The token returned from login/register is stored in `localStorage` and injected into every request by the Axios interceptor. `AuthProvider` validates it against `GET /api/auth/me` on mount so expired tokens are cleared automatically. The role inside the JWT payload is decoded client-side for UI decisions (showing admin vs. user nav), but all admin API endpoints enforce role server-side — the frontend cannot grant itself elevated access.

### Model-to-type mapper pattern

The separation between `api/models/` (backend shapes) and `components/shared/types/` (frontend shapes) with pure mapper functions provides a stable internal API surface. If the backend renames a field, only the model interface and mapper function change — no components need updating.

### Wishlist migrated from localStorage to backend

The wishlist was initially stored in `localStorage` with a per-user key (`wishlist_<userId>`). It has been migrated to a proper backend table (`WishlistItems`) with `GET/POST/DELETE /api/wishlist` endpoints. The migration benefits: wishlist survives clearing browser storage, is shared across devices, and can be deleted when the user's account is deleted (cascade FK). The `toggle` function is now `async` — callers that don't `await` it are fine (fire-and-forget), but components that need the updated state (e.g. Wishlist page's product-detail fetch) can await it.

### `const` objects for enums

`PromotionType` and `PromotionReward` are defined as `as const` plain objects rather than TypeScript `enum`. This produces literal numeric values (`0`, `1`) that serialize correctly through `JSON.stringify` and are completely transparent at runtime. TypeScript `enum` can produce surprising behavior (reverse mappings, string/numeric inconsistencies) that the `const` object pattern avoids.

### Conditional rendering vs `open` prop for dialogs

Form dialogs use `{formOpen && <Dialog ...>}` — they are unmounted on close, which resets all internal state automatically.  
`ConfirmDialog` uses `<ConfirmDialog open={confirmOpen} ...>` — it is always mounted, which is fine because it has no internal state to reset.

This is a conscious consistency — the pattern depends on whether the component has internal state that needs resetting on close.
