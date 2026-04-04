---
description: Godot 4.x game export to target platforms. Configures export presets, verifies templates, builds release binaries via headless CLI. Use for game distribution, platform builds, CI/CD export, or release packaging.
---

# /export - Godot Game Export

$ARGUMENTS

---

## Purpose

Guides the full Godot 4.x export pipeline — from export template installation through platform-specific release builds. Handles export preset configuration, headless CLI export for CI, and platform-specific post-build steps.

---

## Pre-flight Checks

> **GATE:** All checks must pass before export.

1. **Godot version & export templates**
   ```bash
   # Check Godot version
   godot --version

   # Export templates must match EXACT Godot version
   # Templates location:
   # Linux: ~/.local/share/godot/export_templates/<version>/
   # macOS: ~/Library/Application Support/Godot/export_templates/<version>/
   # Windows: %APPDATA%/Godot/export_templates/<version>/
   ```
   > **CRITICAL:** Export templates version must match editor version exactly. Mismatched versions produce silent failures or broken builds.

2. **Export presets configured**
   ```bash
   # Verify export_presets.cfg exists in project root
   ls export_presets.cfg
   ```
   - If missing: Editor → Project → Export → Add preset for target platform

3. **No script errors**
   ```bash
   godot --headless --check-only --script res://project.godot 2>&1
   ```

4. **Resources audit**
   - All referenced scenes/resources exist (no broken `res://` paths)
   - All autoloads are valid
   - No placeholder assets in release build

---

## Platform Export Matrix

| Platform | Output Format | Export Preset Name | Extra Requirements |
|----------|--------------|-------------------|-------------------|
| Windows | .exe + .pck | "Windows Desktop" | rcedit (for icon) |
| Linux | binary + .pck | "Linux/X11" | — |
| macOS | .dmg / .app | "macOS" | Code signing, notarization |
| Web/HTML5 | .html + .wasm | "Web" | COOP/COEP headers on server |
| Android | .apk / .aab | "Android" | JDK, Android SDK, debug.keystore |
| iOS | .ipa | "iOS" | Xcode, Apple Developer account |

---

## Step 1: Configure Export Preset

In Godot Editor: **Project → Export → Add...**

Key settings per platform:
- **Resources tab:** Include/exclude filters for `.import`, `.gd`, `.tscn` files
- **Features tab:** Custom feature tags for conditional exports
- **Script tab:** GDScript export mode (compiled vs text)

> **GATE:** For GDExtension (.so/.dll): add to export filters explicitly. GDExtension files are NOT auto-included.

---

## Step 2: Export via CLI (Headless)

```bash
# Release export (optimized, no debug symbols)
godot --headless --export-release "Windows Desktop" /var/builds/game.exe

# Debug export (includes debug symbols + remote debugger)
godot --headless --export-debug "Linux/X11" /var/builds/game.x86_64

# PCK-only export (data without engine binary)
godot --headless --export-pack "Windows Desktop" /var/builds/game.pck
```

> **CRITICAL:** The `godot` binary must be the **editor** binary, not an export template. `--headless` is required on servers without GPU access (CI/CD).

**Preset name must match** `export_presets.cfg` exactly (case-sensitive, quotes required if spaces).

---

## Step 3: Platform-Specific Post-Build

### Web Export
```bash
# Web exports require specific HTTP headers to function:
# Cross-Origin-Opener-Policy: same-origin
# Cross-Origin-Embedder-Policy: require-corp
#
# Without these headers, SharedArrayBuffer is unavailable and the game won't load.

# Quick test with Python:
python -m http.server 8080 --directory build/web/
# Note: Python's HTTP server does NOT set COOP/COEP headers.
# Use a proper server or add headers via .htaccess / nginx config.
```

### Android Export
```bash
# Debug keystore (auto-generated for debug builds):
# ~/.android/debug.keystore

# Release keystore (MUST be created and backed up):
keytool -genkeypair -v -keystore release.keystore \
  -alias release -keyalg RSA -keysize 2048 -validity 10000

# AAB for Google Play (not APK):
godot --headless --export-release "Android" /var/builds/game.aab
```

### macOS Export
```bash
# Notarization required for distribution outside App Store:
xcrun notarytool submit game.dmg \
  --apple-id "email@example.com" \
  --team-id "TEAMID" \
  --password "app-specific-password" \
  --wait
```

---

## Step 4: Verify Build

| Check | Command/Action |
|-------|---------------|
| Binary exists | `ls -lh build/` |
| File size reasonable | Compare against previous build |
| Runs without errors | Launch exported binary, check console |
| No missing resources | Play through first scene, check for errors |
| GDExtensions loaded | Verify native plugin functionality |

---

## Output Format

````markdown
## 🎮 Godot Export Complete

**Project:** [name]
**Godot version:** [version]
**Export preset:** [preset name]

### Build Artifacts
| Platform | File | Size |
|----------|------|------|
| [platform] | [filename] | [size] |

### Pre-flight
- [ ] Export templates installed (matching version)
- [ ] Export presets configured
- [ ] No script errors
- [ ] Resources audit clean

### Export
- [ ] CLI export successful
- [ ] Platform post-build done
- [ ] Binary launches correctly
- [ ] No missing resources at runtime

### Platform Notes
- [any platform-specific observations]
````

---

## Key Principles

- **Export template version = editor version** — even patch differences cause failures
- **`--headless` for CI** — required on GPU-less servers, prevents window spawning
- **Web exports need COOP/COEP headers** — without them, SharedArrayBuffer fails and game won't load
- **GDExtension files must be in export filters** — they are NOT auto-detected
- **Android requires AAB for Play Store** — APK only for sideloading/testing
- **PCK export** — useful for patching game data without re-distributing the engine binary
