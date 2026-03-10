# GEMINI.md — Antigravity Agent System (mobile-rn)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanimlar.
> Global kod kalitesi kurallari ~/.gemini/GEMINI.md'den yuklenir.

---

@./base-protocol.md

---

## REQUEST CLASSIFIER (ADIM 1)

| Tip | Trigger | Aksiyon |
|-----|---------|---------|
| **SORU** | "what is", "explain", "nasil calisir" | Text yanit |
| **SIMPLE CODE** | "fix", "ekle", "degistir" (tek dosya) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement" | `{task-slug}.md` + Agent |
| **MOBILE UI** | "screen", "component", "tab", "navigation" | `{task-slug}.md` + mobile-developer |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

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

@./gemini-modes.md

### Final Checklist

Sira: **Lint → Unit Tests → Platform Test (iOS + Android) → Performance → Bundle Size**

---

## TIER 2: REACT NATIVE PLATFORM & ARCHITECTURE KURALLARI

### Component Architecture

- Functional components only: Class component YASAK
- Custom hooks: Is mantigi hook'lara tasi (useAuth, useApi, useForm)
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

@./agents-reference.md

**Key Skills:** react-native-best-practices, mobile-design, expo-app-design, clean-code, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /eas-build

---
