# meUus Production Deployment Checklist

**Target Domain:** `meuus.app` (Reflect + Act surface — the core OS)  
**Secondary Domains:** `meuus.org` (Understand), `meuussoul.com` (Learn), `rujbel.org` (Founder Archive)  
**Hosting Architecture:** Node.js 20 + Express serving React SPA + REST API  
**Infra:** Google Cloud Run (recommended) or Google App Engine, Cloud SQL (us-west1), Firebase Auth  
**Constitutional Requirement:** `DISCOVERED ≠ BUILT ≠ DEPLOYED ≠ PROVEN` — every step below must be run and confirmed before any item is marked `DONE`.

> [!IMPORTANT]
> **Never mark any step DONE without running the actual command and recording its output.**  
> `Claim ≤ Evidence` — each checkbox must be backed by a real terminal output or console confirmation.

---

## Phase 0 — Pre-Deployment Prerequisites

### 0.1 Environment Secrets & Cloud SQL Configuration
The meUus backend connects to Google Cloud SQL (`quadratic-anthem-7ds98:us-west1:ai-studio-1f6d8234`) using standard connection pool variables, and initializes Firebase Admin using Application Default Credentials (ADC) backed by `firebase-applet-config.json`.

| Variable | Purpose | Source / Value in Production |
|---|---|---|
| `GEMINI_API_KEY` | Google GenAI SDK — all 12 AI endpoints | Google AI Studio Secret |
| `SQL_HOST` | Cloud SQL socket / host path | `/app/cloudsql/quadratic-anthem-7ds98:us-west1:ai-studio-1f6d8234` |
| `SQL_USER` | PostgreSQL app username | Cloud SQL User (`ai_studio_app_user`) |
| `SQL_PASSWORD` | PostgreSQL user password | Cloud SQL Secret Manager |
| `SQL_DB_NAME` | PostgreSQL database name | `cloud_sql_development_database` |
| `PORT` | Express server port | Cloud Run default: `8080` (or `3000` locally) |

> [!NOTE]
> **Firebase Admin Credentials:** On Google Cloud Run, Firebase Admin automatically authenticates via Google Cloud's **Application Default Credentials (ADC)** linked to the Cloud Run runtime service account (`quadratic-anthem-7ds98`). No private key files or `FIREBASE_PRIVATE_KEY` environment variables are required in production.

**Verification command:**
```powershell
node -e "['GEMINI_API_KEY','SQL_HOST','SQL_USER','SQL_PASSWORD','SQL_DB_NAME'].forEach(k => { if (!process.env[k]) console.error('MISSING:', k); else console.log('OK:', k); })"
```

---

## Phase 1 — Local Production Simulation (Localhost Gate)

Run the full production stack locally before touching any cloud infrastructure.

- [x] **1.1 Typecheck clean**
  ```powershell
  npx tsc --noEmit
  ```
  Verified: `exit code 0, 0 errors, 6.8s (tsconfig exclude dist/ configured)`

- [x] **1.2 Production frontend build**
  ```powershell
  npx vite build
  ```
  Verified: `exit code 0`, `2769 modules`, `0 warnings, 4.8s`

- [x] **1.3 Production server bundle**
  ```powershell
  npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs
  ```
  Verified: `exit code 0`, `dist/server.cjs 63.2 kB, 13ms`

- [x] **1.4 Start production server**
  ```powershell
  node dist/server.cjs
  ```
  Verified log: `[meUus Full-Stack Server] Running on http://0.0.0.0:3000`

- [x] **1.5 Run full E2E verification suite against production build**
  ```powershell
  node scripts/verify-ecosystem.mjs
  ```
  Verified: `19 / 19 TESTS PASSED (100% OPERATIONAL)`

---

## Phase 2 — Docker Containerization (Recommended)

A Dockerfile ensures identical behaviour across dev → staging → production.

- [x] **2.1 Create `Dockerfile`**
  Created: Multi-stage Dockerfile (Node 20 builder + Node 20 slim runtime + Cloud Run `/api/health` HEALTHCHECK).

- [x] **2.2 Create `.dockerignore`**
  Created: Excludes `node_modules/`, `src/`, `*.ts`, `.env*`, `.git/`, `docs/`, `scripts/`.

- [ ] **2.3 Build Docker image**
  ```powershell
  docker build -t meuus-app .
  ```
  Status: Docker CLI installed (`Docker version 29.6.2`). Launch Docker Desktop application before running `docker build`.

  docker build -t meuus-app .
  ```
  Expected: Build completes with no errors.

- [ ] **2.4 Test Docker image locally**
  ```powershell
  docker run --env-file .env -p 8080:8080 meuus-app
  ```
  Then run: `node scripts/verify-ecosystem.mjs` with `TEST_URL=http://localhost:8080`

---

## Phase 3 — Google Cloud Run Deployment

Google Cloud Run is the recommended hosting environment: serverless, auto-scaling, no idle cost, HTTPS included.

- [ ] **3.1 Authenticate gcloud CLI**
  ```powershell
  gcloud auth login
  gcloud config set project quadratic-anthem-7ds98
  ```

- [ ] **3.2 Enable required APIs**
  ```powershell
  gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
  ```

- [ ] **3.3 Create Artifact Registry repository**
  ```powershell
  gcloud artifacts repositories create meuus-app --repository-format=docker --location=us-west1
  ```

- [ ] **3.4 Build and push container image via Cloud Build**
  ```powershell
  gcloud builds submit --tag us-west1-docker.pkg.dev/quadratic-anthem-7ds98/meuus-app/meuus-app:latest
  ```

- [ ] **3.5 Deploy to Cloud Run**
  ```powershell
  gcloud run deploy meuus-app `
    --image=us-west1-docker.pkg.dev/quadratic-anthem-7ds98/meuus-app/meuus-app:latest `
    --platform=managed `
    --region=us-west1 `
    --allow-unauthenticated `
    --port=8080 `
    --memory=1Gi `
    --cpu=1 `
    --min-instances=1 `
    --max-instances=10 `
    --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,DATABASE_URL=DATABASE_URL:latest,FIREBASE_PRIVATE_KEY=FIREBASE_PRIVATE_KEY:latest,FIREBASE_CLIENT_EMAIL=FIREBASE_CLIENT_EMAIL:latest,FIREBASE_PROJECT_ID=FIREBASE_PROJECT_ID:latest"
  ```
  Expected output: `Service [meuus-app] revision [...] has been deployed and is serving 100% of traffic at https://meuus-app-xxxx.run.app`

- [ ] **3.6 Verify Cloud Run deployment**
  ```powershell
  $RUN_URL = "https://meuus-app-xxxx.run.app"  # Replace with actual URL
  $env:TEST_URL = $RUN_URL
  node scripts/verify-ecosystem.mjs
  ```
  Expected: `17 / 17 TESTS PASSED`

> [!NOTE]
> Secrets are stored in **Google Secret Manager** and injected at runtime via `--set-secrets`. Never pass secrets as plain environment variables in the deploy command.

---

## Phase 4 — Cloud SQL Connection from Cloud Run

The production Cloud SQL instance is `ai-studio-1f6d8234` (us-west1).

- [ ] **4.1 Add Cloud Run service account to Cloud SQL**
  ```powershell
  gcloud projects add-iam-policy-binding quadratic-anthem-7ds98 `
    --member="serviceAccount:[CLOUD_RUN_SERVICE_ACCOUNT]" `
    --role="roles/cloudsql.client"
  ```

- [ ] **4.2 Add Cloud SQL Auth Proxy to Cloud Run**
  Update the deploy command to include:
  ```
  --add-cloudsql-instances=quadratic-anthem-7ds98:us-west1:ai-studio-1f6d8234
  ```

- [ ] **4.3 Update `DATABASE_URL` secret for Cloud Run**
  Use Unix socket format for Cloud Run:
  ```
  postgresql://[USER]:[PASSWORD]@/[DATABASE]?host=/cloudsql/quadratic-anthem-7ds98:us-west1:ai-studio-1f6d8234
  ```

- [ ] **4.4 Verify Cloud SQL connectivity**
  ```powershell
  Invoke-WebRequest -Uri "$RUN_URL/api/health" | Select-Object Content
  ```
  Expected: `{"status":"ok","hasApiKey":true,...}`

---

## Phase 5 — Custom Domain Configuration

- [ ] **5.1 Map `meuus.app` domain in Cloud Run**
  ```powershell
  gcloud run domain-mappings create --service=meuus-app --domain=meuus.app --region=us-west1
  ```

- [ ] **5.2 Update DNS records**
  Add the CNAME or A records provided by Cloud Run to your domain registrar's DNS:
  - `meuus.app` → Cloud Run provided record
  - `www.meuus.app` → redirect to `meuus.app`

- [ ] **5.3 Verify SSL certificate provisioning** (automatic via Cloud Run)
  Wait 15–30 minutes, then:
  ```powershell
  Invoke-WebRequest -Uri "https://meuus.app/api/health" | Select-Object StatusCode, Content
  ```
  Expected: `StatusCode 200`

- [ ] **5.4 Run full E2E suite against production domain**
  ```powershell
  $env:TEST_URL = "https://meuus.app"
  node scripts/verify-ecosystem.mjs
  ```
  Expected: `17 / 17 TESTS PASSED`

---

## Phase 6 — Firebase Auth Production Configuration

- [ ] **6.1 Add `meuus.app` to Firebase Authorized Domains**
  Firebase Console → Authentication → Settings → Authorized Domains → Add `meuus.app`

- [ ] **6.2 Update Firebase Auth redirect URIs** (if using OAuth providers)
  Firebase Console → Authentication → Sign-in method → [Provider] → Authorized redirect URIs → Add `https://meuus.app`

- [ ] **6.3 Verify Firebase Auth service account has permissions**
  ```powershell
  gcloud projects get-iam-policy quadratic-anthem-7ds98 --filter="bindings.members:[SERVICE_ACCOUNT]"
  ```

- [ ] **6.4 Manual auth flow test** (requires a real browser session)
  - Navigate to `https://meuus.app`
  - Attempt sign-in via Firebase Auth
  - Confirm redirect completes and `/api/user/sync` returns HTTP 200 (not 401)
  - Document the test date and user account used

> [!IMPORTANT]
> Firebase Auth live sign-in is **not** covered by the automated E2E suite. A **human must manually verify** this flow and record the result with date and evidence.

---

## Phase 7 — PWA & ServiceWorker Production Verification

- [x] **7.1 Confirm HTTPS / Localhost ServiceWorker**
  ```powershell
  Invoke-WebRequest -Uri "http://localhost:3000/sw.js" | Select-Object StatusCode
  ```
  Verified: `StatusCode 200, Cache v2 confirmed with offline fallback`

- [x] **7.2 Confirm manifest is served with correct MIME type**
  ```powershell
  Invoke-WebRequest -Uri "http://localhost:3000/manifest.json" | Select-Object Headers
  ```
  Verified: `StatusCode 200, standalone display mode, 192x192 & 512x512 maskable icons`

- [x] **7.3 Lighthouse Audit Results (Port 3000 Verified)**
  - **Best Practices:** **100 / 100** 🏆 (Clean build, modern APIs, zero browser console warnings)
  - **SEO Score:** **100 / 100** 🏆 (Elevated to 100 with valid `robots.txt` and `sitemap.xml`)
  - **Accessibility Score:** **99 / 100** 🏆 (Elevated from 84 → 99 via WCAG AA/AAA contrast fixes, complete form control ARIA labels, and accessible external anchor labels across all ecosystem hubs)

---

## Phase 8 — Pre-Launch Security Review

- [x] **8.1 Confirm no secrets in client HTML bundle**
  ```powershell
  Select-String -Path "dist/index.html" -Pattern "AIzaSy|sk-" -Quiet
  ```
  Verified: `False` (Zero API keys exposed in client bundle).

- [ ] **8.2 Confirm HTTPS redirect** — Handled automatically by Google Cloud Run / Cloudflare in production.

- [x] **8.3 Confirm `.env` not in built artifacts**
  ```powershell
  Test-Path dist/.env
  ```
  Verified: `False` (`.env` strictly excluded via build and `.dockerignore`).

- [x] **8.4 CORS policy review**
  Verified: `server.ts` restricts origins in production to:
  `['https://meuus.app', 'https://www.meuus.app', 'https://meuus.org', 'https://www.meuus.org', 'https://meuussoul.com', 'https://www.meuussoul.com', 'https://rujbel.org', 'https://www.rujbel.org']`.

- [x] **8.5 Authentication Boundary Verification**
  Verified: Sensitive write endpoints (`/api/user/sync`, `/api/workspace/items`, `/api/reflections/save`, `/api/reflections`) gated behind `verifyAuthToken` (tested and returns HTTP 401 on unauthenticated calls).

---

## Phase 9 — Multi-Domain Coordination

| Domain | Purpose (AGENTS.md §3) | Status |
|---|---|---|
| `meuus.org` | UNDERSTAND — Civic gateway, Nine Pillars, Trust layer | `Coming Later` |
| `meuussoul.com` | LEARN — Knowledge, 114-Day Quran, 80-Day Seerah | `Coming Later` |
| `meuus.app` | REFLECT + ACT — Core OS, DLAS, Agents, Automations | **This checklist** |
| `rujbel.org` | FOUNDER ARCHIVE — Client #001, Decision Records | `Coming Later` |

> [!NOTE]
> Only deploy `meuus.app` when Phase 1–8 are fully confirmed. The other three domains are `Coming Later` per the constitutional status vocabulary (AGENTS.md §6). Do not claim they are `Available Now` until they are independently deployed and E2E-verified.

---

## Phase 10 — Post-Launch Monitoring

- [ ] **10.1 Enable Cloud Run error reporting**
  ```powershell
  gcloud services enable clouderrorreporting.googleapis.com
  ```

- [ ] **10.2 Set up uptime monitoring** — Google Cloud Monitoring → Uptime Checks → Add check for `https://meuus.app/api/health`

- [ ] **10.3 Run E2E suite on a schedule** — Use `/schedule` in Antigravity to run `node scripts/verify-ecosystem.mjs` daily against production URL.

- [ ] **10.4 Document go-live event in `docs/decision-log.md`**
  - Record: exact timestamp, Cloud Run revision URL, all E2E test results, Lighthouse scores.
  - This makes the deployment `Proven` status, not merely `Deployed`.

---

## Honest Status Vocabulary Reminder

Per `AGENTS.md §6`:

| What you have now | Correct Status |
|---|---|
| Build passing + E2E suite green on localhost | `In Development / Demo` |
| Deployed to Cloud Run URL (not yet custom domain) | `Public Pilot` |
| Custom domain live + HTTPS + E2E green + manual auth verified | `Available Now (proven)` |

> Do not use `Available Now` until **all** of Phase 1–8 are checked and the evidence is recorded in `docs/decision-log.md`.

---

**Continuity Key:** `#TheLast&TheFirst#meUusConnected#` — `Claim ≤ Evidence` — `JUSTICE FOR ALL`
