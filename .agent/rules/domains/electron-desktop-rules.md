# electron-desktop Domain Kuralları

## Aktif Olma Koşulu

package.json içinde "electron" veya "@tauri-apps/tauri" mevcut,
ya da src-tauri/tauri.conf.json mevcut.

## Primary Agent

frontend-specialist

## Mimari Zorunluluğu

- Main process ve Renderer process kesinlikle ayrı tut
- contextBridge üzerinden IPC (nodeIntegration: false zorunlu)
- preload script: sadece gerekli API'leri expose et

## Güvenlik (İhlal Etme)

- nodeIntegration: false (default) \u2014 değiştirme
- contextIsolation: true (default) \u2014 değiştirme
- Harici URL: shell.openExternal() kullan, yeni Electron window AÇMA

## Tauri Notu

Tauri seçilmişse Rust backend gerekir.
Tauri API için context7 dökümantasyonunu kullan.
