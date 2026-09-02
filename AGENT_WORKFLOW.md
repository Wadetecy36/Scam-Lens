# ScamLens Agent Workflow

This repository is built in explicit phases. An agent must inspect the current code before changing it and must not skip verification because a feature appears visually complete.

## Working loop

1. Read `notes/ScamLens_Master_Build_Prompt.md` for product constraints.
2. Read `notes/AUDIT.md` for the current state.
3. Read `notes/CONTINUE_PROMPT.md` for the exact next actions.
4. Inspect the existing implementation before creating replacements.
5. Make the smallest coherent change that completes the current checklist item.
6. Reuse existing design-system primitives and service boundaries.
7. Keep sensitive data out of analytics and persistent history.
8. Validate every AI/provider response through `parseScamAnalysis()`.
9. Never put provider secrets in client code or `VITE_` variables.
10. Run typecheck, lint, tests, and production build before calling the phase complete.
11. Update the audit/status notes with what changed and what remains.
12. Stop at the phase boundary and wait for explicit approval before Phase 2.

## Phase 1 boundary

Phase 1 is a production-minded foundation using the mock AI provider. It includes the user-facing analysis flow, result UX, local metadata history, PWA/SEO foundations, accessibility primitives, and provider abstraction.

Do not implement real AI, OCR, authentication, billing, notifications, organizational accounts, or the public API until Phase 2 is explicitly approved.

## Verification commands

```bash
npm install
npm run lint
npm test
tsc -b
npm run build
npm run preview
```

If dependency installation is unavailable, do not claim the build is verified. Record the blocker instead.
