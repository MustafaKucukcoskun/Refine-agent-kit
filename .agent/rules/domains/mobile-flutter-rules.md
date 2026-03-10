# mobile-flutter Domain Kuralları

## Aktif Olma Koşulu

pubspec.yaml mevcut.

## Primary Agent

mobile-developer

## State Yönetimi Tercihleri

- Riverpod 2.x + kod üretimi (`@riverpod` annotation): karmaşık state için birinci tercih
- Provider: basit projeler veya mevcut Provider kodbase'leri için geçerli
- BLoC: ekip BLoC deneyimliyse tercih edilebilir
- setState: sadece lokal, izole widget state'i için

## Kod Stili

- Dart 3.x: records, sealed classes, patterns \u2014 aktif kullan
- `const` constructor'ları maksimuma çıkar
- Widget'ları küçük tut (tek sorumluluk)

## Test

flutter_test + mocktail (mock için)
