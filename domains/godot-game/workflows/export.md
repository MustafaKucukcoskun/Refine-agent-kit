---
description: Export Godot game for distribution. Platform-specific builds and optimization.
---

# /export - Godot Game Export

$ARGUMENTS

---

## Purpose

Export a Godot game project for distribution on target platforms.

---

## Sub-commands

```
/export                    - Interactive export wizard
/export windows            - Export for Windows
/export linux              - Export for Linux
/export macos              - Export for macOS
/export web                - Export for HTML5/Web
/export android            - Export for Android
/export all                - Export for all configured platforms
/export --debug            - Debug export (larger, with symbols)
```

---

## Pre-Export Checklist

```markdown
### Project
- [ ] No script errors (Editor console clean)
- [ ] All scenes load without warnings
- [ ] Export presets configured (Project → Export)
- [ ] Export templates installed for target platform

### Assets
- [ ] Unused assets removed
- [ ] Textures properly compressed (import settings)
- [ ] Audio compressed (OGG for music, WAV for SFX)

### Platform-Specific
- [ ] Windows: .exe icon set
- [ ] Web: SharedArrayBuffer if threads used
- [ ] Android: Keystore configured, min SDK set
- [ ] macOS: Code signing (optional for distribution)

### Version
- [ ] Version number in project settings
- [ ] Version displayed in-game matches
```

---

## Behavior

1. **Check export presets**
   ```
   Project → Export → Presets configured?
   ```

2. **Verify export templates**
   ```bash
   # Templates location:
   # ~/.local/share/godot/export_templates/4.x.stable/
   # Windows: %APPDATA%/Godot/export_templates/4.x.stable/
   ```

3. **Export**
   ```bash
   # CLI export (headless)
   godot --headless --export-release "Windows Desktop" builds/windows/game.exe
   godot --headless --export-release "Linux" builds/linux/game.x86_64
   godot --headless --export-release "Web" builds/web/index.html
   godot --headless --export-release "Android" builds/android/game.apk
   ```

4. **Verify**
   - Run exported build on target
   - Check file sizes
   - Test critical paths

---

## Output Format

````markdown
## Export: [Game Name]

### Builds
| Platform | Size | Path | Status |
|----------|------|------|--------|
| Windows | [size] | builds/windows/game.exe | [Pass/Fail] |
| Linux | [size] | builds/linux/game.x86_64 | [Pass/Fail] |
| Web | [size] | builds/web/index.html | [Pass/Fail] |

### Distribution
| Platform | Upload To |
|----------|-----------|
| Desktop | itch.io, Steam |
| Web | itch.io, Newgrounds, self-hosted |
| Android | Google Play |

### Next Steps
1. Test on target platform
2. Upload to distribution channel
3. Create store page / release notes
````
