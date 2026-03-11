# electron-desktop Domain Rules

## Activation Condition

"electron" or "@tauri-apps/tauri" present in package.json,
or src-tauri/tauri.conf.json present.

## Primary Agent

frontend-specialist

## Architectural Requirement

- Strictly separate Main process and Renderer process
- IPC via contextBridge (nodeIntegration: false mandatory)
- preload script: only expose required APIs

## Security (Do Not Violate)

- nodeIntegration: false (default) — do not change
- contextIsolation: true (default) — do not change
- External URL: use shell.openExternal(), do NOT open new Electron window

## Tauri Note

Rust backend required if Tauri is selected.
Use context7 documentation for Tauri API.
