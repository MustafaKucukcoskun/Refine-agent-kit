# Domain: Flutter Mobile App

> This directory contains a Flutter mobile application project.
> Agent routing: The following rules apply to files in this directory.

## Agent Routing

- **Primary:** `mobile-developer` — Flutter patterns, widget design, platform integration
- **Supporting:** `performance-optimizer` — Frame budget, memory, build optimization
- **Test:** `test-engineer` — flutter_test, mocktail, integration tests

## Skill Priority

| P0 (Critical) | P1 (Important) | P2 (Supporting) |
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

- Riverpod 2.x is the preferred state management
- Use `const` constructors: Mandatory for rebuild optimization
- Small widgets: Single responsibility, split widgets longer than 50 lines
- Use Dart 3 records and sealed classes
- Type hints mandatory: `final String name;` not `var name;`
- Testing: Widget and unit tests with flutter_test + mocktail
