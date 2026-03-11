# GEMINI.md — Antigravity Agent System (python-data)

> This file defines the agent routing and skill system for this workspace.
> Global code quality rules are loaded from ~/.gemini/GEMINI.md.

---

@./base-protocol.md

---

## REQUEST CLASSIFIER (STEP 1)

| Type | Trigger | Action |
|------|---------|--------|
| **QUESTION** | "what is", "explain", "how does it work" | Text response |
| **SIMPLE CODE** | "fix", "add", "change" (single file) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement" | `{task-slug}.md` + Agent |
| **DATA PIPELINE** | "pipeline", "etl", "transform", "dataset" | `{task-slug}.md` + backend-specialist |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: PYTHON DATA SCIENCE CODE RULES

### Primary Agent: `backend-specialist`
### Supporting: `performance-optimizer`

### Skill Priority

| Priority | Skills |
|----------|--------|
| **P0** | data-engineer, python-patterns |
| **P1** | performance-profiling, testing-patterns |
| **P2** | clean-code |

### Data Science-Specific Rules

- **Pandas method chaining:** `.pipe().assign().query()` pattern. Minimize intermediate variables.
- **dtype optimization:** Choose `category` for categoricals, `int8/16/32` for integers. Can reduce memory by 50%+.
- **Polars lazy evaluation:** Prefer Polars lazy mode for >100MB data. `collect()` at the end.
- **DuckDB:** Use duckdb for SQL on files. CSV/Parquet direct query without loading into pandas.
- **Type hints mandatory:** Type checking with `pandas-stubs`. `def transform(df: pd.DataFrame) -> pd.DataFrame:`
- **Notebook vs .py:** Notebook for exploration/EDA, `.py` for production pipeline. Do not mix.
- **Testable transforms:** Every transform step must be an independent, testable function.
- **Testing:** Pytest + numpy.testing. `np.testing.assert_array_almost_equal` for numerical tests.

@./gemini-modes.md

### Final Checklist

Order: **Type Check → Lint → Unit Tests → Data Validation → Performance Profile → Reproducibility Check**

---

## TIER 2: DATA PIPELINE & ML RULES

### Data Pipeline

- Extract: Source-agnostic readers, connection pooling for databases
- Transform: Pure functions, each step testable, idempotent
- Load: Batch insert, upsert pattern, transaction management
- Orchestration: Prefect / Airflow / dagster for complex DAGs
- File formats: Parquet > CSV (compressed, typed, columnar)

### ML / Model Development

- Experiment tracking: MLflow or Weights & Biases
- Feature engineering: Feature store pattern, reusable transforms
- Model versioning: DVC or MLflow Model Registry
- Reproducibility: Random seed, requirements.txt / pyproject.toml, data versioning
- Evaluation: train/val/test split, cross-validation, proper metrics

### Visualization

- matplotlib: Publication-quality, consistent style with `plt.style.use()`
- plotly: Interactive dashboards, Dash apps
- Naming: Title, axis labels, units MANDATORY on every chart
- Color: Colorblind-friendly palette (viridis, cividis)

### Performance

- Vectorization: NumPy/Pandas vectorized ops, Python loops FORBIDDEN (large data)
- Memory: `del` + `gc.collect()` after large DataFrames
- Chunking: `pd.read_csv(chunksize=...)` for large files
- Parallel: `joblib`, `multiprocessing`, `dask` for embarrassingly parallel tasks
- Profiling: Find bottlenecks with `line_profiler`, `memory_profiler`

---

@./agents-reference.md

**Key Skills:** data-engineer, python-patterns, performance-profiling, testing-patterns, clean-code

**Workflows:** /create, /debug, /verify, /code-review, /eda, /train

---
