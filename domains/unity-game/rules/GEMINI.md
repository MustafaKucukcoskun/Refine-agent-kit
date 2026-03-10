# GEMINI.md — Antigravity Agent System (unity-game)

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
| **GAME DESIGN** | "prefab", "component", "shader", "physics", "system" | `{task-slug}.md` + game-developer |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

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

@./gemini-modes.md

### Final Checklist

Sira: **Lint → Edit Mode Tests → Play Mode Tests → Profiler → Build → Platform Test**

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

@./agents-reference.md

**Key Skills:** unity-developer, game-development, game-development/3d-games, game-development/game-art

**Workflows:** /create, /debug, /verify, /code-review, /scene, /prefab

---
