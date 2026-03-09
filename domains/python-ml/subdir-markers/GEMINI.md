# Domain: Python ML / Image Processing

> Bu dizin Python ML, görüntü işleme veya veri bilimi projesi içerir.
> Agent routing: Bu dizindeki dosyalar için aşağıdaki kurallar geçerlidir.

## Agent Routing

- **Primary:** `backend-specialist` — Python logic, pipeline design
- **Supporting:** `performance-optimizer` — Memory, GPU, batch processing
- **Test:** `test-engineer` — Pytest, fixture-based testing

## Skill Priority

| P0 (Kritik) | P1 (Önemli) | P2 (Destek) |
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

- NumPy vectorization tercih et, Python loop'larından kaçın
- Memory management: Large array'leri işledikten sonra `del` + `gc.collect()`
- Batch processing: Tek tek işleme yerine batch pipeline kur
- Reproducibility: Random seed set et, model versioning yap
- Type hints: `np.ndarray`, `torch.Tensor` tip belirt
- GPU: `.to(device)` pattern, CUDA availability check
- Profiling: `line_profiler`, `memory_profiler` ile hot path bul
