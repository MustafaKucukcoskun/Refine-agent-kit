---
description: ML model training workflow. Data prep, model selection, training, evaluation, and export.
---

# /train - Model Training Pipeline

$ARGUMENTS

---

## Purpose

Train a machine learning model with systematic data preparation, model selection, hyperparameter tuning, evaluation, and export.

---

## Sub-commands

```
/train [target]          - Full training pipeline for target variable
/train baseline          - Quick baseline model (no tuning)
/train tune              - Hyperparameter optimization
/train evaluate          - Evaluate existing model
/train export [format]   - Export model (pickle, ONNX, joblib)
/train compare           - Compare multiple model results
```

---

## Behavior

### Training Pipeline

1. **Data Preparation**
   ```python
   from sklearn.model_selection import train_test_split
   from sklearn.preprocessing import StandardScaler

   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
   ```

2. **Model Selection** (based on task type)

   | Task | Models to Try |
   |------|--------------|
   | Classification | LogisticRegression, RandomForest, XGBoost, LightGBM |
   | Regression | LinearRegression, RandomForest, XGBoost, LightGBM |
   | Clustering | KMeans, DBSCAN, HierarchicalClustering |
   | Time Series | ARIMA, Prophet, LSTM |

3. **Training & Evaluation**
   ```python
   from sklearn.metrics import classification_report, mean_squared_error
   model.fit(X_train, y_train)
   y_pred = model.predict(X_test)
   ```

4. **Hyperparameter Tuning** (if requested)
   ```python
   from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
   # or optuna for advanced tuning
   ```

5. **Export**
   ```python
   import joblib
   joblib.dump(model, "models/model_v1.joblib")
   ```

---

## Output Format

````markdown
## Training: [Model Name]

### Task
- **Type:** Classification / Regression
- **Target:** [target column]
- **Features:** [N features]
- **Samples:** [train] / [test]

### Results
| Model | Accuracy/RMSE | Precision | Recall | F1 |
|-------|--------------|-----------|--------|-----|

### Best Model
- **Model:** [name]
- **Params:** [key hyperparameters]
- **Score:** [metric value]

### Feature Importance
| Feature | Importance |
|---------|-----------|

### Artifacts
- Model: `models/[name].joblib`
- Metrics: `reports/metrics.json`
- Plots: `reports/confusion_matrix.png`
````

---

## Key Principles

- **Always split data before any preprocessing** — prevent data leakage
- **Start with baseline** — simple model first, then iterate
- **Cross-validate** — don't rely on single train/test split
- **Track experiments** — log params, metrics, artifacts
- **Reproducibility** — set random seeds, document steps
