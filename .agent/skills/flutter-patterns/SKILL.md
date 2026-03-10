# Flutter Patterns Skill

## 1. Mimariler ve State Yönetimi (Riverpod 2.x)

- Modern Flutter'da StateNotifier vb. yerine `@riverpod` annotation'ı, `Notifier` (senkron) ve `AsyncNotifier` (asenkron) sınıfları kullanın.
- Widget'larda `ConsumerWidget` veya Hooks kullanıyorsanız `HookConsumerWidget` tercih edin.
- **Provider Okuma Kriterleri:**
  - İzlemek (build tetiklemek) için: `ref.watch(provider)` (sadece `build` metodu içinde).
  - Çağırmak (event handler) için: `ref.read(provider.notifier).methodName()`.
  - Dinlemek (snack bar vs göstermek) için: `ref.listen(provider, (prev, next) => ...)`.

## 2. Navigation (GoRouter)

- Klasik `Navigator.push` yerine declarative routing için `GoRouter` kullanın. Bu yaklaşım deep-linking'i otomatik çözer.
- Nested routing ve bottom navigation bar için `ShellRoute` yapısını tercih edin.
- Parametre geçişlerini `pathParameters` ve `extra` (sadece nesne taşıyacaksanız ve web URL'si umrunuzda değilse) ile yapın.

## 3. Dart 3.x Yenilikleri (Pattern Matching & Records)

- İki-üç değer döndürmek için gereksiz class'lar oluşturmayın, **Records** kullanın: `(int code, String msg) fetch() { return (200, "OK"); }`. Result'u okumak: `var (code, msg) = fetch();`
- Geleneksel if-else bloklarını veya if cascade'lerini **Pattern Matching** ile değiştirin (`switch` expressions ve `case` conditions).
- Sealed sınıflar ile union tipleri yaratın (Örn: Result<Success, Failure>). `switch` içinde tüm caselerin işlenmesini (exhaustiveness) zorunlu kılar.

## 4. Layout ve UI Prensipleri

- Sonsuz boyut hatasını (`hasBoundedHeight` exception) önlemek için listelerde/SingleChildScrollView içindeki column'larda `Expanded` veya `Flexible` kullanımına dikkat edin. Listeleri bir ScrollView içine gömerken `shrinkWrap: true` ve `physics: NeverScrollableScrollPhysics()` kullanmaktan kaçının -> performans felaketidir. Bunun yerine **Slivers** (`CustomScrollView`, `SliverList`) kullanın.
- Tek sorumlu küçük widget'lara bölerken metod çıkartmaktan (methods returning Widget) ziyade yeni StatelessWidget sınıfları tanımlamayı tercih edin (Flutter element ağacını daha iyi optimize eder ve const constructor kullanımını sağlar).
- Statik duran ve parametreleri değişmeyen widget'ları mutlaka `const` keyword ile çağırın.

## 5. Test

- UI Testleri için `flutter test` komutunu, widget'ları izole etmek için `WidgetTester` ve ekrana basma işlemleri için `tester.pumpWidget` ardından `tester.pumpAndSettle` (tüm animasyonların bitmesini beklemek) standart kullanımdır.
- Mocking ihtiyacında (örn. Dio, SharedPreferences), null-safety ile mükemmel çalışan `mocktail` paketini standart `mockito` yerine tercih edin (code generation gerektirmez).
