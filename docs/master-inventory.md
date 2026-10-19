# meUus Ecosystem Master Inventory & Reality Map
**Generated**: October 2026  
**Ecosystem**: meUus — Human Development, Intelligence & Execution OS  
**Founder**: Md. Mahady Hasan (Rujbel / Ruju)  
**Core Axiom**: `Claim ≤ Evidence` · `Consistent, Honest Action Over Perfection`

---

## 1. Executive Summary & Verification State

- **Total Cataloged Files**: 115 tracked source, documentation, and media assets
- **Total Components**: 51 interactive React 19 UI modules in `src/components/`
- **Total Backend Endpoints**: 31 Express API routes in `server.ts`
- **Preserved Archive Assets**: 42 historical screenshots, founder records, and MP4 walkthroughs in `public/preserved/` and `public/videos/`
- **Database & State**: Drizzle ORM (`src/db/`) connected to Google Cloud SQL (`quadratic-anthem-7ds98` / `cloud_sql_development_database`) + offline-first IndexedDB/localStorage fallback in `src/lib/offlineStorage.ts`.

---

## 2. The Four Canonical Surfaces

| Surface | Purpose | Implementation Status | Key Components / Routes |
| :--- | :--- | :--- | :--- |
| **`meuus.org`** | **UNDERSTAND** — Civic Gateway, Nine Pillars, Trust & Constitution | **VERIFIED (Active)** | `Hero.tsx`, `PillarsGrid.tsx`, `EvidencePage.tsx`, `AboutPage.tsx`, `TransparencyDashboard.tsx` |
| **`meuussoul.com`** | **LEARN** — Comprehensive knowledge, 114-Day Quran, 80-Day Seerah, Education tracks | **VERIFIED (Active)** | `KnowledgeHub.tsx`, `QuranSeerahJourneys.tsx`, `EducationSystemHub.tsx`, `SoulReflectionPacer.tsx` |
| **`meuus.app`** | **REFLECT + ACT** — Operating OS, DLAS, Agent Registry, WorkStation, Automations, Marketplace | **VERIFIED (Active)** | `UniversalMeYooOS.tsx`, `DlasEngine.tsx`, `WorkStationSuite.tsx`, `MarketplaceExchange.tsx`, `CareerSkillGraph.tsx`, `Dashboard.tsx` |
| **`rujbel.org`** | **FOUNDER LIVING ARCHIVE** — Client #001 architectural decisions, experiments, evidence | **VERIFIED (Active)** | `FounderStory.tsx`, `PreservedWorkShowcase.tsx`, `public/founder-a01.jpeg`, `public/preserved/` |

---

## 3. Directory Map & Traceability

### 3.1 Documentation (`docs/`)
- `docs/decision-log.md`: Chronological log of ecosystem design and architectural choices.
- `docs/deployment-checklist.md`: Production deployment requirements and environment audits.
- `docs/meuus-build-state.md`: Component status inventory and technical readiness matrix.
- `docs/meuus-connected-ecosystem.md`: 62-section Master Constitutional Charter.
- `docs/meuus-continuation-state.md`: Recovery checkpoints and continuation instructions.

### 3.2 Core UI Components (`src/components/` — 51 files)
- **Central Navigation & Shell**: `AppShell.tsx`, `PageHeader.tsx`, `Navbar.tsx`, `Footer.tsx`
- **Supervisor & Central Intelligence**: `UniversalMeYooOS.tsx`, `GeminiChatDrawer.tsx`, `GeminiIntelligenceSuite.tsx`, `AgentCoreProvider.tsx`
- **Personal Development & DLAS**: `DlasEngine.tsx`, `SoulProfileManager.tsx`, `AIProfileCreator.tsx`, `WellnessCheck.tsx`, `HumanJourneyKernel.tsx`
- **Creation & Execution Engine**: `WorkStationSuite.tsx`, `MeUusStudio.tsx`, `SelfBuildingEcosystem.tsx`, `ConnectionCanvas3D.tsx`
- **Economic & Opportunity**: `MarketplaceExchange.tsx`, `CareerSkillGraph.tsx`, `IdeaLabGate.tsx`
- **Knowledge & Education**: `KnowledgeHub.tsx`, `EducationSystemHub.tsx`, `GoogleClassroomHub.tsx`, `QuranSeerahJourneys.tsx`
- **Preserved Archive & Truth**: `FounderStory.tsx`, `PreservedWorkShowcase.tsx`, `EvidencePage.tsx`, `Roadmap.tsx`, `TransparencyDashboard.tsx`

### 3.3 Backend & Services
- `server.ts`: Single consolidated production server running 31 API endpoints (Google GenAI router, Cloud SQL user sync, Google Workspace integrations, wellness insights).
- `src/db/`:
  - `schema.ts`: Drizzle ORM tables (`users`, `workspaceItems`, `soulReflections`).
  - `index.ts`: PostgreSQL connection pool with Cloud SQL credentials.
  - `users.ts`: Data access functions for auth, workspace items, and reflections.
- `src/lib/`:
  - `offlineStorage.ts`: Offline-first persistence for user profiles, custom agents (L0-L5), automations, and DLAS history.
  - `kernel/`: Framework-independent Ecosystem Algorithm Kernel v1 (`kernel.ts`, `humanJourney.ts`).
  - `firebase.ts` & `firebase-admin.ts`: Firebase Auth & admin validation.

### 3.4 Media & Preserved Assets (`public/preserved/` & `public/videos/`)
- `public/founder-a01.jpeg`: Master preserved founder photo (served at `/founder-a01.jpeg`).
- `public/videos/meuus-demo-01.mp4` through `04.mp4`: Local demo video walkthroughs.
- `public/preserved/desktop-*.jpg`: 18 canonical desktop audit screenshots in English and Bengali.
- `public/preserved/journey/*`: Historical founder development milestones and WhatsApp evidence records.

---

## 4. Architectural Rules

1. **No Rebuilding From Scratch**: Always audit existing modules across the 4 canonical surfaces and extend them.
2. **Supervisor-Based Intelligence**: The Layer 1 supervisor (`meYoo` / `GeminiChatDrawer` / `UniversalMeYooOS`) manages child agents (website, workstation, learning/video creation, social platforms, automations).
3. **Claim ≤ Evidence**: Never assert capability without factual code or verified artifact backing.
4. **Governed Automation**: All automations follow approval levels (L0 Observe → L1 Suggest → L2 Prepare → L3 Approve Consequential → L4 Limited Bounded → L5 Autonomous).
