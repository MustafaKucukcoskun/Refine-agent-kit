---
name: chrome-extension-patterns
description: Chrome Extension Manifest V3 patterns, secure architecture, IPC messaging, and extension storage best practices.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Chrome Extension Patterns Skill

## 1. Manifest V3 Fundamentals

- New extensions must always use `manifest.json` version `3`. V2 support has been completely removed.
- **Required fields:** `name`, `version`, `manifest_version: 3`, `action` (for popup; formerly browser_action).

## 2. Preventing Security Violations

- **FORBIDDEN:** In Manifest V3, `eval()` and all remotely hosted code (JS files, CDNs) are forbidden. If using React or another framework, you must build (bundle) the code and embed it within the extension. CSP (Content Security Policy) does not allow this.
- `permissions`: For API access (e.g., `storage`, `tabs`, `activeTab`).
- `host_permissions`: For making AJAX/Fetch requests on specific domains. Instead of `<all_urls>`, specify only what is needed (e.g., `*://api.example.com/*`).

## 3. Architectural Components

- **Background (Service Worker):** The invisible worker running in the background. In V3, it is called a Service Worker. It no longer runs persistently. It wakes up on events. Therefore, do not store state in global variables — save data in Chrome storage!
  ```json
  "background": { "service_worker": "background.js" }
  ```
- **Content Scripts:** Code injected only into web page DOM. Cannot access most Chrome extension APIs (e.g., `chrome.tabs`); the few accessible APIs are messaging (sendMessage) and storage.
  ```json
  "content_scripts": [{ "matches": ["<all_urls>"], "js": ["content.js"] }]
  ```
- **Popup:** A simple HTML window opened via `chrome.action.setPopup`. Its lifecycle restarts every time it is opened and closed.

## 4. Message Passing

The process of a Content Script receiving commands/data from the Service Worker or Popup, or vice versa.

- **Long-running synchronization:** If you will call `sendResponse` asynchronously in a message listener (onMessage), you must `return true;` from the listener function.

  ```javascript
  // Background (Service Worker) -> Content Script or Popup -> Content Script: first find the tab
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, (response) => { ... });
  });

  // Content Script -> Background or Popup:
  chrome.runtime.sendMessage({greeting: "hello"}, (response) => { ... });

  // Listening for messages in both:
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.greeting === "hello") {
      sendResponse({farewell: "goodbye"});
      return true; // REQUIRED if there is an async operation.
    }
  });
  ```

## 5. Data Storage (chrome.storage)

- Do not use standard localStorage. Use `chrome.storage.local` or `chrome.storage.sync` (syncs with the user's Google account; has very low limits). It is Promise-based.
