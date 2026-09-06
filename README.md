# News Hub

A full-stack news app built with React and Express. Users can browse the latest news by category, view full article details, bookmark favorites, and manage their account via email/password or Google login. Articles are fetched from [NewsAPI.org](https://newsapi.org) and cached in a Postgres database, with an automatic background sync job keeping content fresh.

## Tech Stack

**Frontend**
- React (JSX) + Vite
- Tailwind CSS + shadcn/ui
- React Router
- Zod (client-side form validation)
- Sonner (toast notifications)
- react-icons (Remix Icon set)

**Backend**
- Express + TypeScript
- Prisma ORM + Neon (Serverless Postgres)
- better-auth (email/password + Google OAuth)
- Zod (API response & request validation)
- node-cron (scheduled article sync + cleanup)
- Helmet + CORS (security headers)

**External API**
- [NewsAPI.org](https://newsapi.org) — `/v2/top-headlines`

## Features

- 📰 Browse latest news by category (general, technology, sports, business, health)
- 🔍 Full article detail view with source, publish date, and link to original article
- 🔖 Bookmark / unbookmark articles (requires login)
- 🔐 Register/Login via email & password or Google OAuth
- 🌗 Light/Dark mode with no flash-of-wrong-theme on reload
- 📱 Fully responsive UI with a mobile navigation drawer
- ⏱ Automatic background sync (every 2 hours) + stale article cleanup (daily)
- 🛡 Rate-limited authentication endpoints (brute-force protection)

## Project Structure

`api/` and `web/` are independent Node projects (no root-level `package.json` or npm workspaces) — each has its own dependencies and is deployed separately (backend on Render, frontend on Vercel).

```
news-hub/
├── api/                       # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── routes/            # URL → controller mapping
│   │   ├── controllers/       # request/response handling
│   │   ├── services/          # business logic, DB queries, NewsAPI calls
│   │   ├── middleware/        # auth guard, validation, error handling
│   │   ├── schemas/           # Zod request schemas
│   │   ├── types/             # NewsAPI response types
│   │   ├── lib/               # prisma client, auth config, cron jobs
│   │   └── index.ts           # app entry point (app.listen)
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env.example
│   └── package.json
└── web/                       # Frontend (Vite + React)
    ├── src/
    │   ├── components/        # NewsCard, Navbar, Footer, BookmarkButton...
    │   ├── pages/              # Home, Register, Login, Bookmarks, ArticleDetail
    │   ├── lib/                 # api client, auth client, zod schemas, theme
    ├── index.html
    ├── .env.example
    └── package.json
```

## Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) Postgres database (free tier works)
- A [NewsAPI.org](https://newsapi.org/register) API key (free "Developer" tier)
- A [Google Cloud](https://console.cloud.google.com) OAuth Client ID/Secret (for Google login)

## Environment Variables

### Backend — `api/.env`

```env
PORT=5000
DATABASE_URL=your_database_url                          # Neon pooled connection string
BETTER_AUTH_SECRET=better_auth_api_key                  # random 32-byte hex string
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEWSAPI_ORG_KEY=
NEWSAPI_ORG_BASE_URL=https://newsapi.org/v2
CORS_ORIGIN=http://localhost:5173
```

Generate `BETTER_AUTH_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend — `web/.env`

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Setup

```bash
# 1. Clone
git clone <your-repo-url>
cd news-hub

# 2. Install backend dependencies
cd api
npm install
cp .env.example .env
# fill in the values described above

# 3. Set up the database
npx prisma migrate dev
npx @better-auth/cli generate   # only needed if the auth schema changes

# 4. Run the backend
npm run dev        # http://localhost:5000

# 5. In a separate terminal, install & run the frontend
cd ../web
npm install
cp .env.example .env
# fill in the values described above
npm run dev         # http://localhost:5173
```

### Google OAuth Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Configure the OAuth consent screen (External; add your own email as a test user if the app is unpublished)
3. Create an OAuth Client ID of type **Web application**
4. Add an Authorized redirect URI matching your backend:
   ```
   http://localhost:5000/api/auth/callback/google
   ```
   (add your production backend's equivalent URL here too, once deployed)
5. Copy the generated Client ID and Client Secret into `api/.env`

## Available Scripts

### Backend (`api/`)

| Script | Description |
|---|---|
| `npm run dev` | Starts the dev server with hot reload (`tsx watch`) |
| `npm run build` | Generates the Prisma client, then compiles TypeScript to `dist/` |
| `npm run start` | Runs the compiled production build (`node dist/index.js`) |
| `npm run typecheck` | Type-checks the project without emitting output files |

### Frontend (`web/`)

| Script | Description |
|---|---|
| `npm run dev` | Starts the Vite dev server |
| `npm run build` | Builds a production bundle into `dist/` |
| `npm run preview` | Serves the production build locally, for a final check before deploying |

## Background Jobs

Two `node-cron` jobs run inside the backend process, defined in `api/src/lib/cron.ts` and started from `index.ts` once the server is listening:

| Job | Schedule | Purpose |
|---|---|---|
| **News sync** | Every 2 hours (`0 */2 * * *`) | Loops through each category, calls NewsAPI.org, validates the response with Zod, and upserts the results into the `Article` table. Each category runs in its own `try/catch`, so a single failing category (e.g. a transient NewsAPI.org error) doesn't stop the rest from syncing. A short delay is added between categories to stay within NewsAPI.org's rate limits. |
| **Cleanup** | Daily at 03:00 (`0 3 * * *`) | Deletes articles older than 7 days that have zero bookmarks. Bookmarked articles are never touched by this job, regardless of age. |

## Security Notes

- Passwords are hashed and managed entirely by better-auth — the app never stores plaintext passwords.
- All API responses from NewsAPI.org are validated with Zod before being trusted or stored.
- Bookmark and auth endpoints require a valid session (`requireAuth` middleware) and are protected against brute-force attempts via better-auth's built-in rate limiter.
- `.env` files are git-ignored; only `.env.example` templates are committed.

## Known Limitations

- **NewsAPI.org free tier**: the "Developer" plan restricts `top-headlines` requests to originate from `localhost`. A production deployment will need a paid NewsAPI.org plan, or a swap to an alternative news API.
- **No password reset flow**: better-auth is configured for email/password and Google sign-in only; "forgot password" is not implemented.
- **Single-region database**: Neon's free tier is single-region, so latency depends on how close your backend's deployment region is to the database region.

## Deployment

- The backend must run as a **persistent, long-running process** (not a request-triggered/serverless model), because the `node-cron` background jobs described above rely on an always-on process. Choose a hosting option that keeps a Node process running continuously rather than spinning it up per-request.
- The frontend is a static build (`web/dist/` after `npm run build`) and can be served by any static hosting provider.
- After deploying, update the following to match your production URLs:
  - `CORS_ORIGIN` (backend) → the frontend's deployed URL
  - `BETTER_AUTH_URL` (backend) → the backend's own deployed URL
  - `VITE_API_BASE_URL` (frontend) → the backend's deployed URL
  - The Google OAuth Authorized redirect URI → `{your backend URL}/api/auth/callback/google`

## License

This project was built for learning purposes.