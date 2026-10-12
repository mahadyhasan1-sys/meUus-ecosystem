# AGENTS.md — meUus Digital Ecosystem Constitution & Agent Directives

## 1. Project Purpose & Philosophy
meUus is the **Human Development, Intelligence & Execution Operating System** founded by **Md. Mahady Hasan (Rujbel / Ruju)**.
- **Core Axiom:** `Claim ≤ Evidence` — Never assert a capability, partnership, or outcome without factual backing.
- **Operating Principle:** `Consistent, Honest Action Over Perfection`.
- **Core Meaning:** `me → U → us` (Self-understanding → Intelligence & Assistance → Shared Community Responsibility).
- **Core Loop:** `Understand → Learn → Reflect → Act` / `#AnyOneCan#`
- **The Last & The First:**
  - *The Last Word Discovered:* **JUSTICE**
  - *The First Governing Question:* **JUSTICE FOR ALL** — *"Justice is not giving everyone the same outcome. Justice is giving every person their rightful protection, responsibility, opportunity, and consequence, while refusing to sacrifice the innocent for the powerful."*
- **The Core Equation:**
  `Human Intention + Understanding + Knowledge + Evidence + AI + Agents + Tools + Automation + Human Responsibility → Creation → Value → Opportunity → Justice → Continuation`

## 2. Architecture: The 10 Connected Layers & 7-Layer Execution Engine
All capabilities connect through the 10 Connected Layers governed by *Trust + Privacy + Safety + Governance + Continuity + Justice*:
1. **Language Layer:** Words as human infrastructure (voice, written, visual, Bangla fallback).
2. **Knowledge Layer:** Information transformed into usable understanding (*Information ≠ Truth*).
3. **Evidence Layer:** Disciplined verification (*Claim ≤ Evidence*).
4. **Personal Memory Layer:** Governed open memory with explicit consent, retention, and export.
5. **Learning Layer:** Longitudinal skill building & DLAS reflection.
6. **Creation Layer:** `#AnyOneCanBuild#` — system builder, tools, and execution WorkStation.
7. **Profile / Proof Layer:** Evidence-backed capability record (*Demonstrated Work > Claims*).
8. **Opportunity Layer:** Discoverability, employment, projects, and challenges.
9. **Value Distribution Layer:** Traceable creation, legitimate distribution, and transparent accounting.
10. **AI Ecosystem Layer:** Model Router & Agent Engine (*AI is an amplifier, never human authority*).

## 3. Four Canonical Surfaces
- **`meuus.org` (UNDERSTAND):** Civic gateway, Nine Pillars, Trust layer, Institutional covenant.
- **`meuussoul.com` (LEARN):** Comprehensive knowledge, 114-Day Quran, 80-Day Seerah, Education tracks.
- **`meuus.app` (REFLECT + ACT):** The core OS, DLAS, agents, automations, tasks, marketplace.
- **`rujbel.org` (FOUNDER ARCHIVE):** Client #001, architectural evolution, decision records.

## 4. Technology Stack & Tooling
- **Frontend:** React 19.0.0, Vite 6.2.0, Tailwind CSS v4, Motion (`motion/react` 12.38.0), Lucide Icons, Recharts.
- **Backend:** Node.js 20+, Express 4.21.2, bundled via esbuild to `dist/server.cjs`.
- **Database:** PostgreSQL (Google Cloud SQL `ai-studio-1f6d8234`, us-west1), Drizzle ORM 0.45.2.
- **Auth & Cloud Services:** Firebase Auth (`quadratic-anthem-7ds98`), Firebase Admin 14, Google GenAI SDK (`@google/genai` 1.49.0).
- **Local Kernel:** Framework-independent Ecosystem Algorithm Kernel v1 (`src/lib/kernel/`).

## 5. Standard Commands
- **Dev Server:** `npm run dev` (runs tsx server.ts)
- **Production Build:** `npm run build` (vite build + esbuild server.ts)
- **Production Start:** `npm start` (node dist/server.cjs on port 3000)
- **Typecheck & Lint:** `npm run lint` (`tsc --noEmit`)
- **Preview:** `npm run preview`

## 6. Truth, Status & Epistemic Vocabulary
All public interfaces must use truthful status classification. Never blur lines between stages:
# **DISCOVERED ≠ DESIGNED ≠ BUILT ≠ TESTED ≠ DEPLOYED ≠ PROVEN**

Standard Status Vocabulary:
- `Available Now` / `proven` — Fully operational and verified with concrete evidence.
- `Public Foundation` / `source-supported` — Core structure live with ongoing data ingestion.
- `Public Pilot` / `source-candidate` — Active limited test for real human feedback.
- `Demo / Simulation` — Interactive model illustrating future functionality.
- `Manual Process` — Human-in-the-loop operation.
- `In Development` / `in-review` — Active engineering underway.
- `Coming Later` / `not-yet-proven` — Scheduled roadmap item.
- `Long-Term Vision` — Conceptual direction.
- `Uncertain` / `disputed` — Requires further evidence. The system must always be able to say: *"Insufficient evidence."*

## 7. Forbidden Behaviors (Strict Prohibitions)
1. **NO Fabricated Claims:** Never manufacture users, revenue, certifications, medical/legal advice, or unverified partnerships.
2. **NO Destructive Deletion:** Never delete existing source files, components, or preservation history without explicit justification.
3. **NO Unbounded Autonomous Actions:** Consequential actions (financial, legal, public publishing) require explicit L3+ human confirmation.
4. **NO Exposed Secrets:** Never hardcode API keys, service account credentials, or passwords in client-side code.
5. **NO Fake Completion:** Never mark an item as "DONE" or "VERIFIED" without running actual build/test commands.

## 8. Specialized AI Boundaries & Safe Handoff
Specialized AI provides education, preparation, and research, but NEVER replaces qualified authority:
- **`MedicalAI ≠ Doctor`** — Always triage acute crisis and route to licensed medical professionals.
- **`LegalAI ≠ Lawyer`** — Provide legal education and document preparation; never claim legal representation.
- **`MuslimAI ≠ Mufti`** — Surface classical sources, Quran, and Seerah with citations; never issue autonomous fatwas.
- **`EmotionalAI ≠ Therapist`** — Validate feelings and offer grounding micro-actions; never diagnose psychological illness.

## 9. The Hardest-User Test & Accessibility Standards
- **Core Question:** *"Can someone who cannot read or write express a need, understand the response, learn, create, contribute, and continue?"*
- **Standard:** Voice-first interaction, Bengali & local language support, visual explanations, and zero-bandwidth offline resilience.
- **No literacy barrier:** No person's reading or writing level should be an unnecessary barrier to beginning.

## 10. Offline + Online Resilience
- The system must function offline via LocalStorage / IndexedDB for local journaling, DLAS responses, and kernel journeys.
- Online sync attaches to Cloud SQL / Supabase when internet connectivity is present.

## 11. Design System & Visual Standards
- **Palette:** Midnight navy (`bg-slate-950`, `bg-slate-900`), Growth emerald (`#27AE60`, `emerald-500`), Muted gold (`#D4AF37`, `amber-400`), Trust blue (`#1B3864`, `sky-500`).
- **Typography:** Geist / Inter, clean sans-serif with proper Bengali typography fallback (`bn` support).
- **3D & Motion:** Lightweight, GPU-conscious Canvas/CSS 3D; respect `prefers-reduced-motion`; no blocking first paint.

## 12. Preservation Rules
- Real founder photo `founder-a01.jpeg` must always be served at `/founder-a01.jpeg`.
- Preserved assets in `/public/preserved/` and desktop audit histories in `PreservedWorkShowcase.tsx` must be maintained as primary evidence.
- Full constitutional charter preserved at `docs/meuus-connected-ecosystem.md`.

## 13. The Continuity Key
If the entire discovery is ever lost, the minimum recovery key is:
> `#TheLast&TheFirst#meUusConnected#`  
> `#AnyOneCan#`  
> `ME → U → US → meUus`  
> `WORD → UNDERSTANDING → LEARNING → REFLECTION → CHOICE → ACTION → CREATION → EVIDENCE → RESPONSIBILITY → RIGHTS → CONSEQUENCE → JUSTICE → CONTINUATION`  
> `AI → AGENTS → TOOLS → AUTOMATION → CREATION`  
> `IDEA → BUILD → TEST → PROVE → OPPORTUNITY → VALUE → CONTRIBUTION`  
> `JUSTICE FOR ALL`  
> `Claim ≤ Evidence`  
