# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** ScamLens ("Before you click, check.")
**Updated:** 2026-10-04
**Category:** Financial Security & Fraud Prevention

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Page Background | `#FFFFFF` | `--color-background` | Base page background |
| Secondary Surface | `#F8FAFC` | `--color-surface-secondary` | Section fills, subtle cards |
| Primary Navy | `#071B45` | `--color-navy` | Main headings, brand text, primary structure |
| Primary Blue | `#1463FF` | `--color-blue` / `--color-primary` | Key interactive actions, active states, highlights |
| Dark Blue | `#0B2A63` | `--color-navy-dark` | Hover states, deep contrast |
| Body Text | `#52627A` | `--color-text-body` | Primary readable paragraphs (16px+) |
| Secondary Text | `#718096` | `--color-text-secondary` | Captions, metadata, helper text |
| Border | `#E5EAF2` | `--color-border` | Standard card and input outlines |
| Nav Border | `#E9EEF5` | `--color-border-nav` | Top header bottom separator |
| Very Light Blue | `#F2F7FF` | `--color-blue-light` | Subtle page highlights |
| Blue Icon Background | `#EEF5FF` | `--color-blue-icon-bg` | Active pills, icon tiles |
| Green | `#11A66A` | `--color-green` / `--color-risk-low` | LOW risk tier, success badges |
| Green Background | `#ECFAF4` | `--color-green-bg` | LOW risk soft surface |
| Purple | `#7047EB` | `--color-purple` | Screenshot card tile |
| Purple Background | `#F4F0FF` | `--color-purple-bg` | Screenshot icon background |
| Orange | `#F97316` | `--color-orange` / `--color-risk-caution` | CAUTION / SUSPICIOUS tiers |
| Orange Background | `#FFF3EA` | `--color-orange-bg` | CAUTION soft surface |
| Red | `#DC2626` | `--color-red` / `--color-risk-high` | HIGH risk tier |
| Red Background | `#FEF2F2` | `--color-red-bg` | HIGH risk soft surface |

**Color Notes:** Financial-security-company quality. Trustworthy, clean, modern, calm. No gradients, neon, or blobs.

### Typography

- **Font Family:** Inter (self-hosted via `@fontsource/inter`), falling back to `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- **Main Heading:** Weight 700-750, 52-64px desktop, 38-44px mobile, line-height 1.05-1.1, letter-spacing -0.03em, `#071B45`.
- **Highlighted Accent Word:** `#1463FF`.
- **Intro Text:** 18-21px, weight 400, line-height 1.55, `#52627A`.
- **Card Title:** 17-20px, weight 650-700, `#071B45`.
- **Card Description:** 14-16px, `#52627A`, line-height 1.5. Never below 14px anywhere.

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #2563EB;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #DC2626;
  border: 2px solid #DC2626;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FFF1F2;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #DC2626;
  outline: none;
  box-shadow: 0 0 0 3px #DC262620;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Minimalism & Swiss Style

**Keywords:** Clean, simple, spacious, functional, white space, high contrast, geometric, sans-serif, grid-based, essential

**Best For:** Enterprise apps, dashboards, documentation sites, SaaS platforms, professional tools

**Key Effects:** Subtle hover (200-250ms), smooth transitions, sharp shadows if any, clear type hierarchy, fast loading

### Page Pattern

**Pattern Name:** Hero + Features + CTA

- **Conversion Strategy:** Deep CTA placement. For CTA label text, verify at least 4.5:1 against the button fill; use 7:1 only when the product explicitly targets AAA normal-text contrast. Keep focus and component boundaries independently visible. Disable hero parallax under reduced motion and render its static final state.
- **CTA Placement:** Hero (sticky) + Bottom
- **Section Order:** Hero with headline/image > Value prop > Key features (3-5) > CTA section > Footer

---

## Anti-Patterns (Do NOT Use)


### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
