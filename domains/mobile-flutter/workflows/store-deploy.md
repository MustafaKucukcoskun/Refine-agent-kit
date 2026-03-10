---
description: Deploy Flutter app to Google Play and Apple App Store. Handles build, signing, and submission.
---

# /store-deploy - Flutter Store Deployment

$ARGUMENTS

---

## Purpose

Build, sign, and deploy a Flutter application to Google Play Store and/or Apple App Store.

---

## Sub-commands

```
/store-deploy                - Interactive deployment wizard
/store-deploy android        - Build and deploy to Google Play
/store-deploy ios            - Build and deploy to App Store
/store-deploy both           - Deploy to both stores
/store-deploy --track beta   - Deploy to beta track
/store-deploy status         - Check submission status
```

---

## Pre-Deploy Checklist

```markdown
### Code Quality
- [ ] `flutter analyze` clean
- [ ] All tests passing (`flutter test`)
- [ ] No debug prints or TODO comments

### Android
- [ ] `pubspec.yaml` version incremented (version: X.Y.Z+buildNumber)
- [ ] `android/app/build.gradle` signing config
- [ ] Keystore file exists and password correct
- [ ] `proguard-rules.pro` configured
- [ ] Target SDK up to date

### iOS
- [ ] Xcode signing identity valid
- [ ] Provisioning profile matches bundle ID
- [ ] `Info.plist` permissions descriptions filled
- [ ] Privacy manifest (PrivacyInfo.xcprivacy) complete

### Store Listing
- [ ] Screenshots (phone + tablet) updated
- [ ] Store description current
- [ ] Privacy policy URL active
- [ ] Content rating questionnaire completed
```

---

## Behavior

### Android Build & Deploy

```bash
# Build release AAB
flutter build appbundle --release

# Deploy with Fastlane
cd android && fastlane deploy

# Or manual upload to Play Console
# Google Play Console → Release → Production/Beta
```

### iOS Build & Deploy

```bash
# Build release IPA
flutter build ipa --release

# Deploy with Fastlane
cd ios && fastlane release

# Or upload via Transporter
# Open Transporter → drag .ipa → Upload
```

---

## Output Format

````markdown
## Store Deploy: [App Name]

### Build
- **Version:** [version]+[build]
- **Flutter:** [flutter version]
- **Dart:** [dart version]

### Android
- **AAB Size:** [size]
- **Track:** [production/beta/internal]
- **Status:** [Uploaded / In Review / Published]
- **Play Console:** [URL]

### iOS
- **IPA Size:** [size]
- **Track:** [App Store / TestFlight]
- **Status:** [Uploaded / In Review / Published]
- **App Store Connect:** [URL]

### Timeline
- Review usually takes 1-3 days (Android), 1-7 days (iOS)
````
