---
description: Flutter app store deployment for iOS App Store and Google Play Store. Handles signing, release builds, store submission, and phased rollout. Use for mobile app publishing, store release, or production deployment.
---

# /store-deploy - App Store Deployment

$ARGUMENTS

---

## Purpose

Guides Flutter app deployment to iOS App Store and Google Play Store — from signing configuration through store submission. Handles platform-specific build commands, signing credentials, and store metadata.

---

## Pre-flight Checks

> **GATE:** All checks must pass before building release artifacts.

1. **Version & build number**
   ```yaml
   # pubspec.yaml — version must be incremented
   version: 1.2.0+15   # format: semver+buildNumber
   ```
   - Build number must strictly increment per store (cannot reuse)
   - Google Play: `versionCode` (integer, always increasing)
   - App Store: `CFBundleVersion` (always increasing per upload)

2. **Flutter doctor**
   ```bash
   flutter doctor -v
   # All checks must pass for target platforms
   ```

3. **Tests pass**
   ```bash
   flutter test
   flutter analyze
   ```

---

## Platform: Android (Google Play)

### Step 1: Signing Configuration

```bash
# Generate keystore (first time only)
keytool -genkey -v -keystore ~/upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload
```

**android/key.properties** (gitignored):
```properties
storePassword=<password>
keyPassword=<password>
keyAlias=upload
storeFile=<path>/upload-keystore.jks
```

> **CRITICAL:** Losing the keystore = losing the ability to update the app. Back it up securely.

### Step 2: Build AAB

```bash
# Google Play requires AAB (not APK) for new apps
flutter build appbundle --release

# Output: build/app/outputs/bundle/release/app-release.aab
```

### Step 3: Upload to Play Console

- Google Play Console → Release → Production → Create new release
- Upload AAB
- Add release notes
- Review and roll out (staged rollout recommended: start at 10%)

---

## Platform: iOS (App Store)

### Step 1: Signing Setup

```bash
# Requires Apple Developer account ($99/year)
# Open Xcode to manage signing:
open ios/Runner.xcworkspace
```

- Xcode → Runner → Signing & Capabilities
- Select team and provisioning profile
- Bundle identifier must match App Store Connect record

### Step 2: Build IPA

```bash
flutter build ipa --release

# Output: build/ios/ipa/Runner.ipa
```

> If build fails with signing errors, open Xcode and resolve certificates first.

### Step 3: Upload to App Store Connect

**Option A — Xcode:**
```bash
open build/ios/archive/Runner.xcarchive
# Xcode → Distribute App → App Store Connect
```

**Option B — CLI:**
```bash
xcrun altool --upload-app -f build/ios/ipa/Runner.ipa \
  -t ios -u "apple-id@email.com" -p "app-specific-password"
```

**Option C — Fastlane:**
```bash
cd ios && fastlane release
```

---

## Step 4: Store Metadata

| Field | Google Play | App Store |
|-------|------------|-----------|
| Screenshots | Phone + Tablet (min 2) | 6.7", 6.5", 5.5" (required sizes) |
| Description | 4000 char max | 4000 char max |
| Short description | 80 char | Subtitle 30 char |
| Privacy policy | Required URL | Required URL |
| Content rating | IARC questionnaire | Age rating questionnaire |
| Release notes | Per-release | Per-version |

> **GATE:** Privacy policy URL is **mandatory** for both stores. Cannot submit without it.

---

## Step 5: Post-Submission

- **Google Play:** Review typically 1-3 days. Phased rollout recommended.
- **App Store:** Review typically 1-2 days. Expedited review available for critical fixes.
- Monitor crash reports in Play Console / App Store Connect after rollout.

---

## Output Format

````markdown
## 📱 App Store Deployment

**App:** [name]
**Version:** [old] → [new]
**Build number:** [number]

### Android (Google Play)
- [ ] Keystore configured
- [ ] AAB built successfully
- [ ] Uploaded to Play Console
- [ ] Release notes added
- [ ] Staged rollout configured

### iOS (App Store)
- [ ] Signing configured in Xcode
- [ ] IPA built successfully
- [ ] Uploaded to App Store Connect
- [ ] Screenshots current
- [ ] Submitted for review

### Both Platforms
- [ ] Version incremented in pubspec.yaml
- [ ] Privacy policy URL set
- [ ] Release notes written
````

---

## Key Principles

- **AAB not APK** — Google Play requires Android App Bundle for all new apps
- **Build number must always increase** — both stores reject duplicate build numbers
- **Fastlane** simplifies both platforms — consider `fastlane match` for iOS signing
- **Staged rollout** — always start at 10-20% to catch crashes early
- **Never commit signing keys** — keystore, key.properties, and certificates must be gitignored
