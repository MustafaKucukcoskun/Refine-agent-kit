# Domain: Chrome Extension (Manifest V3)

> Bu dizin Chrome Extension (Manifest V3) projesi icerir.
> Agent routing: Bu dizindeki dosyalar icin asagidaki kurallar gecerlidir.

## Agent Routing

- **Primary:** `frontend-specialist` — Extension UI, content scripts, popup/options pages
- **Supporting:** `security-auditor` — CSP, permissions, data isolation

## Skill Priority

| P0 (Kritik) | P1 (Onemli) | P2 (Destek) |
|-------------|-------------|-------------|
| chrome-extension-patterns | webapp-testing | testing-patterns |
| clean-code | | |

## Tech Stack

- Manifest: V3 (V2 YASAK)
- Background: Service Worker
- APIs: Chrome Extension APIs
- Testing: Chrome Extension testing tools

## Chrome Extension-Specific Rules

- Manifest V3 ZORUNLU: V2 kullanimi kesinlikle yasak
- `eval()` YASAK: CSP ihlali, dinamik kod calistirma yok
- Remote code execution YASAK: Tum kod extension icerisinde olmali
- Minimum permissions: Sadece gerekli permission'lari talep et
- `host_permissions`: Sadece gerekli domain'ler, `<all_urls>` yasak
- Service Worker background: Persistent background page yok
- Mesajlasma: `chrome.runtime.sendMessage` / `chrome.runtime.onMessage`
