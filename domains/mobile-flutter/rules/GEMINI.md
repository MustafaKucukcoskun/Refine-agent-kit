# GEMINI.md — Antigravity Agent System (mobile-flutter)

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
| **MOBILE UI** | "screen", "widget", "page", "bottom nav" | `{task-slug}.md` + mobile-developer |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: FLUTTER MOBILE CODE RULES

### Primary Agent: `mobile-developer`
### Supporting: `performance-optimizer`, `test-engineer`

### Skill Priority

| Priority | Skills |
|----------|--------|
| **P0** | flutter-patterns, mobile-design |
| **P1** | clean-code |
| **P2** | testing-patterns |

### Flutter-Specific Rules

- **Riverpod 2.x:** Preferred state management. Choose correct provider types (StateNotifierProvider, FutureProvider, etc.)
- **const constructors:** Use `const` everywhere possible. Critical for widget rebuild optimization.
- **Small widgets:** Single responsibility principle. Split widgets over 50 lines.
- **Dart 3 features:** Use records, sealed classes, pattern matching. Prefer `switch` expressions.
- **Type safety:** `dynamic` FORBIDDEN (unless required). Strict typing.
- **Testing:** flutter_test + mocktail. Widget test + unit test for every feature.
- **Error handling:** `Either<Failure, Success>` pattern or sealed classes for error management.

@./gemini-modes.md

### Final Checklist

Order: **Lint → Widget Tests → Integration Tests → Performance → Platform Check**

---

## TIER 2: FLUTTER PLATFORM & ARCHITECTURE RULES

### Widget Architecture

- StatelessWidget default: Do not use StatefulWidget unless state is needed
- ConsumerWidget (Riverpod): `ref.watch` for reading state, `ref.listen` for side effects
- Key usage: Always provide Key in ListView/GridView
- BuildContext: Do not pass context across async gaps

### Navigation

- Prefer GoRouter or auto_route
- Plan deep linking support
- Route guards: Auth check middleware

### Platform Integration

- Platform channel: Native code communication with MethodChannel
- Permission handling: Permission management with permission_handler
- Lifecycle: Listen to AppLifecycleState, manage resources

### Performance

- `const` widgets: Prevent unnecessary rebuilds
- `RepaintBoundary`: Isolate heavy paint operations
- Image caching: Use `cached_network_image`
- Lazy loading: ListView.builder, pagination

---

@./agents-reference.md

**Key Skills:** flutter-patterns, mobile-design, clean-code, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /store-deploy

---
