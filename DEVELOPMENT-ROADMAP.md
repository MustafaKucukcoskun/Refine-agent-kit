# DEVELOPMENT ROADMAP — refine-agent-kit

> Bu dosya projenin gelecek gelistirmelerini, once yapilmasi gereken duzeltmeleri
> ve her adimin nasil yapilacagini detaylica aciklar.
> Son guncelleme: 2026-03-10

---

## ICINDEKILER

1. [Mevcut Durum Analizi](#1-mevcut-durum-analizi)
2. [FAZA 1 — Kritik Duzeltmeler](#2-faza-1--kritik-duzeltmeler) ✅
3. [FAZA 2 — Yeni Domain'ler](#3-faza-2--yeni-domainler) ✅
4. [FAZA 3 — Domain-Spesifik Workflow & Script'ler](#4-faza-3--domain-spesifik-workflow--scriptler) ✅
5. [FAZA 4 — Moduler GEMINI.md (@import)](#5-faza-4--moduler-geminimd-import) ✅
6. [FAZA 5 — npm Yayinlama](#6-faza-5--npm-yayinlama)
7. [FAZA 6 — Gemini CLI Destegi](#7-faza-6--gemini-cli-destegi)
8. [FAZA 7 — Yeni MCP Server'lar](#8-faza-7--yeni-mcp-serverlar)
9. [FAZA 8 — Rekabet Ozellikleri](#9-faza-8--rekabet-ozellikleri)
10. [FAZA 9 — Uzun Vadeli Vizyon](#10-faza-9--uzun-vadeli-vizyon)
11. [Dosya/Skill Analizi](#11-dosyaskill-analizi)

---

## 1. MEVCUT DURUM ANALIZI

### 1.1 Paketin Yapisi

```
refine-agent-kit/
├── bin/cli.js              ← CLI (init + add-domain)
├── global/                 ← ~/.gemini/ dosyalari
│   ├── GEMINI.md           ← Anti-slop + kalite kurallari
│   └── mcp_config.json     ← context7, github, playwright, chrome-devtools
├── shared/                 ← TUM domainler icin ortak dosyalar
│   ├── .agent/             ← 21 agent, 54 skill, 17 workflow, 6 script
│   └── .shared/            ← Design system (59 persona, 107 referans site)
├── domains/
│   ├── next-web/           ← rules/GEMINI.md + mcp_config.json + subdir-markers/
│   ├── python-backend/     ← rules/GEMINI.md + subdir-markers/
│   └── python-ml/          ← rules/GEMINI.md + subdir-markers/
├── package.json
└── README.md
```

### 1.2 Skill Durumu

| Kategori | Sayi | Aciklama |
|----------|------|----------|
| Toplam skill dizini | 54 | `.agent/skills/` altinda |
| Domain config'lerden referans edilen | 25 | `.agent/domains/*.json` icinde |
| Kirik referans (skill yok) | 0 | ✅ FAZA 1'de duzeltildi |
| Yetim (domain ref yok) | 28 | Skill var ama hicbir domain config referans etmiyor |

**Not:** "Yetim" skill'ler SORUN DEGIL. Bunlar evrensel skill'ler (`clean-code`,
`api-patterns`, `database-design`, `architecture` vb.). Agent frontmatter'indan
dogrudan referans ediliyorlar. Domain config'lerden referans edilmemeleri normal.

### 1.3 Domain Durumu

**CLI'dan kurulabilen domain sayisi: 13** ✅ (FAZA 2'de tamamlandi)
**Domain config dosyasi sayisi: 13** (python-ml.json FAZA 1'de eklendi)

Tum domainler: next-web, python-backend, python-ml, python-data, mobile-flutter,
mobile-rn, electron-desktop, chrome-extension, cli-tool, csharp-backend,
godot-game, unity-game, phaser-game

### 1.4 Workflow/Script Uyumsuzlugu

**KRITIK SORUN:** Tum 17 workflow ve 6 script Next.js/web-spesifik ama TUM domainlere
yukleniyor. Ornekler:
- `/deploy` → `npx tsc --noEmit`, `npm audit` (Python/C#/Flutter'da calismaz)
- `/preview` → port 3000, `curl http://localhost:3000` (oyun motorlarinda anlamsiz)
- `/test` → sadece Jest/Vitest referansi (pytest, xunit, flutter_test yok)
- `/build-fix` → `npm run build`, `npx tsc` (Godot/Unity icin gecersiz)
- `verify.sh` → Next.js bundle analizi (diger domainlerde kullanisiz)

Bu durum, web-disinda olan 10+ domain icin yanlis komutlar calistirma riski tasir.

### 1.4 Rakip Durumu

| Repo | Yildiz | Skill | Agent | Ozel Ozellik |
|------|--------|-------|-------|-------------|
| sickn33/antigravity-awesome-skills | 21K+ | 1,234+ | Yok | Cross-platform, bundle sistemi |
| **refine-agent-kit (biz)** | **Yeni** | **54** | **21** | **Agent routing, persona, anti-slop** |
| rominirani/antigravity-skills | 500+ | ~50 | Yok | Google Developer Expert |
| guanyang/antigravity-skills | 300+ | ~30 | Yok | Moduler tanimlar |

**Bizim farkimiz:** Rakipler SADECE skill koleksiyonu. Biz entegre sistem sunuyoruz
(agent routing + anti-slop + persona + monorepo). Ama skill sayimiz cok dusuk.

---

## 2. FAZA 1 — Kritik Duzeltmeler

> **Oncelik:** P0 (Hemen yapilmali)
> **Tahmini is:** 1-2 saat

### 2.1 Kirik Skill Referanslarini Duzelt

**Sorun:** 13 skill, domain config JSON'larda referans ediliyor ama skill dizini yok.

**Cozum:** Iki strateji:

#### Strateji A: Eksik skill'ler icin stub SKILL.md olustur
Avantaj: Domain config'ler kırılmaz, gelecekte icerik eklenebilir.
Dezavantaj: Bos skill dosyalari kalite dusurur.

#### Strateji B: Domain config'lerden kirik referanslari kaldir (ONERILEN)
Avantaj: Temiz, dürüst yapi. Olmayan skill referans edilmez.
Dezavantaj: Domain config'ler daha az skill gosterir.

**Yapilacak:**
```
Silinecek referanslar (skill dizini yok):
- csharp-backend.json: azure-identity, ef-core, cosmosdb, xunit-patterns, linq-patterns
- mobile-flutter.json: dart-best-practices
- mobile-rn.json: react-native-architecture
- next-web.json: algorithmic-art
- phaser-game.json: algorithmic-art
- python-backend.json: postgres-patterns, database-migrations, supabase-postgres-best-practices
- python-data.json: ml-pipeline-workflow, rag-implementation, algorithmic-art
```

**Not:** `game-development/2d-games` gibi referanslar aslinda dogru. Sub-dizin
olarak `skills/game-development/2d-games/SKILL.md` mevcut. Bunlar kirik degil.

**Adimlar:**
1. Her domain config JSON dosyasini ac
2. `skills` objesi icindeki kirik referanslari sil
3. `skill_notes` varsa ona da not ekle
4. Test: Tum JSON dosyalarinin gecerli JSON oldugunu dogrula

### 2.2 python-ml Domain Config Eksikligi

**Sorun:** CLI'da `python-ml` domain'i var ama `.agent/domains/` icinde `python-ml.json`
dosyasi yok. `python-data.json` var ama farkli icerik.

**Yapilacak:**
1. `shared/.agent/domains/python-ml.json` olustur
2. Primary agent: `backend-specialist`
3. P0 skills: `python-patterns`, `clean-code`
4. P1 skills: `testing-patterns`, `performance-profiling`

---

## 3. FAZA 2 — Yeni Domain'ler

> **Oncelik:** P1 (Kisa vadeli)
> **Tahmini is:** 3-4 saat

### 3.1 Neden 12 Domain'in Hepsi CLI'a Eklenmeli?

`.agent/` dizininde 12 teknoloji icin domain config, domain rules ve ilgili skill'ler
zaten mevcut. CLI sadece 3 tanesi icin kurulum yapabiliyor. Kullanicilar geri kalan
9 teknoloji icin toolkit'i kullanamiyor.

### 3.2 Eklenecek 9 Domain

Her domain icin yapilmasi gereken:
1. `domains/{domain}/rules/GEMINI.md` — Domain-spesifik agent routing dosyasi
2. `domains/{domain}/subdir-markers/GEMINI.md` — Monorepo marker dosyasi
3. `domains/{domain}/mcp_config.json` — Domain-spesifik MCP server'lar (gerekiyorsa)
4. `bin/cli.js` icinde `DOMAINS` objesine ekleme

| Domain | Label | Aciklama | MCP Extra |
|--------|-------|----------|-----------|
| `mobile-flutter` | Flutter Mobile App | Flutter + Dart + Material Design | — |
| `mobile-rn` | React Native App | React Native + Expo + TypeScript | — |
| `electron-desktop` | Electron Desktop App | Electron + Node.js + Chromium | — |
| `chrome-extension` | Chrome Extension | Manifest V3 + Chrome APIs | — |
| `cli-tool` | CLI Tool | Node.js/Python CLI + Commander/Click | — |
| `csharp-backend` | C# Backend (.NET) | ASP.NET Core + Entity Framework | — |
| `godot-game` | Godot Game | Godot Engine + GDScript | — |
| `unity-game` | Unity Game | Unity + C# + Game Patterns | — |
| `python-data` | Python Data Science | Pandas + scikit-learn + RAG | — |

### 3.3 Her Domain Icin GEMINI.md Sablon

```markdown
# GEMINI.md — Antigravity Agent System ({domain-label})

> Bu dosya bu workspace'te agent routing ve skill sistemini tanimlar.
> Global kod kalitesi kurallari ~/.gemini/GEMINI.md'den yuklenir.

---

## CRITICAL: AGENT & SKILL PROTOCOL
[Ayni protokol - kopyala]

## REQUEST CLASSIFIER
[Domain'e uygun tipler]

## INTELLIGENT AGENT ROUTING
[Ayni routing protokolu]

## TIER 1: {DOMAIN} KOD KURALLARI
### Primary Agent: `{primary-agent}`
### Supporting: `{supporting-agents}`
### Skill Priority
| P0 | P1 | P2 |
[Domain config JSON'dan al]

### {Domain}-Specific Rules
[Domain rules dosyasindan al: .agent/rules/domains/{domain}-rules.md]

## QUICK REFERENCE
[Standart quick reference]
```

### 3.4 Adimlar (Her Domain Icin)

```bash
# 1. Dizin olustur
mkdir -p domains/{domain}/rules
mkdir -p domains/{domain}/subdir-markers

# 2. rules/GEMINI.md olustur (domain-spesifik routing)
# Sablon + .agent/domains/{domain}.json'dan skill priority + .agent/rules/domains/{domain}-rules.md'den kurallar

# 3. subdir-markers/GEMINI.md olustur (monorepo marker)
# Kisa: domain adi, primary agent, tech stack, temel kurallar

# 4. MCP config (gerekiyorsa)
# Cogu Python/CLI domain'inin MCP ihtiyaci yok

# 5. CLI'a ekle
# bin/cli.js'de DOMAINS objesine yeni domain ekle
```

---

## 4. FAZA 3 — Domain-Spesifik Workflow & Script'ler

> **Oncelik:** P1 (Icerik dogrulugu — domain'ler calismadan diger fazalar anlamsiz)
> **Tahmini is:** 4-6 saat

### 4.1 Sorun

Tum 17 workflow ve 6 script Next.js/web projesi icin yazilmis ama `shared/.agent/`
icinde tum domainlere yukleniyor. Bu durum:
- Python projesinde `npx tsc --noEmit` calistirmaya calisir
- Flutter projesinde `npm run build` onerır
- Godot projesinde `curl http://localhost:3000` yapar
- C# projesinde `jest --coverage` calistirmaya calisir

### 4.2 Etkilenen Dosyalar

**17 Workflow (`.agent/workflows/`):**

| Workflow | Mevcut (Next.js) | Sorun |
|----------|-------------------|-------|
| `/deploy` | `npx tsc`, `npm audit`, Vercel | Python: `pytest`, `pip audit`; C#: `dotnet publish`; Flutter: `flutter build` |
| `/preview` | Port 3000, `curl localhost` | Flutter: emulator; Godot: editor play; Unity: play mode |
| `/test` | Jest/Vitest | Python: pytest; C#: xunit/nunit; Flutter: flutter_test; Godot: GUT |
| `/build-fix` | `npm run build`, `npx tsc` | Python: `mypy`, `ruff`; C#: `dotnet build`; Flutter: `flutter analyze` |
| `/verify` | TypeScript + ESLint | Her domain farkli linter/checker |
| `/create` | React component | Domain'e gore farkli sablonlar |
| `/debug` | Chrome DevTools, React | Domain'e gore farkli araclar |
| `/quick-fix` | npm/node spesifik | Domain'e gore degisir |
| `/perf-check` | Lighthouse, Web Vitals | Domain'e gore farkli profiler |
| `/code-review` | JS/TS odakli | Dile gore farkli kontroller |
| `/security-scan` | npm audit | pip audit, dotnet audit, pub audit |
| `/refactor` | React patterns | Domain'e gore farkli pattern'ler |
| `/docs` | JSDoc/TSDoc | Python: docstring; C#: XML comments |
| `/plan` | Genel | Nispeten domain-bagimsiz |
| `/analyze` | Web metrics | Domain metrik'leri |
| `/git-flow` | Genel | Nispeten domain-bagimsiz |
| `/status` | npm/node kontrol | Domain'e gore farkli kontroller |

**6 Script (`.agent/scripts/`):**

| Script | Mevcut | Sorun |
|--------|--------|-------|
| `verify.sh` | Next.js build + bundle | Domain'e gore build sistemi farkli |
| `checklist.sh` | npm audit, Lighthouse | Domain arac farki |
| `session-start.sh` | npm/node durum kontrol | Domain'e gore farkli |
| `quick-fix.sh` | npm spesifik | Domain'e gore farkli |
| `perf-budget.sh` | Web metrikleri | Domain'e gore farkli |
| `deploy-check.sh` | Vercel/web deploy | Domain deploy farki |

### 4.3 Cozum Stratejisi

**Yaklasim: Workflow Overlay (Domain-spesifik uzerine yazma)**

Domain-spesifik workflow'lar `domains/{domain}/workflows/` altinda tutulur.
CLI kurulumda once `shared/.agent/workflows/` kopyalanir, sonra domain-spesifik
workflow'lar uzerine yazilir (override).

```
domains/
├── next-web/
│   └── workflows/           ← Next.js'e ozel (mevcut workflow'lar zaten dogru)
├── python-backend/
│   └── workflows/
│       ├── deploy.md        ← pytest, pip audit, gunicorn/uvicorn
│       ├── test.md          ← pytest, coverage, tox
│       ├── build-fix.md     ← mypy, ruff, bandit
│       ├── preview.md       ← uvicorn --reload, port 8000
│       ├── verify.md        ← mypy + ruff + pytest
│       └── security-scan.md ← pip audit, bandit, safety
├── python-ml/
│   └── workflows/
│       ├── test.md          ← pytest, model validation
│       └── ...
├── mobile-flutter/
│   └── workflows/
│       ├── deploy.md        ← flutter build apk/ios, fastlane
│       ├── test.md          ← flutter test, integration_test
│       ├── build-fix.md     ← flutter analyze, dart fix
│       ├── preview.md       ← flutter run, emulator
│       └── ...
├── csharp-backend/
│   └── workflows/
│       ├── deploy.md        ← dotnet publish, Azure/AWS
│       ├── test.md          ← dotnet test, xunit
│       ├── build-fix.md     ← dotnet build, analyzers
│       └── ...
├── godot-game/
│   └── workflows/
│       ├── test.md          ← GUT framework, scene testing
│       ├── build-fix.md     ← godot --headless, export
│       └── ...
└── ...
```

**CLI degisikligi (`bin/cli.js`):**
```javascript
// Mevcut: shared → domain rules overlay
// Yeni: shared → domain rules overlay → domain workflows overlay → domain scripts overlay

const domainWorkflowsSrc = path.join(domainSrc, "workflows");
const workflowsDest = path.join(agentDir, "workflows");
if (fs.existsSync(domainWorkflowsSrc)) {
  copyRecursive(domainWorkflowsSrc, workflowsDest); // uzerine yazar
}

const domainScriptsSrc = path.join(domainSrc, "scripts");
const scriptsDest = path.join(agentDir, "scripts");
if (fs.existsSync(domainScriptsSrc)) {
  copyRecursive(domainScriptsSrc, scriptsDest); // uzerine yazar
}
```

### 4.4 Domain Bazinda Workflow Oncelikleri

Tum domainler icin en kritik 6 workflow (mutlaka domain-spesifik olmali):

| # | Workflow | Neden Kritik |
|---|----------|-------------|
| 1 | `/test` | Yanlis test runner kullanmak hic test calistiramamak demek |
| 2 | `/build-fix` | Yanlis build komutu hic derlememek demek |
| 3 | `/deploy` | Yanlis deploy komutu uretim ortamini bozabilir |
| 4 | `/preview` | Yanlis port/komut gelistirici deneyimini kirar |
| 5 | `/verify` | Yanlis linter/checker kontrolleri atlatiyor |
| 6 | `/security-scan` | Yanlis audit araci guvenlik acigi kacirmak demek |

Geri kalan 11 workflow (plan, git-flow, analyze, docs, vb.) nispeten
domain-bagimsiz ve sonra duzeltebilir.

### 4.5 Script Donusumu

6 script icin benzer overlay yaklasimi. Ancak script'ler `.sh` uzantili
ve Windows uyumlulugu sorunu var. **Karar:** Script'leri Node.js'e donustur
(`.js`) veya domain-bagimsiz hale getir.

### 4.6 Adimlar

1. **Analiz:** Her workflow dosyasini oku, Next.js-spesifik komutlari listele
2. **Sablon olustur:** Her domain icin 6 kritik workflow yaz:
   - python-backend: pytest, mypy, ruff, uvicorn, pip audit
   - python-ml: pytest, mypy, jupyter, model validation
   - python-data: pytest, jupyter, data pipeline testing
   - mobile-flutter: flutter test, flutter analyze, flutter build, fastlane
   - mobile-rn: jest (RN), eas build, metro bundler
   - electron-desktop: jest + electron-builder + CSP
   - chrome-extension: jest + web-ext + manifest validation
   - cli-tool: jest/pytest + npm link/pip install -e
   - csharp-backend: dotnet test, dotnet build, dotnet publish, NuGet audit
   - godot-game: GUT, godot --headless, export presets
   - unity-game: Unity Test Framework, Unity build pipeline
   - phaser-game: vitest, vite build, texture atlas validation
3. **CLI guncelle:** `bin/cli.js`'de workflow/script overlay ekle
4. **Test:** Her domain icin kurulum yap, workflow dosyalarini kontrol et
5. **next-web:** Mevcut workflow'lar zaten dogru, overlay gerekmez

---

## 5. FAZA 4 — Moduler GEMINI.md (@import)

> **Oncelik:** P1 (Kisa-orta vadeli)
> **Tahmini is:** 2-3 saat

### 5.1 Sorun

Mevcut GEMINI.md dosyalari 170+ satir monolitik dosyalar. Ayni icerik (agent protocol,
routing checklist, request classifier) her domain'in GEMINI.md dosyasinda tekrarlaniyor.

### 5.2 Cozum: @file.md Import Syntax

Gemini CLI ve Antigravity IDE `@dosya.md` syntax'ini destekliyor:

```markdown
# Ana GEMINI.md
@./rules/base-protocol.md
@./rules/request-classifier.md
@./rules/{domain}-specific.md
```

### 5.3 Yeni Yapi

```
.agent/rules/
├── GEMINI.md                    ← Ana dosya (sadece @import'lar + domain-spesifik)
├── base-protocol.md             ← Agent & Skill Protocol (TUM domain'ler icin ortak)
├── request-classifier.md        ← Request Classifier tablosu
├── routing-checklist.md         ← Routing Checklist
├── quick-reference.md           ← Quick Reference (21 agent, skill'ler, workflow'lar)
└── domains/
    ├── next-web-rules.md        ← Mevcut (zaten var)
    ├── python-backend-rules.md  ← Mevcut
    └── ...
```

**Ana GEMINI.md ornegi (next-web icin):**
```markdown
# GEMINI.md — Antigravity Agent System (next-web)

> Bu workspace'te agent routing ve skill sistemini tanimlar.
> Global kod kalitesi: ~/.gemini/GEMINI.md

@./base-protocol.md
@./request-classifier.md
@./routing-checklist.md

## TIER 1: NEXT-WEB KOD KURALLARI

### Primary Agent: `frontend-specialist`
### Supporting: `seo-specialist`, `performance-optimizer`

### Skill Priority
| P0 | nextjs-react-expert, nextjs-app-router-patterns, frontend-design, tailwind-patterns |
| P1 | seo-fundamentals, web-design-guidelines, webapp-testing |
| P2 | nodejs-best-practices |

[Domain-spesifik kurallar...]

@./quick-reference.md
```

### 5.4 Adimlar

1. Ortak bolümleri ayri .md dosyalarina cikar:
   - `base-protocol.md` (Agent & Skill Protocol)
   - `request-classifier.md` (Request Classifier tablosu)
   - `routing-checklist.md` (Routing Checklist + File Dependency)
   - `quick-reference.md` (Agent/Skill/Workflow listesi)
2. Her domain'in GEMINI.md dosyasini `@import` kullanan formata donustur
3. CLI'yi guncelle: `shared/.agent/rules/` icine base dosyalari koy,
   domain-spesifik GEMINI.md overlay olarak domain dizininden gelsin
4. **Test:** Antigravity IDE'de import'larin dogru yuklendigini dogrula

### 5.5 Dikkat Edilecekler

- Import derinligi max 5 seviye (Gemini limiti)
- Sadece `.md` dosyalar import edilebilir
- Circular import koruması var (ama yine de dikkat)
- Dosya bulunamazsa hata yorumu eklenir ama calisma durmaz

---

## 6. FAZA 5 — npm Yayinlama

> **Oncelik:** P2 (Orta vadeli)
> **Tahmini is:** 1 saat

### 6.1 Neden?

Simdi: `npx github:MustafaKucukcoskun/Refine-agent-kit init --domain next-web`
Hedef: `npx refine-kit init --domain next-web`

npm'de yayinlamak kurulumu basitlestirir ve profesyonel gorunur.

### 6.2 Adimlar

1. npm hesabi olustur (npmjs.com)
2. `package.json` kontrol et:
   - `name`: "refine-kit" veya "@refine-agent/kit" (scoped)
   - `version`: "1.0.0"
   - `bin`: { "refine-kit": "bin/cli.js" }
   - `files`: ["bin/", "global/", "shared/", "domains/"]
3. Yayinla:
   ```bash
   npm login
   npm publish
   ```
4. README'deki komutlari guncelle
5. GitHub Actions ile otomatik yayinlama kur:
   ```yaml
   # .github/workflows/publish.yml
   name: Publish to npm
   on:
     release:
       types: [created]
   jobs:
     publish:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
             registry-url: https://registry.npmjs.org
         - run: npm publish
           env:
             NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
   ```

### 6.3 Scoped vs Unscoped

| Secenek | Komut | Avantaj |
|---------|-------|---------|
| Unscoped | `npx refine-kit init` | Kisa, kolay |
| Scoped | `npx @refine-agent/kit init` | Isim catismasi riski yok |

**Oneri:** Once unscoped dene, alinmissa scoped kullan.

---

## 7. FAZA 6 — Gemini CLI Destegi

> **Oncelik:** P2 (Orta vadeli)
> **Tahmini is:** 2 saat

### 7.1 Sorun

Antigravity IDE ve Gemini CLI farkli MCP config dosyalari kullaniyor:
- **Antigravity:** `~/.gemini/antigravity/mcp_config.json`
- **Gemini CLI:** `~/.gemini/settings.json` (mcpServers key'i icinde)

Ayrica Gemini CLI'da MCP server format farki:
- Antigravity: `serverUrl` (HTTP)
- Gemini CLI: `httpUrl` (HTTP) veya `command`+`args` (stdio)

### 7.2 Cozum

CLI'a `--target` flag'i ekle:

```bash
# Antigravity IDE (varsayilan)
npx refine-kit init --domain next-web

# Gemini CLI
npx refine-kit init --domain next-web --target gemini-cli
```

### 7.3 Adimlar

1. `global/` altina `settings.json` sablon ekle (Gemini CLI formati)
2. `bin/cli.js`'ye `--target` argumanini ekle
3. `installGlobal()` fonksiyonunda target'a gore dogru dosyayi sec:
   - `antigravity` → `~/.gemini/antigravity/mcp_config.json`
   - `gemini-cli` → `~/.gemini/settings.json`
4. Format donusumu yap:
   ```javascript
   // Antigravity format
   { "serverUrl": "https://mcp.context7.com/mcp" }
   // Gemini CLI format
   { "httpUrl": "https://mcp.context7.com/mcp" }
   ```
5. README'ye iki hedef arasindaki farki acikla

---

## 8. FAZA 7 — Yeni MCP Server'lar

> **Oncelik:** P2 (Orta vadeli)
> **Tahmini is:** 1 saat

### 8.1 Global Config'e Eklenebilecek MCP'ler

| Server | Ne Yapar | Kaynak |
|--------|----------|--------|
| Sequential Thinking | Step-by-step problem cozme | `@anthropic/sequential-thinking-mcp` |
| Memory | Kalici bilgi grafigi (entity + relationship) | `@modelcontextprotocol/server-memory` |
| Firebase | Firebase/Firestore yonetimi | `firebase-tools mcp` |

### 8.2 Adimlar

1. Her MCP server'in paket adini dogrula (npm/GitHub'dan)
2. `global/mcp_config.json`'a ekle
3. Gerekli API key'leri `.env.agent.example` sablonuna ekle
4. README'deki API Keys tablosunu guncelle
5. **Test:** Antigravity IDE'de her server'in calısıp calismadigini dogrula

### 8.3 Domain-Spesifik MCP Eklemeleri

| Domain | MCP Server | Ne Yapar |
|--------|-----------|----------|
| next-web | Firebase | Firestore, Auth, Hosting |
| python-backend | — | (Suan ek MCP yok) |
| python-data | — | (Suan ek MCP yok) |

---

## 9. FAZA 8 — Rekabet Ozellikleri

> **Oncelik:** P3 (Uzun vadeli)
> **Tahmini is:** Her biri 2-4 saat

### 9.1 Cross-Platform Destek

Antigravity-awesome-skills'in en buyuk avantaji cross-platform destegi.
Biz de ekleyebiliriz:

```bash
npx refine-kit init --domain next-web --target cursor
npx refine-kit init --domain next-web --target claude-code
```

**Yapilacak:**
1. Cursor: `.cursor/rules/` dizinine GEMINI.md'yi kopyala
2. Claude Code: `.claude/` dizinine CLAUDE.md olarak kopyala + `.claude/settings.json`'a MCP ekle
3. Codex: `.codex/` dizinine benzer yapi
4. Her hedef icin MCP config formatini donustur

### 9.2 Bundle Sistemi

Rakip antigravity-awesome-skills bundle sistemi kullaniyor (frontend-pro, backend-pro vb.)
Biz de ekleyebiliriz:

```bash
npx refine-kit install-bundle --bundle security-pro
npx refine-kit install-bundle --bundle fullstack-pro
```

| Bundle | Icerik |
|--------|--------|
| `frontend-pro` | nextjs-react-expert, tailwind-patterns, frontend-design, seo-fundamentals, webapp-testing |
| `backend-pro` | api-patterns, database-design, python-patterns, fastapi-pro, testing-patterns |
| `security-pro` | vulnerability-scanner, red-team-tactics, trail-of-bits-security |
| `fullstack-pro` | frontend-pro + backend-pro + database-design + deployment-procedures |
| `mobile-pro` | mobile-design, flutter-patterns, react-native-best-practices |

### 9.3 `list` ve `update` Komutlari

```bash
# Kurulu domain'leri listele
npx refine-kit list
# Output:
#   Root: next-web (frontend-specialist)
#   services/api: python-backend (backend-specialist)
#   services/ml: python-ml (backend-specialist)

# Agent system'i guncelle
npx refine-kit update
# Output:
#   Updated 21 agents, 54 skills, 17 workflows
#   Version: 1.0.0 → 1.1.0
```

**Yapilacak:**
1. `list` komutu: Proje dizininde `.agent/` ve subdirectory GEMINI.md'leri tara
2. `update` komutu: GitHub'dan son surum bilgisini cek, dosyalari guncelle

### 9.4 AI Slop Score Audit

```bash
npx refine-kit audit
# Output:
#   Scanning project for AI slop patterns...
#
#   ⚠ src/utils.py — Generic filename (rename to specific purpose)
#   ⚠ src/api/handler.py:15 — Empty catch block
#   ⚠ src/components/Hero.tsx — Purple gradient detected
#
#   Score: 7/10 (3 slop patterns found)
```

**Yapilacak:**
1. Python/Node.js ile basit AST-free pattern matcher yaz
2. `.shared/design-system/anti-patterns.csv`'den pattern'leri yukle
3. Dosya isimleri + icerik tarasi
4. Puan hesapla ve rapor cikart

---

## 10. FAZA 9 — Uzun Vadeli Vizyon

> **Oncelik:** P3-P4
> **Bu maddeler daha cok fikir asamasinda**

### 10.1 Design System Generator
- Persona + referans siteden otomatik tasarim tokenleri uret
- Tailwind config, CSS variables, component variants

### 10.2 Agent Telemetri
- Hangi agent ne kadar kullaniliyor
- Hangi skill'ler en cok aktif ediliyor
- Optimizasyon onerileri

### 10.3 Takim Profilleri
- Junior vs Senior developer icin farkli agent davranislari
- Code review sikligi, hata aciklama detayi ayarlari

### 10.4 Skill Marketplace
- Kullanicilarin kendi skill'lerini paylasabildigi platform
- `npx refine-kit install-skill community/my-awesome-skill`

---

## 11. DOSYA/SKILL ANALIZI

### 11.1 Kirik Skill Referanslari (Silinecek)

Bu skill'ler domain config JSON'larda referans edilyor ama fiziksel olarak mevcut degil:

```
csharp-backend.json:
  - azure-identity (p1) → SIL
  - ef-core (p1) → SIL
  - cosmosdb (p2) → SIL
  - xunit-patterns (p2) → SIL
  - linq-patterns (p2) → SIL

mobile-flutter.json:
  - dart-best-practices (p1) → SIL

mobile-rn.json:
  - react-native-architecture (p1) → SIL

next-web.json:
  - algorithmic-art (p2) → SIL

phaser-game.json:
  - algorithmic-art (p1) → SIL

python-backend.json:
  - postgres-patterns (p1) → SIL
  - database-migrations (p1) → SIL
  - supabase-postgres-best-practices (p2) → SIL

python-data.json:
  - ml-pipeline-workflow (p1) → SIL
  - rag-implementation (p1) → SIL
  - algorithmic-art (p2) → SIL
```

### 11.2 "Yetim" Skill'ler (NORMAL — Silme)

Bu skill'ler hicbir domain config'den referans edilmiyor ama **agent frontmatter'larindan
dogrudan kullaniliyor**. Bunlar evrensel skill'ler:

```
Evrensel (tum projeler):    Domain-spesifik (agent'lar kullanir):
- api-patterns              - phaser-patterns
- app-builder               - async-python-patterns
- architecture              - red-team-tactics
- behavioral-modes          - rust-pro
- brainstorming             - trail-of-bits-security
- clean-code                - vulnerability-scanner
- code-review-checklist     - powershell-windows
- context-engineering       - server-management
- database-design           - mcp-builder
- deployment-procedures
- documentation-templates
- i18n-localization
- intelligent-routing
- lint-and-validate
- parallel-agents
- performance-profiling
- plan-writing
- systematic-debugging
- tdd-workflow
```

**Neden silinmemeli:** Antigravity IDE skill'leri YAML frontmatter'daki `description`
alanina gore semantik olarak otomatik aktive eder. Domain config'de olmamalari
onlarin kullanilmadigini gostermez. Agent'lar dogrudan referans eder.

### 11.3 Domain Durumu (Guncellenmis)

| Domain | CLI | Rules | Subdir Marker | Workflows | Durum |
|--------|-----|-------|---------------|-----------|-------|
| next-web | ✅ | ✅ | ✅ | ✅ (mevcut) | Tam destek |
| python-backend | ✅ | ✅ | ✅ | ❌ Next.js | FAZA 3'te |
| python-ml | ✅ | ✅ | ✅ | ❌ Next.js | FAZA 3'te |
| python-data | ✅ | ✅ | ✅ | ❌ Next.js | FAZA 3'te |
| mobile-flutter | ✅ | ✅ | ✅ | ❌ Next.js | FAZA 3'te |
| mobile-rn | ✅ | ✅ | ✅ | ❌ Next.js | FAZA 3'te |
| electron-desktop | ✅ | ✅ | ✅ | ❌ Next.js | FAZA 3'te |
| chrome-extension | ✅ | ✅ | ✅ | ❌ Next.js | FAZA 3'te |
| cli-tool | ✅ | ✅ | ✅ | ❌ Next.js | FAZA 3'te |
| csharp-backend | ✅ | ✅ | ✅ | ❌ Next.js | FAZA 3'te |
| godot-game | ✅ | ✅ | ✅ | ❌ Next.js | FAZA 3'te |
| unity-game | ✅ | ✅ | ✅ | ❌ Next.js | FAZA 3'te |
| phaser-game | ✅ | ✅ | ✅ | ❌ Next.js | FAZA 3'te |

---

## ONCELIK SIRASI OZET

```
FAZA 1 (P0 — Hemen): ✅ TAMAMLANDI (2026-03-10)
  1.1 ✅ 13 kirik skill referansi duzeltildi
  1.2 ✅ python-ml.json domain config olusturuldu

FAZA 2 (P1 — 1 Hafta): ✅ TAMAMLANDI (2026-03-10)
  2.1 ✅ 10 yeni domain (toplam 13) icin rules/GEMINI.md + subdir-markers olusturuldu
  2.2 ✅ CLI'a 13 domain eklendi, README guncellendi

FAZA 3 (P1 — Icerik Dogrulugu): ✅ TAMAMLANDI (2026-03-10)
  3.1 ✅ 4 kritik shared workflow domain-aware yapildi (test, build-fix, deploy, preview)
  3.2 ✅ 14 domain-spesifik workflow olusturuldu (eas-build, package, publish, release, scene, prefab, store-deploy, migrate, eda, train, export, scaffold, 2x scene)
  3.3 ✅ CLI'a workflow/script overlay mekanizmasi eklendi
  3.4 ✅ python-ml-rules.md olusturuldu (python-data-rules.md'den ayrildi)
  3.5 ✅ Tum domain config'lerdeki workflow_missing alanlari temizlendi

FAZA 4 (P1 — Modulerlik): ✅ TAMAMLANDI (2026-03-10)
  4.1 ✅ 5 shared base dosyasi olusturuldu (base-protocol, routing-protocol, file-dependency, gemini-modes, agents-reference)
  4.2 ✅ 13 domain GEMINI.md dosyasi @import ile moduler yapiya donusturuldu
  4.3 ✅ Ortalama %40 satir azaltimi (165→100 satir), tekrar eden icerik eliminate edildi

FAZA 5 (P2 — Dagitim): ✅ TAMAMLANDI (2026-03-10)
  5.1 ✅ package.json npm publish icin hazir (author, homepage, bugs, keywords)
  5.2 ✅ README.md guncellendi (npx refine-agent-kit, guncel istatistikler)
  5.3 ✅ .npmignore olusturuldu (DEVELOPMENT-ROADMAP.md haric)
  5.4 ✅ GitHub Actions CI/CD workflow olusturuldu (.github/workflows/publish.yml)
  5.5 ✅ Paket dogrulandi: 641 KB packed, 304 dosya, 2 MB unpacked
  5.6 ⏳ npm publish bekleniyor (npm login + npm publish)

FAZA 6 (P2 — Platform):
  6.1 Gemini CLI destegi (--target gemini-cli)

FAZA 7 (P2 — Araçlar):
  7.1 Yeni MCP server'lar ekle

FAZA 8 (P3 — Rekabet):
  8.1 Cross-platform destek
  8.2 Bundle sistemi
  8.3 list + update komutlari
  8.4 AI Slop audit komutu

FAZA 9 (P4 — Uzun vadeli):
  9.1 Design System Generator
  9.2 Telemetri
  9.3 Takim profilleri
  9.4 Skill marketplace
```

---

## KAYNAKLAR

- [GEMINI.md @file Import Syntax](https://geminicli.com/docs/cli/gemini-md/)
- [Antigravity Skills Authoring (Google Codelabs)](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)
- [Antigravity MCP Config](https://antigravity.google/docs/mcp)
- [Gemini CLI MCP Setup](https://geminicli.com/docs/tools/mcp-server/)
- [Top 10 MCP Servers 2026](https://fastmcp.me/blog/top-10-most-popular-mcp-servers)
- [Firebase MCP Server](https://firebase.google.com/docs/ai-assistance/mcp-server)
- [sickn33/antigravity-awesome-skills (21K+ stars)](https://github.com/sickn33/antigravity-awesome-skills)
- [GitHub MCP Server for Gemini CLI](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-gemini-cli.md)
- [npm Publishing Guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
