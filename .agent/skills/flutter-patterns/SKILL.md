# Flutter Patterns Skill

## 1. Architecture and State Management (Riverpod 2.x)

- In modern Flutter, use `@riverpod` annotation, `Notifier` (synchronous) and `AsyncNotifier` (asynchronous) classes instead of StateNotifier etc.
- Prefer `ConsumerWidget` in widgets, or `HookConsumerWidget` if using Hooks.
- **Provider Reading Criteria:**
  - To watch (trigger rebuilds): `ref.watch(provider)` (only inside `build` method).
  - To call (event handlers): `ref.read(provider.notifier).methodName()`.
  - To listen (show snackbar etc.): `ref.listen(provider, (prev, next) => ...)`.

## 2. Navigation (GoRouter)

- Use `GoRouter` for declarative routing instead of classic `Navigator.push`. This approach automatically handles deep-linking.
- Prefer `ShellRoute` structure for nested routing and bottom navigation bar.
- Pass parameters using `pathParameters` and `extra` (only for carrying objects when web URLs are not a concern).

## 3. Dart 3.x Features (Pattern Matching & Records)

- Do not create unnecessary classes to return two or three values; use **Records**: `(int code, String msg) fetch() { return (200, "OK"); }`. Reading the result: `var (code, msg) = fetch();`
- Replace traditional if-else blocks or if cascades with **Pattern Matching** (`switch` expressions and `case` conditions).
- Create union types with sealed classes (e.g., Result<Success, Failure>). Enforces exhaustiveness in `switch` (all cases must be handled).

## 4. Layout and UI Principles

- To prevent infinite size errors (`hasBoundedHeight` exception), pay attention to `Expanded` or `Flexible` usage in columns inside lists/SingleChildScrollView. Avoid using `shrinkWrap: true` and `physics: NeverScrollableScrollPhysics()` when nesting lists in a ScrollView — this is a performance disaster. Use **Slivers** (`CustomScrollView`, `SliverList`) instead.
- When splitting into single-responsibility small widgets, prefer defining new StatelessWidget classes over extracting methods (methods returning Widget). This allows Flutter to better optimize the element tree and enables const constructor usage.
- Always call statically positioned widgets whose parameters do not change with the `const` keyword.

## 5. Testing

- For UI testing, use `flutter test` with `WidgetTester` to isolate widgets, and `tester.pumpWidget` followed by `tester.pumpAndSettle` (waits for all animations to finish) for rendering.
- For mocking needs (e.g., Dio, SharedPreferences), prefer the `mocktail` package over standard `mockito` as it works perfectly with null-safety (no code generation required).
