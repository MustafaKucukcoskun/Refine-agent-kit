---
description: Chrome Web Store publishing workflow. Validates manifest v3, builds extension zip, uploads to CWS, and tracks review status. Use for extension release, store submission, or publishing updates.
---

# /publish - Chrome Web Store Publish

$ARGUMENTS

---

## Purpose

Guides the full Chrome extension publishing pipeline — from manifest validation to Chrome Web Store submission. Handles version bumping, asset verification, zip packaging, and CWS API upload.

---

## Pre-flight Checks

> **GATE:** All checks must pass before packaging.

1. **Manifest v3 validation**
   ```bash
   # Verify manifest version and required fields
   cat manifest.json | grep -E '"manifest_version"|"version"|"name"|"description"'
   ```
   - `manifest_version` must be `3` (v2 rejected since June 2024)
   - `version` must be higher than currently published version
   - `name` ≤ 45 characters
   - `description` ≤ 132 characters

2. **Permissions audit**
   - Remove any unused permissions — CWS review flags excessive permissions
   - Prefer `activeTab` over broad `<all_urls>`
   - `host_permissions` must be minimal and justified

3. **Asset verification**
   | Asset | Required Size | Format |
   |-------|--------------|--------|
   | Icon 16 | 16×16 | PNG |
   | Icon 48 | 48×48 | PNG |
   | Icon 128 | 128×128 | PNG |
   | Store screenshot | 1280×800 or 640×400 | PNG/JPEG |
   | Promo tile (optional) | 440×280 | PNG |

4. **Content Security Policy**
   - No `unsafe-eval` in CSP (blocked in Manifest v3)
   - No remote code loading

---

## Step 1: Version Bump

```bash
# Read current version
node -e "console.log(JSON.parse(require('fs').readFileSync('manifest.json','utf8')).version)"

# Bump version (edit manifest.json)
# Follow semver: major.minor.patch
```

> **Rule:** Version must strictly increment. CWS rejects re-used version numbers.

---

## Step 2: Production Build

```bash
# Clean previous build
rm -rf dist/

# Build extension
npm run build

# Verify output
ls -la dist/
```

**Verify:** `dist/` contains `manifest.json`, all JS/CSS bundles, icons, and `_locales/` if i18n enabled.

---

## Step 3: Package Zip

```bash
cd dist && zip -r ../extension-v$(node -e "console.log(JSON.parse(require('fs').readFileSync('manifest.json','utf8')).version)").zip . && cd ..
```

> **GATE:** Zip size must be under 10MB (CWS hard limit).

---

## Step 4: Upload to Chrome Web Store

**Option A — CWS Dashboard (manual):**
1. Go to Chrome Web Store Developer Dashboard
2. Select extension → Package → Upload new package
3. Upload zip, fill changelog
4. Submit for review

**Option B — CWS API (automated):**
```bash
# Using chrome-webstore-upload-cli
npx chrome-webstore-upload upload \
  --source extension-v*.zip \
  --extension-id $EXTENSION_ID \
  --client-id $CWS_CLIENT_ID \
  --client-secret $CWS_CLIENT_SECRET \
  --refresh-token $CWS_REFRESH_TOKEN

# Publish after upload
npx chrome-webstore-upload publish --extension-id $EXTENSION_ID
```

---

## Step 5: Post-Submit

- Review typically takes 1–3 business days
- Monitor Developer Dashboard for review status
- If rejected: read rejection reason, fix, re-submit

---

## Output Format

````markdown
## 🚀 Extension Published

**Extension:** [name]
**Version:** [old] → [new]
**Manifest:** v3 ✅
**Zip size:** [X] KB
**Permissions:** [list]

### Pre-flight
- [ ] Manifest v3 valid
- [ ] Version incremented
- [ ] Permissions minimal
- [ ] Icons complete
- [ ] CSP compliant

### Upload
- [ ] Build clean
- [ ] Zip packaged
- [ ] Uploaded to CWS
- [ ] Submitted for review

### Post-submit
- Review ETA: ~1-3 business days
- Dashboard: [link]
````

---

## Key Principles

- **Never** include API keys or secrets in the extension bundle
- **Always** test the built zip by loading it as an unpacked extension before submitting
- **Minimal permissions** — every extra permission increases review scrutiny and user distrust
- **Version number is immutable** — once uploaded, that version number is permanently consumed
- CWS API requires OAuth2 setup — `client_id`, `client_secret`, and `refresh_token` from Google Cloud Console
