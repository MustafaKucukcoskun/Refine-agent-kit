# GEMINI.md — Antigravity Agent System (mobile-flutter)

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
| **MOBILE UI** | "screen", "widget", "page", "bottom nav" | `{task-slug}.md` + mobile-developer |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: FLUTTER MOBILE KOD KURALLARI

### Primary Agent: `mobile-developer`
### Supporting: `performance-optimizer`, `test-engineer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | flutter-patterns, mobile-design |
| **P1** | clean-code |
| **P2** | testing-patterns |

### Flutter-Specific Rules

- **Riverpod 2.x:** Tercih edilen state management. Provider tiplerini dogru sec (StateNotifierProvider, FutureProvider, vb.)
- **const constructors:** Her yerde mumkun olan yerde `const` kullan. Widget rebuild optimizasyonu icin kritik.
- **Kucuk widget'lar:** Tek sorumluluk prensibi. 50+ satirlik widget'lari ayir.
- **Dart 3 features:** Records, sealed classes, pattern matching kullan. `switch` expression tercih et.
- **Type safety:** `dynamic` YASAK (zorunlu degilse). Strict typing.
- **Testing:** flutter_test + mocktail. Widget test + unit test her feature icin.
- **Error handling:** `Either<Failure, Success>` pattern veya sealed class'lar ile hata yonetimi.

@./gemini-modes.md

### Final Checklist

Sira: **Lint → Widget Tests → Integration Tests → Performance → Platform Check**

---

## TIER 2: FLUTTER PLATFORM & ARCHITECTURE KURALLARI

### Widget Architecture

- StatelessWidget default: State gerekmedikce StatefulWidget kullanma
- ConsumerWidget (Riverpod): State okuma icin `ref.watch`, side effect icin `ref.listen`
- Key kullanimi: ListView/GridView'da her zaman Key ver
- BuildContext: Context'i async gap'ten gecirme

### Navigation

- GoRouter veya auto_route tercih et
- Deep linking destegi planla
- Route guard'lar: Auth kontrol middleware

### Platform Integration

- Platform channel: MethodChannel ile native kod iletisimi
- Permission handling: permission_handler ile izin yonetimi
- Lifecycle: AppLifecycleState dinle, kaynak yonetimi yap

### Performance

- `const` widget'lar: Unnecessary rebuild engelle
- `RepaintBoundary`: Heavy paint islemleri izole et
- Image caching: `cached_network_image` kullan
- Lazy loading: ListView.builder, pagination

---

@./agents-reference.md

**Key Skills:** flutter-patterns, mobile-design, clean-code, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /store-deploy

---
