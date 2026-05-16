# Smart Leads Dashboard Architecture

## Product Scope

Smart Leads Dashboard is a small CRM for managing sales leads with authentication, role-based permissions, server-side filtering, pagination, and CSV export. The implementation should feel like a real production codebase: small modules, explicit types, validation at the boundary, and predictable API responses.

## Repository Layout

```text
smart-leads-dashboard/
  backend/
    src/
      config/          Environment and database setup
      controllers/     HTTP request/response orchestration
      services/        Business rules and authorization decisions
      repositories/    Mongoose data access
      middleware/      Auth, RBAC, validation, errors
      routes/          Express route definitions
      models/          Mongoose schemas and model types
      validators/      Request schemas
      utils/           Shared helpers
      types/           Express and domain type extensions
  frontend/
    src/
      api/             Axios client and request modules
      components/      Reusable UI building blocks
      pages/           Route-level screens
      hooks/           Shared React hooks
      store/           Zustand stores
      layouts/         Auth and dashboard layouts
      types/           API and domain types
      utils/           Formatting, debounce, query helpers
  docs/
    architecture.md
```

## Backend Architecture

The backend follows a layered Express structure:

- **Routes** define URL shape and middleware order.
- **Validators** parse and validate request input before it reaches controllers.
- **Controllers** translate HTTP into service calls and return consistent responses.
- **Services** own business rules, such as sales users only changing lead status.
- **Repositories** isolate Mongoose queries so filtering and pagination logic is testable.
- **Middleware** handles cross-cutting concerns: auth, RBAC, validation, and centralized errors.

This avoids the common internship-assignment smell of putting database queries, validation, auth checks, and response formatting in one controller file.

## Frontend Architecture

The frontend will use React Router for navigation, TanStack Query for server state, React Hook Form plus Zod for forms, Axios for HTTP, and Zustand for small client-only auth/session state.

Recommended split:

- `api/`: one configured Axios client and small endpoint modules, for example `authApi.ts` and `leadApi.ts`.
- `types/`: API response shapes shared across pages.
- `store/`: current user and token state, persisted carefully.
- `layouts/`: protected dashboard shell and public auth layout.
- `components/`: reusable controls such as `Button`, `Input`, `Select`, `DataTable`, `Pagination`, `EmptyState`, and `ErrorState`.
- `pages/`: `LoginPage`, `RegisterPage`, `DashboardPage`, `LeadDetailsPage`.

The UI should render permissions from the authenticated user's role. Admin-only actions such as delete and CSV export should not appear for sales users, while the backend still enforces those permissions.

## Database Schema

### User

```ts
{
  name: string;
  email: string;       // unique, lowercase
  passwordHash: string;
  role: "admin" | "sales";
  createdAt: Date;
  updatedAt: Date;
}
```

Indexes:

- unique index on `email`

### Lead

```ts
{
  name: string;
  email: string;       // lowercase
  status: "new" | "contacted" | "qualified" | "lost";
  source: "website" | "instagram" | "referral";
  createdAt: Date;
  updatedAt: Date;
}
```

Indexes:

- `{ status: 1, source: 1, createdAt: -1 }` for combined filters and sorting
- `{ name: "text", email: "text" }` is possible, but for a small assignment a safe regex search on escaped user input is simpler and easier to explain.

## Auth Flow

1. User registers with name, email, password, and role.
2. Backend validates input and checks duplicate email.
3. Password is hashed with bcrypt before storage.
4. Login verifies email/password and signs a JWT.
5. Frontend stores the token in a controlled auth store and sends it through the `Authorization: Bearer <token>` header.
6. Protected backend routes use auth middleware to verify the token and attach the user identity to the request.
7. Frontend protected routes redirect unauthenticated users to login.

Tradeoff: an HTTP-only cookie is stronger for browser token storage, but for an internship API/dashboard with explicit JWT requirements, a bearer token keeps the flow transparent. We will keep the token handling centralized, avoid scattering localStorage calls, and never hardcode secrets.

## RBAC Flow

Roles:

- `admin`: create leads, update all lead fields, delete leads, export CSV, full dashboard access.
- `sales`: view leads and update lead status only.

Backend enforcement:

- Route-level middleware protects admin-only endpoints.
- Service-level checks handle nuanced rules, especially update behavior.
- Sales update payloads are restricted to `status`; attempts to update name, email, or source should return `403 Forbidden`.

Frontend enforcement:

- Hide admin-only controls for sales users.
- Keep status update controls available for sales users.
- Treat backend authorization as the source of truth.

## API Contract

Base URL: `/api/v1`

Common success shape:

```json
{
  "success": true,
  "data": {}
}
```

Common error shape:

```json
{
  "success": false,
  "message": "Human readable error",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

### Auth

`POST /auth/register`

Request:

```json
{
  "name": "Ritika Sharma",
  "email": "ritika@example.com",
  "password": "StrongPass123",
  "role": "sales"
}
```

Response `201`:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "mongo-id",
      "name": "Ritika Sharma",
      "email": "ritika@example.com",
      "role": "sales"
    },
    "token": "jwt"
  }
}
```

`POST /auth/login`

Request:

```json
{
  "email": "ritika@example.com",
  "password": "StrongPass123"
}
```

Response `200`: same shape as register.

`GET /auth/me`

Response `200`:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "mongo-id",
      "name": "Ritika Sharma",
      "email": "ritika@example.com",
      "role": "sales"
    }
  }
}
```

### Leads

`GET /leads?status=qualified&source=instagram&search=rahul&sort=latest&page=1`

Response `200`:

```json
{
  "success": true,
  "data": {
    "leads": [],
    "pagination": {
      "total": 0,
      "page": 1,
      "totalPages": 0,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

`GET /leads/:id`

Response `200`:

```json
{
  "success": true,
  "data": {
    "lead": {
      "id": "mongo-id",
      "name": "Rahul Mehta",
      "email": "rahul@example.com",
      "status": "qualified",
      "source": "instagram",
      "createdAt": "2026-05-16T00:00:00.000Z"
    }
  }
}
```

`POST /leads` admin only.

`PATCH /leads/:id` admin can update all fields; sales can update `status` only.

`DELETE /leads/:id` admin only.

`GET /leads/export.csv?status=qualified&source=instagram&search=rahul&sort=latest` admin only.

CSV export should use the same filter object as list leads, so exported data matches the visible filtered dashboard.

## Filtering Strategy

Backend query parameters:

- `status`: one of `new`, `contacted`, `qualified`, `lost`
- `source`: one of `website`, `instagram`, `referral`
- `search`: matches lead name or email
- `sort`: `latest` or `oldest`
- `page`: positive integer, default `1`

The validator converts raw query strings into a typed filter DTO. The repository builds a Mongoose query:

- Add exact match clauses for `status` and `source`.
- Escape `search` before creating a case-insensitive regex.
- Apply `$or` search against `name` and `email`.
- Sort by `createdAt: -1` for latest, `createdAt: 1` for oldest.

## Pagination Strategy

Backend pagination is fixed at 10 leads per page.

For page `n`:

```ts
const limit = 10;
const skip = (page - 1) * limit;
```

The repository runs `find` and `countDocuments` with the same filter. Metadata is derived as:

```ts
totalPages = Math.ceil(total / limit);
hasNext = page < totalPages;
hasPrev = page > 1;
```

## Docker Strategy

Docker Compose will run three services:

- `mongodb`: official Mongo image with a named volume.
- `backend`: Node/Express API, connected to Mongo via internal service name.
- `frontend`: React app, configured with backend API URL from environment.

Development Docker files should preserve hot reload where practical, while README instructions will also support local non-Docker setup.

## Build Order

1. Architecture and API contract.
2. Backend foundation.
3. Authentication.
4. RBAC.
5. Lead CRUD.
6. Filtering, search, and pagination.
7. CSV export.
8. Docker.
9. Frontend foundation.
10. Frontend auth.
11. Dashboard UI.
12. Lead CRUD UI.
13. Filter/search/pagination UI.
14. README, API docs, `.env.example`, and polish.
