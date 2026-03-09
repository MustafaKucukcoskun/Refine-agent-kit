# mobile-rn Domain Kuralları

## Aktif Olma Koşulu

package.json içinde "react-native" dependency mevcut.

## Mimari Varsayımı

React Native 0.76+ \u2192 New Architecture VARSAYILAN.
Yeni projede eski mimariyi (bridge) etkinleştirme.

## Expo vs Bare

- Expo (managed): yeni projeler için birinci tercih
- Bare workflow: zorunlu native modül varsa

## Primary Agent

mobile-developer

## Stil

- StyleSheet API (default) veya NativeWind
- Inline style: YASAK (re-render performansı)

## Platform Farkları

- Platform.OS kullanımını minimize et \u2014 cross-platform önce
- SafeAreaView: her ekranda zorunlu

## Test

Jest + React Native Testing Library
