---
description: Package Electron app for distribution. Creates installers for Windows, macOS, and Linux.
---

# /package - Package Electron App

$ARGUMENTS

---

## Purpose

Package an Electron desktop application into distributable installers for Windows, macOS, and Linux.

---

## Sub-commands

```
/package              - Interactive packaging wizard
/package win          - Package for Windows (NSIS/MSI)
/package mac          - Package for macOS (DMG/pkg)
/package linux        - Package for Linux (AppImage/deb/rpm)
/package all          - Package for all platforms
/package --dir        - Create unpacked directory (for testing)
```

---

## Pre-Package Checklist

```markdown
### Code Quality
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] All tests passing (`npm test`)
- [ ] No devDependencies in production code

### Configuration
- [ ] `package.json` version incremented
- [ ] `electron-builder.yml` or `forge.config.js` configured
- [ ] App icons set (all sizes: 16x16 → 1024x1024)
- [ ] App ID / bundle ID unique

### Security
- [ ] Preload scripts use contextBridge
- [ ] nodeIntegration: false
- [ ] CSP headers configured
- [ ] No remote code execution paths

### Signing
- [ ] Windows: Code signing certificate (optional but recommended)
- [ ] macOS: Apple Developer ID certificate (required for distribution)
- [ ] macOS: Notarization configured
```

---

## Behavior

1. **Detect packager**
   - electron-builder (most common)
   - electron-forge
   - Custom build script

2. **Build the app**
   ```bash
   # electron-builder
   npx electron-builder --win --mac --linux

   # electron-forge
   npx electron-forge make --platform win32,darwin,linux
   ```

3. **Verify output**
   - Check installer size
   - Test installation on target platform
   - Verify auto-updater works (if configured)

---

## Output Format

````markdown
## Package Complete

### Artifacts
| Platform | Format | Size | Path |
|----------|--------|------|------|
| Windows | NSIS installer | 85 MB | dist/MyApp-1.0.0-Setup.exe |
| macOS | DMG | 92 MB | dist/MyApp-1.0.0.dmg |
| Linux | AppImage | 78 MB | dist/MyApp-1.0.0.AppImage |

### Signing Status
- Windows: [Signed / Unsigned]
- macOS: [Signed + Notarized / Unsigned]

### Next Steps
1. Test installer on each platform
2. Upload to distribution channel
3. Update auto-updater feed
````
