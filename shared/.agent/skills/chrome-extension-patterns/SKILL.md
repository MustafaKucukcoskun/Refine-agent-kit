# Chrome Extension Patterns Skill

## 1. Manifest V3 Temelleri

- Yeni eklentiler her zaman `manifest.json` versiyonu `3` olmalıdır. V2 desteği tamamen kalkmıştır.
- **Temel alanlar:** `name`, `version`, `manifest_version: 3`, `action` (popup için, eskiden browser_action'dı).

## 2. Güvenlik İhlallerini Önleme

- **YASAKLAR:** Manifest V3'te `eval()` ve dışarıdan barındırılan (remote hosted) her türlü kodun (JS dosyaları, CDN'ler) çalıştırılması yasaktır. React veya başka bir framework kullanıyorsanız kodu build alıp (bundle) eklenti içine gömmelisiniz. CSP (Content Security Policy) buna izin vermez.
- `permissions`: API erişimi için (ör. `storage`, `tabs`, `activeTab`).
- `host_permissions`: Belirli domainlerde AJAX/Fetch isteği yapmak için `<all_urls>` yerine sadece ihtiyaç duyulanı (ör. `*://api.example.com/*`) girin.

## 3. Mimari Parçalar

- **Background (Service Worker):** Arkada çalışan görünmez işçidir. V3 ile Service Worker olarak adlandırılır. Artık sürekli çalışmaz (persistent değildir). Olaylar (events) ile uyanır. Bu yüzden global değişkende state tutmayın, veriyi Chrome storage'da saklayın!
  ```json
  "background": { "service_worker": "background.js" }
  ```
- **Content Scripts:** Sadece web sayfalarının (DOM) içine enjekte edilen koddur. Chrome eklenti API'lerinin çoğuna (örneğin `chrome.tabs`) erişemez, erişebildiği nadir API'ler mesajlaşma (sendMessage) ve storage'dır.
  ```json
  "content_scripts": [{ "matches": ["<all_urls>"], "js": ["content.js"] }]
  ```
- **Popup:** `chrome.action.setPopup` ile açılan basit HTML penceresidir. Her açılıp kapandığında yaşam döngüsü baştan başlar.

## 4. Mesajlaşma (Message Passing)

Content Script'in Service Worker'dan veya Popup'tan komut/veri alması işlemidir. Veya tam tersi.

- **Uzun süren senkronizasyon:** Mesaj dinleyicisinde (onMessage) asenkron bir `sendResponse` yapacaksanız dinleyici fonksiyondan `return true;` dönmelisiniz.

  ```javascript
  // Background (Service Worker) -> Content Script'e veya Popup'tan Content Script'e konuşurken önce tab bulmalısınız
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, (response) => { ... });
  });

  // Content Script -> Background veya Popup'a Konuşurken:
  chrome.runtime.sendMessage({greeting: "hello"}, (response) => { ... });

  // İkisinde de Mesajı Dinlerken:
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.greeting === "hello") {
      sendResponse({farewell: "goodbye"});
      return true; // EĞER asenkron işlem varsa bu şart.
    }
  });
  ```

## 5. Veri Kaydetme (chrome.storage)

- Standard localStorage kullanmayın. `chrome.storage.local` veya `chrome.storage.sync` (Kullanıcının google hesabıyla sekronize olur, limiti çok düşüktür) kullanın. Promise tabanlıdır.
