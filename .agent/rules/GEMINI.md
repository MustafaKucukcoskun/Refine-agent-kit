# GEMINI.md — Antigravity Agent System (next-web)

> This file defines the agent routing and skill system for this workspace.
> Global code quality rules are loaded from ~/.gemini/GEMINI.md.

---

@./base-protocol.md

---

## REQUEST CLASSIFIER (STEP 1)

| Type             | Trigger                                  | Action                                 |
| ---------------- | ---------------------------------------- | -------------------------------------- |
| **QUESTION**     | "what is", "explain", "how does it work" | Text response                          |
| **SIMPLE CODE**  | "fix", "add", "change" (single file)     | Inline edit                            |
| **COMPLEX CODE** | "build", "create", "implement"           | `{task-slug}.md` + Agent               |
| **DESIGN/UI**    | "design", "ui", "page", "landing"        | `{task-slug}.md` + frontend-specialist |
| **SLASH CMD**    | /create, /debug, /verify, /deploy        | Command flow                           |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: NEXT-WEB CODE RULES

### Primary Agent: `frontend-specialist`

### Supporting: `seo-specialist`, `performance-optimizer`

### Skill Priority

| Priority | Skills                                                                              |
| -------- | ----------------------------------------------------------------------------------- |
| **P0**   | nextjs-react-expert, nextjs-app-router-patterns, frontend-design, tailwind-patterns |
| **P1**   | seo-fundamentals, web-design-guidelines, webapp-testing, geo-fundamentals           |
| **P2**   | nodejs-best-practices, i18n-localization                                            |

### Next.js-Specific Rules

- **App Router:** `app/` directory structure, Server Components by default, `"use client"` only when needed
- **Data fetching:** async/await in Server Components, SWR/React Query on client
- **Metadata:** `generateMetadata()` or static metadata export in every page.tsx
- **Image:** `next/image` mandatory, specify width/height, placeholder="blur"
- **Font:** Self-hosted with `next/font`, define in layout.tsx
- **API Routes:** Route Handlers under `app/api/`, prefer edge runtime
- **Tailwind:** Utility-first, `@apply` only for repeated patterns

@./gemini-modes.md

### Final Checklist

Order: **Security → Lint → Schema → Tests → UX → SEO → Lighthouse/E2E**

---

## TIER 2: DESIGN RULES

> **Design rules are not here — they are in the specialist agent files.**

| Task                     | Read                                   |
| ------------------------ | -------------------------------------- |
| Web UI/UX / Landing Page | `.agent/agents/frontend-specialist.md` |

### DESIGN FLOW (Mandatory for Every Design Request)

```
1. READ frontend-specialist.md → Deep Design Thinking, Purple Ban, Anti-Safe Harbor,
   Maestro Auditor, Animation Mandate, Layout Diversification Mandate — all included.

2. Do Internal Analysis (silent) → Sector, audience, competitor, soul of design

3. Ask the user SPECIFIC questions (min. 3):
   - Do they have a color palette / brand color?
   - Any reference sites? (liked/disliked)
   - Who is the target audience?
   - What emotion should it convey? (Trust / Energy / Luxury / Fun)
   - UI library preference? (Pure Tailwind / shadcn / custom)

4. Persona Selection (Sector + Emotion Matrix + AI Analysis):
   → Read `.agent/.shared/design-system/personas.csv`
   → Suggest 3 personas based on sector + emotion + project architecture
   → Let user choose

5. `.agent/.shared/design-system/reference-sites.csv` → Review reference sites matching the sector

6. FULL IMPLEMENTATION → All sections + animations + micro-interactions
   Static design = FAIL. Every element moves.
```

Not reading this file before designing = GENERIC OUTPUT = FAIL. No exceptions.

---

@./agents-reference.md

**Key Skills:** nextjs-react-expert, nextjs-app-router-patterns, frontend-design,
tailwind-patterns, seo-fundamentals, web-design-guidelines, webapp-testing

**Workflows:** /ui-ux-pro-max, /deploy, /preview, /create, /debug, /verify, /code-review

**Design System:** `.agent/.shared/design-system/` → `personas.csv`, `reference-sites.csv`, `anti-patterns.csv`

---
