# Smart Leads Dashboard

Full-stack mini CRM for managing sales leads with JWT authentication, role-based access control, lead CRUD, filters, pagination, debounced search, CSV export, and a Render-ready deployment.

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS, React Router, TanStack Query, React Hook Form, Zod, Zustand
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod
- Deployment: Render Docker Blueprint

## Project Structure

```text
.
├── backend/          # Express API and MongoDB models
├── frontend/         # React + Vite app
├── docs/             # API, architecture, and Render notes
├── Dockerfile        # Production image for Render
├── render.yaml       # Render Blueprint
└── README.md
```

## Local Setup

Create local `.env` files only on your machine. Do not commit them.

Backend `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads-dashboard
JWT_SECRET=replace-with-a-long-random-secret-of-at-least-32-characters
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminPass123
```

Frontend `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Install and run:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Seed the admin user:

```bash
cd backend
npm run seed:admin
```

## Render Deployment

Push the whole repository to GitHub, then create a Render Blueprint from `render.yaml`.

Required Render environment values:

```env
MONGODB_URI=mongodb+srv://...
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose-a-secure-password
```

Render generates `JWT_SECRET` automatically.

After the first deploy, seed the admin user in Render Shell or as a one-off job:

```bash
npm run seed:admin:prod
```

More details: [docs/render-deploy.md](docs/render-deploy.md).

## Verification

```bash
cd backend
npm run typecheck
npm run build
```

```bash
cd frontend
npm run typecheck
npm run build
```
