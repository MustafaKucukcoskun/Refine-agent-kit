# Electron Patterns Skill

## 1. Mimari Prensipler (Main vs Renderer)

- **Main Process:** Node.js API'lerine tam erişimi olan asıl süreçtir. Pencere yönetimi (`BrowserWindow`) ve yerel dosya sistemi, IPC dinleme işleri burada olmalıdır.
- **Renderer Process:** Chromium tabanlı web arayüzüdür. Node.js API'lerine direkt erişimi **olmamalıdır** (Güvenlik ihlali). Node logic'ini Main'e taşıyın ve IPC (Inter-Process Communication) ile konuşun.

## 2. Güvenli IPC Kullanımı (ContextBridge)

- Preload scriptleri ile sadece ihtiyacımız olan fonksiyonları Renderer'a açmalıyız.
- **Preload.js Örneği:**

  ```javascript
  const { contextBridge, ipcRenderer } = require("electron");

  contextBridge.exposeInMainWorld("myAPI", {
    readFile: (path) => ipcRenderer.invoke("read-file", path), // İki yönlü (Promise döndürür)
    onUpdateMsg: (callback) =>
      ipcRenderer.on("update-msg", (_event, value) => callback(value)), // Tek yönlü (Main -> Renderer)
  });
  ```

- **Main.js Örneği:**
  ```javascript
  ipcMain.handle("read-file", async (event, path) => {
    return await fs.promises.readFile(path, "utf8");
  });
  ```

## 3. Pencere Yönetimi (BrowserWindow)

- Pencereleri açarken default olan güvenli ayarları bozmayın:
  ```javascript
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false, // ASLA true YAPMAYIN
      contextIsolation: true, // ASLA false YAPMAYIN
      preload: path.join(__dirname, "preload.js"), // Preload scripti zorunlu
    },
  });
  ```
- Lokal HTML dosyası yüklüyorsanız `win.loadFile('index.html')`, URL yüklüyorsanız (React/Vue dev server) `win.loadURL('http://localhost:3000')`.
- Harici linkleri (örn. href="https://google.com") Electron penceresi içinde değil kullanıcının varsayılan tarayıcısında açmak için:
  ```javascript
  win.webContents.setWindowOpenHandler(({ url }) => {
    require("electron").shell.openExternal(url);
    return { action: "deny" };
  });
  ```

## 4. Uygulama Paketleme (electron-builder)

- Dağıtım için her zaman `electron-builder` tercih edin. (Windows için `.nsis`, Mac için `.dmg`, Linux için `.AppImage`).
- Auto-Update için `electron-updater` paketini kullanın. Uygulama açılışında `autoUpdater.checkForUpdatesAndNotify()` tetiklemesi standart yaklaşımdır.
