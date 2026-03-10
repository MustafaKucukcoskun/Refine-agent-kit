# GEMINI.md — Antigravity Agent System (python-data)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanimlar.
> Global kod kalitesi kurallari ~/.gemini/GEMINI.md'den yuklenir.

---

@./base-protocol.md

---

## REQUEST CLASSIFIER (ADIM 1)

| Tip | Trigger | Aksiyon |
|-----|---------|---------|
| **SORU** | "what is", "explain", "nasil calisir" | Text yanit |
| **SIMPLE CODE** | "fix", "ekle", "degistir" (tek dosya) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement" | `{task-slug}.md` + Agent |
| **DATA PIPELINE** | "pipeline", "etl", "transform", "dataset" | `{task-slug}.md` + backend-specialist |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: PYTHON DATA SCIENCE KOD KURALLARI

### Primary Agent: `backend-specialist`
### Supporting: `performance-optimizer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | data-engineer, python-patterns |
| **P1** | performance-profiling, testing-patterns |
| **P2** | clean-code |

### Data Science-Specific Rules

- **Pandas method chaining:** `.pipe().assign().query()` pattern. Intermediate variable'lar minimize et.
- **dtype optimization:** Kategorik icin `category`, integer icin `int8/16/32` dogru sec. Memory %50+ azaltilabilir.
- **Polars lazy evaluation:** >100MB veri icin Polars lazy mode tercih et. `collect()` en sona.
- **DuckDB:** Dosya uzerinde SQL icin duckdb kullan. CSV/Parquet direct query, pandas'a yuklemeden.
- **Type hints zorunlu:** `pandas-stubs` ile tip kontrolu. `def transform(df: pd.DataFrame) -> pd.DataFrame:`
- **Notebook vs .py:** Notebook exploration/EDA icin, `.py` production pipeline icin. Ikisini karistirma.
- **Testable transforms:** Her transform adimi bagimsiz, test edilebilir fonksiyon olmali.
- **Testing:** Pytest + numpy.testing. `np.testing.assert_array_almost_equal` ile numerik test.

@./gemini-modes.md

### Final Checklist

Sira: **Type Check → Lint → Unit Tests → Data Validation → Performance Profile → Reproducibility Check**

---

## TIER 2: DATA PIPELINE & ML KURALLARI

### Data Pipeline

- Extract: Source-agnostic readers, connection pooling for databases
- Transform: Pure functions, each step testable, idempotent
- Load: Batch insert, upsert pattern, transaction management
- Orchestration: Prefect / Airflow / dagster for complex DAGs
- File formats: Parquet > CSV (compressed, typed, columnar)

### ML / Model Development

- Experiment tracking: MLflow veya Weights & Biases
- Feature engineering: Feature store pattern, reusable transforms
- Model versioning: DVC veya MLflow Model Registry
- Reproducibility: Random seed, requirements.txt / pyproject.toml, data versioning
- Evaluation: train/val/test split, cross-validation, proper metrics

### Visualization

- matplotlib: Publication-quality, `plt.style.use()` ile tutarli stil
- plotly: Interactive dashboards, Dash apps
- Naming: Her chart'ta title, axis labels, units ZORUNLU
- Color: Colorblind-friendly palette (viridis, cividis)

### Performance

- Vectorization: NumPy/Pandas vectorized ops, Python loop YASAK (large data)
- Memory: `del` + `gc.collect()` large DataFrame'lerden sonra
- Chunking: `pd.read_csv(chunksize=...)` for large files
- Parallel: `joblib`, `multiprocessing`, `dask` for embarrassingly parallel tasks
- Profiling: `line_profiler`, `memory_profiler` ile bottleneck bul

---

@./agents-reference.md

**Key Skills:** data-engineer, python-patterns, performance-profiling, testing-patterns, clean-code

**Workflows:** /create, /debug, /verify, /code-review, /eda, /train

---
