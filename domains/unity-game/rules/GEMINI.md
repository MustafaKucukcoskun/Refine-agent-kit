# GEMINI.md — Antigravity Agent System (unity-game)

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
| **GAME DESIGN** | "prefab", "component", "shader", "physics", "system" | `{task-slug}.md` + game-developer |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: UNITY GAME CODE RULES

### Primary Agent: `game-developer`
### Supporting: `performance-optimizer`

### Skill Priority

| Priority | Skills |
|----------|--------|
| **P0** | unity-developer, game-development |
| **P1** | game-development/3d-games, game-development/game-art |
| **P2** | testing-patterns |

### Unity C#-Specific Rules

- **Awake() init, Start() setup:** `Awake()` for own references, `Start()` for external dependencies.
- **Allocation in Update() FORBIDDEN:** Avoid `new`, string concatenation, LINQ, boxing. Prevent GC spikes.
- **Prefer [SerializeField]:** Use `[SerializeField] private` instead of `public` fields. Encapsulation.
- **Prefer async/await (Unity 2023+):** Use `async UniTask` or native async instead of coroutines. UniTask recommended.
- **ScriptableObject:** Use as data containers and event channels. Not MonoBehaviour.
- **Object pooling:** Use pool pattern instead of `Instantiate`/`Destroy`. Especially for bullets, effects, NPCs.
- **DI:** Dependency injection with Zenject or VContainer. Singletons FORBIDDEN (use DI container).
- **Testing:** Unity Test Framework. Edit Mode (unit) + Play Mode (integration) tests.

@./gemini-modes.md

### Final Checklist

Order: **Lint → Edit Mode Tests → Play Mode Tests → Profiler → Build → Platform Test**

---

## TIER 2: UNITY ARCHITECTURE & PERFORMANCE RULES

### Component Architecture

- Single Responsibility: Each MonoBehaviour should do one thing
- Interface-based: Decoupling with interfaces like `IHealth`, `IDamageable`
- Assembly Definitions: Reduce compile time with `.asmdef`, control dependencies
- Namespace: Each module in its own namespace

### Rendering (URP)

- Universal Render Pipeline: URP asset, renderer features
- Shader Graph: Prefer Shader Graph for custom shaders, hand-written only when necessary
- Batching: Static/Dynamic batching, SRP Batcher, GPU Instancing
- LOD: Level of Detail, configure Occlusion Culling

### Physics & Movement

- FixedUpdate: Physics operations only in `FixedUpdate()`
- Rigidbody: `MovePosition`/`MoveRotation` for kinematic, `AddForce` for dynamic
- Layer-based collision: Configure Collision Matrix correctly, avoid unnecessary collision checks
- Raycast: Use `NonAlloc` versions (`RaycastNonAlloc`)

### Performance

- Profiler: Frame analysis with Unity Profiler, 16ms budget (60fps)
- Memory: Texture compression, Audio compression, Addressables
- Draw calls: Atlasing, material sharing, batching
- Code: `NativeArray`, `Burst` compiler, Jobs system (for compute-heavy work)

### Project Organization

```
Assets/
├── _Project/          # Project-specific
│   ├── Scripts/
│   ├── Prefabs/
│   ├── Materials/
│   ├── Scenes/
│   └── ScriptableObjects/
├── _Shared/           # Reusable
├── Plugins/           # 3rd party
└── Resources/         # Runtime load (use carefully)
```

---

@./agents-reference.md

**Key Skills:** unity-developer, game-development, game-development/3d-games, game-development/game-art

**Workflows:** /create, /debug, /verify, /code-review, /scene, /prefab

---
