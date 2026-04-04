---
description: Electron or Tauri desktop app packaging. Builds platform-specific installers with code signing, notarization, and auto-update configuration. Use for desktop distribution, installer creation, or release builds.
---

# /package - Desktop App Packaging

$ARGUMENTS

---

## Purpose

Builds production-ready desktop application installers for Windows, macOS, and Linux. Handles code signing, macOS notarization, auto-update configuration, and cross-platform artifact generation.

---

## Pre-flight Checks

> **GATE:** All checks must pass before packaging.

1. **App runs in production mode**
   ```bash
   npm run build && npm start  # Verify no dev-only errors
   ```

2. **Package config exists**
   ```bash
   # electron-builder: check package.json "build" field or electron-builder.yml
   # electron-forge: check forge.config.js
   # Tauri: check src-tauri/tauri.conf.json
   ```

3. **App icons present**
   | Platform | Format | Location |
   |----------|--------|----------|
   | Windows | .ico (256×256) | build/icon.ico |
   | macOS | .icns (512×512@2x) | build/icon.icns |
   | Linux | .png (512×512) | build/icon.png |

4. **Version bumped**
   ```bash
   node -e "console.log(require('./package.json').version)"
   ```

---

## Framework Detection

| Framework | Config File | Build Command | Output |
|-----------|------------|---------------|--------|
| electron-builder | electron-builder.yml | `npx electron-builder` | dist/ |
| electron-forge | forge.config.js | `npx electron-forge make` | out/ |
| Tauri | tauri.conf.json | `npx tauri build` | src-tauri/target/release/bundle/ |

---

## Step 1: Code Signing Setup

### Windows
```bash
# EV Code Signing Certificate required for SmartScreen trust
# Set environment variables:
export CSC_LINK="path/to/certificate.pfx"
export CSC_KEY_PASSWORD="certificate-password"
```

### macOS
```bash
# Requires Apple Developer account
# List available signing identities:
security find-identity -v -p codesigning

# Set for electron-builder:
export CSC_NAME="Developer ID Application: Your Name (TEAMID)"
```

> **CRITICAL:** macOS apps without notarization are quarantined by Gatekeeper. Users cannot open them.

### Linux
- No code signing required for AppImage/deb/rpm
- Snap Store requires signing via `snapcraft`

---

## Step 2: Build Installers

**electron-builder:**
```bash
# All platforms (from macOS host for cross-compilation):
npx electron-builder --mac --win --linux

# Single platform:
npx electron-builder --win nsis      # Windows NSIS installer
npx electron-builder --mac dmg       # macOS DMG
npx electron-builder --linux AppImage # Linux AppImage
```

**Tauri:**
```bash
npx tauri build
# Produces: .msi (Windows), .dmg (macOS), .AppImage/.deb (Linux)
```

---

## Step 3: macOS Notarization

```bash
# electron-builder handles this automatically if configured:
# In electron-builder.yml:
#   afterSign: scripts/notarize.js

# Manual notarization:
xcrun notarytool submit app.dmg \
  --apple-id "your@email.com" \
  --team-id "TEAMID" \
  --password "app-specific-password" \
  --wait
```

> **GATE:** Notarization must succeed before distribution. Check: `xcrun stapler validate app.dmg`

---

## Step 4: Auto-Update Configuration

**electron-updater (electron-builder):**
```yaml
# electron-builder.yml
publish:
  provider: github  # or: s3, generic
  owner: your-org
  repo: your-app
```

**Tauri:**
```json
// tauri.conf.json
"updater": {
  "active": true,
  "endpoints": ["https://your-server.com/updates/{{target}}/{{current_version}}"],
  "pubkey": "YOUR_PUBLIC_KEY"
}
```

---

## Step 5: Verify Artifacts

```bash
# List built artifacts
ls -lh dist/   # or out/ for forge, src-tauri/target/release/bundle/ for Tauri

# Check file sizes (flag if unexpectedly large)
# Typical Electron app: 60-150MB
# Typical Tauri app: 2-10MB
```

| Check | Action |
|-------|--------|
| Size > 200MB | Audit dependencies, enable asar |
| Missing icon | Platform will show generic icon |
| No code signature | Windows SmartScreen warning, macOS Gatekeeper block |
| Native modules | Rebuild for target: `electron-rebuild` |

---

## Output Format

````markdown
## 📦 Desktop Package Built

**App:** [name] v[version]
**Framework:** [electron-builder/forge/tauri]

### Artifacts
| Platform | Format | Size | Signed |
|----------|--------|------|--------|
| Windows | .exe (NSIS) | XX MB | ✅/❌ |
| macOS | .dmg | XX MB | ✅/❌ |
| Linux | .AppImage | XX MB | N/A |

### Verification
- [ ] App launches from installer
- [ ] Code signing valid
- [ ] macOS notarization passed
- [ ] Auto-update configured
- [ ] File size acceptable
````

---

## Key Principles

- **Never distribute unsigned macOS apps** — they will be blocked by Gatekeeper
- **asar packaging** — enabled by default in electron-builder; native modules may break if not excluded
- **electron-builder vs electron-forge** — pick one, they are incompatible. Do not mix configs.
- **Cross-compilation** — macOS apps must be built on macOS (code signing requires Keychain). Windows/Linux can be cross-compiled.
- **Tauri is significantly smaller** — 2-10MB vs 60-150MB for Electron. Consider for new projects.
