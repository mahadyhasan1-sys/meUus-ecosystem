# meUus — Global Human Development Ecosystem

**me → U → us**

meUus is a Human Development, Intelligence & Execution Operating System: one connected ecosystem where any person can understand, learn, reflect, create, build, prove capability, connect to opportunity, and contribute.

- **Core axiom:** `Claim ≤ Evidence`
- **Accessibility principle:** `#AnyOneCan#`
- **Governing question:** `JUSTICE FOR ALL`
- **Core loop:** `Understand → Learn → Reflect → Act`

> Status vocabulary used throughout: **DISCOVERED ≠ DESIGNED ≠ BUILT ≠ TESTED ≠ DEPLOYED ≠ PROVEN**. See [AGENTS.md](./AGENTS.md) for the full constitution.

---

## What is in this repository

The codebase implements the four canonical surfaces and the ten connected layers of the meUus ecosystem.

**Four surfaces**

| Surface | Role | Content here |
| :--- | :--- | :--- |
| `meuus.org` | **UNDERSTAND** | Civic gateway, Nine Pillars, evidence and transparency views |
| `meuussoul.com` | **LEARN** | Knowledge hub, Quran & Seerah journeys, education tracks |
| `meuus.app` | **REFLECT + ACT** | DLAS engine, agents, WorkStation, automations, marketplace |
| `rujbel.org` | **FOUNDER ARCHIVE** | Founder story and preserved work evidence |

**Ten connected layers:** Language · Knowledge · Evidence · Personal Memory · Learning · Creation · Profile/Proof · Opportunity · Value Distribution · AI Ecosystem — governed by Trust, Privacy, Safety, Governance, Continuity, and Justice.

The module map lives in [docs/master-inventory.md](./docs/master-inventory.md); the constitutional charter is [docs/meuus-connected-ecosystem.md](./docs/meuus-connected-ecosystem.md).

---

## Tech stack

| Area | Technology |
| :--- | :--- |
| Frontend | React 19, Vite 6, Tailwind CSS v4, Motion, Lucide, Recharts |
| UI primitives | shadcn-style components on Base UI (`src/components/ui/`), configured by `components.json` |
| Backend | Node.js 20+, Express 4 (`server.ts`) |
| Server bundle | esbuild → `dist/server.cjs` |
| Database | PostgreSQL (Google Cloud SQL) via Drizzle ORM (`src/db/`) |
| Auth & cloud | Firebase Auth / Firestore (`quadratic-anthem-7ds98`), Firebase Admin |
| AI | Google GenAI SDK (`@google/genai`), model router in `server.ts` |
| Offline | IndexedDB / localStorage persistence (`src/lib/offlineStorage.ts`) |

---

## How to run

```bash
npm install
cp .env.example .env     # then fill in your own values
npm run dev
```

- Dev server: `http://localhost:3000` — Express serves the API and mounts Vite middleware in development.
- Production build: `npm run build` (Vite client build + esbuild server bundle).
- Production start: `npm start` (runs `dist/server.cjs` on port 3000).
- Typecheck: `npm run lint` (`tsc --noEmit`).
- Client-only preview: `npm run preview`.

### Environment variables

Only the keys are listed in [.env.example](./.env.example). Never commit real values.

| Key | Purpose |
| :--- | :--- |
| `GEMINI_API_KEY` | Gemini API access for the intelligence layer |
| `APP_URL` | Canonical public URL used for self-referential links and callbacks |
| `SQL_HOST` | Cloud SQL PostgreSQL host |
| `SQL_DB_NAME` | Database name |
| `SQL_USER` / `SQL_PASSWORD` | Application database credentials |
| `SQL_ADMIN_USER` / `SQL_ADMIN_PASSWORD` | Administrative database credentials |

---

## Project structure

`src/` is the single source of truth for application code. The former root-level `components/` and `lib/` folders have been merged into `src/components/` and `src/lib/`, and the `@` path alias now resolves to `src/`.

```
src/
├── App.tsx                  # Root application and routing
├── main.tsx                 # Entry point
├── index.css                # Tailwind v4 theme
├── components/              # Ecosystem modules (51 components)
│   └── ui/                  # Shared UI primitives
├── context/                 # Auth and ecosystem providers
├── db/                      # Drizzle schema, connection, data access
├── hooks/                   # Reusable React hooks
├── lib/                     # Firebase, offline storage, kernel
└── middleware/              # Express auth middleware
```

Full tree: [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

---

## Deployment

### Firebase Hosting (static SPA)

```bash
npm run build
npx firebase-tools deploy --only hosting,firestore:rules
```

`firebase.json` publishes `dist/` for project `quadratic-anthem-7ds98` with SPA rewrites.

> **Scope:** Firebase Hosting serves the built static client only. The Express API in `server.ts` is **not** deployed by Hosting — run it on a Node host (Cloud Run via the included `Dockerfile`, or another container platform) if the API is required in production.
### Vercel

- Import `mahadyhasan1-sys/meUus-ecosystem`.
- Framework preset: **Vite** · Build command: `npm run build` · Output directory: `dist`.
- Custom domains: `meuus.org`, `www.meuus.org`, `meuussoul.com`, `www.meuussoul.com`.

> **Scope:** a Vercel static deployment serves the SPA. The Express API requires a Node/serverless runtime, which is not part of the static build.

Domain cleanup instructions for the previous misconfigured Vercel team: [VERCEL_FIX.md](./VERCEL_FIX.md).

### Container (Cloud Run)

The `Dockerfile` builds the client and server bundle and runs `dist/server.cjs`. The server binds to `PORT` when provided (Cloud Run sets 8080) and falls back to `3000` locally.

---

## Repository rules

- `Claim ≤ Evidence` — no capability, partnership, or outcome claims without evidence.
- No secrets in client code or commits; `.env` stays local.
- Preserve the founder photo served at `/founder-a01.jpeg` and assets in `public/preserved/`.
- Do not delete source or preservation history without explicit justification.

---

## Documentation

| Document | Purpose |
| :--- | :--- |
| [docs/meuus-connected-ecosystem.md](./docs/meuus-connected-ecosystem.md) | Constitutional charter (62 sections) |
| [docs/master-inventory.md](./docs/master-inventory.md) | Module inventory and reality map |
| [docs/meuus-build-state.md](./docs/meuus-build-state.md) | Component status and readiness |
| [docs/decision-log.md](./docs/decision-log.md) | Architectural decision record |
| [docs/deployment-checklist.md](./docs/deployment-checklist.md) | Deployment requirements |
| [docs/meuus-continuation-state.md](./docs/meuus-continuation-state.md) | Recovery checkpoints |
