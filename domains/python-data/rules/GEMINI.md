# GEMINI.md — Antigravity Agent System (python-data)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanimlar.
> Global kod kalitesi kurallari ~/.gemini/GEMINI.md'den yuklenir.

---

## CRITICAL: AGENT & SKILL PROTOCOL (ONCE OKU)

**ZORUNLU:** Her implementasyondan ONCE ilgili agent dosyasini ve skill'lerini oku.

### Skill Loading

`Agent aktif → frontmatter "skills:" kontrol → SKILL.md oku → Ilgili section'lari oku`

- **Selective:** TUM dosyalari okuma. Once `SKILL.md`, sonra sadece request'e uyan section.
- **Priority:** P0 (GEMINI.md) > P1 (Agent .md) > P2 (SKILL.md). Hepsi baglayici.
- **Enforcement:** `Read → Understand WHY → Apply PRINCIPLES → Code`. Skip yasak.

---

## REQUEST CLASSIFIER (ADIM 1)

| Tip              | Trigger                                        | Aksiyon                                |
| ---------------- | ---------------------------------------------- | -------------------------------------- |
| **SORU**         | "what is", "explain", "nasil calisir"          | Text yanit, arac yok                   |
| **SURVEY**       | "analyze", "listele", "overview"               | Session intel, dosya yok               |
| **SIMPLE CODE**  | "fix", "ekle", "degistir" (tek dosya)          | Inline edit                            |
| **COMPLEX CODE** | "build", "create", "implement", "yaz"          | `{task-slug}.md` + Agent               |
| **DATA PIPELINE**| "pipeline", "etl", "transform", "dataset"      | `{task-slug}.md` + backend-specialist  |
| **SLASH CMD**    | /create, /debug, /verify, /code-review         | Command flow                           |

---

## INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATIK)

**HER request'ten once otomatik agent sec ve bildir.**

### Protocol

1. **Sessiz Analiz:** Domain tespit et (ETL? ML? Visualization? Analysis?)
2. **Agent Sec:** En uygun specialist
3. **Bildir:** `**Applying knowledge of @[agent-name]...**`
4. **Uygula:** Agent .md dosyasini oku → kurallari uygula

### ROUTING CHECKLIST (Her kod yanitindan once ZORUNLU)

| #   | Kontrol                                       | Basarisiz →                                 |
| --- | --------------------------------------------- | ------------------------------------------- |
| 1   | Dogru agent domain tespit edildi mi?          | STOP. Analiz et.                            |
| 2   | Agent .md dosyasi OKUNDU mu?                  | STOP. `.agent/agents/{agent}.md` ac ve oku. |
| 3   | `Applying @[agent]...` yazildi mi?            | STOP. Ekle.                                 |
| 4   | Agent frontmatter'daki skill'ler yuklendi mi? | STOP. `skills:` oku.                        |

- Agent belirlemeden kod = **PROTOCOL VIOLATION**
- Agent kurallarini yoksaymak = **QUALITY FAILURE**

---

## File Dependency Awareness

Herhangi bir dosyayi degistirmeden once:

1. `CODEBASE.md` kontrol et (yoksa `session_manager.py` ile uret)
2. Bagimli dosyalari tespit et
3. Etkilenen TUM dosyalari birlikte guncelle

### System Map

**ZORUNLU:** Session basinda `ARCHITECTURE.md` oku. Agent, Skill ve Script yapisini anla.

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

### Gemini Mode Mapping

| Mod      | Agent             | Davranis                                       |
| -------- | ----------------- | ---------------------------------------------- |
| **plan** | `project-planner` | 4-asama metodoloji. Phase 4'e kadar KOD YAZMA. |
| **ask**  | —                 | Sadece anlamaya odaklan. Soru sor.             |
| **edit** | `orchestrator`    | Execute. Once `{task-slug}.md` kontrol et.     |

**Plan Mode (4 Faz):**
1. ANALYSIS → Arastir, soru sor
2. PLANNING → `{task-slug}.md`, gorev plani
3. SOLUTIONING → Mimari, tasarim (KOD YOK!)
4. IMPLEMENTATION → Kod + testler

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

## Final Checklist

"Son kontroller", "final checks" → `python .agent/scripts/checklist.py .`
Sira: **Type Check → Lint → Unit Tests → Data Validation → Performance Profile → Reproducibility Check**

---

## QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** clean-code, intelligent-routing, data-engineer, python-patterns,
performance-profiling, testing-patterns, context-engineering, code-review-checklist

**Workflows:** /create, /debug, /verify, /code-review

**Scripts:** `verify_all.py`, `checklist.py`, `session_manager.py`, `setup-agent.py`,
`auto_preview.py`, `verify_project_tmp.py`

---
