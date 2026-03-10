# Data Engineer Skill

## 1. Pandas Best Practices

- **Method Chaining:** Veri dönüşümlerini geçici değişkenler oluşturmak yerine method chaining (`.assign()`, `.pipe()`, `.query()`) ile yapın. Okunabilirliği artırır ve RAM kullanımını optimize eder.
- **Dtype Optimizasyonu (Pandas 2.0+):** `dtype_backend='numpy_nullable'` kullanarak `Int64`, `Float64`, `boolean`, `string` gibi PyArrow tabanlı nullable tipleri kullanın. Eksik veri (`NaN` vs `None`) kaynaklı hataları önler. `.convert_dtypes()` ile otomatik en iyi nullable dtype'a geçin.
- **Chunking / Memory Mapping:** Büyük dosyalar (RAM'i zorlayanlar) için `pd.read_csv("file.json", lines=True, chunksize=1000)` veya `memory_map=True` (`pd.read_table`) kullanın.
- **Grouping & Merging:** `groupby` işlemlerinde gereksiz indekslemeleri engellemek için `as_index=False` tercih edin.

## 2. Polars Geçişi ve Karşılaştırma

- **Lazy Evaluation:** Pandas "eager" (hemen çalıştır) mantığındayken Polars varsayılan olarak "lazy"dir. Daha yüksek performans gerektiren veri boru hatlarında (>100MB) `pl.scan_csv()` ile grafiği kurup en son `.collect()` çağırarak RAM ve CPU kazancı sağlayın.
- **Query Engine:** Polars çok iş parçacıklı Rust çekirdeğine sahip olduğundan `pl.Expr` (expression) API'si pandas'ın `apply` döngülerinden kat kat hızlıdır. Mümkün olduğunca native expression kullanın (örn: `.with_columns(pl.col("A") * 2)`).

## 3. DuckDB Entegrasyonu

- **In-memory Analitik:** `duckdb.query("SELECT * FROM df").df()` ile pandas DataFrame'leri sıfır-kopya (zero-copy) mantığıyla direkt SQL kullanarak sorgulayın.
- **Direct Parquet/CSV:** Pandas ile belleğe alıp işlem yapmak yerine, diski veritabanı gibi kullanın: `duckdb.sql("SELECT dept, AVG(salary) FROM read_parquet('data.parquet') GROUP BY dept").df()`. Bu sayede RAM sınırını aşan dosyalar üstünde SQL yeteneği kullanılır.

## 4. ETL (Extract, Transform, Load) Pipeline Pattern

- Her adım izole bir Python fonksiyonu olmalıdır. Asla devasa spagetti blokları yazmayın.
  - `extract_data(path: Path) -> pd.DataFrame`
  - `validate_schema(df: pd.DataFrame) -> None` (beklenmeyen dtype/null varsa exception fırlatır)
  - `transform_metrics(df: pd.DataFrame) -> pd.DataFrame` (`.pipe(transform_metrics)` şeklinde kullanılır)
  - `load_data(df: pd.DataFrame, target: str) -> None`
- Ara adımlarda bellek şişmesini önlemek için gereksiz değişkenleri `del var_name` ve `gc.collect()` ile temizleyin.

## 5. Veri Kalitesi (Data Quality)

- **Eksik Değerler:** `fillna()` ile ortalama/medyan/sabit basmak her zaman doğru değildir. İlgili feature makine öğrenmesi hedefleniyorsa durumu not eden `is_null` indikatör kolonları açmayı düşünün. Analitik için ise `dropna()` (kesin silme) tradeoff'larını değerlendirin.
- **Outlier Detection:** 3 Sigma kuralı veya IQR kullanarak ekstrem değerlerin gerçek bir veri bozulması (sensor okuma hatası) mı yoksa nadir doğal olay mı olduğunu anlamak için EDA (Exploratory Data Analysis) yapın.
