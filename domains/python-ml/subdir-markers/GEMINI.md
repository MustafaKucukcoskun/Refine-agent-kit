# Domain: Python ML / Image Processing

> This directory contains a Python ML, image processing, or data science project.
> Agent routing: The following rules apply to files in this directory.

## Agent Routing

- **Primary:** `backend-specialist` — Python logic, pipeline design
- **Supporting:** `performance-optimizer` — Memory, GPU, batch processing
- **Test:** `test-engineer` — Pytest, fixture-based testing

## Skill Priority

| P0 (Critical) | P1 (Important) | P2 (Supporting) |
|-------------|-------------|-------------|
| python-patterns | testing-patterns | clean-code |
| clean-code | performance-profiling | |

## Tech Stack

- Image: OpenCV, Pillow, scikit-image
- ML: PyTorch, TensorFlow, scikit-learn
- Data: NumPy, Pandas
- Pipeline: asyncio, multiprocessing
- Testing: Pytest + numpy.testing

## ML/CV-Specific Rules

- Prefer NumPy vectorization, avoid Python loops
- Memory management: `del` + `gc.collect()` after processing large arrays
- Batch processing: Build batch pipelines instead of processing one-by-one
- Reproducibility: Set random seed, do model versioning
- Type hints: Specify types like `np.ndarray`, `torch.Tensor`
- GPU: `.to(device)` pattern, CUDA availability check
- Profiling: Find hot paths with `line_profiler`, `memory_profiler`
