# Domain: Python Data Science

> Bu dizin Python veri bilimi / veri muhendisligi projesi icerir.
> Agent routing: Bu dizindeki dosyalar icin asagidaki kurallar gecerlidir.

## Agent Routing

- **Primary:** `backend-specialist` — Data pipeline, Python patterns, ETL logic
- **Supporting:** `performance-optimizer` — Memory, vectorization, lazy evaluation

## Skill Priority

| P0 (Kritik) | P1 (Onemli) | P2 (Destek) |
|-------------|-------------|-------------|
| data-engineer | performance-profiling | clean-code |
| python-patterns | testing-patterns | |

## Tech Stack

- Data: Pandas / Polars
- SQL: DuckDB
- ML: scikit-learn, PyTorch
- Viz: matplotlib / plotly
- Testing: Pytest + numpy.testing

## Data Science-Specific Rules

- Pandas method chaining tercih et: `.pipe().assign().query()` pattern
- dtype optimization: Kategorik, int8/16/32 dogru sec, memory azalt
- Polars lazy evaluation: >100MB veri icin Polars lazy mode tercih et
- DuckDB: Dosya uzerinde SQL icin duckdb kullan (CSV/Parquet direct query)
- Type hints zorunlu: `pandas-stubs` ile tip kontrolu
- Notebook exploration icin, `.py` production icin: Kaggle/EDA notebook, pipeline .py
- Her transform adimi test edilebilir fonksiyon olmali
