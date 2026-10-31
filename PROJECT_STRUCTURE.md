# meUus Ecosystem — Project Structure

Final structure after the `components/` + `lib/` merge. `src/` is the single source of truth; the `@` alias resolves to `src/`.

`node_modules/`, `dist/`, and `.git/` are omitted (dependencies, build output, version control).

```
meUus-ecosystem/
├── .agents/                          # Agent skill definitions
├── .antigravity/                     # Tooling state (ignored: *.pbtxt, tmp/)
├── .vscode/                          # launch.json, settings.json
├── docs/                             # Governance and knowledge documents
│   ├── decision-log.md
│   ├── deployment-checklist.md
│   ├── master-inventory.md
│   ├── meuus-build-state.md
│   ├── meuus-connected-ecosystem.md
│   └── meuus-continuation-state.md
├── public/                           # Static assets served at the site root
│   ├── founder-a01.jpeg              # Preserved founder photo (/founder-a01.jpeg)
│   ├── manifest.json
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── sw.js
│   ├── preserved/                    # 42 archived evidence assets
│   └── videos/                       # 4 demo walkthroughs (meuus-demo-01…04.mp4)
├── scripts/
│   └── verify-ecosystem.mjs
├── src/                              # ← Single source of truth
│   ├── App.tsx                       # Root application, routing, lazy modules
│   ├── main.tsx                      # React entry point
│   ├── index.css                     # Tailwind v4 theme and design tokens
│   ├── constants.ts
│   ├── types.ts
│   ├── components/                   # 51 ecosystem modules
│   │   ├── ui/                       # Shared UI primitives
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── separator.tsx
│   │   │   └── tabs.tsx
│   │   ├── AppShell.tsx              # Shell: sidebar + topbar
│   │   ├── Dashboard.tsx
│   │   ├── UniversalMeYooOS.tsx      # Layer 1 supervisor
│   │   ├── GeminiChatDrawer.tsx
│   │   ├── GeminiIntelligenceSuite.tsx
│   │   ├── AgentCoreProvider.tsx
│   │   ├── DlasEngine.tsx
│   │   ├── SoulProfileManager.tsx
│   │   ├── HumanJourneyKernel.tsx
│   │   ├── WorkStationSuite.tsx
│   │   ├── MeUusStudio.tsx
│   │   ├── SelfBuildingEcosystem.tsx
│   │   ├── ConnectionCanvas3D.tsx     # Canvas 3D layer map
│   │   ├── MarketplaceExchange.tsx
│   │   ├── CareerSkillGraph.tsx
│   │   ├── IdeaLabGate.tsx
│   │   ├── KnowledgeHub.tsx
│   │   ├── EducationSystemHub.tsx
│   │   ├── GoogleClassroomHub.tsx
│   │   ├── QuranSeerahJourneys.tsx
│   │   ├── EvidencePage.tsx
│   │   ├── TransparencyDashboard.tsx
│   │   ├── FounderStory.tsx
│   │   ├── PreservedWorkShowcase.tsx
│   │   ├── Roadmap.tsx
│   │   └── … 25 more surface, safety, accessibility and journey modules
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── EcosystemContext.tsx
│   ├── db/                           # Drizzle ORM + Cloud SQL
│   │   ├── drizzle.config.ts
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── users.ts
│   ├── hooks/
│   │   └── useAgentPermission.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── classroom.ts
│   │   ├── firebase.ts
│   │   ├── firebase-admin.ts
│   │   ├── offlineStorage.ts
│   │   ├── utils.ts                  # cn() helper
│   │   ├── webAudioAmbient.ts
│   │   └── kernel/                   # Ecosystem Algorithm Kernel v1
│   │       ├── index.ts
│   │       ├── kernel.ts
│   │       └── humanJourney.ts
│   └── middleware/
│       └── auth.ts
├── .dockerignore
├── .env.example                      # Keys only — no values
├── .firebaserc                       # Default project: quadratic-anthem-7ds98
├── .gitignore
├── AGENTS.md                         # Constitution and agent directives
├── Dockerfile                        # Cloud Run image (client + server bundle)
├── PROJECT_STRUCTURE.md
├── README.md
├── VERCEL_FIX.md
├── components.json                   # shadcn-style config (@ → src)
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firebase.json                     # Hosting → dist, Firestore rules
├── firestore.rules
├── index.html
├── package.json                      # name: meuus-ecosystem
├── server.ts                         # Express API (31 endpoints)
├── tsconfig.json
└── vite.config.ts
```

## Rules enforced by this structure

1. **One location per kind of file.** React components live only in `src/components/`; utilities live only in `src/lib/`. No root-level duplicates.
2. **`@/` → `src/`.** Both `tsconfig.json` paths and the Vite alias resolve to `src`.
3. **Runtime artifacts are never committed.** `dist/`, `node_modules/`, `.env`, `.vercel`, `.firebase/`, and `.antigravity/*.pbtxt` are ignored.
4. **Documentation is the record.** Governance documents stay in `docs/`; the root holds only entry points and configuration.

## Housekeeping notes

- One lockfile only: `package-lock.json` (npm). The stale `bun.lock` was removed.
- The server binds `process.env.PORT` when set, falling back to `3000` for local development — matching the container's `PORT=8080`.
- Legacy root files kept for continuity: `lighthouse-report.json`, `scan_text_white.cjs`, `VIDEO_SCRIPT.md`.
