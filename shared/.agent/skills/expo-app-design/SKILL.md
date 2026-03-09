# Expo App Design Skill

## 1. Expo Router (File-based Routing)

- Navigation kodlarını manuel yazmak yerine Next.js benzeri `app/` dizinini kullanın.
- **Root Layout:** `app/_layout.tsx` tüm uygulamanın sarmalayıcısıdır (Providers, Error Boundaries burada olmalıdır).
- **Tabs ve Stacks:** `app/(tabs)/_layout.tsx` oluşturarak otomatik alt tab menüleri yaratın. Ekranlar bu klasörde `index.tsx`, `settings.tsx` olarak durur.
- **Bilinmeyen Rota (404):** `app/+not-found.tsx` dosyası ile catch-all yönlendirme yapın.

## 2. app.config.ts Kullanımı

- Statik `app.json` kullanmayın. Yerine Type-Safe ve mantık çalıştırabilen `app.config.ts` kullanın.
- Ortam değişkenleri okuyarak uygulama adı, bundle ID (`com.my.app` vs `com.my.app-dev`), ikon gibi özellikleri development / production için dinamik oluşturun. (Örn: `name: process.env.APP_ENV === 'production' ? 'My App' : 'My App (DEV)'`).
- Üçüncü parti paketler için Expo Plugin'leri bu dosyada `plugins: []` dizisine eklenir.

## 3. Environment Variables (.env)

- Sadece `EXPO_PUBLIC_` ön ekine sahip (prefix) değişkenler client tarafında JS bundle'ına dahil edilir.
- Doğru kullanım: `EXPO_PUBLIC_API_URL=https://api.example.com`.
- API keyler gibi güvenli kalması gereken sırlar (secrets) `.env`'ye konmaz, EAS Secrets üzerinden sunucu tarafında işlenir.

## 4. EAS Build ve Profile Yönetimi

- **eas.json:** Build süreçlerinizi yönetir. Mutlaka 3 temel profile sahip olun: `development` (simulator/cihaz tetiği için), `preview` (TestFlight / iç test), `production` (Mağaza).
- Her profil kendi environment değişkenleri setini `env: { APP_ENV: "production" }` şeklinde tanımlamalıdır. Bu EAS bulutunda build alınırken `app.config.ts`'i besler.

## 5. EAS Update (OTA)

- Uygulama mağazası beklemeden anlık JavaScript güncellemeleri göndermek için `expo-updates` kütüphanesini kullanın.
- Kanal stratejisi kurun: `preview` profili alan test kullanıcıları "preview" update kanalından beslenirken, "production" ayrı kalsın.

## 6. Prebuild (Bare Workflow Geçişi)

- Normalde `ios` ve `android` klasörleri diskinizde yer almaz (Managed Workflow). Eğer özel C++/Java kodu gerektiren, Expo plugin'i bulunmayan bir SDK eklerseniz `npx expo prebuild` komutuyla projeyi bare workflow'a çevirin.
- Prebuild bir kez çalıştırıldıktan sonra, iOS/Android dizinlerine manuel müdahale etmek yerine Expo Config Plugins yazmayı tercih edin (böylece projeyi silip tekrar prebuild yapıldığında değişiklikler korunur).
