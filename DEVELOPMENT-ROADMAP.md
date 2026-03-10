# DEVELOPMENT ROADMAP — refine-agent-kit

> Bu dosya projenin gelecek gelistirmelerini, once yapilmasi gereken duzeltmeleri
> ve her adimin nasil yapilacagini detaylica aciklar.
> Son guncelleme: 2026-03-10

---

## ICINDEKILER

1. [Mevcut Durum Analizi](#1-mevcut-durum-analizi)
2. [FAZA 1 — Kritik Duzeltmeler](#2-faza-1--kritik-duzeltmeler)
3. [FAZA 2 — Yeni Domain'ler](#3-faza-2--yeni-domainler)
4. [FAZA 3 — Moduler GEMINI.md (@import)](#4-faza-3--moduler-geminimd-import)
5. [FAZA 4 — npm Yayinlama](#5-faza-4--npm-yayinlama)
6. [FAZA 5 — Gemini CLI Destegi](#6-faza-5--gemini-cli-destegi)
7. [FAZA 6 — Yeni MCP Server'lar](#7-faza-6--yeni-mcp-serverlar)
8. [FAZA 7 — Rekabet Ozellikleri](#8-faza-7--rekabet-ozellikleri)
9. [FAZA 8 — Uzun Vadeli Vizyon](#9-faza-8--uzun-vadeli-vizyon)
10. [Dosya/Skill Analizi](#10-dosyaskill-analizi)

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
| Kirik referans (skill yok) | 13 | Domain config'de var ama skill dizini yok |
| Yetim (domain ref yok) | 28 | Skill var ama hicbir domain config referans etmiyor |

**Not:** "Yetim" skill'ler SORUN DEGIL. Bunlar evrensel skill'ler (`clean-code`,
`api-patterns`, `database-design`, `architecture` vb.). Agent frontmatter'indan
dogrudan referans ediliyorlar. Domain config'lerden referans edilmemeleri normal.

### 1.3 Domain Uyumsuzlugu

**CLI'dan kurulabilen domain sayisi: 3** (next-web, python-backend, python-ml)
**Domain config dosyasi sayisi: 12** (chrome-extension, cli-tool, csharp-backend,
electron-desktop, godot-game, mobile-flutter, mobile-rn, next-web, phaser-game,
python-backend, python-data, unity-game)

Bu 9 domain icin altyapi (config + rules) mevcut ama CLI'dan kurulamiyor.

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

## 4. FAZA 3 — Moduler GEMINI.md (@import)

> **Oncelik:** P1 (Kisa-orta vadeli)
> **Tahmini is:** 2-3 saat

### 4.1 Sorun

Mevcut GEMINI.md dosyalari 170+ satir monolitik dosyalar. Ayni icerik (agent protocol,
routing checklist, request classifier) her domain'in GEMINI.md dosyasinda tekrarlaniyor.

### 4.2 Cozum: @file.md Import Syntax

Gemini CLI ve Antigravity IDE `@dosya.md` syntax'ini destekliyor:

```markdown
# Ana GEMINI.md
@./rules/base-protocol.md
@./rules/request-classifier.md
@./rules/{domain}-specific.md
```

### 4.3 Yeni Yapi

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

### 4.4 Adimlar

1. Ortak bolümleri ayri .md dosyalarina cikar:
   - `base-protocol.md` (Agent & Skill Protocol)
   - `request-classifier.md` (Request Classifier tablosu)
   - `routing-checklist.md` (Routing Checklist + File Dependency)
   - `quick-reference.md` (Agent/Skill/Workflow listesi)
2. Her domain'in GEMINI.md dosyasini `@import` kullanan formata donustur
3. CLI'yi guncelle: `shared/.agent/rules/` icine base dosyalari koy,
   domain-spesifik GEMINI.md overlay olarak domain dizininden gelsin
4. **Test:** Antigravity IDE'de import'larin dogru yuklendigini dogrula

### 4.5 Dikkat Edilecekler

- Import derinligi max 5 seviye (Gemini limiti)
- Sadece `.md` dosyalar import edilebilir
- Circular import koruması var (ama yine de dikkat)
- Dosya bulunamazsa hata yorumu eklenir ama calisma durmaz

---

## 5. FAZA 4 — npm Yayinlama

> **Oncelik:** P2 (Orta vadeli)
> **Tahmini is:** 1 saat

### 5.1 Neden?

Simdi: `npx github:MustafaKucukcoskun/Refine-agent-kit init --domain next-web`
Hedef: `npx refine-kit init --domain next-web`

npm'de yayinlamak kurulumu basitlestirir ve profesyonel gorunur.

### 5.2 Adimlar

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

### 5.3 Scoped vs Unscoped

| Secenek | Komut | Avantaj |
|---------|-------|---------|
| Unscoped | `npx refine-kit init` | Kisa, kolay |
| Scoped | `npx @refine-agent/kit init` | Isim catismasi riski yok |

**Oneri:** Once unscoped dene, alinmissa scoped kullan.

---

## 6. FAZA 5 — Gemini CLI Destegi

> **Oncelik:** P2 (Orta vadeli)
> **Tahmini is:** 2 saat

### 6.1 Sorun

Antigravity IDE ve Gemini CLI farkli MCP config dosyalari kullaniyor:
- **Antigravity:** `~/.gemini/antigravity/mcp_config.json`
- **Gemini CLI:** `~/.gemini/settings.json` (mcpServers key'i icinde)

Ayrica Gemini CLI'da MCP server format farki:
- Antigravity: `serverUrl` (HTTP)
- Gemini CLI: `httpUrl` (HTTP) veya `command`+`args` (stdio)

### 6.2 Cozum

CLI'a `--target` flag'i ekle:

```bash
# Antigravity IDE (varsayilan)
npx refine-kit init --domain next-web

# Gemini CLI
npx refine-kit init --domain next-web --target gemini-cli
```

### 6.3 Adimlar

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

## 7. FAZA 6 — Yeni MCP Server'lar

> **Oncelik:** P2 (Orta vadeli)
> **Tahmini is:** 1 saat

### 7.1 Global Config'e Eklenebilecek MCP'ler

| Server | Ne Yapar | Kaynak |
|--------|----------|--------|
| Sequential Thinking | Step-by-step problem cozme | `@anthropic/sequential-thinking-mcp` |
| Memory | Kalici bilgi grafigi (entity + relationship) | `@modelcontextprotocol/server-memory` |
| Firebase | Firebase/Firestore yonetimi | `firebase-tools mcp` |

### 7.2 Adimlar

1. Her MCP server'in paket adini dogrula (npm/GitHub'dan)
2. `global/mcp_config.json`'a ekle
3. Gerekli API key'leri `.env.agent.example` sablonuna ekle
4. README'deki API Keys tablosunu guncelle
5. **Test:** Antigravity IDE'de her server'in calısıp calismadigini dogrula

### 7.3 Domain-Spesifik MCP Eklemeleri

| Domain | MCP Server | Ne Yapar |
|--------|-----------|----------|
| next-web | Firebase | Firestore, Auth, Hosting |
| python-backend | — | (Suan ek MCP yok) |
| python-data | — | (Suan ek MCP yok) |

---

## 8. FAZA 7 — Rekabet Ozellikleri

> **Oncelik:** P3 (Uzun vadeli)
> **Tahmini is:** Her biri 2-4 saat

### 8.1 Cross-Platform Destek

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

### 8.2 Bundle Sistemi

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

### 8.3 `list` ve `update` Komutlari

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

### 8.4 AI Slop Score Audit

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

## 9. FAZA 8 — Uzun Vadeli Vizyon

> **Oncelik:** P3-P4
> **Bu maddeler daha cok fikir asamasinda**

### 9.1 Design System Generator
- Persona + referans siteden otomatik tasarim tokenleri uret
- Tailwind config, CSS variables, component variants

### 9.2 Agent Telemetri
- Hangi agent ne kadar kullaniliyor
- Hangi skill'ler en cok aktif ediliyor
- Optimizasyon onerileri

### 9.3 Takim Profilleri
- Junior vs Senior developer icin farkli agent davranislari
- Code review sikligi, hata aciklama detayi ayarlari

### 9.4 Skill Marketplace
- Kullanicilarin kendi skill'lerini paylasabildigi platform
- `npx refine-kit install-skill community/my-awesome-skill`

---

## 10. DOSYA/SKILL ANALIZI

### 10.1 Kirik Skill Referanslari (Silinecek)

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

### 10.2 "Yetim" Skill'ler (NORMAL — Silme)

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

### 10.3 12 Domain vs 3 CLI Domain Uyumsuzlugu

| Domain Config | CLI'da Var? | Durum |
|---------------|-------------|-------|
| next-web | ✅ | Tam destek |
| python-backend | ✅ | Tam destek |
| python-data | ❌ (python-ml olarak var) | Config adi uyumsuz |
| mobile-flutter | ❌ | FAZA 2'de eklenecek |
| mobile-rn | ❌ | FAZA 2'de eklenecek |
| electron-desktop | ❌ | FAZA 2'de eklenecek |
| chrome-extension | ❌ | FAZA 2'de eklenecek |
| cli-tool | ❌ | FAZA 2'de eklenecek |
| csharp-backend | ❌ | FAZA 2'de eklenecek |
| godot-game | ❌ | FAZA 2'de eklenecek |
| unity-game | ❌ | FAZA 2'de eklenecek |
| phaser-game | ❌ | FAZA 2'de eklenecek |

---

## ONCELIK SIRASI OZET

```
FAZA 1 (P0 — Hemen): ✅ TAMAMLANDI (2026-03-10)
  1.1 ✅ 13 kirik skill referansi duzeltildi (esdeger ile degistir veya sil)
  1.2 ✅ python-ml.json domain config olusturuldu

FAZA 2 (P1 — 1 Hafta): ✅ TAMAMLANDI (2026-03-10)
  2.1 ✅ 10 yeni domain (toplam 13) icin rules/GEMINI.md + subdir-markers olusturuldu
  2.2 ✅ CLI'a 13 domain eklendi, README guncellendi

FAZA 3 (P1 — 1 Hafta):
  3.1 GEMINI.md'leri @import ile modüler yap

FAZA 4 (P2 — 2 Hafta):
  4.1 npm'e yayinla

FAZA 5 (P2 — 2 Hafta):
  5.1 Gemini CLI destegi (--target gemini-cli)

FAZA 6 (P2 — 1 Hafta):
  6.1 Yeni MCP server'lar ekle

FAZA 7 (P3 — 1 Ay):
  7.1 Cross-platform destek
  7.2 Bundle sistemi
  7.3 list + update komutlari
  7.4 AI Slop audit komutu

FAZA 8 (P4 — Uzun vadeli):
  8.1 Design System Generator
  8.2 Telemetri
  8.3 Takim profilleri
  8.4 Skill marketplace
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
