---
description: Expo EAS Build and Submit workflow. Configures build profiles, triggers cloud builds, manages credentials, and submits to app stores. Use for React Native/Expo cloud builds, app store submission, or CI/CD mobile pipeline.
---

# /eas-build - Expo EAS Build & Submit

$ARGUMENTS

---

## Purpose

Guides the full Expo Application Services (EAS) workflow — from build profile configuration to app store submission. Handles credential management, cloud build triggers, OTA updates, and multi-environment builds.

---

## Pre-flight Checks

> **GATE:** All checks must pass before triggering a build.

1. **EAS CLI installed**
   ```bash
   npx eas-cli --version
   # If not installed: npm install -g eas-cli
   eas login
   ```

2. **Project configured**
   ```bash
   # Verify app.json / app.config.js has:
   # - expo.name
   # - expo.slug
   # - expo.ios.bundleIdentifier
   # - expo.android.package
   ```

3. **eas.json exists**
   ```bash
   # If not: initialize
   eas build:configure
   ```

---

## Step 1: Build Profile Configuration

**eas.json:**
```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": { "appleId": "your@email.com", "ascAppId": "APP_ID" },
      "android": { "serviceAccountKeyPath": "./google-sa-key.json" }
    }
  }
}
```

| Profile | Purpose | Distribution |
|---------|---------|-------------|
| development | Dev client with hot reload | Internal (team only) |
| preview | Testing builds for QA | Internal (APK/Ad Hoc) |
| production | Store release | App Store / Play Store |

---

## Step 2: Credential Setup

**iOS:**
```bash
eas credentials -p ios
# Options: Let EAS manage (recommended) or provide your own
# EAS auto-creates provisioning profiles and certificates
```

**Android:**
```bash
eas credentials -p android
# Options: Let EAS manage keystore or upload existing
```

> **CRITICAL:** If using EAS-managed credentials, they're stored on Expo servers. For enterprise, use `--local` builds with your own credentials.

---

## Step 3: Trigger Build

```bash
# Both platforms
eas build --platform all --profile production

# Single platform
eas build --platform ios --profile production
eas build --platform android --profile production

# Local build (no cloud, uses local machine)
eas build --platform ios --local
```

**Build monitoring:**
```bash
# Check build status
eas build:list --limit 5

# View build logs
eas build:view <BUILD_ID>
```

> **GATE:** Wait for build to complete. Check for build errors before proceeding.

---

## Step 4: Submit to Stores

```bash
# Auto-submit (chains build + submit)
eas build --platform all --profile production --auto-submit

# Manual submit after build
eas submit --platform ios --latest
eas submit --platform android --latest
```

**iOS requirements:**
- Apple Developer account linked: `eas credentials -p ios`
- App record exists in App Store Connect

**Android requirements:**
- Google Play service account key (JSON) configured
- App listing exists in Google Play Console

---

## Step 5: OTA Updates (Post-Release)

```bash
# Push JS-only update without new build
eas update --branch production --message "Fix login bug"

# Check update status
eas update:list --branch production
```

> OTA updates only work for JS/asset changes. Native module changes require a new build.

---

## Output Format

````markdown
## 🚀 EAS Build & Submit

**App:** [name]
**Profile:** [development/preview/production]
**SDK version:** [expo SDK version]

### Build Status
| Platform | Build ID | Status | Duration |
|----------|----------|--------|----------|
| iOS | [id] | ✅/❌ | [time] |
| Android | [id] | ✅/❌ | [time] |

### Credentials
- [ ] iOS: Provisioning profile valid
- [ ] Android: Keystore configured

### Submission
- [ ] iOS: Submitted to App Store Connect
- [ ] Android: Submitted to Google Play Console

### Post-Release
- [ ] OTA update channel configured
- [ ] Crash monitoring active
````

---

## Key Principles

- **EAS-managed credentials** are the simplest path — let EAS handle signing unless enterprise policy requires otherwise
- **`autoIncrement: true`** in production profile — prevents build number conflicts
- **`expo-dev-client`** is required for custom native modules in development builds
- **Free tier** has queue delays — paid plan gets priority builds
- **`--auto-submit`** only works if credentials are pre-configured for both stores
- **OTA vs Native** — JS-only changes can use `eas update`. Native dependency changes need full `eas build`.
