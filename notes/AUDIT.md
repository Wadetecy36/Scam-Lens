# ScamLens — Phase 1 Audit (as of this handoff)

## Overall completion: ~38% of the Phase 1 foundation checklist (spec §43, 22 items)

Strong on architecture and safety-critical plumbing (schema, validation, AI
abstraction, mock provider). Weak on actually wired screens — the app does
not run as ScamLens yet; it still boots the default Vite template.

---

## Security audit

**No critical issues found in authored code.** Checked for: `dangerouslySetInnerHTML`,
`eval`, raw `innerHTML`, hardcoded secrets/API keys, secrets in `VITE_` vars,
unrestricted client-side `fetch`, unsafe `localStorage` use.

| Check | Result |
|---|---|
| Secrets in client bundle | ✅ None. `env.ts` only reads non-sensitive `VITE_` flags and documents the secrets rule inline. |
| XSS surfaces | ✅ None — no `dangerouslySetInnerHTML` anywhere. |
| Client-side URL fetching | ✅ None — `isPlausibleUrl()` validates URL *shape* only; nothing auto-visits a submitted URL (per spec §6C, §14). |
| localStorage sensitive data | ✅ `history-service.ts` stores only metadata (id, category, score, level, timestamps) — never raw message/screenshot text, matching spec §13/§26. |
| Unvalidated AI output reaching UI | ✅ `validators.ts` (`parseScamAnalysis`) is a hard boundary; even the mock provider is routed through it, so the real provider will be too. |
| `target="_blank"` without `rel="noopener"` | ⚠️ Present only in the **leftover default `App.tsx`** (Vite template), not in any authored ScamLens code. Will disappear once `App.tsx` is replaced. |
| Rate limiting / CSRF / secure headers / SSRF / file-upload validation | ❌ Not yet implemented — these are server-side concerns (spec §14) and no server exists yet in this phase. Flagged as Phase 1 remaining work, not a regression. |
| Input validation on forms | ⚠️ Partial — `InputField`/`TextAreaField` exist but no analysis input page consumes them yet with real validation (length limits, empty-state handling). |

**Verdict:** what's built is clean and follows the spec's privacy/security
principles by construction (metadata-only history, schema-gated AI output,
no client secrets). Nothing here needs to be *fixed* — the gap is coverage,
not vulnerabilities.

---

## Design audit

| Check | Result |
|---|---|
| Distinctive visual identity (vs. AI-design defaults) | ✅ Paper/pine-teal palette, Fraunces+Inter, avoids cream+terracotta and dark+neon defaults per the design plan. |
| Risk communicated via 3 channels (not color alone) | ✅ `RiskPill`/`RiskHeader` use icon + word + ramp position + number. |
| Mobile-first, 44px touch targets | ✅ `.tap-target` utility applied to nav links, buttons, inputs. |
| Focus states | ✅ Global `:focus-visible` style with visible outline in brand color. |
| Reduced motion respected | ✅ `prefers-reduced-motion` handled in `index.css`. |
| Skip-to-content link | ✅ In `AppLayout`. |
| No placeholder copy in authored pages | ✅ Landing page uses real, specific scam-example copy throughout. |
| **Placeholder branding still present** | ❌ `App.tsx`/`main.tsx` are **still the unmodified Vite template** (React/Vite logos, "Get started", counter button) — this violates spec §47 (No Placeholders) and is the single most visible loose end. `App.css` still has Vite/React default styles as well, unused by anything else but not deleted. |
| Consistency across un-built pages | N/A — Analyze, Result, History, Settings, Family, About, Privacy, Terms, 404 don't exist yet, so there's nothing to critique there yet. |

**Verdict:** the design system and Landing page are in good shape and on-brief.
The glaring issue is cosmetic-but-blocking: the actual app entry point hasn't
been swapped over, so nothing built is currently visible or routed.

---

## Item-by-item status against spec §43 (Phase 1 foundation)

| # | Item | Status | Est. |
|---|---|---|---|
| 1 | Project configuration | Vite, Tailwind v4, TS path aliases done | 90% |
| 2 | Routing | react-router-dom installed, **zero routes wired** | 0% |
| 3 | Design system | Tokens + Button/Card/Alert/Checklist/Field/RiskPill | 85% |
| 4 | Responsive layout | AppLayout/Header/Footer built, not mounted | 60% |
| 5 | Landing page | Content-complete, not mounted | 90% |
| 6 | Analysis page shell | Not started | 0% |
| 7 | Result page shell | Not started | 0% |
| 8 | History page shell | Service done, no page | 0% |
| 9 | Settings page shell | Not started | 0% |
| 10 | Family page shell | Not started | 0% |
| 11 | Custom 404 | Not started | 0% |
| 12 | PWA foundation | Not started | 0% |
| 13 | SEO foundation | Hook built, used on 1 page | 40% |
| 14 | Structured data foundation | Hook built, used on 1 page | 40% |
| 15 | Accessibility foundation | Solid primitives, not exercised app-wide | 60% |
| 16 | API/service abstraction | Done | 90% |
| 17 | AI provider abstraction | Done | 95% |
| 18 | Typed scam-analysis schema | Done | 95% |
| 19 | Secure environment configuration | Client env done; no `.env.example`, no server folder | 50% |
| 20 | Error/loading states | Alert component exists, not wired to any async flow | 15% |
| 21 | Basic testing foundation | Not started | 0% |
| 22 | Production build configuration | vite.config done, never actually verified (App.tsx still placeholder) | 30% |

**Average: ~38%**

---

## Immediate next 3 actions (see continuation prompt)
1. Replace `App.tsx`/`main.tsx` with the real router + `AppLayout`, delete `App.css` and unused Vite/React assets.
2. Build the Analyze flow (picker → message/image/url/call inputs) and the Result page — these are the product's core screens.
3. Add PWA manifest/icons, `robots.txt`/`sitemap.xml`/`llms.txt`, and a 404 page, then run `tsc -b`, lint, and `vite build` to get to a clean, verified build.
