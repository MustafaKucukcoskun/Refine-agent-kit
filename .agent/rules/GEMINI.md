# GEMINI.md — Antigravity Agent System (next-web)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanimlar.
> Global kod kalitesi kurallari ~/.gemini/GEMINI.md'den yuklenir.

---

@./base-protocol.md

---

## REQUEST CLASSIFIER (ADIM 1)

| Tip | Trigger | Aksiyon |
|-----|---------|---------|
| **SORU** | "what is", "explain", "nasil calisir" | Text yanit |
| **SIMPLE CODE** | "fix", "ekle", "degistir" (tek dosya) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement" | `{task-slug}.md` + Agent |
| **DESIGN/UI** | "design", "ui", "page", "landing" | `{task-slug}.md` + frontend-specialist |
| **SLASH CMD** | /create, /debug, /verify, /deploy | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: NEXT-WEB KOD KURALLARI

### Primary Agent: `frontend-specialist`
### Supporting: `seo-specialist`, `performance-optimizer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | nextjs-react-expert, nextjs-app-router-patterns, frontend-design, tailwind-patterns |
| **P1** | seo-fundamentals, web-design-guidelines, webapp-testing, geo-fundamentals |
| **P2** | nodejs-best-practices, i18n-localization |

### Next.js-Specific Rules

- **App Router:** `app/` dizin yapisi, Server Components varsayilan, `"use client"` sadece gerektiginde
- **Data fetching:** Server Components'te async/await, Client'ta SWR/React Query
- **Metadata:** Her page.tsx'te `generateMetadata()` veya static metadata export
- **Image:** `next/image` zorunlu, width/height belirt, placeholder="blur"
- **Font:** `next/font` ile self-hosted, layout.tsx'te tanimla
- **API Routes:** `app/api/` altinda Route Handlers, edge runtime tercihi
- **Tailwind:** Utility-first, `@apply` sadece tekrar eden pattern'ler icin

@./gemini-modes.md

### Final Checklist

Sira: **Security → Lint → Schema → Tests → UX → SEO → Lighthouse/E2E**

---

## TIER 2: DESIGN KURALLARI

> **Design kurallari burada degil — specialist agent dosyalarinda.**

| Gorev | Oku |
|-------|-----|
| Web UI/UX / Landing Page | `.agent/agents/frontend-specialist.md` |

### DESIGN FLOW (Her Design Isteginde Zorunlu)

```
1. frontend-specialist.md OKU → Deep Design Thinking, Purple Ban, Anti-Safe Harbor,
   Maestro Auditor, Animation Mandate, Layout Diversification Mandate hepsini icerir.

2. Ic Analiz Yap (sessiz) → Sector, audience, competitor, soul of design

3. Kullaniciya SPESIFIK sorular sor (min. 3):
   - Renk paleti / marka rengi var mi?
   - Referans site var mi? (Begendigi/begenmedigi)
   - Hedef kitle kim?
   - Hangi duyguyu vermeli? (Guven / Enerji / Luks / Eglence)
   - UI library tercihi? (Pure Tailwind / shadcn / custom)

4. Persona Secimi (Sektor + Duygu Matrisi + AI Analizi):
   → `.shared/design-system/personas.csv` oku
   → Sektor + duygu + proje mimarisine gore 3 persona oner
   → Kullanici secsin

5. `.shared/design-system/reference-sites.csv` → Sektore uygun referans siteleri incele

6. FULL IMPLEMENTATION → Tum section'lar + animasyonlar + micro-interactions
   Static design = FAIL. Her element moves.
```

Bu dosyayi okumadan design = GENERIC OUTPUT = FAIL. Istisna yok.

---

@./agents-reference.md

**Key Skills:** nextjs-react-expert, nextjs-app-router-patterns, frontend-design,
tailwind-patterns, seo-fundamentals, web-design-guidelines, webapp-testing

**Workflows:** /ui-ux-pro-max, /deploy, /preview, /create, /debug, /verify, /code-review

**Design System:** `.shared/design-system/` → `personas.csv`, `reference-sites.csv`, `anti-patterns.csv`

---
