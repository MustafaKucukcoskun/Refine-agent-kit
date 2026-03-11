# python-ml Domain Rules

## Activation Condition

torch, tensorflow, opencv-python, scikit-image, or cv2 present in
pyproject.toml or requirements.txt.

## Library Preferences

- Deep Learning: PyTorch (preferred) or TensorFlow/JAX
- Computer Vision: OpenCV (processing), torchvision/albumentations (augmentation)
- Image processing: PIL/Pillow, scikit-image
- ML Pipeline: scikit-learn (preprocessing, metrics)
- Data: NumPy (tensor operations), pandas (metadata/labels)
- Visualization: matplotlib (metric charts), tensorboard (training)

## Primary Agent

backend-specialist + performance-optimizer (for GPU optimization)

## Code Style

- Type hints mandatory (torch.Tensor, np.ndarray, etc.)
- Write device-agnostic code: `device = torch.device("cuda" if torch.cuda.is_available() else "cpu")`
- Separate model and data operations: `models/`, `data/`, `transforms/`
- Reproducibility: `torch.manual_seed()`, `np.random.seed()`, deterministic config
- Batch processing: split large data into batches, prevent memory overflow
- NumPy vectorization: use vectorized operations instead of for-loops
- Profiling: find bottlenecks with `torch.profiler`, `cProfile`

## Model Development Process

1. Data preparation: Dataset class, DataLoader, augmentation pipeline
2. Model design: nn.Module, forward pass, loss function
3. Training loop: optimizer, scheduler, gradient clipping
4. Evaluation: validation metrics, confusion matrix, per-class accuracy
5. Export: ONNX, TorchScript, or checkpoint (.pth)

## Anti-Patterns

- GPU memory leak: use `torch.no_grad()` during inference
- Unnecessary .numpy() calls: frequent GPU to CPU transfer
- Single large batch: OOM error — adjust batch_size
- Debug with print(): use tensorboard or logging
- Hardcoded hyperparameters: use argparse or config files
