# SCAMLENS — PHASE 1 CONTINUATION PROMPT

You are continuing an in-progress build of ScamLens, a parent-focused AI
scam-safety web app. The original full spec is `ScamLens_Master_Build_Prompt.md`
(included) — treat it as the source of truth for anything not covered here.
This prompt tells you exactly what already exists, what's broken, and what
to build next. Read `AUDIT.md` first for the full status breakdown.

**Current completion: ~38% of the Phase 1 foundation checklist.**

---

## 1. Unzip and orient

The attached zip is the `scamlens/` project root (no `node_modules`). Steps:

```
unzip scamlens.zip
cd scamlens
npm install
npm run dev
```

Stack already decided and installed — do not change it:
- React 19 + Vite 8 + TypeScript (strict) + Tailwind CSS v4 (`@tailwindcss/vite`)
- react-router-dom v7
- lucide-react for icons
- @fontsource/fraunces + @fontsource/inter (self-hosted fonts, already wired in `src/index.css`)
- Path alias `@/*` → `src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`)

## 2. Design system — already decided, follow it exactly

Full rationale is in `notes/design-plan.md`. Summary:
- Colors: warm paper (`--color-paper: #f6f3ec`), ink (`#1e2a28`), pine/teal
  as the primary brand color (`#2f5d53`), clay as a sparing accent (`#c1652f`).
  Risk ramp: LOW `#3e7a5b` · CAUTION `#b9832a` · SUSPICIOUS `#c1652f` · HIGH `#a63a2b`.
- Type: Fraunces (display/headlines only) + Inter (UI/body, 18px base — audience skews older).
- Never communicate risk with color alone — always icon + word + position, see `RiskPill.tsx`/`RiskHeader`.
- Mobile-first, 44px touch targets (`.tap-target` utility already defined).
- One motion moment max per screen (the `.animate-settle` keyframe already defined) — don't add hover-fade-ins everywhere.
- Real product copy only. No lorem ipsum, no "Coming soon," no unmodified Vite/React template content anywhere.

Do not introduce a different palette, different fonts, card-with-shadow-on-everything, ALL-CAPS eyebrows, or em-dash labels — these were deliberately avoided as AI-design tells.

## 3. What's already built — reuse, don't rebuild

```
src/ai/scam-analysis/schema.ts        — ScamAnalysis, RiskLevel, ScamCategory types + riskLevelFromScore()
src/ai/scam-analysis/categories.ts    — CATEGORY_LABELS
src/ai/scam-analysis/prompts.ts       — SCAMLENS_ANALYZER_V1 (versioned prompt)
src/ai/scam-analysis/analyzer.ts      — AIProvider interface, AnalysisRequestError
src/ai/scam-analysis/validators.ts    — parseScamAnalysis() — the hard validation boundary; NEVER bypass this
src/ai/providers/mock-scenarios.ts    — 8 realistic mock scenarios + pickScenarioForText()
src/ai/providers/mock-provider.ts     — MockAIProvider implements AIProvider

src/services/analysis-service.ts      — runScamAnalysis(input), setAnalysisProvider()
src/services/history-service.ts       — saveToHistory/listHistory/deleteHistoryEntry/clearHistory (localStorage, metadata only, 30-day retention)

src/lib/cn.ts                         — classname join helper
src/lib/analytics.ts                  — track() stub, non-sensitive props only
src/lib/result-store.ts               — in-memory session store for full ScamAnalysis + raw input (NOT persisted — intentional)

src/config/env.ts                     — typed client env (VITE_-prefixed only, no secrets)

src/hooks/useDocumentHead.ts          — per-route SEO tags (title/description/canonical/OG/Twitter), no react-helmet dependency
src/hooks/useStructuredData.ts        — injects/cleans up JSON-LD <script> per page
src/hooks/useReadAloud.ts             — wraps browser SpeechSynthesis, never auto-plays

src/components/ui/Button.tsx          — Button + exported buttonClasses() for styling <Link>/<a> as buttons
src/components/ui/Card.tsx
src/components/ui/Alert.tsx           — info/warning/offline tones
src/components/ui/Checklist.tsx       — Checklist (do/avoid lists), IconRow
src/components/ui/Field.tsx           — InputField, TextAreaField
src/components/risk/RiskPill.tsx      — RiskPill (compact) + RiskHeader (full, result-screen header)
src/components/voice/ReadAloudButton.tsx
src/components/layout/Logo.tsx, Header.tsx, Footer.tsx, OfflineBanner.tsx
src/layouts/AppLayout.tsx             — shell with skip-link, Header, OfflineBanner, <Outlet/>, Footer

src/pages/LandingPage.tsx             — DONE, uses buttonClasses() (not a made-up `render` prop — that was a bug, already fixed)
```

Note a bug that was already caught and fixed: `LandingPage.tsx` originally
used a nonexistent `asChild`/`render` prop on `Button`. It now correctly uses
the exported `buttonClasses()` helper to style `<Link>`/`<a>` elements
directly. If you see any other component reaching for props that don't exist
on `Button`, use the same pattern.

## 4. Critical first fix — the app doesn't run as ScamLens yet

`src/App.tsx` and `src/main.tsx` are **still the unmodified Vite starter
template** (counter button, Vite/React logos, "Get started" text). This is
the single blocking issue — nothing built so far is wired up or visible.

Do this first:
1. Delete `src/App.css` and any remaining default assets in `src/assets/`.
2. Rewrite `src/App.tsx` to define the router (see routes below) using
   `createBrowserRouter` or `<Routes>`, with `AppLayout` as the root layout
   wrapping all routes via `<Outlet/>`.
3. `main.tsx` stays minimal — just mounts `<App/>` inside `<StrictMode>`.

## 5. Routes to build (spec §19)

```
/                 → LandingPage (done, just needs mounting)
/analyze          → picker: "What would you like to check?" — 4 cards (Message/Screenshot/Link/Something someone told you), per spec §21
/analyze/message  → paste-text input → TextAreaField → calls runScamAnalysis({type:'message', text}) → on success, storeResult() + navigate to /result/:id
/analyze/image    → screenshot upload (PNG/JPG/WEBP only, size-limited client-side check even though real OCR is Phase 2) → same result flow with type:'image'
/analyze/url      → InputField for a URL, validated client-side with isPlausibleUrl() from validators.ts before submit — never auto-fetch it
/analyze/call     → TextAreaField, "Describe what happened" (spec §6D) — same result flow with type:'call'
/result/:id       → THE most important screen (spec §22) — pull from result-store via id, render RiskHeader, warning signs, "What this means" (simpleExplanation), Checklist (do) + Checklist (avoid), then Explain-It-Simply toggle, ReadAloudButton, "Ask family member" CTA (optional, links toward /family). Handle the case where the id isn't in result-store (e.g. page was refreshed) with an Alert, not a crash.
/history          → list from listHistory(), each row uses RiskPill, empty state when no history yet
/settings         → shell: account/notification-style settings placeholders that are clearly real UI, not "coming soon" — keep genuinely minimal per spec §48 (don't build dozens of settings)
/family           → shell explaining the trusted-contact concept (spec §12) with an "optional" framing and a clear empty state — no working invite flow yet, that's Phase 2, but the shell must look finished, not stubbed
/about             → real product copy about ScamLens's purpose and limitations
/privacy           → real privacy copy consistent with what's actually implemented (metadata-only history, no default persistence of raw content, no credential requests) — do not promise more than the code does
/terms             → real terms copy
/404 (catch-all)   → custom, on-brand, with a way back to "Check something"
```

Every route must call `useDocumentHead()` with a real title/description, and
`/` and `/about` should probably also set structured data (`WebSite`/`Organization` — do NOT add `FAQPage` or `SoftwareApplication` schema unless the page content genuinely matches that schema's fields).

Every async action (submitting an analysis, loading history) needs loading +
success + error + retry states — spec §38. Use the `Alert` component's
`offline`/`warning` tones for errors; never expose a raw error message or
stack trace to the user.

## 6. After routes are wired, do these in order

1. **PWA foundation** (spec §17): `manifest.webmanifest`, real icons (not
   placeholder squares — something that reads as the ScamLens mark using the
   `ShieldCheck` motif already used in `Logo.tsx`), theme-color meta tag,
   basic service worker registration. Offline mode must show the existing
   `OfflineBanner` copy pattern ("You're offline. Reconnect to analyze this
   message.") — never fake an analysis result while offline.
2. **SEO static files**: `public/robots.txt`, `public/sitemap.xml` (list the
   real static routes above, exclude `/result/:id` since those are
   per-user/non-indexable — set `index:false` via `useDocumentHead` on that
   route too), `public/llms.txt` per spec §35 (purpose, inputs, limitations,
   privacy principles — no internal prompts or secrets).
3. **`.env.example`** at the project root documenting `VITE_APP_ENV`,
   `VITE_APP_URL`, `VITE_ANALYTICS_ENABLED`, `VITE_USE_MOCK_ANALYSIS` (all
   already read in `src/config/env.ts`) — with comments, no real values.
4. **Basic testing foundation** (spec §45): install Vitest + Testing
   Library. Minimum coverage:
   - `parseScamAnalysis()` — valid input passes, missing/invalid fields throw
   - `riskLevelFromScore()` — boundary values (24/25, 49/50, 74/75)
   - `isPlausibleUrl()` — valid/invalid URLs
   - One flow test: Landing → click "Check something" → /analyze → pick
     Message → submit mock text → arrives at /result/:id without errors
5. **Verify the build**: run `tsc -b`, `npm run lint` (oxlint is already
   configured), `npm run build`, and `npm run preview`. Fix every TypeScript
   error, lint warning, and console error before considering this phase
   done. Do not leave any of these unresolved.

## 7. Guardrails (carry over from the original spec — do not relax these)

- Never call an AI provider directly from client code with a real API key —
  all real-provider calls are server-side in Phase 2. The mock provider
  runs client-side only because it's a mock.
- Never let unvalidated data reach the UI — always route through
  `parseScamAnalysis()`.
- Never persist raw message/screenshot/URL content by default — only
  `history-service.ts`'s metadata shape. Only persist raw content if the
  user explicitly opts in (not built yet — flag it as Phase 2 if you get
  there).
- Never claim certainty ("this is definitely a scam/safe") in any UI copy
  unless it's clearly hedged per spec §3 — reuse the calibrated language
  already used in the mock scenarios' `summary`/`explanations` fields as the
  house style.
- Don't build Phase 2/3 features (real AI provider, OCR, auth, payments,
  notifications) — shells and clean boundaries only, per spec §48.
- Stop after Phase 1 is complete and verified. Do not start Phase 2 without
  explicit approval, per spec §52.

## 8. Deliverable when you finish this phase

Same as spec §51: project structure, tech decisions, dependencies, routes,
components, design system, data models, AI abstraction, mock provider, SEO
implementation, PWA implementation, security measures, accessibility
measures, testing setup, env variables, build commands, deployment
instructions, and a Phase 2 task list — backed by an actually-runnable,
actually-building app, not a description of one.
