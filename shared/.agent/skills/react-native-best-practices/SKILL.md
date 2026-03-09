# React Native Best Practices Skill

## 1. New Architecture (RN 0.76+)
- **JSI ve Bridgeless:** 0.76 ile New Architecture varsayılan olarak gelir. Bridge tabanlı asenkron iletişim yerine, JSI (JavaScript Interface) sayesinde JS ve Native (C++) birbirlerini senkron olarak çağırabilir (`nativeModule.getValue()`). Bu, startup süresini ve frame dropları inanılmaz iyileştirir.
- **Uyumsuzluk Çözümü (Exception Pattern):** Eski bir paket New Architecture desteklemiyorsa ve zorunluysa, sadece o derleme için Android'de `android/gradle.properties` içine `newArchEnabled=false`, iOS için de Podfile'a `ENV['RCT_NEW_ARCH_ENABLED'] = '0'` ekleyerek opt-out yapın. Ancak her zaman alternatifi olan TurboModule uyumlu paket arayın.

## 2. Proje Yapısı ve Mimari
- Tüm logic ve ekranları "Feature-Based" (Özellik Odaklı) klasörleyin. Örn: `src/features/auth/`, `src/features/feed/`. Her feature kendi içinde `api/`, `components/`, `screens/` barındırır. Global components sadece gerçekten her yerde paylaşılan (Buton, Input vb) şeyler olmalıdır.

## 3. Navigation (React Navigation v7)
- v7 ile gelen statik type tanımları sayesinde, parametre geçişleri tam type-safe'dir. Parametreyi her zaman statik tipli (TypeScript interfacesi) ile daraltın (narrowing). "Magic string" route isimleri kullanmayın. Modülleri (`stack`, `tab`, `drawer`) ihtiyaca göre parçalı tasarlayın.

## 4. Performans ve Listeler
- **FlatList vs ScrollView:** Görünen ekrandan daha fazla içeriği olan listeler için **ASLA** `ScrollView.map` yapmayın. Mutlaka `FlatList` kullanın. Eleman sayınız devasa isebellek için `initialNumToRender` ve `maxToRenderPerBatch` ince ayarlarını yapın.
- **Memoization:** Her componenti `React.memo` ile sarmalamayın. Sadece prop'ları pahalı olan ve state değişiminde sık renderlanan (örn: listedeki tek bir satır) componentler için `memo`, ona paslanan fonksiyonlar için `useCallback` uygulayın.

## 5. State Yönetimi
- **Zustand:** Asenkron veri ve global state için en idealidir. Boilerplate'i yoktur.
- Component-kapsamlı geçici veriler dışında (form grid) API cevapları veya session bilgisini Zustand'da tutun.

## 6. Native API'ler ve Test
- Native linkler (mailto:, tel:, https:) veya app-to-app iletişim için `Linking.canOpenURL` kontrolünü daima try-catch içinde yapın. iOS'te Info.plist (LSApplicationQueriesSchemes) gerektirir.
- **Jest + RNTL:** E2E yerine integration yaklaşımı. Component'i `render()` edin, ardından `fireEvent.press` gibi tetiklemeler yapıp sonucunu bekleyin: `await waitFor(() => expect(screen.getByText('Başarılı')).toBeTruthy());`
