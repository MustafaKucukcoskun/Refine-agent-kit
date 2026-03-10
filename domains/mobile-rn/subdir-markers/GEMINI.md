# Domain: React Native App

> Bu dizin React Native mobil uygulama projesi icerir.
> Agent routing: Bu dizindeki dosyalar icin asagidaki kurallar gecerlidir.

## Agent Routing

- **Primary:** `mobile-developer` — React Native patterns, mobile UX, platform integration
- **Supporting:** `performance-optimizer` — JS thread, native bridge, bundle size
- **Test:** `test-engineer` — Jest, React Native Testing Library

## Skill Priority

| P0 (Kritik) | P1 (Onemli) | P2 (Destek) |
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
- Expo managed workflow tercih et, bare sadece gerektiginde
- StyleSheet API veya NativeWind kullan, inline style YASAK
- SafeAreaView zorunlu: Her ekranda safe area kontrol et
- Platform.OS kullanimi minimize et: Platform-specific dosyalar tercih et
- No inline styles: `StyleSheet.create()` ile tanimla
