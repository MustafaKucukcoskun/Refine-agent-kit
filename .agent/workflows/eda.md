---
description: Exploratory Data Analysis workflow. Profile dataset, detect quality issues, visualize distributions, analyze correlations, and generate actionable insights. Use for data profiling, dataset investigation, feature analysis, or data quality audit.
---

# /eda - Exploratory Data Analysis

$ARGUMENTS

---

## Purpose

Guides a systematic Exploratory Data Analysis — from data loading through actionable insights. Prevents common EDA pitfalls (wrong dtypes, silent NaN handling, misleading correlations) by enforcing a structured investigation pipeline.

---

## Tool Adaptation

| Dataset Size | Recommended Library | Why |
|-------------|-------------------|-----|
| < 1M rows | pandas | Full API, easy plotting |
| 1M - 100M rows | polars | 10-50x faster, lazy evaluation |
| > 100M rows | DuckDB | SQL interface, out-of-core |
| Any (quick profile) | ydata-profiling | Auto-generates HTML report |

---

## Step 1: Load & First Look

```python
import pandas as pd

# Load data
df = pd.read_csv("data.csv")   # or: pd.read_parquet, pd.read_json

# First look
print(f"Shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")
print(f"Dtypes:\n{df.dtypes}")
print(f"Memory: {df.memory_usage(deep=True).sum() / 1e6:.1f} MB")
df.head(10)
```

> **GATE:** Check dtypes BEFORE any computation. Object columns containing numbers cause silent errors in statistics.

```python
# Fix common dtype issues
df["date"] = pd.to_datetime(df["date"], format="%Y-%m-%d")
df["category"] = df["category"].astype("category")
df["price"] = pd.to_numeric(df["price"], errors="coerce")  # coerce invalid → NaN
```

---

## Step 2: Data Quality Profiling

```python
# Missing values
missing = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(1)
pd.DataFrame({"count": missing, "pct": missing_pct}).query("count > 0").sort_values("pct", ascending=False)
```

```python
# Duplicates
n_dupes = df.duplicated().sum()
print(f"Duplicate rows: {n_dupes} ({n_dupes/len(df)*100:.1f}%)")

# If duplicates exist, inspect them:
if n_dupes > 0:
    df[df.duplicated(keep=False)].sort_values(df.columns[0]).head(20)
```

```python
# Cardinality (unique values per column)
cardinality = pd.DataFrame({
    "unique": df.nunique(),
    "dtype": df.dtypes,
    "sample": [df[c].dropna().sample(min(3, df[c].nunique())).tolist() for c in df.columns]
})
cardinality
```

### Quality Issue Decision Matrix

| Issue | Threshold | Action |
|-------|-----------|--------|
| Missing > 50% | Column level | Consider dropping column |
| Missing 5-50% | Column level | Impute (median/mode/model) |
| Missing < 5% | Row level | Drop rows or simple impute |
| High cardinality categorical | > 100 unique | Group rare categories into "Other" |
| Constant column | 1 unique value | Drop — zero information |
| Near-constant | > 99% same value | Flag for review |
| ID-like column | unique == len(df) | Exclude from analysis |

---

## Step 3: Distribution Analysis

```python
import matplotlib.pyplot as plt

# Numeric distributions
numeric_cols = df.select_dtypes(include="number").columns
fig, axes = plt.subplots(len(numeric_cols), 2, figsize=(12, 4*len(numeric_cols)))

for i, col in enumerate(numeric_cols):
    df[col].hist(bins=50, ax=axes[i, 0])
    axes[i, 0].set_title(f"{col} — Histogram")

    df.boxplot(column=col, ax=axes[i, 1])
    axes[i, 1].set_title(f"{col} — Boxplot")

plt.tight_layout()
plt.show()
```

```python
# Descriptive statistics (extended)
df.describe(percentiles=[0.01, 0.05, 0.25, 0.5, 0.75, 0.95, 0.99]).T
```

### Outlier Detection

```python
# IQR method
for col in numeric_cols:
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1
    outliers = df[(df[col] < Q1 - 1.5*IQR) | (df[col] > Q3 + 1.5*IQR)]
    if len(outliers) > 0:
        print(f"{col}: {len(outliers)} outliers ({len(outliers)/len(df)*100:.1f}%)")
```

> **Do NOT auto-remove outliers.** Flag them, investigate their source, then decide per-column.

---

## Step 4: Correlation & Relationships

```python
import seaborn as sns

# Correlation matrix (numeric only)
corr = df[numeric_cols].corr()
plt.figure(figsize=(10, 8))
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0, fmt=".2f")
plt.title("Correlation Matrix")
plt.tight_layout()
plt.show()
```

```python
# High correlations (potential multicollinearity)
high_corr = []
for i in range(len(corr.columns)):
    for j in range(i+1, len(corr.columns)):
        if abs(corr.iloc[i, j]) > 0.8:
            high_corr.append((corr.columns[i], corr.columns[j], corr.iloc[i, j]))

if high_corr:
    print("High correlations (|r| > 0.8):")
    for c1, c2, r in high_corr:
        print(f"  {c1} ↔ {c2}: {r:.3f}")
```

> **Correlation ≠ Causation.** And Pearson only captures linear relationships. Use Spearman for ordinal data.

```python
# Categorical vs numeric (grouped stats)
for cat_col in df.select_dtypes(include="category").columns:
    print(f"\n{cat_col} vs numeric:")
    print(df.groupby(cat_col)[numeric_cols].agg(["mean", "median", "count"]))
```

---

## Step 5: Summary Report

> **GATE:** Every EDA must end with actionable findings — not just charts.

### Report Template

````markdown
## 📊 EDA Summary: [Dataset Name]

**Shape:** [rows] × [columns]
**Period:** [date range if temporal]
**Source:** [origin]

### Data Quality
| Metric | Value |
|--------|-------|
| Total rows | [n] |
| Duplicate rows | [n] ([pct]%) |
| Columns with missing | [n] / [total] |
| Worst missing column | [name] ([pct]%) |

### Key Distributions
- **[column]:** [distribution shape, range, notable patterns]
- **[column]:** [distribution shape, range, notable patterns]

### Correlations
- [column A] ↔ [column B]: r=[value] — [interpretation]

### Outliers
- [column]: [n] outliers — [likely cause]

### Data Quality Issues
1. [issue + recommended fix]
2. [issue + recommended fix]

### Recommendations
- [ ] [actionable next step]
- [ ] [actionable next step]
````

---

## Key Principles

- **Always check dtypes first** — object columns with numeric-looking data silently break statistics
- **Large datasets: sample first** — `df.sample(10_000)` for quick exploration, full data for final analysis
- **Datetime parsing needs explicit format** — `pd.to_datetime(col, format=...)` is 10x faster and avoids ambiguity
- **Categorical vs ordinal encoding matters** — Pearson correlation on ordinal-encoded data is misleading
- **`%matplotlib inline`** in notebooks — required for inline display in Jupyter
- **Never auto-remove outliers** — investigate source first; they may be valid extreme values
