---
description: Deployment command for production releases. Pre-flight checks and deployment execution. Adapts to project domain.
---

# /deploy - Production Deployment

$ARGUMENTS

---

## Purpose

This command handles production deployment with pre-flight checks, deployment execution, and verification.
Automatically adapts to the project's tech stack and deployment target.

---

## Sub-commands

```
/deploy            - Interactive deployment wizard
/deploy check      - Run pre-deployment checks only
/deploy preview    - Deploy to preview/staging
/deploy production - Deploy to production
/deploy rollback   - Rollback to previous version
```

---

## Domain-Specific Pre-Deploy Checklist

**MANDATORY:** Use the checklist matching your project domain.

### next-web / phaser-game / electron-desktop / chrome-extension

```markdown
### Code Quality
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] ESLint passing (`npx eslint .`)
- [ ] All tests passing (`npm test`)

### Security
- [ ] No hardcoded secrets
- [ ] Environment variables documented
- [ ] Dependencies audited (`npm audit`)

### Performance
- [ ] Bundle size acceptable
- [ ] No console.log statements in production
- [ ] Images optimized (web only)
```

### python-backend / python-ml / python-data

```markdown
### Code Quality
- [ ] Type check passing (`mypy .` or `pyright`)
- [ ] Linting clean (`ruff check .`)
- [ ] All tests passing (`pytest`)

### Security
- [ ] No hardcoded secrets
- [ ] Environment variables documented
- [ ] Dependencies audited (`pip audit` or `safety check`)

### Database
- [ ] Migrations up to date (`alembic upgrade head`)
- [ ] No pending schema changes
- [ ] Backup verified
```

### mobile-flutter

```markdown
### Code Quality
- [ ] Analysis clean (`flutter analyze`)
- [ ] All tests passing (`flutter test`)
- [ ] Build succeeds (`flutter build apk --release` / `flutter build ios`)

### Platform
- [ ] Android: Signing config set
- [ ] iOS: Provisioning profile valid
- [ ] Version/build number incremented (pubspec.yaml)

### Stores
- [ ] Screenshots updated
- [ ] Release notes written
- [ ] Privacy policy current
```

### mobile-rn

```markdown
### Code Quality
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] All tests passing (`npm test`)
- [ ] EAS build succeeds (`eas build --platform all`)

### Platform
- [ ] Android: Keystore configured
- [ ] iOS: Certificates valid
- [ ] app.json version incremented

### Stores
- [ ] OTA update or store submit
- [ ] Release notes written
```

### csharp-backend

```markdown
### Code Quality
- [ ] Build passing (`dotnet build --configuration Release`)
- [ ] All tests passing (`dotnet test`)
- [ ] No analyzer warnings (`dotnet format --verify-no-changes`)

### Security
- [ ] No hardcoded connection strings
- [ ] Environment variables documented
- [ ] Dependencies safe (`dotnet list package --vulnerable`)

### Database
- [ ] EF migrations applied
- [ ] Connection string configured for production
```

### godot-game / unity-game

```markdown
### Code Quality
- [ ] No script errors (Editor console clean)
- [ ] All test scenes pass
- [ ] Export presets configured

### Build
- [ ] Target platform selected (Windows/Linux/macOS/Web/Android/iOS)
- [ ] Export templates installed
- [ ] Version number incremented

### Distribution
- [ ] Steam/itch.io/store page updated
- [ ] Build tested on target platform
```

### cli-tool

```markdown
### Code Quality
- [ ] All tests passing
- [ ] Linting clean
- [ ] `--help` output correct

### Package
- [ ] Version incremented (package.json / pyproject.toml)
- [ ] CHANGELOG updated
- [ ] README examples current

### Registry
- [ ] npm publish / PyPI upload ready
- [ ] Auth tokens configured
```

---

## Deployment Flow

```
/deploy
    |
    v
Pre-flight checks (domain-specific)
    |
Pass? --No--> Fix issues
    |
   Yes
    |
    v
Build application (domain command)
    |
    v
Deploy to platform
    |
    v
Health check & verify
    |
    v
Complete
```

---

## Platform Support by Domain

| Domain | Platforms | Default |
|--------|----------|---------|
| next-web | Vercel, Railway, Fly.io, Docker, Cloudflare | Vercel |
| python-backend | Railway, Fly.io, Docker, AWS Lambda, Render | Docker |
| python-ml | Docker, AWS SageMaker, GCP Vertex AI | Docker |
| python-data | Docker, Airflow, Dagster | Docker |
| mobile-flutter | Google Play, App Store, Fastlane, Codemagic | Fastlane |
| mobile-rn | EAS Submit, Google Play, App Store, Fastlane | EAS |
| electron-desktop | electron-builder, electron-forge | electron-builder |
| chrome-extension | Chrome Web Store | CWS CLI |
| cli-tool | npm registry, PyPI | npm / PyPI |
| csharp-backend | Azure, AWS, Docker, IIS | Docker |
| godot-game | itch.io, Steam, Export | itch.io |
| unity-game | Steam, itch.io, Unity Cloud Build | Steam |
| phaser-game | Vercel, Netlify, itch.io | Vercel |

---

## Output Format

### Successful Deploy

````markdown
## Deployment Complete

### Summary
- **Version:** [version]
- **Environment:** [production/staging]
- **Platform:** [detected platform]

### URLs / Artifacts
- [Production URL or build artifact path]

### Health Check
[Pass] API responding / App launched / Build verified
````

### Failed Deploy

````markdown
## Deployment Failed

### Error
[Build/deploy step that failed]

### Resolution
1. [Fix step]
2. [Verify step]
3. Try `/deploy` again

### Rollback
Previous version is still active.
Run `/deploy rollback` if needed.
````

---

## Examples

```
/deploy
/deploy check
/deploy preview
/deploy production
/deploy rollback
```
