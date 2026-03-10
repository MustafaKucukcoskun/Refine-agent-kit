# GEMINI.md — Antigravity Agent System (chrome-extension)

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

| Tip              | Trigger                                     | Aksiyon                                 |
| ---------------- | ------------------------------------------- | --------------------------------------- |
| **SORU**         | "what is", "explain", "nasil calisir"       | Text yanit, arac yok                    |
| **SURVEY**       | "analyze", "listele", "overview"            | Session intel, dosya yok                |
| **SIMPLE CODE**  | "fix", "ekle", "degistir" (tek dosya)       | Inline edit                             |
| **COMPLEX CODE** | "build", "create", "implement", "yaz"       | `{task-slug}.md` + Agent                |
| **PERMISSIONS**  | "permission", "manifest", "csp", "security" | `{task-slug}.md` + security-auditor     |
| **SLASH CMD**    | /create, /debug, /verify, /code-review      | Command flow                            |

---

## INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATIK)

**HER request'ten once otomatik agent sec ve bildir.**

### Protocol

1. **Sessiz Analiz:** Domain tespit et (Content Script? Background? Popup? Permissions?)
2. **Agent Sec:** En uygun specialist
3. **Bildir:** `**Applying knowledge of @[agent-name]...**`
4. **Uygula:** Agent .md dosyasini oku → kurallari uygula

### ROUTING CHECKLIST (Her kod yanitindan once ZORUNLU)

| #   | Kontrol                                       | Basarisiz →                                 |
| --- | --------------------------------------------- | ------------------------------------------- |
| 1   | Dogru agent domain tespit edildi mi?          | STOP. Analiz et.                            |
| 2   | Agent .md dosyasi OKUNDU mu?                  | STOP. `.agent/agents/{agent}.md` ac ve oku. |
| 3   | `Applying @[agent]...` yazildi mi?            | STOP. Ekle.                                 |
| 4   | Agent frontmatter'daki skill'ler yuklendi mi? | STOP. `skills:` oku.                        |

- Agent belirlemeden kod = **PROTOCOL VIOLATION**
- Agent kurallarini yoksaymak = **QUALITY FAILURE**

---

## File Dependency Awareness

Herhangi bir dosyayi degistirmeden once:

1. `CODEBASE.md` kontrol et (yoksa `session_manager.py` ile uret)
2. Bagimli dosyalari tespit et
3. Etkilenen TUM dosyalari birlikte guncelle

### System Map

**ZORUNLU:** Session basinda `ARCHITECTURE.md` oku. Agent, Skill ve Script yapisini anla.

---

## TIER 1: CHROME EXTENSION KOD KURALLARI

### Primary Agent: `frontend-specialist`
### Supporting: `security-auditor`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | chrome-extension-patterns, clean-code |
| **P1** | webapp-testing |
| **P2** | testing-patterns |

### Chrome Extension-Specific Rules

- **Manifest V3 ZORUNLU:** V2 gecis sureci bitmistir. Sadece V3.
- **eval() KESINLIKLE YASAK:** CSP ihlali. `new Function()`, `setTimeout(string)` da yasak.
- **Remote code execution YASAK:** Tum kod extension bundle icerisinde olmali. CDN'den kod yukleme yok.
- **Minimum permissions:** Sadece gerekli permission'lari talep et. `<all_urls>` YASAK.
- **host_permissions:** Sadece gerekli domain'ler. Genis scope'tan kacin.
- **Service Worker background:** Persistent background page yok. Event-driven tasarim.
- **Mesajlasma:** `chrome.runtime.sendMessage` / `chrome.runtime.onMessage` pattern.
- **Storage:** `chrome.storage.local` veya `chrome.storage.sync`. localStorage YASAK (background'da yok).

### Gemini Mode Mapping

| Mod      | Agent             | Davranis                                       |
| -------- | ----------------- | ---------------------------------------------- |
| **plan** | `project-planner` | 4-asama metodoloji. Phase 4'e kadar KOD YAZMA. |
| **ask**  | —                 | Sadece anlamaya odaklan. Soru sor.             |
| **edit** | `orchestrator`    | Execute. Once `{task-slug}.md` kontrol et.     |

**Plan Mode (4 Faz):**
1. ANALYSIS → Arastir, soru sor
2. PLANNING → `{task-slug}.md`, gorev plani
3. SOLUTIONING → Mimari, tasarim (KOD YOK!)
4. IMPLEMENTATION → Kod + testler

---

## TIER 2: CHROME EXTENSION ARCHITECTURE KURALLARI

### Extension Components

- **Background (Service Worker):** Event listeners, alarm API, state management
- **Content Scripts:** DOM manipulation, page context isolation, CSS injection
- **Popup:** Kucuk UI, hizli etkileisim, state goster
- **Options Page:** Ayarlar, konfigrasyon, chrome.storage ile persist
- **Side Panel:** Chrome 114+ side panel API

### Security (KRITIK)

- Content Security Policy: Manifest'te strict CSP tanimla
- Cross-origin: `fetch` ile CORS, background'dan proxy pattern
- User data: Minimum veri topla, `chrome.storage` encrypt sensitive data
- Permission justification: Her permission icin Chrome Web Store aciklamasi hazirla

### Messaging Patterns

- `chrome.runtime.sendMessage`: Popup ↔ Background
- `chrome.tabs.sendMessage`: Background → Content Script
- `chrome.runtime.connect`: Long-lived connection (port)
- External messaging: `externally_connectable` dikkatli kullan

### Performance

- Service Worker lifecycle: Idle'da terminate olur, state persist et
- Alarm API: Periodic task'ler icin `chrome.alarms` kullan
- Lazy loading: Buyuk modul'leri dynamic import ile yukle

---

## Final Checklist

"Son kontroller", "final checks" → `python .agent/scripts/checklist.py .`
Sira: **Security Audit → CSP Check → Permissions Review → Lint → Tests → Chrome Web Store Compliance**

---

## QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** clean-code, intelligent-routing, chrome-extension-patterns, webapp-testing,
testing-patterns, context-engineering, code-review-checklist

**Workflows:** /create, /debug, /verify, /code-review

**Scripts:** `verify_all.py`, `checklist.py`, `session_manager.py`, `setup-agent.py`,
`auto_preview.py`, `verify_project_tmp.py`

---
