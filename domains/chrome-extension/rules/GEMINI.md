# GEMINI.md — Antigravity Agent System (chrome-extension)

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
| **PERMISSIONS** | "permission", "manifest", "csp", "security" | `{task-slug}.md` + security-auditor |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

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

@./gemini-modes.md

### Final Checklist

Sira: **Security Audit → CSP Check → Permissions Review → Lint → Tests → Chrome Web Store Compliance**

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

@./agents-reference.md

**Key Skills:** chrome-extension-patterns, clean-code, webapp-testing, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /publish

---
