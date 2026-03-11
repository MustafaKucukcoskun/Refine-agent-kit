# mobile-flutter Domain Rules

## Activation Condition

pubspec.yaml present.

## Primary Agent

mobile-developer

## State Management Preferences

- Riverpod 2.x + code generation (`@riverpod` annotation): first choice for complex state
- Provider: valid for simple projects or existing Provider codebases
- BLoC: can be preferred if team has BLoC experience
- setState: only for local, isolated widget state

## Code Style

- Dart 3.x: records, sealed classes, patterns — actively use
- Maximize `const` constructor usage
- Keep widgets small (single responsibility)

## Test

flutter_test + mocktail (for mocking)
