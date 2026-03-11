# chrome-extension Domain Rules

## Activation Condition

"content_scripts" present in manifest.json.

## Primary Agent

frontend-specialist

## Manifest Version

Manifest V3 mandatory (V2 deprecated, new extensions not accepted).

## Security — Do Not Violate

- eval() FORBIDDEN (CSP violation, submission will be rejected)
- Remote code execution FORBIDDEN
- Minimum permission principle: only request needed permissions
- host_permissions: only domains that need to be accessed

## Architecture

- Background: Service Worker (V3 — not persistent)
- Content Script: page DOM access
- Popup: chrome.action.setPopup
- Messaging: chrome.runtime.sendMessage / chrome.tabs.sendMessage
