# Domain: Python Data Science

> This directory contains a Python data science / data engineering project.
> Agent routing: The following rules apply to files in this directory.

## Agent Routing

- **Primary:** `backend-specialist` — Data pipeline, Python patterns, ETL logic
- **Supporting:** `performance-optimizer` — Memory, vectorization, lazy evaluation

## Skill Priority

| P0 (Critical) | P1 (Important) | P2 (Supporting) |
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

- Prefer Pandas method chaining: `.pipe().assign().query()` pattern
- dtype optimization: Choose correct types (category, int8/16/32), reduce memory
- Polars lazy evaluation: Prefer Polars lazy mode for >100MB data
- DuckDB: Use duckdb for SQL on files (CSV/Parquet direct query)
- Type hints mandatory: Type checking with `pandas-stubs`
- Notebook for exploration, `.py` for production: Kaggle/EDA notebook, pipeline .py
- Every transform step must be a testable function
