# GEMINI.md — Antigravity Agent System (mobile-rn)

> This file defines the agent routing and skill system for this workspace.
> Global code quality rules are loaded from ~/.gemini/GEMINI.md.

---

@./base-protocol.md

---

## REQUEST CLASSIFIER (STEP 1)

| Type | Trigger | Action |
|------|---------|--------|
| **QUESTION** | "what is", "explain", "how does it work" | Text response |
| **SIMPLE CODE** | "fix", "add", "change" (single file) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement" | `{task-slug}.md` + Agent |
| **MOBILE UI** | "screen", "component", "tab", "navigation" | `{task-slug}.md` + mobile-developer |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: REACT NATIVE CODE RULES

### Primary Agent: `mobile-developer`
### Supporting: `performance-optimizer`, `test-engineer`

### Skill Priority

| Priority | Skills |
|----------|--------|
| **P0** | react-native-best-practices, mobile-design |
| **P1** | expo-app-design, clean-code |
| **P2** | testing-patterns |

### React Native-Specific Rules

- **New Architecture default:** TurboModules + Fabric renderer. Do not use legacy bridge.
- **Expo managed preferred:** Bare workflow only if native modules are required. Manage with `expo prebuild`.
- **StyleSheet API / NativeWind:** Inline styles FORBIDDEN. Use `StyleSheet.create()` or NativeWind classes.
- **SafeAreaView mandatory:** Use `SafeAreaView` or `useSafeAreaInsets()` on every screen.
- **Platform.OS minimize:** Prefer platform-specific files (`.ios.tsx`, `.android.tsx`).
- **TypeScript strict:** `any` FORBIDDEN. Proper type definitions.
- **Testing:** Jest + React Native Testing Library. Snapshot + interaction test for every screen.

@./gemini-modes.md

### Final Checklist

Order: **Lint → Unit Tests → Platform Test (iOS + Android) → Performance → Bundle Size**

---

## TIER 2: REACT NATIVE PLATFORM & ARCHITECTURE RULES

### Component Architecture

- Functional components only: Class components FORBIDDEN
- Custom hooks: Move business logic to hooks (useAuth, useApi, useForm)
- Memoization: Use `React.memo`, `useMemo`, `useCallback` correctly
- FlatList: `getItemLayout`, `keyExtractor` mandatory for large lists

### Navigation

- React Navigation 7+: Stack, Tab, Drawer navigator
- Deep linking: Expo Linking + universal links
- Type-safe navigation: Typed routes with `@react-navigation/native`

### State Management

- Zustand or Jotai: Lightweight global state
- React Query / TanStack Query: Server state management
- AsyncStorage: Persist only non-sensitive data
- Expo SecureStore: Sensitive data (tokens, keys)

### Performance

- Hermes engine: Default, monitor performance
- Bundle size: Check with `npx react-native-bundle-visualizer`
- Image optimization: `expo-image` or `FastImage`
- Animation: `react-native-reanimated` (does not block JS thread)

---

@./agents-reference.md

**Key Skills:** react-native-best-practices, mobile-design, expo-app-design, clean-code, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /eas-build

---
