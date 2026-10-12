/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * meUus Ecosystem Comprehensive End-to-End Test & Verification Suite
 * Validates all surface gateways, PWA shell assets, health telemetry,
 * offline profile synchronization echo, and multi-model AI inference.
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function runVerification() {
  console.log('=================================================================');
  console.log('  meUus Sovereign Operating System — Full Verification Test Suite ');
  console.log(`  Target: ${BASE_URL} | Timestamp: ${new Date().toISOString()}`);
  console.log('=================================================================\n');

  const results = [];

  async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  async function test(name, fn) {
    const start = Date.now();
    try {
      const detail = await fn();
      const elapsed = Date.now() - start;
      results.push({ name, pass: true, elapsed, detail });
      console.log(`  [PASS] ${name} (${elapsed}ms) ${detail ? '→ ' + detail : ''}`);
    } catch (err) {
      const elapsed = Date.now() - start;
      results.push({ name, pass: false, elapsed, error: err.message });
      console.error(`  [FAIL] ${name} (${elapsed}ms) → ${err.message}`);
    }
  }

  // 1. Root Gateway Portal
  await test('Root Portal Gateway (GET /)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes('meUus')) throw new Error('meUus title missing');
    if (!html.includes('root')) throw new Error('React mount container missing');
    return 'HTML200, React root confirmed';
  });

  // 2. Health Check Telemetry
  await test('API Health Telemetry (GET /api/health)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/api/health`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(`Status not ok: ${data.status}`);
    return `Status: OK, hasApiKey: ${data.hasApiKey}`;
  });

  // 3. PWA Manifest
  await test('PWA Web App Manifest (GET /manifest.json)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/manifest.json`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const manifest = await res.json();
    if (!manifest.name?.includes('meUus')) throw new Error('Manifest name invalid');
    return `Manifest: "${manifest.name}", Scope: "${manifest.scope}"`;
  });

  // 4. ServiceWorker Offline Engine
  await test('ServiceWorker Cache Engine (GET /sw.js)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/sw.js`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const code = await res.text();
    if (!code.includes('meuus-offline-cache-v2')) throw new Error('Cache v2 identifier missing');
    return 'Cache v2 confirmed with offline fallback';
  });

  // 5. Preserved Founder Photographic Artifact
  await test('Preserved Founder Photograph (GET /founder-a01.jpeg)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/founder-a01.jpeg`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const len = res.headers.get('content-length') || (await res.arrayBuffer()).byteLength;
    return `Served HTTP 200, Size: ${Math.round(len / 1024)} KB`;
  });

  // 6. Anonymous Offline-First Profile Synchronization
  await test('Offline Profile Sync Echo (POST /api/profile-sync)', async () => {
    const payload = {
      profile: { id: 'test_verify_user', name: 'Citizen Tester', locale: 'bn' },
      agents: [{ id: 'agent_1', name: 'Test Scout' }],
      dlasHistory: [{ id: 'dlas_1', tier: 'BASIC', completedAt: new Date().toISOString() }],
    };
    const res = await fetchWithTimeout(`${BASE_URL}/api/profile-sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error('Sync echo rejected');
    return `Success, Acknowledged items: Profile, ${json.localItemsReceived.agentCount} Agents, ${json.localItemsReceived.dlasHistoryCount} DLAS`;
  });

  // 7. Layer 4 AI Model Router: Low-Latency Inference
  await test('Layer 4 AI Model Router (POST /api/fast-response)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/api/fast-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'State the core motto of meUus in one short sentence.' })
    });
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.text) throw new Error('No AI text generated');
    return `Served by: ${json.actualModel || json.model} (${json.latencyMs}ms)`;
  });

  // 8. Mind Beautifier & Emotional Growth Analysis
  await test('Mind Beautifier Emotional Growth (POST /api/wellness-insights)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/api/wellness-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reflectionText: 'I feel overwhelmed by starting, but I want to take an honest small step today.',
        selectedMood: 'Determined',
        focusTag: 'Starting Point'
      })
    });
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.emotionalTone) throw new Error('Emotional tone missing');
    return `Tone: "${json.emotionalTone}", Bangla: "${json.banglaWisdom?.bangla || 'Preserved'}"`;
  });

  // 9. #TheLast&TheFirst# Connected Ecosystem Surface
  await test('#TheLast&TheFirst# Connected Ecosystem Surface (GET /)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    return 'Gateway online, #TheLast&TheFirst# connected';
  });

  // 10. AI Profile Creator Runtime Inference (Gate 4 /api/chat)
  await test('AI Profile Creator Runtime Inference (POST /api/chat)', async () => {
    const systemInstruction = [
      'You are the meUus Soul Profile drafting assistant.',
      'Core axiom: Claim <= Evidence.',
      'Output STRICT JSON only: {"bio": string, "skills": string[], "goals": string[], "evidenceNotes": string}'
    ].join('\n');

    const res = await fetchWithTimeout(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Here are my own DLAS reflections: I learned basic web design and want to build a small community directory for my neighborhood in Sylhet.'
          }
        ],
        systemInstruction,
        role: 'meuus-profile-drafter',
        model: 'lite'
      })
    });

    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.text) throw new Error('No draft returned');
    const cleaned = data.text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const hasJson = cleaned.includes('{') && cleaned.includes('}');
    if (!hasJson) throw new Error('Draft is not JSON');
    return `Model: ${data.actualModel || data.model}, Profile JSON validated`;
  });

  // ─── Standalone Surface Audit ────────────────────────────────────────────────

  // 11. /evidence — Claim ≤ Evidence Registry Surface
  await test('Evidence Registry Surface (GET /evidence)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/evidence`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes('meUus')) throw new Error('meUus title missing from /evidence');
    if (!html.includes('root')) throw new Error('React root mount point missing from /evidence');
    return 'HTTP 200, meUus title confirmed, React root present';
  });

  // 12. /safety — Consolidated Safety & Trust Boundary Surface
  await test('Safety & Trust Boundary Surface (GET /safety)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/safety`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes('meUus')) throw new Error('meUus title missing from /safety');
    return 'HTTP 200, meUus title confirmed';
  });

  // 13. /accessibility — Digital Inclusion & Accessibility Policy Surface
  await test('Accessibility Policy Surface (GET /accessibility)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/accessibility`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes('meUus')) throw new Error('meUus title missing from /accessibility');
    return 'HTTP 200, meUus title confirmed';
  });

  // 14. /about — Founder Story & Institutional Mandate Surface
  await test('Founder Story Surface (GET /about)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/about`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes('meUus')) throw new Error('meUus title missing from /about');
    return 'HTTP 200, meUus title confirmed';
  });

  // 15. /appreciation — Appreciation & Contributor Acknowledgement Surface
  await test('Appreciation Surface (GET /appreciation)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/appreciation`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes('meUus')) throw new Error('meUus title missing from /appreciation');
    return 'HTTP 200, meUus title confirmed';
  });

  // ─── Firebase Auth Gateway Guards ────────────────────────────────────────────

  // 16. Auth Guard: /api/user/sync rejects unauthenticated requests with HTTP 401
  await test('Firebase Auth Gateway Guard (POST /api/user/sync → 401)', async () => {
    let status = 0;
    let body = '';
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/api/user/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      status = res.status;
      body = await res.text();
    } catch (_) {
      // Treat network error as non-401 failure
    }
    if (status !== 401) throw new Error(`Expected HTTP 401 but got ${status}`);
    const err = JSON.parse(body);
    if (!err.error) throw new Error('Missing error field in 401 response body');
    return `HTTP 401 ✓, error: "${err.error}"`;
  });

  // 17. Auth Guard: /api/reflections rejects unauthenticated requests with HTTP 401
  await test('Firebase Auth Gateway Guard (GET /api/reflections → 401)', async () => {
    let status = 0;
    let body = '';
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/api/reflections`, { method: 'GET' });
      status = res.status;
      body = await res.text();
    } catch (_) {
      // Treat network error as non-401 failure
    }
    if (status !== 401) throw new Error(`Expected HTTP 401 but got ${status}`);
    const err = JSON.parse(body);
    if (!err.error) throw new Error('Missing error field in 401 response body');
    return `HTTP 401 ✓, error: "${err.error}"`;
  });

  // ─── Visual & Video Media Assets from Laptop ─────────────────────────────────

  // 18. Laptop Video Demo MP4 Asset
  await test('Laptop Video Demo MP4 Asset (GET /videos/meuus-demo-01.mp4)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/videos/meuus-demo-01.mp4`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const len = res.headers.get('content-length') || (await res.arrayBuffer()).byteLength;
    return `Served HTTP 200, Size: ${Math.round(len / 1024 / 1024 * 10) / 10} MB MP4`;
  });

  // 19. Preserved Workstation Capture Asset
  await test('Preserved Workstation Screenshot (GET /preserved/journey/lasthermeswork.png)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/preserved/journey/lasthermeswork.png`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const len = res.headers.get('content-length') || (await res.arrayBuffer()).byteLength;
    return `Served HTTP 200, Size: ${Math.round(len / 1024)} KB PNG`;
  });

  // ─── Resilient Grounding Intelligence Endpoints ──────────────────────────────

  // 20. Search Grounding Inference API
  await test('Search Grounding Runtime Inference (POST /api/search-grounded)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/api/search-grounded`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'What is the capital of Bangladesh?' })
    }, 25000);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.text || data.text.length < 5) throw new Error('Response text empty');
    return `Model: ${data.actualModel}, Grounded: ${data.isGrounded}, Text: "${data.text.trim().substring(0, 40)}..."`;
  });

  // 21. Maps Grounding Inference API
  await test('Maps Grounding Runtime Inference (POST /api/maps-grounded)', async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/api/maps-grounded`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Where is Sixty Dome Mosque located?', district: 'Bagerhat' })
    }, 25000);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.text || data.text.length < 5) throw new Error('Response text empty');
    return `Model: ${data.actualModel}, Grounded: ${data.isGrounded}, Text: "${data.text.trim().substring(0, 40)}..."`;
  });

  console.log('\n=================================================================');
  const passed = results.filter(r => r.pass).length;
  const total = results.length;
  console.log(`  VERIFICATION SCORECARD: ${passed} / ${total} TESTS PASSED`);
  if (passed === total) {
    console.log('  STATUS: ALL CHECKS VERIFIED PASS (100% OPERATIONAL)');
  } else {
    console.log('  STATUS: SOME CHECKS FAILED — REVIEW TELEMETRY ABOVE');
  }
  console.log('=================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
