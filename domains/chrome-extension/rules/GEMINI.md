# GEMINI.md — Antigravity Agent System (chrome-extension)

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
| **PERMISSIONS** | "permission", "manifest", "csp", "security" | `{task-slug}.md` + security-auditor |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: CHROME EXTENSION CODE RULES

### Primary Agent: `frontend-specialist`
### Supporting: `security-auditor`

### Skill Priority

| Priority | Skills |
|----------|--------|
| **P0** | chrome-extension-patterns, clean-code |
| **P1** | webapp-testing |
| **P2** | testing-patterns |

### Chrome Extension-Specific Rules

- **Manifest V3 MANDATORY:** V2 transition period is over. V3 only.
- **eval() ABSOLUTELY FORBIDDEN:** CSP violation. `new Function()`, `setTimeout(string)` also forbidden.
- **Remote code execution FORBIDDEN:** All code must be inside the extension bundle. No loading code from CDN.
- **Minimum permissions:** Only request necessary permissions. `<all_urls>` FORBIDDEN.
- **host_permissions:** Only required domains. Avoid broad scope.
- **Service Worker background:** No persistent background page. Event-driven design.
- **Messaging:** `chrome.runtime.sendMessage` / `chrome.runtime.onMessage` pattern.
- **Storage:** `chrome.storage.local` or `chrome.storage.sync`. localStorage FORBIDDEN (not available in background).

@./gemini-modes.md

### Final Checklist

Order: **Security Audit → CSP Check → Permissions Review → Lint → Tests → Chrome Web Store Compliance**

---

## TIER 2: CHROME EXTENSION ARCHITECTURE RULES

### Extension Components

- **Background (Service Worker):** Event listeners, alarm API, state management
- **Content Scripts:** DOM manipulation, page context isolation, CSS injection
- **Popup:** Small UI, quick interaction, show state
- **Options Page:** Settings, configuration, persist with chrome.storage
- **Side Panel:** Chrome 114+ side panel API

### Security (CRITICAL)

- Content Security Policy: Define strict CSP in manifest
- Cross-origin: `fetch` with CORS, proxy pattern from background
- User data: Collect minimum data, encrypt sensitive data with `chrome.storage`
- Permission justification: Prepare Chrome Web Store explanation for every permission

### Messaging Patterns

- `chrome.runtime.sendMessage`: Popup ↔ Background
- `chrome.tabs.sendMessage`: Background → Content Script
- `chrome.runtime.connect`: Long-lived connection (port)
- External messaging: Use `externally_connectable` carefully

### Performance

- Service Worker lifecycle: Terminates when idle, persist state
- Alarm API: Use `chrome.alarms` for periodic tasks
- Lazy loading: Load large modules with dynamic import

---

@./agents-reference.md

**Key Skills:** chrome-extension-patterns, clean-code, webapp-testing, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /publish

---
