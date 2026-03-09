# GEMINI.md — Antigravity Agent System (next-web)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanımlar.
> Global kod kalitesi kuralları ~/.gemini/GEMINI.md'den yüklenir.

---

## 🔴 CRITICAL: AGENT & SKILL PROTOCOL (ÖNCE OKU)

**ZORUNLU:** Her implementasyondan ÖNCE ilgili agent dosyasını ve skill'lerini oku.

### Skill Loading

`Agent aktif → frontmatter "skills:" kontrol → SKILL.md oku → İlgili section'ları oku`

- **Selective:** TÜM dosyaları okuma. Önce `SKILL.md`, sonra sadece request'e uyan section.
- **Priority:** P0 (GEMINI.md) > P1 (Agent .md) > P2 (SKILL.md). Hepsi bağlayıcı.
- **Enforcement:** `Read → Understand WHY → Apply PRINCIPLES → Code`. Skip yasak.

---

## 📥 REQUEST CLASSIFIER (ADIM 1)

| Tip              | Trigger                                     | Aksiyon                                |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| **SORU**         | "what is", "explain", "nasıl çalışır"       | Text yanıt, araç yok                   |
| **SURVEY**       | "analyze", "listele", "overview"            | Session intel, dosya yok               |
| **SIMPLE CODE**  | "fix", "ekle", "değiştir" (tek dosya)       | Inline edit                            |
| **COMPLEX CODE** | "build", "create", "implement", "yaz"       | `{task-slug}.md` + Agent               |
| **DESIGN/UI**    | "design", "ui", "page", "landing", "arayüz" | `{task-slug}.md` + frontend-specialist |
| **SLASH CMD**    | /create, /debug, /verify, /code-review      | Command flow                           |

---

## 🤖 INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATİK)

**HER request'ten önce otomatik agent seç ve bildir.**

### Protocol

1. **Sessiz Analiz:** Domain tespit et (Frontend? Backend? API? Design?)
2. **Agent Seç:** En uygun specialist
3. **Bildir:** `🤖 **Applying knowledge of @[agent-name]...**`
4. **Uygula:** Agent .md dosyasını oku → persona + kuralları uygula

> 🔴 `@[skills/intelligent-routing]` protokolünü takip et.

### ⚠️ ROUTING CHECKLIST (Her kod/design yanıtından önce ZORUNLU)

| #   | Kontrol                                       | Başarısız →                                 |
| --- | --------------------------------------------- | ------------------------------------------- |
| 1   | Doğru agent domain tespit edildi mi?          | STOP. Analiz et.                            |
| 2   | Agent .md dosyası OKUNDU mu?                  | STOP. `.agent/agents/{agent}.md` aç ve oku. |
| 3   | `🤖 Applying @[agent]...` yazıldı mı?         | STOP. Ekle.                                 |
| 4   | Agent frontmatter'daki skill'ler yüklendi mi? | STOP. `skills:` oku.                        |

- ❌ Agent belirlemeden kod = **PROTOCOL VIOLATION**
- ❌ Announcement atlamak = **USER CANNOT VERIFY**
- ❌ Agent kurallarını yoksaymak = **QUALITY FAILURE**

---

## 📁 File Dependency Awareness

Herhangi bir dosyayı değiştirmeden önce:

1. `CODEBASE.md` kontrol et (yoksa `session_manager.py` ile üret)
2. Bağımlı dosyaları tespit et
3. Etkilenen TÜM dosyaları birlikte güncelle

### 🗺️ System Map

🔴 **ZORUNLU:** Session başında `ARCHITECTURE.md` oku. Agent, Skill ve Script yapısını anla.

---

## TIER 1: NEXT-WEB KOD KURALLARI

### Primary Agent: `frontend-specialist`
### Supporting: `seo-specialist`, `performance-optimizer`

### Skill Priority

| Öncelik | Skill'ler |
|---------|-----------|
| **P0** | nextjs-react-expert, nextjs-app-router-patterns, frontend-design, tailwind-patterns |
| **P1** | seo-fundamentals, web-design-guidelines, webapp-testing, geo-fundamentals |
| **P2** | nodejs-best-practices |

### 🎭 Gemini Mode Mapping

| Mod      | Agent             | Davranış                                       |
| -------- | ----------------- | ---------------------------------------------- |
| **plan** | `project-planner` | 4-aşama metodoloji. Phase 4'e kadar KOD YAZMA. |
| **ask**  | —                 | Sadece anlamaya odaklan. Soru sor.             |
| **edit** | `orchestrator`    | Execute. Önce `{task-slug}.md` kontrol et.     |

**Plan Mode (4 Faz):**
1. ANALYSIS → Araştır, soru sor
2. PLANNING → `{task-slug}.md`, görev planı
3. SOLUTIONING → Mimari, tasarım (KOD YOK!)
4. IMPLEMENTATION → Kod + testler

> 🔴 Edit mode: Çok dosyalı değişiklik → `{task-slug}.md` öner. Tek dosya → direkt devam.

### 🏁 Final Checklist

"Son kontroller", "final checks" → `python .agent/scripts/checklist.py .`
Sıra: **Security → Lint → Schema → Tests → UX → SEO → Lighthouse/E2E**

---

## TIER 2: DESIGN KURALLARI

> **Design kuralları burada değil — specialist agent dosyalarında.**

| Görev                    | Oku                                    |
| ------------------------ | -------------------------------------- |
| Web UI/UX / Landing Page | `.agent/agents/frontend-specialist.md` |

### 🎨 DESIGN FLOW (Her Design İsteğinde Zorunlu)

```
1. frontend-specialist.md OKU → Deep Design Thinking, Purple Ban, Anti-Safe Harbor,
   Maestro Auditor, Animation Mandate, Layout Diversification Mandate hepsini içerir.

2. İç Analiz Yap (sessiz) → Sector, audience, competitor, soul of design

3. Kullanıcıya SPESIFIK sorular sor (min. 3):
   - Renk paleti / marka rengi var mı?
   - Referans site var mı? (Beğendiğin/beğenmediğin)
   - Hedef kitle kim?
   - Hangi duyguyu vermeli? (Güven / Enerji / Lüks / Eğlence)
   - UI library tercihi? (Pure Tailwind / shadcn / custom)

4. Persona Seçimi (Sektör + Duygu Matrisi + AI Analizi):
   → `.shared/design-system/personas.csv` oku
   → Sektör + duygu + proje mimarisine göre 3 persona öner
   → Kullanıcı seçsin → Design Commitment:
   🎨 "Persona: [seçilen], Stil: [...], Safe Harbor'dan farkı: [...]"

5. `.shared/design-system/reference-sites.csv` → Sektöre uygun referans siteleri incele

6. FULL IMPLEMENTATION → Tüm section'lar + animasyonlar + micro-interactions
   Static design = FAIL. Her element moves.
```

🔴 **Bu dosyayı okumadan design = GENERIC OUTPUT = FAIL. İstisna yok.**

---

## 📁 QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** clean-code, intelligent-routing, frontend-design, nextjs-react-expert,
nextjs-app-router-patterns, tailwind-patterns, seo-fundamentals, web-design-guidelines,
webapp-testing, nodejs-best-practices, context-engineering, code-review-checklist

**Workflows:** /ui-ux-pro-max, /deploy, /preview, /create, /debug, /verify, /code-review

**Scripts:** `verify_all.py`, `checklist.py`, `session_manager.py`, `setup-agent.py`,
`auto_preview.py`, `verify_project_tmp.py`

**Design System:** `.shared/design-system/` → `personas.csv`, `reference-sites.csv`, `anti-patterns.csv`

---
