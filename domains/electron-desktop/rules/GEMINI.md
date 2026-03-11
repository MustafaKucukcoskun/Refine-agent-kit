# GEMINI.md — Antigravity Agent System (electron-desktop)

> This file defines the agent routing and skill system for this workspace.
> Global code quality rules are loaded from ~/.gemini/GEMINI.md.

---

@./base-protocol.md

---

## REQUEST CLASSIFIER (STEP 1)

| Type | Trigger | Action |
|------|---------|--------|
| **QUESTION** | "what is", "explain", "how does it work" | Text response |
| **SIMPLE CODE** | "fix", "add", "change" (single file) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement" | `{task-slug}.md` + Agent |
| **IPC/SECURITY** | "ipc", "main process", "preload", "sandbox" | `{task-slug}.md` + security-auditor |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: ELECTRON DESKTOP CODE RULES

### Primary Agent: `frontend-specialist`
### Supporting: `security-auditor`, `test-engineer`

### Skill Priority

| Priority | Skills |
|----------|--------|
| **P0** | electron-patterns, nodejs-best-practices |
| **P1** | clean-code |
| **P2** | testing-patterns |

### Electron-Specific Rules

- **Main/Renderer separation MANDATORY:** Business logic in main process, UI in renderer. Do not mix.
- **contextBridge IPC only:** `ipcMain.handle` + `ipcRenderer.invoke` pattern. Direct `remote` module FORBIDDEN.
- **nodeIntegration: false:** Node.js access must be disabled in renderer process.
- **contextIsolation: true:** Secure bridge must be established via preload script.
- **Preload script:** Only expose necessary APIs. Minimal surface area principle.
- **shell.openExternal:** Use for external URLs. `window.open` in renderer is forbidden.
- **Testing:** Playwright + Vitest. Main/Renderer must be tested separately.

@./gemini-modes.md

### Final Checklist

Order: **Security Audit → IPC Review → Lint → Tests → Build → Platform Test**

---

## TIER 2: ELECTRON SECURITY & ARCHITECTURE RULES

### Security (CRITICAL)

- CSP header: Set restrictive Content-Security-Policy
- No `eval()`: Dynamic code execution FORBIDDEN
- No `remote` module: Do not use `@electron/remote`, prefer IPC
- Protocol handler: Use `protocol.handle` securely for custom protocols
- Auto-update: Signed updates with `electron-updater`
- File access: User selection via Dialog API, no arbitrary path access

### Architecture

- Multi-window: BrowserWindow management, window pool pattern
- Tray integration: Background operation with system tray support
- Native modules: `node-addon-api` or prebuild, rebuild automation
- Storage: `electron-store` or SQLite, encrypted storage for sensitive data

### Build & Distribution

- electron-builder or electron-forge: Platform-specific build
- Code signing: macOS notarization + Windows Authenticode
- Auto-update: Differential update support
- ASAR: `asar` packaging, no unpack unless necessary

---

@./agents-reference.md

**Key Skills:** electron-patterns, nodejs-best-practices, clean-code, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /package

---
