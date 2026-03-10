# GEMINI.md — Antigravity Agent System (mobile-flutter)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanimlar.
> Global kod kalitesi kurallari ~/.gemini/GEMINI.md'den yuklenir.

---

## CRITICAL: AGENT & SKILL PROTOCOL (ONCE OKU)

**ZORUNLU:** Her implementasyondan ONCE ilgili agent dosyasini ve skill'lerini oku.

### Skill Loading

`Agent aktif → frontmatter "skills:" kontrol → SKILL.md oku → Ilgili section'lari oku`

- **Selective:** TUM dosyalari okuma. Once `SKILL.md`, sonra sadece request'e uyan section.
- **Priority:** P0 (GEMINI.md) > P1 (Agent .md) > P2 (SKILL.md). Hepsi baglayici.
- **Enforcement:** `Read → Understand WHY → Apply PRINCIPLES → Code`. Skip yasak.

---

## REQUEST CLASSIFIER (ADIM 1)

| Tip              | Trigger                                     | Aksiyon                                |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| **SORU**         | "what is", "explain", "nasil calisir"       | Text yanit, arac yok                   |
| **SURVEY**       | "analyze", "listele", "overview"            | Session intel, dosya yok               |
| **SIMPLE CODE**  | "fix", "ekle", "degistir" (tek dosya)       | Inline edit                            |
| **COMPLEX CODE** | "build", "create", "implement", "yaz"       | `{task-slug}.md` + Agent               |
| **MOBILE UI**    | "screen", "widget", "page", "bottom nav"    | `{task-slug}.md` + mobile-developer    |
| **SLASH CMD**    | /create, /debug, /verify, /code-review      | Command flow                           |

---

## INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATIK)

**HER request'ten once otomatik agent sec ve bildir.**

### Protocol

1. **Sessiz Analiz:** Domain tespit et (Widget? State? Navigation? Platform?)
2. **Agent Sec:** En uygun specialist
3. **Bildir:** `**Applying knowledge of @[agent-name]...**`
4. **Uygula:** Agent .md dosyasini oku → kurallari uygula

### ROUTING CHECKLIST (Her kod yanitindan once ZORUNLU)

| #   | Kontrol                                       | Basarisiz →                                 |
| --- | --------------------------------------------- | ------------------------------------------- |
| 1   | Dogru agent domain tespit edildi mi?          | STOP. Analiz et.                            |
| 2   | Agent .md dosyasi OKUNDU mu?                  | STOP. `.agent/agents/{agent}.md` ac ve oku. |
| 3   | `Applying @[agent]...` yazildi mi?            | STOP. Ekle.                                 |
| 4   | Agent frontmatter'daki skill'ler yuklendi mi? | STOP. `skills:` oku.                        |

- Agent belirlemeden kod = **PROTOCOL VIOLATION**
- Agent kurallarini yoksaymak = **QUALITY FAILURE**

---

## File Dependency Awareness

Herhangi bir dosyayi degistirmeden once:

1. `CODEBASE.md` kontrol et (yoksa `session_manager.py` ile uret)
2. Bagimli dosyalari tespit et
3. Etkilenen TUM dosyalari birlikte guncelle

### System Map

**ZORUNLU:** Session basinda `ARCHITECTURE.md` oku. Agent, Skill ve Script yapisini anla.

---

## TIER 1: FLUTTER MOBILE KOD KURALLARI

### Primary Agent: `mobile-developer`
### Supporting: `performance-optimizer`, `test-engineer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | flutter-patterns, mobile-design |
| **P1** | clean-code |
| **P2** | testing-patterns |

### Flutter-Specific Rules

- **Riverpod 2.x:** Tercih edilen state management. Provider tiplerini dogru sec (StateNotifierProvider, FutureProvider, vb.)
- **const constructors:** Her yerde mumkun olan yerde `const` kullan. Widget rebuild optimizasyonu icin kritik.
- **Kucuk widget'lar:** Tek sorumluluk prensibi. 50+ satirlik widget'lari ayir.
- **Dart 3 features:** Records, sealed classes, pattern matching kullan. `switch` expression tercih et.
- **Type safety:** `dynamic` YASAK (zorunlu degilse). Strict typing.
- **Testing:** flutter_test + mocktail. Widget test + unit test her feature icin.
- **Error handling:** `Either<Failure, Success>` pattern veya sealed class'lar ile hata yonetimi.

### Gemini Mode Mapping

| Mod      | Agent             | Davranis                                       |
| -------- | ----------------- | ---------------------------------------------- |
| **plan** | `project-planner` | 4-asama metodoloji. Phase 4'e kadar KOD YAZMA. |
| **ask**  | —                 | Sadece anlamaya odaklan. Soru sor.             |
| **edit** | `orchestrator`    | Execute. Once `{task-slug}.md` kontrol et.     |

**Plan Mode (4 Faz):**
1. ANALYSIS → Arastir, soru sor
2. PLANNING → `{task-slug}.md`, gorev plani
3. SOLUTIONING → Mimari, tasarim (KOD YOK!)
4. IMPLEMENTATION → Kod + testler

---

## TIER 2: FLUTTER PLATFORM & ARCHITECTURE KURALLARI

### Widget Architecture

- StatelessWidget default: State gerekmedikce StatefulWidget kullanma
- ConsumerWidget (Riverpod): State okuma icin `ref.watch`, side effect icin `ref.listen`
- Key kullanimi: ListView/GridView'da her zaman Key ver
- BuildContext: Context'i async gap'ten gecirme

### Navigation

- GoRouter veya auto_route tercih et
- Deep linking destegi planla
- Route guard'lar: Auth kontrol middleware

### Platform Integration

- Platform channel: MethodChannel ile native kod iletisimi
- Permission handling: permission_handler ile izin yonetimi
- Lifecycle: AppLifecycleState dinle, kaynak yonetimi yap

### Performance

- `const` widget'lar: Unnecessary rebuild engelle
- `RepaintBoundary`: Heavy paint islemleri izole et
- Image caching: `cached_network_image` kullan
- Lazy loading: ListView.builder, pagination

---

## Final Checklist

"Son kontroller", "final checks" → `python .agent/scripts/checklist.py .`
Sira: **Lint → Widget Tests → Integration Tests → Performance → Platform Check**

---

## QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** clean-code, intelligent-routing, flutter-patterns, mobile-design,
testing-patterns, performance-profiling, context-engineering, code-review-checklist

**Workflows:** /create, /debug, /verify, /code-review

**Scripts:** `verify_all.py`, `checklist.py`, `session_manager.py`, `setup-agent.py`,
`auto_preview.py`, `verify_project_tmp.py`

---
