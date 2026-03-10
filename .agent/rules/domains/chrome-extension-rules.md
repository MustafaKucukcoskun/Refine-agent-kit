# chrome-extension Domain Kuralları

## Aktif Olma Koşulu

manifest.json içinde "content_scripts" mevcut.

## Primary Agent

frontend-specialist

## Manifest Versiyonu

Manifest V3 zorunlu (V2 deprecated, yeni eklenti kabul edilmiyor).

## Güvenlik \u2014 İhlal Etme

- eval() YASAK (CSP ihlali, yayın reddedilir)
- Remote code execution YASAK
- Minimum izin prensibi: sadece gerekli permission'ları iste
- host_permissions: sadece erişilmesi gereken domain'ler

## Mimari

- Background: Service Worker (V3 \u2014 persistent değil)
- Content Script: sayfa DOM erişimi
- Popup: chrome.action.setPopup
- Mesajlaşma: chrome.runtime.sendMessage / chrome.tabs.sendMessage
