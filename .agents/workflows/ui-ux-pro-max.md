---
description: Plan and implement high-quality UI with AI-powered design intelligence. Uses 59 design personas, 107 reference sites, 33 anti-patterns, plus 50+ styles and 97 color palettes. Produces a complete design system (MASTER.md + per-page overrides) before any code is written. Use when building new UI from scratch, designing a landing page, creating a design system, or planning visual direction. Keywords: design, UI, UX, landing page, style, design system, color palette, typography, layout.
---

# /ui-ux-pro-max — AI-Powered Design System Generator

$ARGUMENTS

---

## Purpose

Produce a **complete design system** (persona, colors, typography, UX rules, anti-patterns) before writing any UI code. Outputs a `design-system/MASTER.md` as the single source of truth.

---

## When to Use

| Use when | Do NOT use for |
|---|---|
| Starting new UI from scratch | Bug fixes in existing UI → use `/enhance` |
| Landing page, marketing site | Pure code refactor → use `/refactor-clean` |
| Design system for multi-page app | Quick style tweaks (1-2 lines CSS) |
| Visual consistency across screens | Backend-only features |

---

## Quick Start (5 min)

```bash
# 1. Generate design system (interactive)
python .agent/.shared/ui-ux-pro-max/scripts/search.py \
  "saas fitness app wellness modern" --design-system --persist -p "FitApp"

# 2. Review the output
cat design-system/MASTER.md

# 3. Implement UI using the recommendations
```

---

## Phase-Gated Flow

```
Phase 0: Requirement Analysis  →  Phase 1: Design System Generation
                                           ↓
                                     [GATE 1]
                                           ↓
Phase 2: Page-Level Overrides  →  Phase 3: Implementation Plan
                                           ↓
                                     [GATE 2]
                                           ↓
Phase 4: UI Implementation  →  Phase 5: Pre-Delivery QA
```

---

## Phase 0: Requirement Analysis

Extract from user's request:

| Dimension | Example |
|---|---|
| **Product type** | SaaS, e-commerce, portfolio, dashboard, landing |
| **Industry** | health, fintech, gaming, education, beauty |
| **Style mood** | minimal, playful, brutalist, elegant, editorial |
| **Stack** | html-tailwind (default), react, nextjs, vue, svelte, shadcn, swiftui, react-native, flutter |
| **Mode** | light, dark, both |

If any dimension is unclear, ask **one** clarifying question — not five.

---

## Phase 1: Design System Generation (REQUIRED)

```bash
python .agent/.shared/ui-ux-pro-max/scripts/search.py \
  "<product_type> <industry> <style keywords>" \
  --design-system --persist -p "<project_name>"
```

**What this produces (`design-system/MASTER.md`):**
- Persona (1 of 59) — style family, risk level, signature element
- Color palette — primary, secondary, accent, semantic
- Typography pair — display + body fonts
- Layout philosophy — grid, spacing, density
- Animation style — easing, duration range
- Anti-patterns to avoid — specific to chosen persona

### 🚦 GATE 1 — Design System Approval

Show user the generated MASTER.md summary. Ask:
*"Design direction approved, or want a different persona?"*

If user wants alternative, re-run with adjusted keywords or use `--domain style` to browse options.

---

## Phase 2: Page-Level Overrides (Optional)

For multi-page apps, generate per-page overrides where they should differ from MASTER:

```bash
python .agent/.shared/ui-ux-pro-max/scripts/search.py \
  "<page purpose>" --design-system --persist -p "<project>" --page "<page-name>"
```

**How overrides work:**
- Page-specific file: `design-system/pages/<page>.md`
- Applied only when implementing that page
- Overrides (not replaces) MASTER rules

**Common cases for overrides:**
- Dashboard (denser layout than landing)
- Checkout (higher trust signals, reduced distractions)
- Admin (utility-first, less decorative)

---

## Phase 3: Supplement Searches (as needed)

| Need | Command |
|---|---|
| More style options | `--domain style "glassmorphism dark"` |
| Chart recommendations | `--domain chart "real-time dashboard"` |
| UX best practices | `--domain ux "animation accessibility"` |
| Alternative fonts | `--domain typography "elegant luxury"` |
| Landing structure | `--domain landing "hero social-proof"` |
| Stack-specific patterns | `--stack html-tailwind "layout responsive"` |

### 🚦 GATE 2 — Plan Approval

Present the consolidated design system (MASTER + overrides + supplements) and ask:
*"Ready to implement? (yes / edit design / cancel)"*

---

## Phase 4: Implementation

Reference `design-system/MASTER.md` and any page-specific overrides at every UI decision point.

**Hierarchical retrieval rule:**
1. Look for `design-system/pages/<current-page>.md` first
2. If absent, use `design-system/MASTER.md`
3. Never invent colors/fonts outside these files

**Supported stacks:**
`html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`

---

## Phase 5: Pre-Delivery QA Checklist

Run through **every** item before declaring done:

### Visual Quality
- [ ] No emojis as icons — use SVG (Heroicons / Lucide / Simple Icons)
- [ ] All icons from one consistent set
- [ ] Brand logos verified correct (Simple Icons)
- [ ] Hover states don't cause layout shift
- [ ] Theme colors used directly (e.g. `bg-primary`, not CSS var wrappers)

### Interaction
- [ ] `cursor-pointer` on every clickable element
- [ ] Hover feedback (color/shadow/border change)
- [ ] Transitions 150-300ms (not instant, not > 500ms)
- [ ] Keyboard focus states visible

### Light/Dark Mode
- [ ] Text contrast ≥ 4.5:1 in both modes
- [ ] Glass/transparent elements visible in light mode (`bg-white/80` min, not `/10`)
- [ ] Body text `#0F172A` (slate-900) light / `#F1F5F9` (slate-100) dark
- [ ] Muted text `#475569` (slate-600) light / `#94A3B8` (slate-400) dark
- [ ] Borders `border-gray-200` light / `border-white/10` dark

### Layout
- [ ] Floating navbar: `top-4 left-4 right-4` (not stuck to `top-0`)
- [ ] Content padding accounts for fixed navbar height
- [ ] One consistent `max-w-*` across sections
- [ ] Responsive at 375, 768, 1024, 1440px
- [ ] No horizontal scroll on mobile

### Accessibility
- [ ] `alt` on every image
- [ ] `<label>` on every form input
- [ ] Color never the only indicator (also icon/text)
- [ ] `prefers-reduced-motion` respected

---

## Common Anti-Patterns (auto-flagged by design system)

From `.shared/design-system/anti-patterns.csv` — 33 entries, ranked by severity:

| Pattern | Alternative |
|---|---|
| Purple-blue gradient (AI cliché) | Use persona's actual palette |
| Center-aligned body text | Left-align (or right for RTL) |
| Inter/Roboto everywhere | Use pair from persona |
| Bento grid for everything | Context-appropriate layout |
| Glassmorphism on light bg | Use only on rich backgrounds |
| Equal 3-column grid default | Asymmetric or single-focus |

Run: `python .agent/.shared/ui-ux-pro-max/scripts/search.py "<term>" --domain ux` for full list.

---

## Output Formats

```bash
# Terminal-friendly
python .agent/.shared/ui-ux-pro-max/scripts/search.py "query" --design-system

# Markdown for docs
python .agent/.shared/ui-ux-pro-max/scripts/search.py "query" --design-system -f markdown
```

---

## Anti-Patterns (Workflow itself)

- ❌ **Writing CSS before running `/ui-ux-pro-max`** — you'll anchor on defaults instead of persona
- ❌ **Skipping `--persist`** — design system lives only in terminal, lost next session
- ❌ **Editing `design-system/MASTER.md` manually without regenerating** — drift accumulates
- ❌ **Ignoring anti-patterns list** — they exist because AI defaults to them

---

## Related

- `/create` — scaffolding that respects the generated design system
- `/enhance` — add UI features while following MASTER.md
- `/preview` — visual QA before delivery

---

## Examples

```
/ui-ux-pro-max SaaS fitness tracker, playful, dark mode
/ui-ux-pro-max luxury beauty spa landing page
/ui-ux-pro-max fintech crypto dashboard, data-dense
/ui-ux-pro-max editorial blog, brutalist
```
