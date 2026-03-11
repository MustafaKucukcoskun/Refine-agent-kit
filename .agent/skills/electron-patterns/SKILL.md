# Electron Patterns Skill

## 1. Architectural Principles (Main vs Renderer)

- **Main Process:** The primary process with full access to Node.js APIs. Window management (`BrowserWindow`), native file system, and IPC listening should be handled here.
- **Renderer Process:** A Chromium-based web interface. It should **NOT** have direct access to Node.js APIs (security violation). Move Node logic to Main and communicate via IPC (Inter-Process Communication).

## 2. Secure IPC Usage (ContextBridge)

- Only expose the functions we need to the Renderer via preload scripts.
- **Preload.js Example:**

  ```javascript
  const { contextBridge, ipcRenderer } = require("electron");

  contextBridge.exposeInMainWorld("myAPI", {
    readFile: (path) => ipcRenderer.invoke("read-file", path), // Two-way (returns Promise)
    onUpdateMsg: (callback) =>
      ipcRenderer.on("update-msg", (_event, value) => callback(value)), // One-way (Main -> Renderer)
  });
  ```

- **Main.js Example:**
  ```javascript
  ipcMain.handle("read-file", async (event, path) => {
    return await fs.promises.readFile(path, "utf8");
  });
  ```

## 3. Window Management (BrowserWindow)

- Do not override the secure default settings when creating windows:
  ```javascript
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false, // NEVER set to true
      contextIsolation: true, // NEVER set to false
      preload: path.join(__dirname, "preload.js"), // Preload script is mandatory
    },
  });
  ```
- If loading a local HTML file use `win.loadFile('index.html')`, if loading a URL (React/Vue dev server) use `win.loadURL('http://localhost:3000')`.
- To open external links (e.g., href="https://google.com") in the user's default browser instead of the Electron window:
  ```javascript
  win.webContents.setWindowOpenHandler(({ url }) => {
    require("electron").shell.openExternal(url);
    return { action: "deny" };
  });
  ```

## 4. Application Packaging (electron-builder)

- Always prefer `electron-builder` for distribution. (`.nsis` for Windows, `.dmg` for Mac, `.AppImage` for Linux).
- Use the `electron-updater` package for Auto-Update. Triggering `autoUpdater.checkForUpdatesAndNotify()` on application startup is the standard approach.
