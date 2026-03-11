# GEMINI.md — Antigravity Agent System (python-ml)

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
| **ML/CV** | "model", "train", "pipeline", "process" | `{task-slug}.md` + backend-specialist |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: PYTHON ML / IMAGE PROCESSING RULES

### Primary Agent: `backend-specialist`
### Supporting: `performance-optimizer`
### Testing: `test-engineer`

### Skill Priority

| Priority | Skills |
|----------|--------|
| **P0** | python-patterns, clean-code |
| **P1** | testing-patterns, performance-profiling |
| **P2** | api-patterns |

### ML/CV-Specific Rules

- **NumPy vectorization:** Avoid Python loops, use vectorized operations
- **Memory management:** `del` + `gc.collect()` after processing large arrays
- **Batch processing:** Build batch pipelines instead of processing one by one
- **Reproducibility:** Set random seed (`np.random.seed`, `torch.manual_seed`)
- **Model versioning:** Checkpoint save/load pattern, epoch tracking
- **Type hints:** Specify types like `np.ndarray`, `torch.Tensor`, `PIL.Image.Image`
- **GPU handling:** `.to(device)` pattern, CUDA availability check, graceful CPU fallback
- **Profiling:** Find hot paths with `line_profiler`, `memory_profiler`
- **Data pipeline:** Efficient data loading with `torch.utils.data.DataLoader`
- **Logging:** Training metrics: loss, accuracy, epoch — `tensorboard` or `wandb`

@./gemini-modes.md

### Final Checklist

Order: **Reproducibility → Memory → Performance → Tests → Documentation**

---

## TIER 2: DATA & PERFORMANCE RULES

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
