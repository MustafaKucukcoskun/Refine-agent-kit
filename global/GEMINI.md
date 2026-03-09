# GEMINI.md — Global Code Quality Rules

> Bu dosya TÜM projelerde AI kod kalitesini yönetir. Dil ve framework bağımsız.
> Konum: ~/.gemini/GEMINI.md

---

## 🔴 TIER 0: EVRENSEL KURALLAR (Her Zaman, Her Dil, Her Proje)

### 🌐 Dil

- Kullanıcı hangi dilde yazarsa o dilde yanıt ver
- Kod comment ve değişken isimleri: İngilizce

### 🧹 Clean Code (Global Zorunlu)

- DRY: Tekrar eden kod = refactor sinyali. Ama premature abstraction yapma.
- KISS: En basit çalışan çözümü seç. Over-engineering = kalite düşürür.
- YAGNI: İleride lazım olur diye şimdi yazma. Şu anki gereksinim için yaz.
- Test: Zorunlu. Pyramid (Unit > Integration > E2E) + AAA Pattern.
- Secrets: Asla hardcode etme. Environment variable / secret manager kullan.

### 🚫 Anti-AI Slop (Global Zorunlu — Her Dil, Her Çıktı)

**AI slop = AI'ın ürettiği generic, template-vari, projeye özgü olmayan çıktı.**

**⚖️ DENGE KURALI (KRİTİK):**
Slop'tan kaçınmak ≠ her şeyi over-engineer etmek. Basit bir iş basit kalsın.
3 satırlık CRUD endpoint'i "özgün olsun" diye 50 satıra çıkarmak da slop kadar kötü.
**Doğru olan: projeye uygun, okunabilir, amacına hizmet eden kod.**

#### Kod Slop (Tüm Diller)

| Slop Türü | Örnek | Neden Kötü |
|-----------|-------|------------|
| Generic naming | `data`, `item`, `temp`, `result`, `flag`, `utils.py` | Ne yaptığı belirsiz |
| Obvious comments | `// increment counter by 1`, `# loop through list` | Kodu tekrar ediyor |
| Empty catch | `try: ... except: pass` / `catch(e) {}` | Hataları yutuyor |
| God class/file | 500+ satır tek dosya, 10+ method tek class | Single responsibility ihlali |
| Unnecessary wrapper | `class UserService { getUser() { return db.getUser() } }` | Katman eklemiyor, sadece proxy |
| Copy-paste pattern | Tutorial'dan alınmış, projeye uyarlanmamış yapı | Projeye özgü değil |
| Over-abstraction | 3 dosyalık proje için factory + strategy + observer | Karmaşıklık ≠ kalite |

#### Backend / API Slop

| Slop Türü | Doğrusu |
|-----------|---------|
| Her endpoint'ten tüm veriyi döndürme | Pagination + field selection |
| Generic error: `{"error": "Something went wrong"}` | Spesifik hata kodu + mesaj |
| Her şey için ayrı middleware | İhtiyaç olan yerde, ihtiyaç kadar |
| N+1 query problemi | Eager loading / batch query |
| Business logic controller'da | Service/domain layer'a taşı |

#### Frontend / Design Slop

| Slop Türü | Doğrusu |
|-----------|---------|
| Generic hero + 3-column grid + purple gradient | Projeye özgü layout + renk |
| `handleClick`, `onChange` generic handler | `submitPayment`, `toggleDarkMode` |
| Her component'a `useEffect` | İhtiyaç olan yerde, cleanup ile |
| CSS-in-JS her yerde | Proje convention'ına uygun styling |
| Stock illustration + Lorem ipsum | Gerçek içerik, gerçek veri |

#### Metin / Copy Slop

| Slop | Alternatif |
|------|-----------|
| "In today's rapidly evolving..." | Direkt konuya gir |
| "Leveraging cutting-edge..." | Ne yaptığını söyle |
| "Seamless integration" | Spesifik: "API key ile 3 adımda bağlan" |
| "Robust and scalable" | Metrikleri ver: "10K req/s, %99.9 uptime" |

### 📐 SCOPE EXPANSION (Her İmplement Görevinde)

**"Ekle", "geliştir", "iyileştir" gibi isteklerde kapsam DARALTMA, GENİŞLET:**

| Alan | ❌ Minimal (FAIL) | ✅ Full Scope |
|------|-------------------|---------------|
| **Frontend** | 1 animasyon | Her section'a scroll-trigger + stagger |
| **Backend** | 1 endpoint'e validation | Tüm endpoint'lere validation + error handling |
| **API** | Sadece happy path | Happy + error + edge cases + rate limiting |
| **Database** | Sadece tablo oluştur | Tablo + index + constraint + migration |
| **Test** | 1 test yaz | Happy path + edge case + error case testleri |

**Kural:** Scope belirsizse → maksimum yorumu seç, teslim et, sonra sor.

### 🔐 Güvenlik (Global Zorunlu)

- OWASP Top 10 farkındalığı her kod yazımında aktif
- Input validation: Her dış girişi (user input, API response, file read) validate et
- Injection: Parametreli sorgular (SQL, command, LDAP). String concat ile query ASLA.
- Auth: Token'ları memory'de tutma, httpOnly cookie veya secure storage kullan
- Secrets: .env + environment variable. Commit'e secret girerse = acil rotate

### 📊 Performance (Dil-Agnostik)

**Önce ölç, sonra optimize et. Premature optimization = kötü.**

| Alan | Ölçüm | Hedef |
|------|-------|-------|
| **Web Frontend** | Core Web Vitals (LCP, INP, CLS) | LCP <2.5s, INP <200ms, CLS <0.1 |
| **Backend API** | Response time, throughput | p95 <200ms, error rate <0.1% |
| **Database** | Query time, connection pool | Slow query <100ms, no N+1 |
| **Python** | Profiling (cProfile, line_profiler) | Hot path optimized |
| **General** | Memory, CPU, I/O | Leak yok, idle CPU düşük |

---

## 🛑 SOCRATIC GATE (Her İstekte)

| Tip | Strateji | Aksiyon |
|-----|----------|---------|
| **Yeni Feature / Build** | Deep Discovery | Min. 3 stratejik soru sor |
| **Kod Edit / Bug Fix** | Context Check | Etki alanını onayla |
| **Belirsiz / Vague** | Clarification | Amaç + kullanıcı + kapsam sor |
| **"Devam et" / "Yap"** | Execution | Hemen başla. Geri dönülemez işlemlerde sor. |

**Kurallar:**
1. Gate geçince → tam implementation. Yarım bırakma = FAIL.
2. Cevap aldıktan sonra scope expand et, daraltma.
3. Spec-heavy request: trade-off / edge case sor, ama sonra hepsini yap.

---
