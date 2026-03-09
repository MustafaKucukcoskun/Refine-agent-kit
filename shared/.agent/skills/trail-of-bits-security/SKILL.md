# Trail of Bits Security Prensibleri

Bu skill globaldir ve her domain'de uygulanmalıdır.

## 1. Input Validation (Girdi Doğrulama)

- Sistem dışından gelen (Kullanıcı, API Request, Dosya) tüm verilere varsayılan olarak "ZARARLI" muamelesi yapın.
- Sanitization (temizleme) yerine Validation (doğrulama) yapın (ör. `is_integer`, Pydantic strict tipler).
- Path traversal açıklarına karşı dosya yolları (`../../`) için her zaman path normalization (ör. `os.path.abspath`) ve prefix kontrolü yapın.

## 2. Secrets Management (Gizli Bilgi Yönetimi)

- Asla hardcode secret, token veya test amaçlı olsa bile API/DB connection string yazmayın.
- `.env` kullanın, her zaman `EXPO_PUBLIC_` gibi güvenli sanılan ön eklerin tarayıcıya/mobile sızdığını varsayın (içlerine gerçek secret koymayın).
- Kritik keylerin source control (Git) dışında kaldığından emin olun (örn: `.gitignore`).

## 3. OWASP Top 10 ve Injection

- SQL veri çekim işlemlerinde her zaman Parameterized Query veya ORM kullanın. String birleştirme (`"SELECT * FROM users WHERE name = " + user_input`) **kesinlikle yasaktır.**
- XSS koruması için HTML encode etmeden kullanıcı girdisi render etmeyin.
- X-Frame-Options, CSP, HSTS gibi Security Header'ların API veya Frontend sunucusundan basıldığına emin olun.

## 4. AuthZ (Yetkilendirme) ve AuthN (Kimlik Doğrulama)

- `Authentication` sadece kullanıcının kim olduğunu anlatır, yetkisini belirlemez.
- `Authorization` her endpoint'in başında bağımsız kontrol edilmelidir. (Sadece root rotada yetki kontrolü yapmak yeterli değildir, obje/row bazlı izinlere dikkat edilmelidir - Insecure Direct Object Reference (IDOR) riski).
- JWT veya OAuth kullanıyorsanız Refresh token olmadan çok uzun yaşayan Access Token'lar yaratmayın.

## 5. Bağımlılık (Dependency) ve LogGüvenliği

- Üçüncü parti bağımlılıkları düzenli olarak güncelleyin (`npm audit`, `pip-audit`, snyk veya trivy gibi tool'ları projede düşünün).
- Exception yakalarken ve Loglara yazarken kullanıcı PII'ı (Kişisel Veri), şifre, TC kimlik, Session ID veya bearer token değerlerini açık metin (plaintext) halinde basmayın.
