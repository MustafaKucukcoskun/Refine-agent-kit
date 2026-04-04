---
name: react-native-best-practices
description: React Native best practices for new architecture, navigation, performance, state management, and testing.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# React Native Best Practices Skill

## 1. New Architecture (RN 0.76+)

- **JSI and Bridgeless:** New Architecture is enabled by default in 0.76. Instead of Bridge-based async communication, JSI (JavaScript Interface) allows JS and Native (C++) to call each other synchronously (`nativeModule.getValue()`). This dramatically improves startup time and reduces frame drops.
- **Incompatibility Workaround (Exception Pattern):** If an older package does not support New Architecture and is required, opt-out for that build only by adding `newArchEnabled=false` in Android's `android/gradle.properties` and `ENV['RCT_NEW_ARCH_ENABLED'] = '0'` in the iOS Podfile. However, always search for TurboModule-compatible package alternatives.

## 2. Project Structure and Architecture

- Organize all logic and screens in a "Feature-Based" folder structure. E.g., `src/features/auth/`, `src/features/feed/`. Each feature contains its own `api/`, `components/`, `screens/`. Global components should only be truly shared items (Button, Input, etc.).

## 3. Navigation (React Navigation v7)

- With v7's static type definitions, parameter passing is fully type-safe. Always narrow parameters with static types (TypeScript interfaces). Do not use "magic string" route names. Design modules (`stack`, `tab`, `drawer`) in a modular fashion based on need.

## 4. Performance and Lists

- **FlatList vs ScrollView:** For lists with more content than the visible screen, **NEVER** use `ScrollView.map`. Always use `FlatList`. For massive item counts, fine-tune `initialNumToRender` and `maxToRenderPerBatch` for memory optimization.
- **Memoization:** Do not wrap every component in `React.memo`. Only apply `memo` to components with expensive props that re-render frequently on state changes (e.g., a single row in a list), and `useCallback` for functions passed to them.

## 5. State Management

- **Zustand:** Ideal for async data and global state. Zero boilerplate.
- Store API responses and session information in Zustand, except for component-scoped temporary data (form grids).

## 6. Native APIs and Testing

- Always wrap `Linking.canOpenURL` in try-catch for native links (mailto:, tel:, https:) or app-to-app communication. iOS requires Info.plist (LSApplicationQueriesSchemes).
- **Jest + RNTL:** Integration approach over E2E. `render()` the component, then trigger with `fireEvent.press` and await the result: `await waitFor(() => expect(screen.getByText('Success')).toBeTruthy());`
