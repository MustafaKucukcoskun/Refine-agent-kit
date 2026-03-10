# GEMINI.md — Antigravity Agent System (phaser-game)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanimlar.
> Global kod kalitesi kurallari ~/.gemini/GEMINI.md'den yuklenir.

---

## CRITICAL: AGENT & SKILL PROTOCOL (ONCE OKU)

**ZORUNLU:** Her implementasyondan ONCE ilgili agent dosyasini ve skill'lerini oku.

### Skill Loading

`Agent aktif → frontmatter "skills:" kontrol → SKILL.md oku → Ilgili section'lari oku`

- **Selective:** TUM dosyalari okuma. Once `SKILL.md`, sonra sadece request'e uyan section.
- **Priority:** P0 (GEMINI.md) > P1 (Agent .md) > P2 (SKILL.md). Hepsi baglayici.
- **Enforcement:** `Read → Understand WHY → Apply PRINCIPLES → Code`. Skip yasak.

---

## REQUEST CLASSIFIER (ADIM 1)

| Tip | Trigger | Aksiyon |
|-----|---------|---------|
| **SORU** | "what is", "explain", "nasil calisir" | Text yanit |
| **SIMPLE CODE** | "fix", "ekle", "degistir" (tek dosya) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement" | `{task-slug}.md` + Agent |
| **GAME DESIGN** | "scene", "physics", "sprite", "level" | `{task-slug}.md` + game-developer |

---

## INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATIK)

**HER request'ten once otomatik agent sec ve bildir.**

### ROUTING CHECKLIST (Her kod yanitindan once ZORUNLU)

| # | Kontrol | Basarisiz → |
|---|---------|-------------|
| 1 | Dogru agent domain tespit edildi mi? | STOP. Analiz et. |
| 2 | Agent .md dosyasi OKUNDU mu? | STOP. `.agent/agents/{agent}.md` ac ve oku. |
| 3 | `Applying @[agent]...` yazildi mi? | STOP. Ekle. |
| 4 | Agent frontmatter'daki skill'ler yuklendi mi? | STOP. `skills:` oku. |

---

## TIER 1: PHASER GAME KOD KURALLARI

### Primary Agent: `game-developer`
### Supporting: `performance-optimizer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | game-development, phaser-patterns |
| **P1** | clean-code |
| **P2** | testing-patterns |

### Phaser-Specific Rules

- **Scene architecture:** Her ekran ayri Scene class. Scene gecisi: `this.scene.start()` / `this.scene.launch()` (overlay)
- **Asset management:** `preload()` icinde yukle, `create()`'te kullan
- **Physics:** Arcade (basit, hizli) veya Matter.js (kompleks fizik)
- **Object pooling:** Sik create/destroy yerine pool kullan
- **Texture atlas:** Ayri spriteler yerine atlas tercih et (performans)
- **Camera bounds:** Disindaki nesneleri `setActive(false)` yap
- **TypeScript:** Tip guvenligi icin TypeScript tercih et

---

## Final Checklist

Sira: **Performance → Physics → Rendering → Tests → Build**

---

## QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** game-development, phaser-patterns, clean-code, testing-patterns

**Workflows:** /create, /debug, /verify, /build-fix, /deploy

---
