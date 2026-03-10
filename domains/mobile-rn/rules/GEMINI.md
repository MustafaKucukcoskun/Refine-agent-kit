# GEMINI.md — Antigravity Agent System (mobile-rn)

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
| **MOBILE UI**    | "screen", "component", "tab", "navigation"  | `{task-slug}.md` + mobile-developer    |
| **SLASH CMD**    | /create, /debug, /verify, /code-review      | Command flow                           |

---

## INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATIK)

**HER request'ten once otomatik agent sec ve bildir.**

### Protocol

1. **Sessiz Analiz:** Domain tespit et (Component? Navigation? Native Module? State?)
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

## TIER 1: REACT NATIVE KOD KURALLARI

### Primary Agent: `mobile-developer`
### Supporting: `performance-optimizer`, `test-engineer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | react-native-best-practices, mobile-design |
| **P1** | expo-app-design, clean-code |
| **P2** | testing-patterns |

### React Native-Specific Rules

- **New Architecture default:** TurboModules + Fabric renderer. Legacy bridge kullanma.
- **Expo managed preferred:** Bare workflow sadece native modul zorunluysa. `expo prebuild` ile yonet.
- **StyleSheet API / NativeWind:** Inline style YASAK. `StyleSheet.create()` veya NativeWind class'lari.
- **SafeAreaView zorunlu:** Her ekranda `SafeAreaView` veya `useSafeAreaInsets()` kullan.
- **Platform.OS minimize:** Platform-specific dosyalar tercih et (`.ios.tsx`, `.android.tsx`).
- **TypeScript strict:** `any` YASAK. Proper type definitions.
- **Testing:** Jest + React Native Testing Library. Her screen icin snapshot + interaction test.

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

## TIER 2: REACT NATIVE PLATFORM & ARCHITECTURE KURALLARI

### Component Architecture

- Functional components only: Class component YASAK
- Custom hooks: Is mantigi hook'lara tasI (useAuth, useApi, useForm)
- Memoization: `React.memo`, `useMemo`, `useCallback` dogru kullan
- FlatList: Large list'ler icin `getItemLayout`, `keyExtractor` zorunlu

### Navigation

- React Navigation 7+: Stack, Tab, Drawer navigator
- Deep linking: Expo Linking + universal links
- Type-safe navigation: `@react-navigation/native` ile typed routes

### State Management

- Zustand veya Jotai: Lightweight global state
- React Query / TanStack Query: Server state yonetimi
- AsyncStorage: Persist only non-sensitive data
- Expo SecureStore: Sensitive data (tokens, keys)

### Performance

- Hermes engine: Default, performans izle
- Bundle size: `npx react-native-bundle-visualizer` ile kontrol
- Image optimization: `expo-image` veya `FastImage`
- Animation: `react-native-reanimated` (JS thread'i bloklamaz)

---

## Final Checklist

"Son kontroller", "final checks" → `python .agent/scripts/checklist.py .`
Sira: **Lint → Unit Tests → Platform Test (iOS + Android) → Performance → Bundle Size**

---

## QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** clean-code, intelligent-routing, react-native-best-practices, mobile-design,
expo-app-design, testing-patterns, performance-profiling, context-engineering, code-review-checklist

**Workflows:** /create, /debug, /verify, /code-review

**Scripts:** `verify_all.py`, `checklist.py`, `session_manager.py`, `setup-agent.py`,
`auto_preview.py`, `verify_project_tmp.py`

---
