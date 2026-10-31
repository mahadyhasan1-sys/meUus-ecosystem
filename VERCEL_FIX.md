# Vercel Domain Fix — meUus Ecosystem

Recorded issue with the legacy Vercel team and the steps to resolve it. **Nothing in this guide has been executed by an agent** — domain and project changes are performed in the Vercel dashboard and at the DNS registrar, by the founder.

---

## 1. The problem

The old Vercel team `mdmahadyhasanruju-5639` contains **two projects** that collectively hold **four production domains**:

| Vercel project | Domains attached | Linked repository |
| :--- | :--- | :--- |
| `meuus-ecosystem-app` | `meuussoul.com`, `www.meuussoul.com` | old experimental repo |
| `us` | `meuus.org`, `www.meuus.org` | old experimental repo |

Because both projects point at **old experimental GitHub repositories**, the live domains serve stale or incorrect builds instead of the current production code in `mahadyhasan1-sys/meUus-ecosystem`.

The repository itself is now correct: branch `main`, primary identity `mahadyhasan1@gmail.com`. The split is purely on the Vercel side — two projects, two old repo links, four domains.

---

## 2. Fix — one project, four domains (recommended)

### Step 1 — Verify before deleting

In the Vercel dashboard, open **Team `mdmahadyhasanruju-5639` → Projects** and confirm:

- which project owns each of the four domains (Project → Settings → Domains);
- the Git repository each project is connected to;
- any environment variables or settings worth carrying over (`GEMINI_API_KEY`, `APP_URL`, etc.).

Export anything you need first. Deleting a project releases its domains and cannot be undone from the dashboard.

### Step 2 — Delete the two old projects

Delete **`meuus-ecosystem-app`** and **`us`**.

Both are linked to obsolete repositories. Removing them releases all four domains so they can be attached to the correct project.

> This is a destructive step. Confirm the repository links are indeed the old experiments before proceeding.

### Step 3 — Create one new project

1. **Add New → Project → Import Git Repository**.
2. Select **`mahadyhasan1-sys/meUus-ecosystem`**, branch `main`.
3. Configure the build:

   | Setting | Value |
   | :--- | :--- |
   | Framework preset | Vite |
   | Build command | `npm run build` |
   | Output directory | `dist` |
   | Install command | `npm install` |

4. Add environment variables from `.env.example` (values from your own secrets store).
5. Deploy.

### Step 4 — Attach all four domains to the new project

In the new project: **Settings → Domains → Add**, and add:

- `meuus.org`
- `www.meuus.org`
- `meuussoul.com`
- `www.meuussoul.com`

Vercel will direct each domain to this single project, so every path resolves to the same current build.

### Step 5 — DNS records

At the registrar for each domain, set:

| Record | Name | Value |
| :--- | :--- | :--- |
| `A` | `@` (apex) | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Then:

- **Remove conflicting records** left over from earlier hosting — old `A`/`AAAA`/`CNAME` values pointing at Firebase Hosting or other providers. A stale apex `A` record is the most common reason a domain keeps serving an old site.
- **Keep** `MX` and `TXT` records (email, SPF, domain verification) unless you intentionally change mail.
- Add a `TXT` verification record only if the Vercel dashboard explicitly asks for one.

### Step 6 — Verify

```bash
nslookup meuus.org
nslookup www.meuus.org
nslookup meuussoul.com
nslookup www.meuussoul.com
```

Every domain should resolve to Vercel, and all four should serve the same current build. DNS propagation can take minutes to a few hours depending on the previous TTL.

---

## 3. Alternative — keep Firebase deployment

If you prefer to consolidate on Firebase instead of Vercel:

1. Build and deploy from this repository:

   ```bash
   npm run build
   npx firebase-tools deploy --only hosting,firestore:rules --project quadratic-anthem-7ds98
   ```

2. Remove the four domains from Vercel (delete the two old projects as above) so they stop competing for DNS.
3. In **Firebase console → Hosting → Add custom domain**, connect `meuus.org`, `www.meuus.org`, `meuussoul.com`, and `www.meuussoul.com`. The wizard supplies the exact `A` / `CNAME` values to create at your registrar — use those, not cached values from another guide.
4. Verify with `nslookup` as above.

---

## 4. Important scope note

Both Vercel and Firebase Hosting serve **static files only**. This repository's API lives in `server.ts` (Express, 31 endpoints) and is bundled to `dist/server.cjs`. A static Vercel or Firebase deployment serves the React application; it does **not** run the Express API.

If the API is needed in production, host the container (`Dockerfile`) on Cloud Run or an equivalent Node runtime and point the client's API calls at it — or keep the API on the existing Cloud Run service.

> The server binds `process.env.PORT` when set (Cloud Run provides 8080) and falls back to `3000` locally, so the container port and the app port now agree.

---

## 5. Checklist

- [ ] Old project `meuus-ecosystem-app` deleted
- [ ] Old project `us` deleted
- [ ] New project imports `mahadyhasan1-sys/meUus-ecosystem` (`main`)
- [ ] Build: `npm run build`, output `dist`
- [ ] All four domains attached to the new project
- [ ] Apex `A` → `76.76.21.21`; `www` `CNAME` → `cname.vercel-dns.com`
- [ ] Conflicting legacy DNS records removed; `MX`/`TXT` preserved
- [ ] All four domains serve the same current build
