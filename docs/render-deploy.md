# Render Deployment

This project is configured for Render as one Docker web service. The backend serves the API at `/api/v1` and the built React frontend from the same Render domain.

## Required setup

1. Push this repository to GitHub or GitLab.
2. Create a MongoDB Atlas database and copy the connection string.
3. In Render, choose **New > Blueprint** and select this repo.
4. When Render asks for environment values, set:

```env
MONGODB_URI=mongodb+srv://...
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose-a-secure-password
```

`JWT_SECRET` is generated automatically by Render.

## After first deploy

Open the service shell or run a one-off job in Render, then seed the admin user:

```bash
npm run seed:admin:prod
```

The public app URL will look like:

```text
https://smart-leads-dashboard.onrender.com
```

The health check endpoint is:

```text
https://smart-leads-dashboard.onrender.com/api/v1/health
```
