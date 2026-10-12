/**
 * PreservedWorkShowcase — Complete Desktop Archive
 * 233 Desktop items · R20→R60A Release Series · MEUUSSOUL Audits
 * DSR Convergence · Book Manuscript · SHA-256 Preserved Assets
 */

import { useState } from 'react';
import PageHeader from './PageHeader';
import { FolderGit2 } from 'lucide-react';

const RELEASE_SERIES = [
  { id: 'R20', label: 'R20 — Recovery', date: '2026-08-24', status: 'VERIFIED', desc: 'Source recovery baseline after environment loss.' },
  { id: 'R21', label: 'R21 — Exact Source Staging', date: '2026-08-24', status: 'VERIFIED', desc: 'Exact source pinned and staged for lint cleanup.' },
  { id: 'R22', label: 'R22 — Lint Cleanup & UI Truth', date: '2026-08-24', status: 'VERIFIED', desc: 'Lint resolved. UI truth alignment confirmed.' },
  { id: 'R33', label: 'R33 — Codex Lineage Evidence', date: '2026-08-24', status: 'VERIFIED', desc: 'Full codex lineage documented. Comparator passed.' },
  { id: 'R42', label: 'R42 — Verification (×5)', date: '2026-08-24', status: 'VERIFIED', desc: '5-pass verification: R42 → R42.1 → R42.2 → R42.3 → R42.4.' },
  { id: 'R44', label: 'R44 — Verification Gate', date: '2026-08-24', status: 'VERIFIED', desc: 'Long-run verification gate passed. LEARN track confirmed.' },
  { id: 'R46', label: 'R46 — UNDERSTAND Candidate', date: '2026-08-25', status: 'VERIFIED', desc: 'UNDERSTAND domain candidate validated (3 iterations).' },
  { id: 'R47', label: 'R47 — APP Final Candidate', date: '2026-08-25', status: 'VERIFIED', desc: 'Full app final candidate. Package: meUus_R47_APP (32.7 MB .rar).' },
  { id: 'R48', label: 'R48 — Rujbel Candidates (×9)', date: '2026-08-25', status: 'VERIFIED', desc: 'rujbel.org final candidate through 9 readability iterations.' },
  { id: 'R49', label: 'R49 — Four Domain Regression', date: '2026-08-25', status: 'VERIFIED', desc: 'Cross-domain regression: meuus.org, meuussoul.com, meuus.app, rujbel.org.' },
  { id: 'R50', label: 'R50 — Release Preflight', date: '2026-08-25', status: 'VERIFIED', desc: 'Release preflight authority + baseline confirmed.' },
  { id: 'R51', label: 'R51 — Provenance + Cloudflare Seal', date: '2026-08-25', status: 'VERIFIED', desc: 'Deployment provenance sealed. Cloudflare configuration locked.' },
  { id: 'R52', label: 'R52 — Release Command Authority', date: '2026-08-25', status: 'VERIFIED', desc: 'Release command authority established and documented.' },
  { id: 'R53', label: 'R53 — Founder Windows Rehearsal', date: '2026-08-25', status: 'VERIFIED', desc: 'Coordinated release rehearsal from founder\'s Windows machine.' },
  { id: 'R54', label: 'R54 — Release Decision Seal', date: '2026-08-25', status: 'VERIFIED', desc: 'Go/no-go release decision sealed with evidence.' },
  { id: 'R55', label: 'R55 — Two-Lane Promotion', date: '2026-08-25', status: 'VERIFIED', desc: 'Two-lane simultaneous promotion: PREFLIGHT × 5 → EXECUTION.' },
  { id: 'R56', label: 'R56 — LEARN Reconciliation', date: '2026-08-25', status: 'VERIFIED', desc: 'LEARN track reconciliation: R44 authority → Runtime identity → V7 link → Remote mirror.' },
  { id: 'R57', label: 'R57 — Visual Acceptance + LEARN Final', date: '2026-08-25', status: 'VERIFIED', desc: 'Visual acceptance gate passed. LEARN final candidate confirmed.' },
  { id: 'R58', label: 'R58 — Release', date: '2026-08-25', status: 'LIVE', desc: 'Production release. Four domains live.' },
  { id: 'R59A', label: 'R59A — Ecosystem Algorithm Kernel', date: '2026-08-25', status: 'LIVE', desc: 'Ecosystem algorithm kernel seeded. Decision engine initialized.' },
  { id: 'R59B', label: 'R59B — Starting Point Final Closeout', date: '2026-08-25', status: 'LIVE', desc: 'Starting Point milestone formally closed out with evidence.' },
  { id: 'R60A', label: 'R60A — Kernel Human Journey', date: '2026-08-25', status: 'CURRENT', desc: 'Human Journey Kernel v1 · Bilingual · Evidence-aware · Local-only. This is where we are.' },
];

const DSR_GATES = [
  { id: 'DSR004', label: 'DSR004 — Codex Convergence', date: '2026-08-31', result: 'PASSED', file: 'DSR004_CODEX_CONVERGENCE_20260831-153500.txt' },
  { id: 'DSR005', label: 'DSR005 — Preview Acceptance + Artifact Parity', date: '2026-08-31', result: 'PASSED', file: 'DSR005_PREVIEW_ACCEPTANCE_RESULT_20260831.txt' },
  { id: 'DSR006', label: 'DSR006 — Preview → Production App Convergence', date: '2026-08-31', result: 'PASSED', file: 'DSR006_PREVIEW_APP_DwD-dwN-.js.txt' },
];

const MEUUSSOUL_AUDITS = [
  { id: 'AU1', label: 'Laptop Audit #1', ts: '20260816_225853', size: '7.5 MB' },
  { id: 'AU2', label: 'Laptop Audit #2', ts: '20260816_230848', size: '7.5 MB' },
  { id: 'AU3', label: 'Laptop Audit #3', ts: '20260816_231113', size: '7.5 MB' },
  { id: 'AU4', label: 'Laptop Audit #4', ts: '20260816_231223', size: '7.5 MB' },
  { id: 'AU5', label: 'Laptop Audit #5', ts: '20260816_231419', size: '7.5 MB' },
  { id: 'AU6', label: 'Laptop Audit #6', ts: '20260816_231555', size: '7.5 MB' },
  { id: 'AU7', label: 'Local Work Backup', ts: '20260816_233332', size: '7.5 MB' },
];

const BOOK_CHAPTERS = [
  '01 — The Starting Point Is You', '02 — Before You Begin', '03 — The One Word Start',
  '04 — Knowledge Before Action', '05 — Claim ≤ Evidence', '06 — The Nine Pillars',
  '07 — Understanding the Self', '08 — The First Signal', '09 — Listening Before Knowing',
  '10 — Evidence Culture', '11 — The DLAS Engine', '12 — Human Growth States',
  '13 — The Journey Is Not a Race', '14 — Language as a Starting Point',
  '15 — Earning With Integrity', '16 — Learning Without Fear',
  '17 — Emotional Intelligence Ground Zero', '18 — Families First',
  '19 — The Drug Buster Protocol', '20 — Mind Beautifier',
  '21 — Legal Awareness for All', '22 — Business With a Soul',
  '23 — The Green Bangladesh Principle', '24 — The Idea Lab Gate',
  '25 — WorkStation — Free Tools, Real Capacity', '26 — Soul Profile Architecture',
  '27 — The 114-Day Quran Journey', '28 — 80-Day Prophetic Seerah',
  '29 — Rujbel: Where Meaning Begins', '30 — The aliveBangladesh Signal',
  '31 — Consistent, Honest Action Over Perfection', '32 — The Covenant',
  '33 — Day One Statement', '34 — Be The Starting Point',
  '35 — Appendix: Founding Principles', '36 — Appendix: Claim ≤ Evidence Register',
  '37 — First Draft Backup Seal',
];

const PRESERVED_ASSETS = [
  { label: 'Founder Photo (Verified)', path: '/founder-a01.jpeg', sha: 'SHA-256 Verified · Client #001', tag: 'FOUNDER' },
  { label: 'Founder Journey WhatsApp', path: '/preserved/journey/founder_whatsapp_20260712.jpeg', sha: 'SHA-256 · WhatsApp 2026-07-12', tag: 'FOUNDER' },
  { label: 'Desktop Home Interface', path: '/preserved/desktop-home.jpg', sha: 'SHA-256 · Desktop Preservation', tag: 'UI EVIDENCE' },
  { label: 'DLAS Framework Audit', path: '/preserved/desktop-dlas.jpg', sha: 'SHA-256 · Desktop Preservation', tag: 'DLAS' },
  { label: 'Status Matrix Surface', path: '/preserved/desktop-status.jpg', sha: 'SHA-256 · Desktop Preservation', tag: 'GOVERNANCE' },
  { label: 'Foundational Principles', path: '/preserved/desktop-principles.jpg', sha: 'SHA-256 · Desktop Preservation', tag: 'COVENANT' },
  { label: '114-Day Quran Interface', path: '/preserved/desktop-bn-quran-journey.jpg', sha: 'SHA-256 · Desktop Preservation', tag: 'LEARN' },
  { label: '80-Day Seerah Interface', path: '/preserved/desktop-bn-seerah.jpg', sha: 'SHA-256 · Desktop Preservation', tag: 'LEARN' },
  { label: 'Book Manuscript Archive', path: '/preserved/desktop-books.jpg', sha: 'SHA-256 · Desktop Preservation', tag: 'MANUSCRIPT' },
  { label: 'Bengali Home Interface', path: '/preserved/desktop-bn-home.jpg', sha: 'SHA-256 · Desktop Preservation', tag: 'UI EVIDENCE' },
  { label: 'Accessibility Audit View', path: '/preserved/desktop-accessibility.jpg', sha: 'SHA-256 · Desktop Preservation', tag: 'A11Y' },
  { label: 'Hero Ecosystem Overview', path: '/preserved/img_hero_ecosystem.jpg', sha: 'SHA-256 · meuussoul app drawable', tag: 'APP' },
  { label: 'Learning Academy Hub', path: '/preserved/img_learning_academy.jpg', sha: 'SHA-256 · meuussoul app drawable', tag: 'APP' },
  { label: 'meUus Brand Seal', path: '/preserved/img_meuus_brand_logo.jpg', sha: 'SHA-256 · meuussoul app drawable', tag: 'BRAND' },
  { label: 'Provider Home Screenshot', path: '/preserved/provider-home-screenshot.png', sha: 'SHA-256 · Provider Verification', tag: 'SYSTEM' },
];

const STATUS_COLORS: Record<string, string> = {
  VERIFIED: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  LIVE: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  CURRENT: 'text-amber-300 bg-amber-50 border-amber-200',
  PASSED: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

export default function PreservedWorkShowcase() {
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [activeTab, setActiveTab] = useState<'releases' | 'dsr' | 'meuussoul' | 'book' | 'assets'>('releases');

  const tabs = [
    { id: 'releases', label: `R-Series (${RELEASE_SERIES.length})` },
    { id: 'dsr', label: `DSR Gates (${DSR_GATES.length})` },
    { id: 'meuussoul', label: `Soul Audits (${MEUUSSOUL_AUDITS.length})` },
    { id: 'book', label: `Book (${BOOK_CHAPTERS.length} ch.)` },
    { id: 'assets', label: `Preserved Assets` },
  ] as const;

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<FolderGit2 size={18} />}
        title="Preserved Work Evidence"
        subtitle="Primary Archival Evidence, Desktop Audits, and Preserved Artifacts."
        badge="Preserved"
        breadcrumb="Transparency"
      />
      <section className="py-8 px-6 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            Client #001 · Preserved Desktop Archive
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
            233 Desktop Items · Complete Work History
          </h2>
          <p className="text-gray-500 max-w-3xl leading-relaxed">
            Every release iteration, DSR quality gate, MEUUSSOUL audit, book manuscript chapter, and verified
            asset — preserved exactly as created. This is the full evidence chain from Day One to now.
          </p>
          {/* Desktop stats */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { n: '233', label: 'Desktop Items' },
              { n: '22', label: 'R-Series Releases' },
              { n: '3', label: 'DSR Quality Gates' },
              { n: '7', label: 'MEUUSSOUL Audits' },
              { n: '37', label: 'Book Chapters' },
              { n: '4', label: 'Live Domains' },
            ].map(s => (
              <div key={s.n} className="text-center px-4 py-2 rounded-xl bg-white border border-gray-200">
                <div className="text-xl font-bold text-emerald-600">{s.n}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex flex-wrap gap-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                activeTab === t.id
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-500'
              }`}
            >{t.label}</button>
          ))}
        </div>

        {/* R-Series timeline */}
        {activeTab === 'releases' && (
          <div className="space-y-3">
            <p className="text-gray-400 text-sm">Complete release lineage from recovery to current kernel.</p>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
              <div className="space-y-3 pl-10">
                {RELEASE_SERIES.map((r, i) => (
                  <div key={r.id} className="relative">
                    <div className={`absolute -left-6 top-3 w-3 h-3 rounded-full border-2 ${
                      r.status === 'CURRENT' ? 'bg-amber-400 border-amber-400' :
                      r.status === 'LIVE' ? 'bg-blue-400 border-blue-400' :
                      'bg-emerald-400 border-emerald-400'
                    }`} />
                    <div className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 shadow-xs transition">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-sm font-bold text-gray-900">{r.label}</span>
                          <p className="text-gray-500 text-sm mt-1">{r.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-500">{r.date}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DSR Gates */}
        {activeTab === 'dsr' && (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">Development Stage Release quality gates — every gate must pass before promotion.</p>
            {DSR_GATES.map(d => (
              <div key={d.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{d.label}</h4>
                    <p className="text-xs text-gray-500 mt-1 font-mono">{d.file}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500">{d.date}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[d.result]}`}>{d.result}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              All 3 DSR gates passed. Preview → Production convergence verified. Android acceptance gates cleared (×6 iterations).
            </div>
          </div>
        )}

        {/* MEUUSSOUL Audits */}
        {activeTab === 'meuussoul' && (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">
              Full meuussoul.com laptop preservation audits captured on 2026-08-16. Each is a complete snapshot
              of the live soul app codebase, assets, and local work at that exact moment.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {MEUUSSOUL_AUDITS.map(a => (
                <div key={a.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{a.label}</h4>
                      <p className="text-xs text-gray-500 font-mono mt-1">{a.ts}</p>
                    </div>
                    <span className="text-xs text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 rounded-lg">{a.size}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              Combined audit size: ~52.5 MB · MEUUSSOUL_LAPTOP_AUDIT_LATEST.zip (7.5 MB) · MEUUSSOUL_SAFE_LAPTOP_INVENTORY.ps1 active.
            </div>
          </div>
        )}

        {/* Book Chapters */}
        {activeTab === 'book' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-5">
              <h3 className="font-bold text-purple-950 text-lg">Be The Starting Point</h3>
              <p className="text-purple-700 text-sm mt-1">By Md. Mahady Hasan (Ruju) · First Full Draft</p>
              <p className="text-gray-600 text-sm mt-3">
                A {BOOK_CHAPTERS.length}-chapter manuscript authored from lived experience, founding principles,
                and evidence-first philosophy. Every chapter is a direct output of the meUus journey.
              </p>
              <div className="flex gap-3 mt-4">
                <div className="text-center px-3 py-2 rounded-lg bg-white border border-gray-200">
                  <div className="text-lg font-bold text-violet-400">{BOOK_CHAPTERS.length}</div>
                  <div className="text-xs text-gray-400">Chapters</div>
                </div>
                <div className="text-center px-3 py-2 rounded-lg bg-white border border-gray-200">
                  <div className="text-lg font-bold text-violet-400">1st</div>
                  <div className="text-xs text-gray-400">Full Draft</div>
                </div>
                <div className="text-center px-3 py-2 rounded-lg bg-white border border-gray-200">
                  <div className="text-lg font-bold text-violet-400">SHA-256</div>
                  <div className="text-xs text-gray-400">Backed Up</div>
                </div>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(showAllChapters ? BOOK_CHAPTERS : BOOK_CHAPTERS.slice(0, 10)).map((ch, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5">
                  <span className="text-emerald-500 text-xs font-mono mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-gray-700 text-sm">{ch}</span>
                </div>
              ))}
            </div>
            {!showAllChapters && (
              <button
                onClick={() => setShowAllChapters(true)}
                className="w-full py-2.5 border border-gray-300 hover:border-gray-500 text-gray-500 hover:text-gray-900 rounded-xl text-sm transition"
              >Show all {BOOK_CHAPTERS.length} chapters ↓</button>
            )}
          </div>
        )}

        {/* Preserved Assets */}
        {activeTab === 'assets' && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">SHA-256 verified assets from the canonical preservation manifest.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PRESERVED_ASSETS.map(a => (
                <div key={a.label} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={a.path}
                      alt={a.label}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{a.label}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono border border-gray-200">{a.tag}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">{a.sha}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Key files list */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Key Desktop File Evidence</h4>
              {[
                { f: 'meuus_v_01.mp4', size: '39.2 MB', note: 'Original meUus v0.1 video' },
                { f: 'meUus_R47_APP_Final_Candidate.rar', size: '32.7 MB', note: 'Final app candidate archive' },
                { f: 'MEUUSSOUL_LAPTOP_AUDIT_LATEST.zip', size: '7.5 MB', note: 'Latest soul audit snapshot' },
                { f: 'MEUUS_STEP002A_EVIDENCE_HANDOFF.zip', size: '0.68 MB', note: 'Evidence handoff package' },
                { f: 'MEUUS_R33_CODEX_LINEAGE_EVIDENCE.zip', size: '0.06 MB', note: 'Codex lineage proof' },
                { f: 'MEUUS_RECOVERY_CONTROL_RECORD.md', size: '0.01 MB', note: 'Recovery control record' },
              ].map(item => (
                <div key={item.f} className="flex items-center justify-between gap-3 py-1.5 border-b border-gray-200/50 last:border-0">
                  <div>
                    <span className="text-xs font-mono text-gray-700">{item.f}</span>
                    <span className="text-xs text-gray-500 ml-2">— {item.note}</span>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{item.size}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom seal */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Claim ≤ Evidence · Client #001 · Preservation Seal</p>
          <p className="text-gray-500 text-xs">
            meUus has begun truthfully. It is not complete. It is not rejected. It is born as a public beginning
            across its first live domains, and it will continue through evidence, listening, reflection, and responsible action.
          </p>
        </div>
      </div>
    </section>
    </div>
  );
}
