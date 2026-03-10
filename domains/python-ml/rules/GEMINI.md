# GEMINI.md — Antigravity Agent System (python-ml)

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
| **ML/CV** | "model", "train", "pipeline", "process" | `{task-slug}.md` + backend-specialist |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: PYTHON ML / IMAGE PROCESSING KURALLARI

### Primary Agent: `backend-specialist`
### Supporting: `performance-optimizer`
### Testing: `test-engineer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | python-patterns, clean-code |
| **P1** | testing-patterns, performance-profiling |
| **P2** | api-patterns |

### ML/CV-Specific Rules

- **NumPy vectorization:** Python loop'larindan kacin, vectorized operations kullan
- **Memory management:** Large array'leri isldikten sonra `del` + `gc.collect()`
- **Batch processing:** Tek tek isleme yerine batch pipeline kur
- **Reproducibility:** Random seed set et (`np.random.seed`, `torch.manual_seed`)
- **Model versioning:** Checkpoint save/load pattern, epoch tracking
- **Type hints:** `np.ndarray`, `torch.Tensor`, `PIL.Image.Image` tip belirt
- **GPU handling:** `.to(device)` pattern, CUDA availability check, graceful CPU fallback
- **Profiling:** `line_profiler`, `memory_profiler` ile hot path bul
- **Data pipeline:** `torch.utils.data.DataLoader` ile efficient data loading
- **Logging:** Training metrics: loss, accuracy, epoch — `tensorboard` veya `wandb`

@./gemini-modes.md

### Final Checklist

Sira: **Reproducibility → Memory → Performance → Tests → Documentation**

---

## TIER 2: DATA & PERFORMANCE KURALLARI

### Data Pipeline

- Input validation: Shape, dtype, range check at pipeline entry
- Preprocessing: Deterministic transforms, configurable augmentation
- Caching: Processed data cache for repeated experiments
- Format: Use efficient formats (HDF5, LMDB, TFRecord) for large datasets

### Performance

- **GPU utilization:** Mixed precision (`torch.cuda.amp`), gradient accumulation
- **Memory:** Gradient checkpointing for large models, `pin_memory=True`
- **I/O bottleneck:** `num_workers > 0` in DataLoader, prefetch
- **Profiling:** `torch.profiler` for GPU, `cProfile` for CPU bottlenecks

### Testing

- **Unit tests:** Pure functions, transform correctness, shape assertions
- **Integration:** Full pipeline end-to-end with small sample data
- **Reproducibility:** Fixed seed tests, deterministic mode assertions
- **Fixtures:** `numpy.testing.assert_array_almost_equal` for numerical checks

---

@./agents-reference.md

**Key Skills:** python-patterns, clean-code, testing-patterns, performance-profiling

**Workflows:** /create, /debug, /verify, /code-review, /eda, /train

---
