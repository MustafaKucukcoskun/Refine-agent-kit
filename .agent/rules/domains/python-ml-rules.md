# python-ml Domain Kurallari

## Aktif Olma Kosulu

pyproject.toml veya requirements.txt icinde torch, tensorflow, opencv-python,
scikit-image veya cv2 mevcut.

## Kutuphane Tercihleri

- Deep Learning: PyTorch (tercih) veya TensorFlow/JAX
- Computer Vision: OpenCV (isleme), torchvision/albumentations (augmentation)
- Goruntu isleme: PIL/Pillow, scikit-image
- ML Pipeline: scikit-learn (preprocessing, metrics)
- Veri: NumPy (tensor islemleri), pandas (metadata/etiket)
- Gorsellestirme: matplotlib (metrik grafikleri), tensorboard (egitim)

## Primary Agent

backend-specialist + performance-optimizer (GPU optimizasyonu icin)

## Kod Stili

- Type hints zorunlu (torch.Tensor, np.ndarray vb.)
- Device-agnostic kod yaz: `device = torch.device("cuda" if torch.cuda.is_available() else "cpu")`
- Model ve veri islemlerini ayir: `models/`, `data/`, `transforms/`
- Reproduciblity: `torch.manual_seed()`, `np.random.seed()`, deterministic config
- Batch processing: Buyuk veriyi batch'lere bol, bellek tasirma onle
- NumPy vectorization: for-loop yerine vektorize islemler kullan
- Profiling: `torch.profiler`, `cProfile` ile darbogazlari bul

## Model Gelistirme Sureci

1. Veri hazirlama: Dataset class, DataLoader, augmentation pipeline
2. Model tasarimi: nn.Module, forward pass, loss function
3. Egitim dongusu: optimizer, scheduler, gradient clipping
4. Degerlendirme: validation metrics, confusion matrix, per-class accuracy
5. Export: ONNX, TorchScript, veya checkpoint (.pth)

## Anti-Patterns

- GPU bellek sizmasi: `torch.no_grad()` kullan inference'da
- Gereksiz .numpy() cagrilari: GPU'dan CPU'ya sureksiz transfer
- Tek buyuk batch: OOM hatasi — batch_size ayarla
- print() ile debug: tensorboard veya logging kullan
- Hardcoded hyperparameter: argparse veya config dosyasi kullan
