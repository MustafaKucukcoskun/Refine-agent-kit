# python-data Domain Kuralları

## Aktif Olma Koşulu

pyproject.toml, requirements.txt, environment.yml veya Pipfile içinde
pandas, numpy, scikit-learn, polars veya dask mevcut.

## Kütüphane Tercihleri

- DataFrame: pandas (genel) veya polars (performans kritikse, >100MB veri)
- Büyük dosya sorgu: duckdb (SQL arayüzü, Parquet/CSV için)
- ML: scikit-learn (klasik), PyTorch / transformers (derin öğrenme)
- Görselleştirme: matplotlib (temel), plotly (interaktif)

## Primary Agent

backend-specialist (data-scientist agent P2'de eklenecek)

## Kod Stili

- Type hints zorunlu (pandas-stubs veya polars natif tipler)
- Notebook vs script: keşif → .ipynb, üretim → .py modül
- Her dönüşüm adımını test edilebilir fonksiyona böl
- Lazy evaluation tercih et (polars lazy, dask, jeneratörler)
