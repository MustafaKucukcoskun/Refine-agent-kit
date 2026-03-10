# Domain: Flutter Mobile App

> Bu dizin Flutter mobil uygulama projesi icerir.
> Agent routing: Bu dizindeki dosyalar icin asagidaki kurallar gecerlidir.

## Agent Routing

- **Primary:** `mobile-developer` — Flutter patterns, widget design, platform integration
- **Supporting:** `performance-optimizer` — Frame budget, memory, build optimization
- **Test:** `test-engineer` — flutter_test, mocktail, integration tests

## Skill Priority

| P0 (Kritik) | P1 (Onemli) | P2 (Destek) |
|-------------|-------------|-------------|
| flutter-patterns | clean-code | testing-patterns |
| mobile-design | | |

## Tech Stack

- Framework: Flutter 3.x
- Language: Dart 3.x
- Design: Material Design 3
- State: Riverpod 2.x
- Testing: flutter_test + mocktail

## Flutter-Specific Rules

- Riverpod 2.x tercih edilen state management
- `const` constructor kullan: Rebuild optimizasyonu icin zorunlu
- Kucuk widget'lar: Tek sorumluluk, 50 satirdan uzun widget bolunmeli
- Dart 3 records ve sealed class'lari kullan
- Type hints zorunlu: `final String name;` not `var name;`
- Test: flutter_test + mocktail ile widget ve unit test
