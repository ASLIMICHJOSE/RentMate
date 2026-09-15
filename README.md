# RentMate

A full-stack rental and roommate platform for students and young professionals: discover
rentals, find compatible roommates, manage listings, request visits, chat in real time and
moderate everything from an admin dashboard.

> **Status: Milestone 2 of 18 complete — frontend foundation.**
> The API runs with a health endpoint, and the client ships a full UI foundation: routed pages,
> a reusable component library, forms with Zod validation, toast notifications and
> loading/empty/error states. Listing and roommate data is still mock data — the database lands
> in Milestone 3. See [Roadmap](#roadmap) for what comes next.

---

## Tech stack

| Layer     | Technology                                                                   |
| --------- | ---------------------------------------------------------------------------- |
| Frontend  | React 19, Vite, TypeScript, Tailwind CSS v4, React Router, Axios, Zod        |
| Backend   | Node.js, Express 5, TypeScript, JWT auth, bcrypt, Zod, Socket.IO, Cloudinary |
| Database  | PostgreSQL + Prisma ORM                                                      |
| Tooling   | ESLint (flat config), Prettier, Git, npm workspaces                          |
| Deployment| Client → Vercel, Server → Render/Railway, DB → hosted PostgreSQL, Images → Cloudinary |

## Architecture

```
                    React + Vite (client/)
                            │  HTTP/HTTPS (same-origin /api)
                            ▼
                    Express REST API (server/)
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   PostgreSQL          Cloudinary          Socket.IO
    (Prisma)            (images)             (chat)
```

Requests flow one way only: **route → middleware → controller → service → Prisma → PostgreSQL**.
The frontend never touches the database directly, and every sensitive operation is authorized
on the server (the client is never trusted).

## Repository layout

```
rentmate/
├── client/                  # React + Vite + TypeScript SPA
│   ├── public/              # static assets + placeholder images
│   ├── src/
│   │   ├── pages/           # route-level screens (auth/, properties/, dashboard/, owner/, admin/)
│   │   ├── components/
│   │   │   ├── ui/          # Button, Card, Modal, form controls, states, Badge, Skeleton
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   ├── property/    # PropertyCard, SearchBar, FilterPanel, PropertyGallery
│   │   │   ├── roommate/    # RoommateCard with compatibility breakdown
│   │   │   ├── dashboard/   # ActivityList
│   │   │   └── feedback/    # Toaster
│   │   ├── layouts/         # RootLayout, DashboardLayout, per-role nav config
│   │   ├── hooks/           # useToast, useDebouncedValue
│   │   ├── context/         # ToastProvider + context
│   │   ├── data/            # MOCK data + mock API layer (replaced in Milestones 3-7)
│   │   ├── services/        # API layer (single Axios instance)
│   │   ├── types/           # shared client types
│   │   ├── utils/           # formatting, label maps, classnames
│   │   ├── App.tsx          # lazy-loaded route table
│   │   └── main.tsx
│   ├── .env.example
│   └── vite.config.ts
├── server/                  # Express + TypeScript REST API
│   ├── src/
│   │   ├── config/env.ts    # validated, typed environment config
│   │   ├── controllers/     # thin HTTP layer
│   │   ├── middleware/      # error handling, auth (M4), notFound
│   │   ├── routes/          # `/api` route registration
│   │   ├── services/        # (M3+) business logic
│   │   ├── validators/      # (M3+) Zod schemas
│   │   ├── types/           # (M3+) shared server types
│   │   ├── utils/           # ApiError, response envelope
│   │   ├── app.ts           # Express app factory
│   │   └── server.ts        # HTTP bootstrap + graceful shutdown
│   ├── prisma/              # (Milestone 3) schema + migrations
│   └── .env.example
├── .editorconfig
├── .prettierrc.json
├── package.json             # npm workspaces + root scripts
└── README.md
```

## Getting started

**Prerequisites:** Node.js ≥ 20 (developed on Node 26) and npm ≥ 10.

```bash
# 1. Install every workspace's dependencies
npm install

# 2. Create your local env files
cp server/.env.example server/.env     # Windows: copy server\.env.example server\.env
cp client/.env.example client/.env

# 3. Run the API (http://localhost:5000) and the client (http://localhost:5173) together
npm run dev
```

Open <http://localhost:5173>. The landing page calls `GET /api/health` through the Vite dev
proxy and reports whether the API is reachable.

### Root scripts

| Script                   | Purpose                                                  |
| ------------------------ | -------------------------------------------------------- |
| `npm run dev`            | Run API + client together with live reload               |
| `npm run dev:server`     | API only (`tsx watch`)                                   |
| `npm run dev:client`     | Client only (Vite)                                       |
| `npm run build`          | Type-check and build both workspaces                     |
| `npm start`              | Run the compiled API (`server/dist/server.js`)           |
| `npm run typecheck`      | TypeScript checks in every workspace                     |
| `npm run lint`           | ESLint in every workspace                                |
| `npm run format`         | Prettier write across the repo                           |
| `npm run verify`         | typecheck + lint + Prettier check (run before committing)|

## Frontend structure

Routes are code-split with `React.lazy` and rendered inside `RootLayout` (navbar, footer, skip
link) or `DashboardLayout` (per-role sidebar):

| Route                      | Page                        | State                              |
| -------------------------- | --------------------------- | ---------------------------------- |
| `/`                        | Home                        | done                               |
| `/login`, `/register`      | Auth forms                  | validated; submits in Milestone 4  |
| `/properties`              | Property discovery          | filters mock data; API in M7       |
| `/properties/:id`          | Property details            | gallery, facts, owner card         |
| `/roommates`               | Roommate discovery          | scores are sample values (M11)     |
| `/dashboard`               | Student dashboard           | sample metrics (M13)               |
| `/saved`, `/requests`, `/messages` | Student sub-pages   | empty states until M9, M12-M14     |
| `/profile`                 | Profile + edit form         | persists in Milestone 5            |
| `/owner`                   | Owner dashboard             | listings table, CRUD in M6         |
| `/admin`                   | Admin dashboard             | modules land in M17-M18            |
| `*`                        | Not found                   | done                               |

UI conventions: one Axios instance in `services/http.ts` (never `fetch` in components), toasts
via `useToast()`, forms through React Hook Form + Zod, and every async view has loading, empty
and error states. Destinations that are not built yet render **disabled** with the milestone that
delivers them rather than linking to a dead route. All mock data lives in `src/data/`: pages
either call the async mock API layer (`data/mockApi.ts`, replaced by `services/` in Milestone 7)
or read a documented fixture for a dashboard table. Nothing else in the app imports fixtures.

## Environment variables

All configuration is validated at boot by Zod (`server/src/config/env.ts`): the API refuses to
start with an invalid `.env` instead of failing later at runtime.

| Variable                                              | Scope   | Notes                                          |
| ----------------------------------------------------- | ------- | ---------------------------------------------- |
| `NODE_ENV`                                            | server  | `development` \| `test` \| `production`         |
| `PORT`                                                | server  | API port (default `5000`)                       |
| `CLIENT_URL`                                          | server  | Allowed CORS origin                              |
| `SERVER_URL`                                          | server  | Public API URL                                   |
| `DATABASE_URL`                                        | server  | *Milestone 3* — PostgreSQL connection string     |
| `JWT_SECRET` (≥32 chars), `JWT_EXPIRES_IN`            | server  | *Milestone 4* — auth tokens                      |
| `COOKIE_SECURE`                                       | server  | `true` in production (HTTPS-only cookie)          |
| `CLOUDINARY_CLOUD_NAME`, `_API_KEY`, `_API_SECRET`     | server  | *Milestone 15* — image uploads                   |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`               | server  | API rate limiting                                 |
| `VITE_API_URL`                                        | client  | API base URL (`/api` uses the proxy)              |
| `VITE_API_PROXY_TARGET`                               | client  | Dev-only proxy target for `/api` and `/socket.io` |

`.env` files are gitignored — only `.env.example` files are committed. Never put secrets in
`VITE_*` variables; those values ship to the browser.

## API overview

| Method | Endpoint      | Auth | Description                                    |
| ------ | ------------- | ---- | ---------------------------------------------- |
| `GET`  | `/api/health` | —    | Liveness probe: status, env, uptime, timestamp |

Responses use one envelope everywhere:

```jsonc
// success
{ "success": true, "data": { } }

// failure
{ "success": false, "error": { "code": "PROPERTY_NOT_FOUND", "message": "Property not found" } }
```

Unmatched routes return `404 ROUTE_NOT_FOUND`; malformed JSON returns `400 INVALID_JSON`; any
unexpected error returns `500 INTERNAL_ERROR` without leaking stack traces in production.

## Security

Implemented in Milestone 1 and kept active throughout development:

- Passwords will be hashed with bcrypt and stored as hashes only (Milestone 4).
- Auth via httpOnly cookies; `COOKIE_SECURE=true` in production.
- Role-based authorization (`STUDENT` / `OWNER` / `ADMIN`) enforced server-side, plus ownership
  checks so users can only mutate their own resources.
- Every external input is validated with Zod at the edge.
- `helmet` security headers, strict CORS allow-list, and IP rate limiting on `/api`.
- Centralised error handling that never exposes stack traces or database internals.
- Secrets stay in `.env` (gitignored); credentials in examples are placeholders only.

## Testing

Automated tests arrive with the features they cover (Milestone 4 onward) so each milestone is
verified before the next one starts. Until then each milestone is checked with:

```bash
npm run verify                       # typecheck + ESLint + Prettier
npm run build                        # production build of both workspaces
npm run dev                          # then walk the routes in a browser
```

For Milestone 1/2 the API was probed directly (`GET /api/health`, a 404 route and malformed
JSON) and every client page module was requested through the Vite dev server to confirm it
transforms without errors. Postman/Thunder Client collections will be documented here as
endpoints land.

## Roadmap

| #   | Milestone                        | Status |
| --- | -------------------------------- | ------ |
| 1   | Project foundation               | ✅ done |
| 2   | Frontend foundation (UI + routes)| ✅ done |
| 3   | Database setup (Prisma)          | ⏳ next |
| 4   | Authentication                   | ☐      |
| 5   | Profile management               | ☐      |
| 6   | Property CRUD                    | ☐      |
| 7   | Search & filtering               | ☐      |
| 8   | Property details                 | ☐      |
| 9   | Saved properties                 | ☐      |
| 10  | Roommate profiles                | ☐      |
| 11  | Roommate matching                | ☐      |
| 12  | Roommate requests                | ☐      |
| 13  | Visit requests                   | ☐      |
| 14  | Real-time messaging              | ☐      |
| 15  | Image upload (Cloudinary)        | ☐      |
| 16  | Reviews                          | ☐      |
| 17  | Reports & moderation             | ☐      |
| 18  | Admin dashboard                  | ☐      |

Then: security review, automated testing pass, and deployment (client → Vercel, API →
Render/Railway, database → managed PostgreSQL).

## Deployment

| Component | Target                        | Notes                                                            |
| --------- | ----------------------------- | ---------------------------------------------------------------- |
| Client    | Vercel                        | Build `npm run build:client`, output `client/dist`               |
| API       | Render or Railway             | Build `npm run build:server`, start `npm start`                  |
| Database  | Managed PostgreSQL            | Set `DATABASE_URL`, run `prisma migrate deploy`                  |
| Images    | Cloudinary                    | Set the three `CLOUDINARY_*` variables                           |

Set `NODE_ENV=production`, `COOKIE_SECURE=true` and real secrets in the hosting dashboard —
never in the repository.
