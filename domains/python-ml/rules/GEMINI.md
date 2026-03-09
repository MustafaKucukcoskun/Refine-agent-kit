# GEMINI.md — Antigravity Agent System (python-ml)

> Bu dosya bu workspace'te agent routing ve skill sistemini tanımlar.
> Global kod kalitesi kuralları ~/.gemini/GEMINI.md'den yüklenir.

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

| Tip              | Trigger                                     | Aksiyon                                |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| **SORU**         | "what is", "explain", "nasil calisir"       | Text yanit, arac yok                   |
| **SURVEY**       | "analyze", "listele", "overview"            | Session intel, dosya yok               |
| **SIMPLE CODE**  | "fix", "ekle", "degistir" (tek dosya)       | Inline edit                            |
| **COMPLEX CODE** | "build", "create", "implement", "yaz"       | `{task-slug}.md` + Agent               |
| **ML/CV**        | "model", "train", "pipeline", "process"     | `{task-slug}.md` + backend-specialist  |
| **SLASH CMD**    | /create, /debug, /verify, /code-review      | Command flow                           |

---

## INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATIK)

**HER request'ten once otomatik agent sec ve bildir.**

### Protocol

1. **Sessiz Analiz:** Domain tespit et (ML Model? Data Pipeline? Image Processing? Training?)
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

## Final Checklist

"Son kontroller", "final checks" → `python .agent/scripts/checklist.py .`
Sira: **Reproducibility → Memory → Performance → Tests → Documentation**

---

## QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** clean-code, intelligent-routing, python-patterns, testing-patterns,
performance-profiling, context-engineering, code-review-checklist

**Workflows:** /create, /debug, /verify, /code-review

**Scripts:** `verify_all.py`, `checklist.py`, `session_manager.py`, `setup-agent.py`,
`auto_preview.py`, `verify_project_tmp.py`

---
