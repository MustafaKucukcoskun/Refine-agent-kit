---
description: EAS Build command for React Native / Expo apps. Manages cloud builds for Android and iOS.
---

# /eas-build - Expo Application Services Build

$ARGUMENTS

---

## Purpose

Build React Native / Expo apps using EAS (Expo Application Services) for Android and iOS platforms.

---

## Sub-commands

```
/eas-build                    - Interactive build wizard
/eas-build android            - Build Android (APK/AAB)
/eas-build ios                - Build iOS (IPA)
/eas-build all                - Build both platforms
/eas-build --profile preview  - Use preview profile
/eas-build status             - Check build status
```

---

## Pre-Build Checklist

```markdown
### Code Quality
- [ ] TypeScript errors resolved (`npx tsc --noEmit`)
- [ ] All tests passing (`npm test`)
- [ ] No console.log in production code

### Configuration
- [ ] app.json / app.config.js version incremented
- [ ] eas.json build profiles configured
- [ ] Environment variables set in EAS Secrets

### Platform-Specific
- [ ] Android: Keystore configured in eas.json
- [ ] iOS: Apple Developer account connected
- [ ] iOS: Provisioning profile valid
```

---

## Behavior

1. **Check EAS CLI**
   - Verify `eas-cli` installed (`npx eas --version`)
   - Check login status (`npx eas whoami`)

2. **Validate Configuration**
   - Read `eas.json` for build profiles
   - Verify `app.json` / `app.config.js`
   - Check native module compatibility

3. **Execute Build**
   ```bash
   # Development build
   npx eas build --platform android --profile development

   # Preview (internal testing)
   npx eas build --platform all --profile preview

   # Production (store submission)
   npx eas build --platform all --profile production
   ```

4. **Monitor & Report**
   - Show build URL for tracking
   - Report success/failure with download links

---

## Output Format

````markdown
## EAS Build: [Platform]

### Configuration
- **Profile:** [development/preview/production]
- **Platform:** [android/ios/all]
- **Version:** [app version]
- **Build Number:** [build number]

### Status
- Build URL: [EAS dashboard URL]
- [Queued → Building → Complete]

### Artifacts
- Android: [APK/AAB download link]
- iOS: [IPA download link or TestFlight status]
````

---

## Common Issues

| Issue | Fix |
|-------|-----|
| `eas-cli` not found | `npm install -g eas-cli` |
| Not logged in | `npx eas login` |
| Keystore missing | `npx eas credentials` |
| iOS cert expired | Renew in Apple Developer Portal |
| Build timeout | Check `eas.json` resource class |
