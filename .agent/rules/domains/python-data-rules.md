# python-data Domain Rules

## Activation Condition

pandas, numpy, scikit-learn, polars, or dask present in
pyproject.toml, requirements.txt, environment.yml, or Pipfile.

## Library Preferences

- DataFrame: pandas (general) or polars (if performance-critical, >100MB data)
- Large file queries: duckdb (SQL interface, for Parquet/CSV)
- ML: scikit-learn (classical), PyTorch / transformers (deep learning)
- Visualization: matplotlib (basic), plotly (interactive)

## Primary Agent

backend-specialist (data-scientist agent to be added in P2)

## Code Style

- Type hints mandatory (pandas-stubs or polars native types)
- Notebook vs script: exploration → .ipynb, production → .py module
- Split each transformation step into a testable function
- Prefer lazy evaluation (polars lazy, dask, generators)
