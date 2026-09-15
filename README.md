# RentMate

A full-stack rental and roommate platform for students and young professionals: discover
rentals, find compatible roommates, manage listings, request visits, chat in real time and
moderate everything from an admin dashboard.

> **Status: Milestones 1-4 built; Milestone 3/4 runtime verification pending a database URL.**
> Foundation, frontend, database schema (with migrations and seed) and authentication are all
> written and statically verified. Applying migrations, seeding and exercising login end to end
> needs the Supabase connection strings in `server/.env` (see [Database](#database)). Listings and
> roommates still render from the mock layer in `client/src/data/` until the property API lands.
> See [Roadmap](#roadmap) for what comes next.

---

## Tech stack

| Layer     | Technology                                                                   |
| --------- | ---------------------------------------------------------------------------- |
| Frontend  | React 19, Vite, TypeScript, Tailwind CSS v4, React Router, Axios, Zod        |
| Backend   | Node.js (ESM), Express 5, TypeScript, JWT auth, bcrypt, Zod, Socket.IO, Cloudinary |
| Database  | PostgreSQL (Supabase) + Prisma 7 with the `pg` driver adapter                |
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

**Why the server is ESM:** Prisma 7 ships as an ES module and its client is generated as
TypeScript source into `server/src/generated/`, so the API moved from CommonJS to ESM
(`"type": "module"`, `module`/`moduleResolution: nodenext`). Relative imports therefore carry
explicit `.js` extensions. This is a required consequence of the Prisma 7 upgrade, not a
stylistic preference — Prisma 7 also drops the Rust query engine, which is why the client is
constructed with a `@prisma/adapter-pg` driver adapter and the CLI is configured through
`prisma.config.ts` instead of flags in `package.json`.

## Repository layout

```
rentmate/
├── client/                  # React + Vite + TypeScript SPA
│   ├── public/              # static assets + placeholder images
│   ├── src/
│   │   ├── pages/           # route-level screens (auth/, properties/, dashboard/, owner/, admin/)
│   │   ├── components/
│   │   │   ├── ui/          # Button, Card, Modal, form controls, states, Badge, Skeleton
│   │   │   ├── auth/        # ProtectedRoute (role-aware guard)
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   ├── property/    # PropertyCard, SearchBar, FilterPanel, PropertyGallery
│   │   │   ├── roommate/    # RoommateCard with compatibility breakdown
│   │   │   ├── dashboard/   # ActivityList
│   │   │   └── feedback/    # Toaster
│   │   ├── layouts/         # RootLayout, DashboardLayout, per-role nav config
│   │   ├── hooks/           # useToast, useAuth, useDebouncedValue
│   │   ├── context/         # Toast + Auth providers and their contexts
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
│   │   ├── config/prisma.ts # shared PrismaClient (pg driver adapter)
│   │   ├── controllers/     # thin HTTP layer
│   │   ├── middleware/      # error handling, auth (M4), notFound
│   │   ├── routes/          # `/api` route registration
│   │   ├── services/        # business logic (auth; properties from M6)
│   │   ├── validators/      # Zod request schemas
│   │   ├── types/           # session types + Express request augmentation
│   │   ├── utils/           # ApiError, response envelope
│   │   ├── generated/       # Prisma client output (gitignored)
│   │   ├── app.ts           # Express app factory
│   │   └── server.ts        # HTTP bootstrap + graceful shutdown
│   ├── prisma/
│   │   ├── schema.prisma    # domain schema
│   │   ├── migrations/      # SQL migrations
│   │   └── seed.ts          # development seed
│   ├── prisma.config.ts     # Prisma 7 CLI config
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

## Database

PostgreSQL is hosted on Supabase. Prisma 7 talks to it through the `node-postgres` driver
adapter and needs **two** connection strings:

| Variable       | Used by      | Supabase connection string                  |
| -------------- | ------------ | ------------------------------------------- |
| `DATABASE_URL` | the running API | **Transaction pooler** (port `6543`, `?pgbouncer=true`) |
| `DIRECT_URL`   | Prisma CLI (migrations, seed) | **Direct connection** (port `5432`) |

Migrations cannot run through a transaction pooler, which is why the API and the CLI use
different URLs; `prisma.config.ts` points the CLI at `DIRECT_URL`.

```bash
# 1. Create a project at supabase.com, then copy both strings from
#    Project settings -> Database -> Connection string into server/.env

# 2. Apply the schema and seed demo data
npm run prisma:migrate --workspace server   # prisma migrate dev
npm run db:seed --workspace server          # prisma db seed

# 3. Inspect data in the browser
npm run prisma:studio --workspace server
```

Seeded accounts all use the password `Password123!` (hashed with bcrypt before insertion),
for example `admin@rentmate.dev`, `priya.owner@rentmate.dev`, `aditya.student@rentmate.dev`.

### Schema overview

| Model                    | Purpose                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `User`                   | Accounts with a `STUDENT` / `OWNER` / `ADMIN` role, bcrypt hash |
| `Profile`                | Optional profile details, one row per user                      |
| `Property`               | Listings with rent, deposit, location and moderation status     |
| `PropertyImage`          | Cloudinary URLs + public ids (no image bytes in Postgres)       |
| `Amenity` / `PropertyAmenity` | Normalised amenity catalogue and its join table            |
| `RoommateProfile`        | Budget, locality, lifestyle preferences for matching            |
| `SavedProperty`          | Shortlists, unique per `(user, property)`                       |
| `RoommateRequest`        | Requests between students with a validated status flow          |
| `VisitRequest`           | Visit scheduling between students and owners                    |
| `Conversation` / `ConversationParticipant` / `Message` | Chat threads and history     |
| `Review`                 | Ratings and comments about a listing or a user                  |
| `Report`                 | Moderation reports for properties, users and messages           |

Design notes: UUIDv7 keys (safe to expose, still time-sortable), `Int` rupees instead of floats,
indexes matching the discovery query (`status, city, rent`), cascade deletes for dependent rows,
and `updatedAt` maintenance on every mutable model. Extra integrity that Prisma cannot express
(partial unique indexes for "one active roommate request", a `CHECK` on review ratings) is added
in the migration SQL.

## Environment variables

All configuration is validated at boot by Zod (`server/src/config/env.ts`): the API refuses to
start with an invalid `.env` instead of failing later at runtime.

| Variable                                              | Scope   | Notes                                          |
| ----------------------------------------------------- | ------- | ---------------------------------------------- |
| `NODE_ENV`                                            | server  | `development` \| `test` \| `production`         |
| `PORT`                                                | server  | API port (default `5000`)                       |
| `CLIENT_URL`                                          | server  | Allowed CORS origin                              |
| `SERVER_URL`                                          | server  | Public API URL                                   |
| `DATABASE_URL`                                        | server  | Pooled PostgreSQL connection (required)          |
| `DIRECT_URL`                                          | server  | Direct connection for Prisma migrations          |
| `JWT_SECRET` (≥32 chars), `JWT_EXPIRES_IN`            | server  | Signed session tokens (required)                 |
| `COOKIE_SECURE`, `COOKIE_SAME_SITE`                   | server  | Cookie hardening; use `true`/`none` cross-site    |
| `AUTH_RATE_LIMIT_WINDOW_MS`, `AUTH_RATE_LIMIT_MAX`    | server  | Brute-force limiter for register/login            |
| `CLOUDINARY_CLOUD_NAME`, `_API_KEY`, `_API_SECRET`     | server  | *Milestone 15* — image uploads                   |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`               | server  | API rate limiting                                 |
| `VITE_API_URL`                                        | client  | API base URL (`/api` uses the proxy)              |
| `VITE_API_PROXY_TARGET`                               | client  | Dev-only proxy target for `/api` and `/socket.io` |

`.env` files are gitignored — only `.env.example` files are committed. Never put secrets in
`VITE_*` variables; those values ship to the browser.

## API overview

| Method | Endpoint               | Auth        | Description                                        |
| ------ | ---------------------- | ----------- | -------------------------------------------------- |
| `GET`  | `/api/health`          | —           | Liveness probe: status, env, uptime, database check |
| `POST` | `/api/auth/register`   | —           | Create a student/owner account and start a session  |
| `POST` | `/api/auth/login`      | —           | Sign in with email + password                       |
| `POST` | `/api/auth/logout`     | —           | Clear the session cookie                            |
| `GET`  | `/api/auth/me`         | session     | The signed-in user with their profile summary       |

Authentication details:

- Passwords are hashed with bcrypt (cost 12) and the hash is never selected by any read path.
- The session is a signed JWT (7 days) delivered in an **httpOnly** cookie, so an XSS bug cannot
  read it. `Authorization: Bearer <token>` also works for Postman/Thunder Client.
- `/register` accepts only `STUDENT` or `OWNER`; admin accounts are never self-service.
- Every request re-reads the user from the database, so role changes and suspensions take effect
  immediately instead of waiting for the token to expire.
- Unknown emails and wrong passwords return the same `401 INVALID_CREDENTIALS` response, with a
  dummy bcrypt comparison so response times do not reveal which emails exist.
- Register/login are rate limited separately from the rest of the API.

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

- Passwords are hashed with bcrypt (cost 12) and stored as hashes only.
- Auth via httpOnly cookies with a signed JWT; `COOKIE_SECURE=true` in production.
- Brute-force protection: dedicated rate limits on register/login, plus a generic API limiter.
- Role-based authorization (`STUDENT` / `OWNER` / `ADMIN`) enforced server-side, plus ownership
  checks so users can only mutate their own resources.
- Every external input is validated with Zod at the edge.
- `helmet` security headers, strict CORS allow-list, and IP rate limiting on `/api`.
- Centralised error handling that never exposes stack traces or database internals.
- Secrets stay in `.env` (gitignored); credentials in examples are placeholders only.

## Testing

```bash
npm run verify                       # typecheck + ESLint + Vitest + Prettier
npm run test                         # unit tests only (Vitest, no database required)
npm run build                        # production build of both workspaces
npm run dev                          # then walk the routes in a browser
```

Vitest unit tests live next to the code they cover (`server/src/**/*.test.ts`) and deliberately
avoid the database so they run anywhere:

| File                                | Covers                                                        |
| ----------------------------------- | ------------------------------------------------------------- |
| `utils/password.test.ts`            | bcrypt hashing, salting, verification                          |
| `utils/token.test.ts`               | JWT round-trip, forged/expired tokens, duration parsing        |
| `utils/cookies.test.ts`             | httpOnly/secure/SameSite flags and cookie lifetime             |
| `validators/auth.validator.test.ts` | input normalisation, password rules, admin self-signup blocked  |
| `middleware/auth.middleware.test.ts`| validation, role authorization, error envelope mapping         |
| `middleware/errorHandler.production.test.ts` | no internals leaked in production responses           |

HTTP-level integration tests (register → login → protected route, ownership checks) are added
alongside the milestone that first needs a seeded database. Endpoint behaviour has so far been
probed with `curl`: health and 404/400 envelopes, anonymous and forged-token `401`s, rejected
admin self-signup, per-field validation details, cookie clearing on logout and the 429
brute-force limiter. Postman/Thunder Client collections will be documented here as endpoints
land.

## Roadmap

| #   | Milestone                        | Status |
| --- | -------------------------------- | ------ |
| 1   | Project foundation               | ✅ done |
| 2   | Frontend foundation (UI + routes)| ✅ done |
| 3   | Database setup (Prisma)          | 🚧 schema, migrations and seed written; applying them needs credentials |
| 4   | Authentication                   | 🚧 code + unit tests done; end-to-end login needs the database |
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
