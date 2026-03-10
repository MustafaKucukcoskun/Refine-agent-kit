---
description: Çalışan kodu bozmadan temizle ve iyileştir
---

Amaç: Çalışan kodu bozmadan temizle ve iyileştir
Kural: Refactor sırasında dış davranış değişmemeli (testler geçmeli)

Adımlar:

1. Mevcut testlerin geçtiğini doğrula (/verify veya /test)
2. Code smell'leri tespit et:
   - Uzun fonksiyonlar (>20 satır \u2192 böl)
   - Magic number/string \u2192 named constant
   - Duplicate kod \u2192 extract function/method
   - Derin nesting \u2192 early return pattern
3. Değişiklikleri küçük adımlarda yap \u2014 her adım sonrası test
4. İsim iyileştirmeleri: değişken, fonksiyon, sınıf isimleri açıklayıcı mı?
5. Son kontrol: test coverage düştü mü?

Kullanım: /refactor-clean [dosya veya kapsam]
