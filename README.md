# ScamLens

**Before you click, check.**

ScamLens is a parent-focused AI scam-safety web app. It helps people check suspicious messages, screenshots, links, and descriptions of calls before they click, pay, reply, or share information.

## Current phase

Phase 1 foundation is actively under construction. The app now has the real route shell and the core mock-analysis UX. Real AI/OCR/authentication/billing remain Phase 2 work.

## Stack

- React 19
- Vite 8
- TypeScript strict mode
- Tailwind CSS v4
- React Router v7
- Lucide icons
- Self-hosted Fraunces + Inter
- Mock AI provider with a typed validation boundary

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run lint
tsc -b
npm test
npm run build
npm run preview
```

The supplied build environment could not complete dependency installation during the current handoff, so the new test packages still need to be installed in a networked environment before verification.

## Architecture

- `src/ai/` contains provider contracts, prompts, schemas, validators, and the Phase 1 mock provider.
- `src/services/` contains application services such as analysis and metadata-only history.
- `src/lib/result-store.ts` holds full results only in session memory.
- `src/pages/` contains the route-level product experience.
- `src/components/` contains reusable design-system and product primitives.
- `server/` is reserved for Phase 2 server-side integrations and secrets.

## Product model

Free acquisition → repeated utility → family adoption → Plus → Family Plan → B2B/B2B2C → API/white-label.

The architecture should support these layers without turning the core safety flow into a sales funnel.
