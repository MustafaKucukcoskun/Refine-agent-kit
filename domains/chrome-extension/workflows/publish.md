---
description: Publish Chrome extension to Chrome Web Store. Handles build, validation, and submission.
---

# /publish - Publish Chrome Extension

$ARGUMENTS

---

## Purpose

Build, validate, and publish a Chrome extension to the Chrome Web Store.

---

## Sub-commands

```
/publish              - Full publish flow (build → validate → submit)
/publish validate     - Validate manifest and permissions only
/publish build        - Build extension ZIP only
/publish submit       - Submit already-built ZIP to CWS
/publish status       - Check review status
```

---

## Pre-Publish Checklist

```markdown
### Manifest
- [ ] manifest.json version incremented
- [ ] Permissions minimal (no unused permissions)
- [ ] Host permissions scoped (no `<all_urls>` unless needed)
- [ ] Icons set (16, 48, 128)

### Code Quality
- [ ] No `eval()` or `new Function()`
- [ ] CSP compliant (no inline scripts)
- [ ] All tests passing
- [ ] No console.log in production

### Store Listing
- [ ] Description updated
- [ ] Screenshots current (1280x800 or 640x400)
- [ ] Privacy policy URL valid
- [ ] Category correct

### Security
- [ ] No hardcoded API keys in content scripts
- [ ] Storage API used for sensitive data
- [ ] Message passing validated (no `*` origins)
```

---

## Behavior

1. **Build extension**
   ```bash
   npm run build
   # Creates dist/ or build/ directory
   ```

2. **Create ZIP**
   ```bash
   cd dist && zip -r ../extension.zip . && cd ..
   ```

3. **Validate**
   - Check manifest.json schema
   - Verify all referenced files exist
   - Check CSP compliance
   - Validate permissions justification

4. **Submit to Chrome Web Store**
   ```bash
   # Using chrome-webstore-upload-cli
   npx chrome-webstore-upload upload \
     --source extension.zip \
     --extension-id $EXTENSION_ID \
     --client-id $CLIENT_ID \
     --client-secret $CLIENT_SECRET \
     --refresh-token $REFRESH_TOKEN
   ```

---

## Output Format

````markdown
## Publish: Chrome Extension

### Build
- **Version:** [manifest version]
- **Size:** [ZIP size]
- **Files:** [file count]

### Validation
- [Pass] Manifest schema valid
- [Pass] All files referenced exist
- [Pass] CSP compliant
- [Pass/Warn] Permissions: [list]

### Submission
- **Status:** Submitted for review
- **Extension ID:** [ID]
- **Dashboard:** https://chrome.google.com/webstore/devconsole

### Estimated Review Time
- Simple update: 1-3 days
- New permissions: 3-7 days
- First submission: 7-14 days
````
