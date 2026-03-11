# Domain: Electron Desktop App

> This directory contains an Electron desktop application project.
> Agent routing: The following rules apply to files in this directory.

## Agent Routing

- **Primary:** `frontend-specialist` — UI, renderer process, Chromium integration
- **Supporting:** `security-auditor` — IPC security, sandbox, CSP
- **Test:** `test-engineer` — Playwright, Vitest

## Skill Priority

| P0 (Critical) | P1 (Important) | P2 (Supporting) |
|-------------|-------------|-------------|
| electron-patterns | clean-code | testing-patterns |
| nodejs-best-practices | | |

## Tech Stack

- Framework: Electron 30+
- Runtime: Node.js
- Renderer: Chromium
- Testing: Playwright + Vitest

## Electron-Specific Rules

- Main/Renderer process separation MANDATORY: Business logic in main, UI in renderer
- contextBridge IPC only: `ipcMain.handle` + `ipcRenderer.invoke` pattern
- `nodeIntegration: false` MANDATORY: No Node.js access in renderer
- `contextIsolation: true` MANDATORY: Secure bridge via preload script
- Preload script: Only expose necessary APIs, minimal surface area principle
- External URLs: Use `shell.openExternal`, do not open in renderer
