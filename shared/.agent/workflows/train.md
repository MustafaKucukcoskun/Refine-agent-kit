---
description: ML model training pipeline. Data splitting, preprocessing, model training, evaluation metrics, and artifact export. Use for model development, hyperparameter tuning, experiment tracking, or training pipeline setup.
---

# /train - ML Model Training

$ARGUMENTS

---

## Purpose

Guides a structured ML training pipeline — from data splitting through model serialization. Enforces best practices to prevent data leakage, ensure reproducibility, and produce properly evaluated models.

---

## Pre-flight Checks

> **GATE:** All checks must pass before training.

1. **EDA completed** — do NOT train on data you haven't explored (`/eda` first)
2. **Target variable defined** — classification (categorical) or regression (numeric)?
3. **Dataset clean** — missing values handled, dtypes correct

```python
import numpy as np
import pandas as pd

# Set random seed for reproducibility
SEED = 42
np.random.seed(SEED)

# Load prepared data
df = pd.read_csv("data_clean.csv")
print(f"Shape: {df.shape}")
print(f"Target distribution:\n{df['target'].value_counts(normalize=True)}")
```

---

## Task Detection

| Target Type | Task | Primary Metric | Watch For |
|-------------|------|----------------|-----------|
| Binary categorical | Classification | F1-score, AUC-ROC | Class imbalance |
| Multi-class categorical | Classification | Macro F1, Accuracy | Per-class performance |
| Continuous numeric | Regression | RMSE, MAE, R² | Outlier sensitivity |
| Time-indexed | Time Series | MAE, MAPE | Temporal leakage |

> **GATE:** For imbalanced classification (minority < 20%), accuracy is misleading. Use F1-score or AUC-ROC.

---

## Step 1: Train/Validation/Test Split

```python
from sklearn.model_selection import train_test_split

X = df.drop(columns=["target"])
y = df["target"]

# First split: train+val vs test (80/20)
X_trainval, X_test, y_trainval, y_test = train_test_split(
    X, y, test_size=0.2, random_state=SEED,
    stratify=y  # CRITICAL for classification — preserves class ratio
)

# Second split: train vs val (75/25 of trainval = 60/20 overall)
X_train, X_val, y_train, y_val = train_test_split(
    X_trainval, y_trainval, test_size=0.25, random_state=SEED,
    stratify=y_trainval
)

print(f"Train: {X_train.shape[0]}, Val: {X_val.shape[0]}, Test: {X_test.shape[0]}")
```

> **CRITICAL:** `stratify=y` for classification. Without it, rare classes may be entirely absent from test set.

> **CRITICAL:** Test set is LOCKED. Never use it for tuning, feature selection, or any decision-making. Evaluation on test happens exactly ONCE — at the end.

---

## Step 2: Preprocessing Pipeline

```python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

numeric_features = X_train.select_dtypes(include="number").columns.tolist()
categorical_features = X_train.select_dtypes(include=["object", "category"]).columns.tolist()

preprocessor = ColumnTransformer(
    transformers=[
        ("num", Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]), numeric_features),
        ("cat", Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]), categorical_features),
    ]
)
```

> **CRITICAL DATA LEAKAGE PREVENTION:** Fit preprocessor on `X_train` ONLY. Transform `X_val` and `X_test` using the fitted preprocessor. NEVER fit on full dataset before splitting.

```python
# Correct: fit on train, transform others
X_train_proc = preprocessor.fit_transform(X_train)
X_val_proc = preprocessor.transform(X_val)
X_test_proc = preprocessor.transform(X_test)  # Only used at final evaluation
```

---

## Step 3: Model Training

### Baseline First

```python
from sklearn.dummy import DummyClassifier  # or DummyRegressor

baseline = DummyClassifier(strategy="most_frequent")
baseline.fit(X_train_proc, y_train)
print(f"Baseline accuracy: {baseline.score(X_val_proc, y_val):.3f}")
```

> Every model must beat the baseline. If it doesn't, the features are insufficient.

### Model Selection

| Task | Start With | Then Try |
|------|-----------|----------|
| Tabular classification | RandomForest, XGBoost | LightGBM, CatBoost |
| Tabular regression | RandomForest, XGBoost | LightGBM, ElasticNet |
| Small dataset (< 1K) | LogisticRegression, SVM | KNN, DecisionTree |
| Time series | Prophet, ARIMA | LSTM, Temporal Fusion |

```python
from sklearn.ensemble import RandomForestClassifier

# Full pipeline: preprocessing + model
model_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(
        n_estimators=100,
        random_state=SEED,
        n_jobs=-1,
    ))
])

model_pipeline.fit(X_train, y_train)
```

---

## Step 4: Evaluation

### Classification Metrics

```python
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import matplotlib.pyplot as plt
import seaborn as sns

y_val_pred = model_pipeline.predict(X_val)
y_val_proba = model_pipeline.predict_proba(X_val)[:, 1]  # binary only

# Classification report
print(classification_report(y_val, y_val_pred))

# Confusion matrix
cm = confusion_matrix(y_val, y_val_pred)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()

# AUC-ROC (binary)
print(f"AUC-ROC: {roc_auc_score(y_val, y_val_proba):.3f}")
```

### Regression Metrics

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

y_val_pred = model_pipeline.predict(X_val)
print(f"RMSE: {mean_squared_error(y_val, y_val_pred, squared=False):.3f}")
print(f"MAE: {mean_absolute_error(y_val, y_val_pred):.3f}")
print(f"R²: {r2_score(y_val, y_val_pred):.3f}")
```

> **GATE:** If model barely beats baseline, revisit feature engineering before tuning hyperparameters.

---

## Step 5: Final Test Evaluation

> **GATE:** Only proceed here AFTER model selection and tuning are complete on validation set.

```python
# FINAL evaluation — run exactly once
y_test_pred = model_pipeline.predict(X_test)
print("=== FINAL TEST RESULTS ===")
print(classification_report(y_test, y_test_pred))
```

> This is the number you report. If it's significantly worse than validation, you overfit.

---

## Step 6: Save Model Artifact

```python
import joblib

# Save full pipeline (preprocessing + model)
joblib.dump(model_pipeline, "models/model_v1.joblib")

# Load later:
# model = joblib.load("models/model_v1.joblib")
# predictions = model.predict(new_data)
```

> Use `joblib` for scikit-learn pipelines (handles numpy arrays efficiently). Use ONNX for cross-platform deployment.

---

## Experiment Logging

```python
# Minimal experiment log (append to CSV)
import datetime

log_entry = {
    "timestamp": datetime.datetime.now().isoformat(),
    "model": "RandomForestClassifier",
    "params": {"n_estimators": 100},
    "val_f1": 0.85,
    "val_auc": 0.92,
    "test_f1": 0.83,       # Only after final eval
    "notes": "baseline features, no tuning"
}
```

> **Always log hyperparameters alongside metrics.** A metric without its params is useless for reproduction.

---

## Output Format

````markdown
## 🤖 Model Training Report

**Task:** [Classification / Regression]
**Target:** [column name]
**Dataset:** [rows] × [features]
**Split:** Train [n] / Val [n] / Test [n]

### Preprocessing
- Numeric: [imputer + scaler]
- Categorical: [imputer + encoder]
- Feature count after encoding: [n]

### Results
| Model | Val Metric | Test Metric |
|-------|-----------|-------------|
| Baseline | [score] | — |
| [Model 1] | [score] | [score] |

### Key Findings
- [most important features / insights]
- [any surprising results]

### Artifacts
- Model: `models/model_v1.joblib`
- Preprocessor: included in pipeline
- Seed: [SEED]
````

---

## Key Principles

- **Data leakage is the #1 ML mistake** — fit preprocessor on train set ONLY
- **Stratified split for classification** — always `stratify=y`
- **Test set is sacred** — evaluate on it exactly once, at the very end
- **Baseline first** — if your model can't beat `DummyClassifier`, fix features, not hyperparameters
- **Random seed everywhere** — `random_state=SEED` in split, model, and any stochastic component
- **Log everything** — model without logged params is unreproducible
- **GPU memory** — if using PyTorch, move tensors to CPU before logging: `tensor.cpu().numpy()`
