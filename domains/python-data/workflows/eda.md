---
description: Exploratory Data Analysis workflow. Data profiling, visualization, and statistical summary for datasets.
---

# /eda - Exploratory Data Analysis

$ARGUMENTS

---

## Purpose

Perform systematic exploratory data analysis on a dataset. Profile structure, detect patterns, identify issues, and generate visualizations.

---

## Sub-commands

```
/eda [file/path]      - Full EDA on dataset
/eda profile          - Quick data profile (shape, types, nulls)
/eda correlations     - Correlation matrix and analysis
/eda outliers         - Detect and report outliers
/eda distributions    - Distribution plots for all numeric columns
/eda report           - Generate HTML/PDF EDA report
```

---

## Behavior

1. **Load and Profile**
   ```python
   import pandas as pd
   df = pd.read_csv("data.csv")  # or .parquet, .json, .xlsx
   print(df.shape, df.dtypes, df.describe())
   print(df.isnull().sum())
   ```

2. **Statistical Summary**
   - Shape, column types, memory usage
   - Missing values (count and percentage)
   - Unique value counts per column
   - Basic statistics (mean, median, std, min, max)

3. **Distribution Analysis**
   - Numeric: histograms, box plots
   - Categorical: value counts, bar charts
   - Temporal: time series trends

4. **Correlation & Relationships**
   - Pearson/Spearman correlation matrix
   - Feature importance (if target specified)
   - Cross-tabulations for categoricals

5. **Data Quality Issues**
   - Duplicates
   - Outliers (IQR, Z-score)
   - Inconsistent formats (dates, strings)
   - Cardinality issues (too many unique values)

---

## Output Format

````markdown
## EDA: [Dataset Name]

### Overview
- **Rows:** [N] | **Columns:** [N]
- **Memory:** [size]
- **Missing:** [% overall]

### Column Summary
| Column | Type | Nulls | Unique | Sample Values |
|--------|------|-------|--------|---------------|

### Key Findings
1. [Finding with statistical support]
2. [Finding with statistical support]

### Data Quality Issues
| # | Severity | Column | Issue | Recommendation |
|---|----------|--------|-------|----------------|

### Visualizations
[Inline plots or saved to reports/ directory]

### Next Steps
1. [Data cleaning recommendations]
2. [Feature engineering suggestions]
3. [Modeling considerations]
````

---

## Tools

| Library | Use |
|---------|-----|
| pandas | Data loading and manipulation |
| matplotlib / seaborn | Visualizations |
| ydata-profiling | Automated HTML report |
| scipy | Statistical tests |
| polars | Large dataset alternative |
