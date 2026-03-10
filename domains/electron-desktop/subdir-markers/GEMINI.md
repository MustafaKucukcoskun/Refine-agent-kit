# Domain: Electron Desktop App

> Bu dizin Electron masaustu uygulama projesi icerir.
> Agent routing: Bu dizindeki dosyalar icin asagidaki kurallar gecerlidir.

## Agent Routing

- **Primary:** `frontend-specialist` — UI, renderer process, Chromium integration
- **Supporting:** `security-auditor` — IPC security, sandbox, CSP
- **Test:** `test-engineer` — Playwright, Vitest

## Skill Priority

| P0 (Kritik) | P1 (Onemli) | P2 (Destek) |
|-------------|-------------|-------------|
| electron-patterns | clean-code | testing-patterns |
| nodejs-best-practices | | |

## Tech Stack

- Framework: Electron 30+
- Runtime: Node.js
- Renderer: Chromium
- Testing: Playwright + Vitest

## Electron-Specific Rules

- Main/Renderer process ayirimi ZORUNLU: Is mantigi main'de, UI renderer'da
- contextBridge IPC only: `ipcMain.handle` + `ipcRenderer.invoke` pattern
- `nodeIntegration: false` ZORUNLU: Renderer'da Node.js erisimi yok
- `contextIsolation: true` ZORUNLU: Preload script ile guvenli kopru
- Preload script: Sadece gerekli API'leri expose et, minimal yuzey alani
- External URL'ler: `shell.openExternal` kullan, renderer'da acma
