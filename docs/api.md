# Smart Leads Dashboard API

Base URL: `/api/v1`

All JSON responses use a consistent envelope:

```json
{
  "success": true,
  "data": {}
}
```

Errors:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Enter a valid email address" }]
}
```

## Auth

### Register Sales User

`POST /auth/register`

Public registration always creates a `sales` user. Passing a `role` field is rejected.

```json
{
  "name": "Rohith",
  "email": "rohith@example.com",
  "password": "Password123"
}
```

### Login

`POST /auth/login`

```json
{
  "email": "admin@example.com",
  "password": "AdminPass123"
}
```

### Current User

`GET /auth/me`

Requires:

```text
Authorization: Bearer <token>
```

## Leads

All lead endpoints require authentication.

### List Leads

`GET /leads?status=qualified&source=instagram&search=rahul&sort=latest&page=1`

Query parameters:

- `status`: `new`, `contacted`, `qualified`, `lost`
- `source`: `website`, `instagram`, `referral`
- `search`: matches name or email
- `sort`: `latest`, `oldest`
- `page`: positive integer

Response includes backend pagination metadata:

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

### Create Lead

`POST /leads`

Admin only.

```json
{
  "name": "Rahul Mehta",
  "email": "rahul@example.com",
  "status": "new",
  "source": "instagram"
}
```

### Get Single Lead

`GET /leads/:id`

Admin and sales users.

### Update Lead

`PATCH /leads/:id`

Admin can update all fields. Sales users can update `status` only.

### Delete Lead

`DELETE /leads/:id`

Admin only.

### Export CSV

`GET /leads/export.csv?status=qualified&source=instagram&search=rahul&sort=latest`

Admin only. Uses the same filtering strategy as the list endpoint.
