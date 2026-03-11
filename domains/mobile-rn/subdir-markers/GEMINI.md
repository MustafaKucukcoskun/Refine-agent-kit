# Domain: React Native App

> This directory contains a React Native mobile application project.
> Agent routing: The following rules apply to files in this directory.

## Agent Routing

- **Primary:** `mobile-developer` — React Native patterns, mobile UX, platform integration
- **Supporting:** `performance-optimizer` — JS thread, native bridge, bundle size
- **Test:** `test-engineer` — Jest, React Native Testing Library

## Skill Priority

| P0 (Critical) | P1 (Important) | P2 (Supporting) |
|-------------|-------------|-------------|
| react-native-best-practices | expo-app-design | testing-patterns |
| mobile-design | clean-code | |

## Tech Stack

- Framework: React Native 0.76+ (New Architecture)
- Tooling: Expo (managed preferred)
- Language: TypeScript
- Styling: StyleSheet API / NativeWind
- Testing: Jest + React Native Testing Library

## React Native-Specific Rules

- New Architecture default: TurboModules + Fabric renderer
- Prefer Expo managed workflow, bare only when necessary
- Use StyleSheet API or NativeWind, inline styles FORBIDDEN
- SafeAreaView mandatory: Check safe area on every screen
- Minimize Platform.OS usage: Prefer platform-specific files
- No inline styles: Define with `StyleSheet.create()`
