# Domain: Chrome Extension (Manifest V3)

> This directory contains a Chrome Extension (Manifest V3) project.
> Agent routing: The following rules apply to files in this directory.

## Agent Routing

- **Primary:** `frontend-specialist` — Extension UI, content scripts, popup/options pages
- **Supporting:** `security-auditor` — CSP, permissions, data isolation

## Skill Priority

| P0 (Critical) | P1 (Important) | P2 (Supporting) |
|-------------|-------------|-------------|
| chrome-extension-patterns | webapp-testing | testing-patterns |
| clean-code | | |

## Tech Stack

- Manifest: V3 (V2 FORBIDDEN)
- Background: Service Worker
- APIs: Chrome Extension APIs
- Testing: Chrome Extension testing tools

## Chrome Extension-Specific Rules

- Manifest V3 MANDATORY: V2 usage is absolutely forbidden
- `eval()` FORBIDDEN: CSP violation, no dynamic code execution
- Remote code execution FORBIDDEN: All code must be inside the extension
- Minimum permissions: Only request necessary permissions
- `host_permissions`: Only required domains, `<all_urls>` forbidden
- Service Worker background: No persistent background page
- Messaging: `chrome.runtime.sendMessage` / `chrome.runtime.onMessage`
