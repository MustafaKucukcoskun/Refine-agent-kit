# GEMINI.md — Antigravity Agent System (electron-desktop)

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
| **IPC/SECURITY** | "ipc", "main process", "preload", "sandbox" | `{task-slug}.md` + security-auditor |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

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

@./gemini-modes.md

### Final Checklist

Sira: **Security Audit → IPC Review → Lint → Tests → Build → Platform Test**

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

@./agents-reference.md

**Key Skills:** electron-patterns, nodejs-best-practices, clean-code, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /package

---
