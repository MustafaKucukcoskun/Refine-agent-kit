# Data Engineer Skill

## 1. Pandas Best Practices

- **Method Chaining:** Perform data transformations using method chaining (`.assign()`, `.pipe()`, `.query()`) instead of creating temporary variables. Improves readability and optimizes RAM usage.
- **Dtype Optimization (Pandas 2.0+):** Use `dtype_backend='numpy_nullable'` to leverage PyArrow-backed nullable types like `Int64`, `Float64`, `boolean`, `string`. Prevents errors caused by missing data (`NaN` vs `None`). Use `.convert_dtypes()` to automatically switch to the best nullable dtype.
- **Chunking / Memory Mapping:** For large files (that strain RAM), use `pd.read_csv("file.json", lines=True, chunksize=1000)` or `memory_map=True` (`pd.read_table`).
- **Grouping & Merging:** Prefer `as_index=False` in `groupby` operations to prevent unnecessary indexing.

## 2. Polars Migration and Comparison

- **Lazy Evaluation:** While Pandas is "eager" (execute immediately), Polars is "lazy" by default. For data pipelines requiring higher performance (>100MB), build the graph with `pl.scan_csv()` and call `.collect()` at the end to save RAM and CPU.
- **Query Engine:** Since Polars has a multi-threaded Rust core, the `pl.Expr` (expression) API is orders of magnitude faster than pandas' `apply` loops. Use native expressions wherever possible (e.g., `.with_columns(pl.col("A") * 2)`).

## 3. DuckDB Integration

- **In-memory Analytics:** Query pandas DataFrames directly with SQL using zero-copy semantics: `duckdb.query("SELECT * FROM df").df()`.
- **Direct Parquet/CSV:** Instead of loading into memory with Pandas, use disk as a database: `duckdb.sql("SELECT dept, AVG(salary) FROM read_parquet('data.parquet') GROUP BY dept").df()`. This enables SQL capabilities on files that exceed RAM limits.

## 4. ETL (Extract, Transform, Load) Pipeline Pattern

- Each step should be an isolated Python function. Never write massive spaghetti blocks.
  - `extract_data(path: Path) -> pd.DataFrame`
  - `validate_schema(df: pd.DataFrame) -> None` (raises exception on unexpected dtype/null)
  - `transform_metrics(df: pd.DataFrame) -> pd.DataFrame` (used as `.pipe(transform_metrics)`)
  - `load_data(df: pd.DataFrame, target: str) -> None`
- Clean up unnecessary variables between steps with `del var_name` and `gc.collect()` to prevent memory bloat.

## 5. Data Quality

- **Missing Values:** Filling with `fillna()` using mean/median/constant is not always correct. If the feature targets machine learning, consider creating `is_null` indicator columns that note the status. For analytics, evaluate `dropna()` (hard delete) tradeoffs.
- **Outlier Detection:** Use the 3 Sigma rule or IQR and perform EDA (Exploratory Data Analysis) to determine whether extreme values are actual data corruption (sensor reading errors) or rare natural events.
