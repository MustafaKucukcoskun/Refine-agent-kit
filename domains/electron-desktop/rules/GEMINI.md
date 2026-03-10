# GEMINI.md — Antigravity Agent System (electron-desktop)

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

| Tip              | Trigger                                     | Aksiyon                                |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| **SORU**         | "what is", "explain", "nasil calisir"       | Text yanit, arac yok                   |
| **SURVEY**       | "analyze", "listele", "overview"            | Session intel, dosya yok               |
| **SIMPLE CODE**  | "fix", "ekle", "degistir" (tek dosya)       | Inline edit                            |
| **COMPLEX CODE** | "build", "create", "implement", "yaz"       | `{task-slug}.md` + Agent               |
| **IPC/SECURITY** | "ipc", "main process", "preload", "sandbox" | `{task-slug}.md` + security-auditor    |
| **SLASH CMD**    | /create, /debug, /verify, /code-review      | Command flow                           |

---

## INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATIK)

**HER request'ten once otomatik agent sec ve bildir.**

### Protocol

1. **Sessiz Analiz:** Domain tespit et (Main Process? Renderer? IPC? Security?)
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

## TIER 1: ELECTRON DESKTOP KOD KURALLARI

### Primary Agent: `frontend-specialist`
### Supporting: `security-auditor`, `test-engineer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | electron-patterns, nodejs-best-practices |
| **P1** | clean-code |
| **P2** | testing-patterns |

### Electron-Specific Rules

- **Main/Renderer ayirimi ZORUNLU:** Is mantigi main process'te, UI renderer'da. Karistirma.
- **contextBridge IPC only:** `ipcMain.handle` + `ipcRenderer.invoke` pattern. Direct `remote` modulu YASAK.
- **nodeIntegration: false:** Renderer process'te Node.js erisimi kapatilmali.
- **contextIsolation: true:** Preload script ile guvenli kopru kurulmali.
- **Preload script:** Sadece gerekli API'leri expose et. Minimal yuzey alani prensibi.
- **shell.openExternal:** External URL'ler icin kullan. Renderer'da `window.open` yasak.
- **Testing:** Playwright + Vitest. Main/Renderer ayri test edilmeli.

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

## TIER 2: ELECTRON SECURITY & ARCHITECTURE KURALLARI

### Security (KRITIK)

- CSP header: Restrictive Content-Security-Policy ayarla
- No `eval()`: Dinamik kod calistirma YASAK
- No `remote` module: `@electron/remote` kullanma, IPC tercih et
- Protocol handler: Custom protocol icin `protocol.handle` guvenli kullan
- Auto-update: `electron-updater` ile imzali guncelleme
- File access: Dialog API ile kullanici secimi, arbitrary path erisimi yok

### Architecture

- Multi-window: BrowserWindow yonetimi, window pool pattern
- Tray integration: System tray destegiyle arka plan calismasi
- Native modules: `node-addon-api` veya prebuild, rebuild otomasyonu
- Storage: `electron-store` veya SQLite, encrypted storage for sensitive data

### Build & Distribution

- electron-builder veya electron-forge: Platform-specific build
- Code signing: macOS notarization + Windows Authenticode
- Auto-update: Differential update destegi
- ASAR: `asar` packaging, no unpack gerekmedikce

---

## Final Checklist

"Son kontroller", "final checks" → `python .agent/scripts/checklist.py .`
Sira: **Security Audit → IPC Review → Lint → Tests → Build → Platform Test**

---

## QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** clean-code, intelligent-routing, electron-patterns, nodejs-best-practices,
testing-patterns, performance-profiling, context-engineering, code-review-checklist

**Workflows:** /create, /debug, /verify, /code-review

**Scripts:** `verify_all.py`, `checklist.py`, `session_manager.py`, `setup-agent.py`,
`auto_preview.py`, `verify_project_tmp.py`

---
