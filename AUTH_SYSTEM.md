# Authentication System — How It Works

**Feature:** #27 — Real User Authentication  
**Stack:** JWT (HS256) · BCrypt · ASP.NET Core 10 · React + TypeScript

---

## Overview

The system replaces the old role-toggle with real JWT-based authentication. Users register or log in to receive a signed token stored in `localStorage`. Every request to a protected API endpoint carries that token. The backend validates it and derives the user's identity from its claims.

---

## Backend

### New files and changes

| Path | What it does |
|------|-------------|
| `DataAccess/Entities/User.cs` | `Id`, `Email`, `PasswordHash`, `Role`, `CreatedAt`, `DisplayName?` |
| `DataAccess/Entities/CartItem.cs` | Added `UserId` FK → `User` (non-nullable after migration `MakeCartItemUserIdNonNullable`) |
| `DataAccess/Repositories/IUserRepository.cs` | `FindByEmailAsync(email)` |
| `DataAccess/Repositories/UserRepository.cs` | EF Core implementation |
| `DataAccess/Seeders/UserSeeder.cs` | Seeds `admin@shop.com / Admin123!` on first run |
| `BusinessLogic/DTOs/AuthDTOs.cs` | `LoginRequest`, `RegisterRequest`, `AuthResponse`, `UserDto`, `UpdateProfileRequest`, `ChangePasswordRequest` |
| `BusinessLogic/Services/Interfaces/IAuthService.cs` | `Register`, `Login`, `GetCurrentUser`, `UpdateProfile`, `ChangePassword` |
| `BusinessLogic/Services/AuthService.cs` | BCrypt hashing + JWT generation + profile update + password change |
| `Api/Controllers/AuthController.cs` | `POST /register`, `POST /login`, `GET /me`, `PUT /me`, `PUT /me/password` |

### Configuration required

Add these keys to your `appsettings.json` (or user secrets):

```json
{
  "Jwt": {
    "Key": "<random 32+ character secret>",
    "Issuer": "SmartShoppingAssistant",
    "Audience": "SmartShoppingAssistant",
    "ExpiresInDays": 7
  }
}
```

See `appsettings.Example.json` for the full template.

### Middleware pipeline (Program.cs)

```
UseCors → UseAuthentication → UseAuthorization → MapControllers
```

`UseAuthentication` must come **before** `UseAuthorization`; both must come after CORS.

### Token generation

`AuthService.GenerateToken` builds a JWT with three claims:

| Claim | Value |
|-------|-------|
| `NameIdentifier` | `user.Id` (int) |
| `Email` | `user.Email` |
| `Role` | `"user"` or `"admin"` |

The token is signed with `HS256` using the `Jwt:Key` secret and expires after `Jwt:ExpiresInDays` days.

### Endpoint protection

| Endpoint group | Guard |
|---------------|-------|
| `GET /api/products`, `GET /api/categories`, `GET /api/promotions` | Public — no auth needed |
| `POST /api/ai/search` | Public — no auth needed |
| `POST/PUT/DELETE /api/products`, `…categories`, `…promotions` | `[Authorize(Roles = "admin")]` |
| All `/api/cart/*` endpoints | `[Authorize]` (any authenticated user) |
| All `/api/orders/*` endpoints | `[Authorize]` (any authenticated user) |
| `GET /api/auth/me` | `[Authorize]` (any authenticated user) |
| `PUT /api/auth/me` | `[Authorize]` (any authenticated user) |
| `PUT /api/auth/me/password` | `[Authorize]` (any authenticated user) |
| `POST /api/auth/register`, `POST /api/auth/login` | Anonymous |

### Cart user-scoping

`CartItem.UserId` (nullable `int`) links each cart item to its owner.

- `CartItemRepository.GetAllWithProductAndCategoriesAsync(userId)` — `WHERE UserId = @userId`
- `CartItemRepository.DeleteAllForUserAsync(userId)` — bulk delete for a user
- `CartItemController` extracts `userId` from `ClaimTypes.NameIdentifier` on every request

### Migration

Run to apply the new schema:

```bash
cd Backend/SmartShoppingAssistantLigaAc.Api
dotnet ef database update --project ../SmartShoppingAssistantLigaAc.DataAccess
```

The migration (`20260609140053_AddUserAuthAndCartScoping`) creates the `Users` table and adds `UserId` to `CartItems`.

---

## Frontend

### New files and changes

| Path | What it does |
|------|-------------|
| `context/AuthContext/auth-context.ts` | `AuthContextValue` shape (incl. `loading`) + `useAuth()` hook |
| `context/AuthContext/AuthProvider.tsx` | Persists token; restores session via `GET /auth/me`; exposes `loading`; registers global 401 handler |
| `api/clients/AuthApiClient.ts` | `login()`, `register()`, `me()` |
| `api/base/http.ts` | JWT request interceptor; `setUnauthorizedHandler()` for global 401 auto-logout |
| `components/Login/index.tsx` | `/login` page |
| `components/Register/index.tsx` | `/register` page |
| `App.tsx` | `AuthProvider` replaces `RoleProvider`; `ProtectedRoute`, `PublicOnlyRoute`, `AdminRoute` — all loading-aware |
| `components/NavBar/index.tsx` | User avatar / dropdown / sign-out; Sign in + Register buttons when unauthenticated |
| `context/CartContent/CartProvider.tsx` | Reloads cart on login; clears it on logout |

### Auth flow — complete walkthrough for beginners

> **Big picture:** The browser never sends a username and password on every request — that would be slow and risky. Instead, the user proves their identity once (login), and the server hands back a small signed pass called a **JWT token**. The browser saves that pass and attaches it to every subsequent request. The server reads the pass, trusts it (because only the server could have signed it), and knows who the user is without touching the database again.

---

#### Key concepts before we start

**BCrypt — why passwords are never stored as plain text**

When a user registers, the plain-text password is run through BCrypt, which produces a fixed-length hash:

```
"Admin123!"  →  BCrypt.HashPassword  →  "$2a$11$xyz...abc"  (stored in DB)
```

BCrypt is a *one-way* function — you cannot reverse the hash back to the original password. When the user logs in, BCrypt re-hashes the submitted password and compares the result to the stored hash. If they match, the password is correct:

```csharp
BCrypt.Net.BCrypt.Verify("Admin123!", "$2a$11$xyz...abc")  // true
BCrypt.Net.BCrypt.Verify("wrongpass", "$2a$11$xyz...abc")  // false
```

The `$2a$11$` prefix encodes the algorithm version and *cost factor* (11 rounds of hashing). This makes brute-force cracking expensive even if the database is leaked.

---

**JWT — a signed, self-contained identity card**

A JSON Web Token (JWT) is a base64-encoded string with three dot-separated parts:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← Header  (algorithm + type)
.eyJzdWIiOiIxMjM0NTY3ODkwIn0             ← Payload (claims: who you are, role, expiry)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature (proves nobody tampered with it)
```

The **signature** is computed with a secret key known only to the server (`Jwt:Key`). Any modification to the header or payload would produce a different signature — and the server would reject the token. This means the browser cannot fake a token or change its own role.

---

#### The data shapes (DTOs)

`AuthDTOs.cs` defines the objects that flow between the frontend and backend:

```csharp
// What the browser sends when logging in
public record LoginRequest(string Email, string Password);

// What the browser sends when registering
public record RegisterRequest(string Email, string Password);

// What the server sends back on success (login or register)
public record AuthResponse(string Token, string Role, string Email, int UserId);

// What GET /auth/me and PUT /auth/me return
public record UserDto(int Id, string Email, string Role, DateTime CreatedAt, string? DisplayName);

// What PUT /auth/me accepts
public record UpdateProfileRequest(string? DisplayName);

// What PUT /auth/me/password accepts
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
```

`record` types in C# are immutable value objects — a concise way to define data containers with no behaviour.

On the TypeScript side, `UserApiClient.ts` mirrors the profile shape:

```ts
interface UserProfile {
  id: number;
  email: string;
  role: string;
  displayName: string | null;
  createdAt: string;
}
```

`AuthApiClient.ts` still mirrors the auth response for login/register flows:

```ts
interface AuthResponse {
  token: string;
  role: string;
  email: string;
  userId: number;
}
```

---

#### Step 1 — User fills in the form and submits

`components/Login/index.tsx` manages the form state with three `useState` hooks:

```tsx
const [email, setEmail]     = useState("");
const [password, setPassword] = useState("");
const [error, setError]     = useState<string | null>(null);
const [loading, setLoading] = useState(false);
```

Each text field is a *controlled input* — React owns the value, and every keystroke calls the setter:

```tsx
<TextField
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}   // update state on every keystroke
/>
```

When the form is submitted, `handleSubmit` runs:

```tsx
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();   // stop the browser from reloading the page (default form behavior)
  setError(null);       // clear any previous error message
  setLoading(true);     // disable the button so the user can't double-submit
  try {
    const { token, user } = await authApi.login({ email, password });
    login(token, user);  // store the session (explained in Step 5)
    navigate(user.role === "admin" ? "/categories" : "/shop");
  } catch (err) {
    setError(err instanceof Error ? err.message : "Login failed");
  } finally {
    setLoading(false);   // re-enable the button whether it succeeded or failed
  }
}
```

`e.preventDefault()` is essential — without it the browser would submit the form the old-fashioned way (full page reload), and all of our JavaScript would be thrown away.

---

#### Step 2 — The HTTP request leaves the browser

`authApi.login()` in `AuthApiClient.ts` calls the shared Axios instance:

```ts
login: async (data: LoginRequest): Promise<{ token: string; user: AuthUser }> => {
  // http.post sends POST /api/auth/login with body: { email, password }
  const res = await http.post<AuthResponse>("/auth/login", data);

  // The server returns { token, role, email, userId }
  // We reshape it into { token, user } for the caller
  return {
    token: res.token,
    user: { userId: res.userId, email: res.email, role: res.role as "user" | "admin" },
  };
},
```

The `http` wrapper in `api/base/http.ts` is a thin layer over Axios that:
1. Sends JSON with `Content-Type: application/json`.
2. Adds the `Authorization` header via a **request interceptor** (more on this later).
3. Extracts `response.data` so callers never have to unwrap Axios's envelope.

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   // e.g. "http://localhost:5000/api"
  headers: { "Content-Type": "application/json" },
});

export const http = {
  post: async <T>(path: string, body: unknown): Promise<T> => {
    const response = await api.post<T>(path, body);
    return response.data;   // unwrap { data, status, headers, ... } → just data
  },
  // ...
};
```

At this point the network request looks like:

```
POST /api/auth/login  HTTP/1.1
Content-Type: application/json

{ "email": "user@example.com", "password": "secret123" }
```

---

#### Step 3 — The controller receives the request

`AuthController.cs` is the entry point on the backend:

```csharp
[Route("api/auth")]
[ApiController]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await authService.LoginAsync(request);
            return Ok(response);          // 200 OK + JSON body
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);  // 401 + plain-text error
        }
    }
}
```

Key points:
- `[ApiController]` tells ASP.NET to automatically deserialise the JSON body into `LoginRequest`. No manual parsing needed.
- `[FromBody]` binds `{ "email": "...", "password": "..." }` to the `LoginRequest` record.
- The method just delegates to `authService` and maps exceptions to HTTP status codes. It contains no business logic itself — that is the controller's only job.

---

#### Step 4 — Credentials are verified

`AuthService.LoginAsync` does the real work:

```csharp
public async Task<AuthResponse> LoginAsync(LoginRequest request)
{
    // 1. Look up the user by email (case-insensitive in the repository)
    var user = await userRepository.FindByEmailAsync(request.Email)
        ?? throw new UnauthorizedAccessException("Invalid email or password.");
    //         ^^^ if FindByEmail returns null, throw immediately

    // 2. Compare the submitted password against the stored BCrypt hash
    if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        throw new UnauthorizedAccessException("Invalid email or password.");
    //  ^^^ same message for wrong password — attacker can't tell which one failed

    // 3. Both checks passed — generate and return the token
    return new AuthResponse(GenerateToken(user), user.Role, user.Email, user.Id);
}
```

> **Why the same error message for both failures?**
> If the server said "email not found" vs "wrong password", an attacker could probe which emails are registered. Using a single generic message — called *user enumeration protection* — prevents that.

---

#### Step 5 — The JWT is built

`GenerateToken` is a private method called immediately after credentials are verified:

```csharp
private string GenerateToken(User user)
{
    // 1. Turn the secret string from config into a cryptographic key object
    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key is not configured.")));

    // 2. Wrap the key with the signing algorithm (HMAC-SHA256)
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    // 3. Define the claims — the payload of the token
    //    These are the facts the server will be able to read on every future request
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),  // e.g. "42"
        new Claim(ClaimTypes.Email,          user.Email),          // e.g. "user@example.com"
        new Claim(ClaimTypes.Role,           user.Role),           // "user" or "admin"
    };

    // 4. Read the expiry setting (default 7 days if missing or unparseable)
    var expiresDays = int.TryParse(configuration["Jwt:ExpiresInDays"], out var d) ? d : 7;

    // 5. Assemble the token
    var token = new JwtSecurityToken(
        issuer:            configuration["Jwt:Issuer"],    // who created the token
        audience:          configuration["Jwt:Audience"],  // who the token is for
        claims:            claims,
        expires:           DateTime.UtcNow.AddDays(expiresDays),
        signingCredentials: credentials);

    // 6. Serialise to the compact dot-separated string: "xxxxx.yyyyy.zzzzz"
    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

The resulting string looks like this (decoded at [jwt.io](https://jwt.io)):

```json
// Header
{ "alg": "HS256", "typ": "JWT" }

// Payload
{
  "nameid": "42",
  "email":  "user@example.com",
  "role":   "user",
  "iss":    "SmartShoppingAssistant",
  "aud":    "SmartShoppingAssistant",
  "exp":    1754000000
}

// Signature  (cannot be faked without Jwt:Key)
HMACSHA256(base64(header) + "." + base64(payload), secret)
```

The whole token is returned inside the `AuthResponse`:

```json
{
  "token":  "eyJhbGci...",
  "role":   "user",
  "email":  "user@example.com",
  "userId": 42
}
```

---

#### Step 6 — Frontend stores the session

Back in the browser, `authApi.login()` has returned `{ token, user }`. `handleSubmit` calls `login(token, user)` from `AuthContext`:

```tsx
// AuthProvider.tsx
function login(newToken: string, newUser: AuthUser) {
  localStorage.setItem(TOKEN_KEY, newToken);  // persist across page refreshes
  setToken(newToken);                         // update React state
  setUser(newUser);                           // set the current user immediately
}
```

`localStorage` is the browser's key-value store that survives page reloads and browser restarts (unlike `sessionStorage`, which clears when the tab is closed). The key `"auth_token"` holds the JWT string.

Setting `token` state also triggers the `useEffect` in `AuthProvider`:

```tsx
useEffect(() => {
  if (!token) {
    setUser(null);
    return;
  }
  // Verify the token is still valid by asking the server who we are
  authApi.me().then(setUser).catch(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  });
}, [token]);  // ← runs whenever 'token' changes
```

On a fresh login this effect fires immediately after `setToken`, but `setUser(newUser)` already ran synchronously in `login()`, so the UI does not wait for the `me()` round-trip. The effect's `me()` call serves mainly as a self-healing check — if for some reason the token was already invalid the state would be cleaned up.

`isAuthenticated` is a derived value:

```tsx
<AuthContext.Provider value={{
  user,
  token,
  isAuthenticated: !!user,   // true when user is non-null, false otherwise
  login,
  logout
}}>
```

`!!user` coerces `null` to `false` and any `AuthUser` object to `true`. All components that need to know if the user is logged in read this single boolean.

---

#### Step 7 — Cart reacts to the new auth state

`CartProvider` watches `isAuthenticated` with its own `useEffect`:

```tsx
// CartProvider.tsx
const { isAuthenticated } = useAuth();

useEffect(() => {
  if (isAuthenticated) {
    loadCart();   // fetch this user's cart items from /api/cart
  } else {
    setCart(null);  // wipe the cart so a different user doesn't see stale data
  }
}, [isAuthenticated]);  // ← runs whenever auth state changes
```

This is React's dependency array at work — the effect runs once on mount, and again any time `isAuthenticated` changes. The moment `login()` sets `user`, `isAuthenticated` flips to `true`, this effect re-runs, and the cart is loaded for the newly signed-in user.

---

#### Step 8 — Every subsequent request carries the token automatically

`http.ts` registers an Axios **request interceptor** — a function that runs before every request, for every API call in the whole app:

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);  // read the token on every request
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    //                              ^^^^^^ standard HTTP auth scheme for JWTs
  }
  return config;  // pass the (possibly modified) config along
});
```

This means no component ever needs to manually attach a token. A call like `cartApi.getCart()` sends:

```
GET /api/cart  HTTP/1.1
Authorization: Bearer eyJhbGci...
```

On the backend, ASP.NET's `UseAuthentication` middleware validates the token on every request before the controller action runs. It decodes the claims and populates `HttpContext.User`. Controllers then read the user identity directly from that:

```csharp
// CartItemController.cs — how the user ID is extracted from the token
var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
if (!int.TryParse(userIdClaim, out var userId))
    return Unauthorized();
// userId is now the int from the JWT — no database lookup needed
```

The response interceptor handles errors uniformly across the app:

```ts
api.interceptors.response.use(
  (response) => response,   // success: pass through unchanged
  (error) => {
    // Extract the most useful error message from whatever the server returned
    const data = error.response?.data;
    const message =
      typeof data === "string" && data !== ""
        ? data                         // server sent plain text (e.g. "Invalid email or password.")
        : error.message || "Request failed";   // fallback to Axios's own message
    return Promise.reject(new Error(message));  // always reject with an Error object
  },
);
```

---

#### Step 9 — Navigation

After `login()` completes, the Login component redirects based on role:

```tsx
navigate(user.role === "admin" ? "/categories" : "/shop");
```

Regular users go to `/shop`. Admins go directly to `/categories` (the admin management area). The route guards (`ProtectedRoute` and `AdminRoute`) enforce these boundaries even if someone manually types a URL.

---

#### Error handling during login

| Scenario | Backend response | Frontend behaviour |
|----------|-----------------|-------------------|
| Wrong email or password | `401 Unauthorized` + `"Invalid email or password."` | `error` state set; red `Alert` shown above the form |
| Email not found | `401 Unauthorized` + `"Invalid email or password."` | Same — intentionally identical to avoid user enumeration |
| Network failure / server down | No response, Axios times out | `error` state set with `"Network Error"` |
| Server error (5xx) | Error body or status text | Normalised by response interceptor, shown in `Alert` |

The `loading` boolean prevents double-submission. While the request is in-flight:

```tsx
<Button
  type="submit"
  disabled={loading}   // grayed out, not clickable
>
  {loading ? "Signing in…" : "Sign in"}
</Button>
```

`finally { setLoading(false) }` ensures the button is always re-enabled whether the request succeeds or fails.

---

#### Page load / session restoration

When the user refreshes the page or opens a new tab, React state is wiped. `AuthProvider` recovers the session from `localStorage`:

```tsx
// The lazy initialiser runs once before the first render
const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
```

A *lazy initialiser* is a function passed to `useState` instead of a value. React calls it only on the first render, making it ideal for reading from `localStorage` (a synchronous but slightly expensive DOM API). The initial value of `token` is whatever was saved last — or `null` if nothing was saved.

Then the `useEffect` fires:

```tsx
useEffect(() => {
  if (!token) {
    setUser(null);
    return;
  }
  authApi.me().then(setUser).catch(() => {
    // Token in localStorage is expired, tampered, or the server restarted with a new key
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  });
}, [token]);
```

`GET /api/auth/me` on the backend reads the `NameIdentifier` claim from the token and fetches the user from the database:

```csharp
[HttpGet("me")]
[Authorize]   // ASP.NET validates the JWT before this action runs
public async Task<ActionResult<UserDto>> Me()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (!int.TryParse(userIdClaim, out var userId))
        return Unauthorized();

    try
    {
        var user = await authService.GetCurrentUserAsync(userId);
        return Ok(user);
    }
    catch (KeyNotFoundException)
    {
        return NotFound();   // user was deleted from DB after the token was issued
    }
}
```

---

#### Sign out

`logout()` is the mirror image of `login()`:

```tsx
function logout() {
  localStorage.removeItem(TOKEN_KEY);  // delete the token from the browser
  setToken(null);                      // clear React state
  setUser(null);                       // user is now null → isAuthenticated = false
}
```

Setting `user` to `null` immediately causes `isAuthenticated` to become `false`. `CartProvider`'s `useEffect` detects the change and clears cart state. The `NavBar` watches `isAuthenticated` and shows "Sign in / Register" buttons instead of the user avatar.

---

#### Complete flow summary

```
── PAGE LOAD ──────────────────────────────────────────────────────────────────

1. AuthProvider reads token from localStorage (lazy useState)
2. If token exists → GET /api/auth/me (Authorization: Bearer <token>)
     ├─ 200 OK  → user state populated, isAuthenticated = true
     │               └─ CartProvider useEffect → loadCart()
     └─ 401/error → localStorage cleared, user = null, unauthenticated


── LOGIN ───────────────────────────────────────────────────────────────────────

Browser                          Server
──────────────────────────────   ──────────────────────────────────────────────
1. handleSubmit                  
2. authApi.login({ email, pw }) →  POST /api/auth/login
                                   3. AuthController.Login([FromBody] LoginRequest)
                                   4. AuthService.LoginAsync
                                      a. FindByEmailAsync(email) — DB lookup
                                      b. BCrypt.Verify(password, hash)
                                      c. GenerateToken → JwtSecurityToken (HS256)
                                   5. 200 OK { token, role, email, userId } →
6. authApi maps → { token, user }
7. AuthProvider.login(token, user)
   - localStorage["auth_token"] = token
   - setToken(token); setUser(user)
   - isAuthenticated = true
8. CartProvider loads cart
9. navigate("/shop") or "/categories"


── AUTHENTICATED REQUEST ───────────────────────────────────────────────────────

1. Any API call (e.g. cartApi.getCart())
2. Axios request interceptor reads localStorage["auth_token"]
3. Adds header: Authorization: Bearer eyJhbGci...
4. ASP.NET UseAuthentication validates JWT, populates HttpContext.User
5. Controller reads User.FindFirst(ClaimTypes.NameIdentifier) → userId


── SIGN OUT ─────────────────────────────────────────────────────────────────

1. logout() → localStorage.removeItem("auth_token")
2. setUser(null) → isAuthenticated = false
3. CartProvider clears cart state
4. NavBar shows Sign in / Register buttons
5. ProtectedRoute redirects any protected page to /login
```

---

---

## Profile Management (Feature #28)

Three endpoints extend the auth layer so authenticated users can manage their own account:

### `GET /api/auth/me`

Already documented above. Returns `UserDto` including the `DisplayName?` field added in the `AddOrdersAndUserDisplayName` migration.

### `PUT /api/auth/me`

Updates the authenticated user's display name.

```csharp
[HttpPut("me")]
[Authorize]
public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateProfileRequest request)
{
    var userId = /* extract from JWT claim */;
    var updated = await authService.UpdateProfileAsync(userId, request);
    return Ok(updated);
}
```

`AuthService.UpdateProfileAsync` sets `user.DisplayName = request.DisplayName`, calls `UpdateAsync`, and returns a new `UserDto`. Passing `null` clears the display name.

**Request body:**
```json
{ "displayName": "John" }
```

**Response:** `200 OK` with updated `UserDto`.

---

### `PUT /api/auth/me/password`

Changes the authenticated user's password. Requires the current password for verification.

```csharp
[HttpPut("me/password")]
[Authorize]
public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
{
    var userId = /* extract from JWT claim */;
    try {
        await authService.ChangePasswordAsync(userId, request);
        return NoContent();
    } catch (UnauthorizedAccessException ex) {
        return BadRequest(ex.Message);
    }
}
```

`AuthService.ChangePasswordAsync`:
1. Fetches the user by `userId`.
2. Calls `BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash)`.
3. If verification fails → throws `UnauthorizedAccessException("Incorrect current password.")`.
4. If verification succeeds → `user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword)` → save.

**Request body:**
```json
{ "currentPassword": "oldpass", "newPassword": "newpass123" }
```

**Response:** `204 No Content` on success · `400 Bad Request` with error string on wrong current password.

---

### Frontend integration (`UserApiClient.ts`)

```ts
export const userApi = {
  getProfile:     ()                                   => http.get<UserProfile>("/auth/me"),
  updateProfile:  (displayName: string | null)         => http.put<UserProfile>("/auth/me", { displayName }),
  changePassword: (currentPassword, newPassword)       => http.put<void>("/auth/me/password", { currentPassword, newPassword }),
};
```

All three calls attach the JWT automatically via the Axios request interceptor. The `Profile` page at `/profile` (ProtectedRoute) uses all three methods.

---

## Auth Loading State & Route Guard Flicker Prevention

### The problem

On page refresh, `token` is read from `localStorage` synchronously, but `user` is populated asynchronously after `GET /auth/me` resolves. During this gap, `isAuthenticated` is `false` even though the user has a valid session. Route guards that check `isAuthenticated` would incorrectly redirect to `/login`.

### The solution — `loading` state

```ts
// auth-context.ts
export interface AuthContextValue {
  loading: boolean;  // true while /auth/me is in-flight
  ...
}
```

```tsx
// AuthProvider.tsx
const [loading, setLoading] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY));

useEffect(() => {
  if (!token) { setLoading(false); return; }
  authApi.me().then(setUser).catch(...).finally(() => setLoading(false));
}, [token]);
```

`loading` starts as `true` only when a token already exists in storage (there is something to validate). It becomes `false` once `/auth/me` resolves — success or failure. If no token exists, `loading` starts as `false` immediately (no network call).

All three route guards read `loading` and return `null` while it is `true`:

```tsx
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
```

---

## Global 401 Auto-Logout

### The problem

A stored JWT can expire between page loads. Any API call made with an expired token returns `401 Unauthorized`. Without a global handler, each API call would need its own 401 check.

### The solution — `setUnauthorizedHandler`

```ts
// http.ts
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();
    }
    ...
  }
);
```

`AuthProvider` registers a handler on mount:

```tsx
// AuthProvider.tsx
const logoutRef = useRef<() => void>(() => {});
logoutRef.current = logout;

useEffect(() => {
  setUnauthorizedHandler(() => {
    logoutRef.current();
    navigate("/login", { replace: true });
  });
}, [navigate]);
```

`logoutRef` avoids the stale closure problem — even if `logout` is recreated on re-render, `logoutRef.current` always points to the latest version. The result: any API call anywhere in the app that receives a 401 automatically clears auth state and redirects to `/login` without any per-call handling.

---

## Seeded admin account

| Field | Value |
|-------|-------|
| Email | `admin@shop.com` |
| Password | `Admin123!` |
| Role | `admin` |

Created automatically by `UserSeeder` on first startup if the `Users` table is empty.
