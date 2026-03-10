# GEMINI.md — Antigravity Agent System (unity-game)

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

| Tip              | Trigger                                              | Aksiyon                                |
| ---------------- | ---------------------------------------------------- | -------------------------------------- |
| **SORU**         | "what is", "explain", "nasil calisir"                | Text yanit, arac yok                   |
| **SURVEY**       | "analyze", "listele", "overview"                     | Session intel, dosya yok               |
| **SIMPLE CODE**  | "fix", "ekle", "degistir" (tek dosya)                | Inline edit                            |
| **COMPLEX CODE** | "build", "create", "implement", "yaz"                | `{task-slug}.md` + Agent               |
| **GAME DESIGN**  | "prefab", "component", "shader", "physics", "system" | `{task-slug}.md` + game-developer      |
| **SLASH CMD**    | /create, /debug, /verify, /code-review               | Command flow                           |

---

## INTELLIGENT AGENT ROUTING (ADIM 2 — OTOMATIK)

**HER request'ten once otomatik agent sec ve bildir.**

### Protocol

1. **Sessiz Analiz:** Domain tespit et (Component? Shader? Physics? UI? Audio?)
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

## TIER 1: UNITY GAME KOD KURALLARI

### Primary Agent: `game-developer`
### Supporting: `performance-optimizer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | unity-developer, game-development |
| **P1** | game-development/3d-games, game-development/game-art |
| **P2** | testing-patterns |

### Unity C#-Specific Rules

- **Awake() init, Start() setup:** `Awake()` kendi referanslari, `Start()` dis bagimliliklari.
- **Update() icinde allocation YASAK:** `new`, string concatenation, LINQ, boxing kacinilmali. GC spike onleme.
- **[SerializeField] tercih et:** `public` field yerine `[SerializeField] private`. Encapsulation.
- **async/await tercih et (Unity 2023+):** Coroutine yerine `async UniTask` veya native async. `UniTask` oneririz.
- **ScriptableObject:** Data container ve event channel olarak kullan. MonoBehaviour degil.
- **Object pooling:** `Instantiate`/`Destroy` yerine pool pattern. Ozellikle mermi, efekt, NPC.
- **DI:** Zenject veya VContainer ile dependency injection. Singleton YASAK (DI container kullan).
- **Testing:** Unity Test Framework. Edit Mode (unit) + Play Mode (integration) test.

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

## TIER 2: UNITY ARCHITECTURE & PERFORMANCE KURALLARI

### Component Architecture

- Single Responsibility: Her MonoBehaviour tek bir is yapsin
- Interface-based: `IHealth`, `IDamageable` gibi interface'ler ile decoupling
- Assembly Definitions: `.asmdef` ile compile time azalt, dependency kontrol et
- Namespace: Her modul kendi namespace'i icerisinde

### Rendering (URP)

- Universal Render Pipeline: URP asset, renderer features
- Shader Graph: Custom shader'lar icin Shader Graph tercih et, hand-written sadece gerektiginde
- Batching: Static/Dynamic batching, SRP Batcher, GPU Instancing
- LOD: Level of Detail, Occlusion Culling ayarla

### Physics & Movement

- FixedUpdate: Fizik islemleri sadece `FixedUpdate()` icerisinde
- Rigidbody: `MovePosition`/`MoveRotation` kinematic icin, `AddForce` dynamic icin
- Layer-based collision: Collision Matrix dogru ayarla, gereksiz collision kontrol etme
- Raycast: `NonAlloc` versiyonlari kullan (`RaycastNonAlloc`)

### Performance

- Profiler: Unity Profiler ile frame analizi, 16ms budget (60fps)
- Memory: Texture compression, Audio compression, Addressables
- Draw calls: Atlasing, material sharing, batching
- Code: `NativeArray`, `Burst` compiler, Jobs system (compute-heavy isler icin)

### Project Organization

```
Assets/
├── _Project/          # Proje-specific
│   ├── Scripts/
│   ├── Prefabs/
│   ├── Materials/
│   ├── Scenes/
│   └── ScriptableObjects/
├── _Shared/           # Yeniden kullanilabilir
├── Plugins/           # 3rd party
└── Resources/         # Runtime load (dikkatli kullan)
```

---

## Final Checklist

"Son kontroller", "final checks" → `python .agent/scripts/checklist.py .`
Sira: **Lint → Edit Mode Tests → Play Mode Tests → Profiler → Build → Platform Test**

---

## QUICK REFERENCE

**Agents (21):** orchestrator, project-planner, frontend-specialist, backend-specialist,
mobile-developer, game-developer, security-specialist, security-auditor, penetration-tester,
debugger, devops-engineer, database-architect, performance-optimizer, qa-automation-engineer,
test-engineer, seo-specialist, code-archaeologist, documentation-writer, product-owner,
product-manager, explorer-agent

**Key Skills:** clean-code, intelligent-routing, unity-developer, game-development,
game-development/3d-games, game-development/game-art, testing-patterns, performance-profiling,
context-engineering, code-review-checklist

**Workflows:** /create, /debug, /verify, /code-review

**Scripts:** `verify_all.py`, `checklist.py`, `session_manager.py`, `setup-agent.py`,
`auto_preview.py`, `verify_project_tmp.py`

---
