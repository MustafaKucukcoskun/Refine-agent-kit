# Domain: Unity Game

> Bu dizin Unity oyun motoru projesi icerir.
> Agent routing: Bu dizindeki dosyalar icin asagidaki kurallar gecerlidir.

## Agent Routing

- **Primary:** `game-developer` — Game architecture, ECS patterns, Unity lifecycle
- **Supporting:** `performance-optimizer` — Draw calls, GC allocation, profiling

## Skill Priority

| P0 (Kritik) | P1 (Onemli) | P2 (Destek) |
|-------------|-------------|-------------|
| unity-developer | game-development/3d-games | testing-patterns |
| game-development | game-development/game-art | |

## Tech Stack

- Engine: Unity 2023+
- Language: C#
- Rendering: Universal Render Pipeline (URP)
- Testing: Unity Test Framework (Edit + Play Mode)

## Unity-Specific Rules

- `Awake()` initialization, `Start()` setup: Lifecycle sirasi onemli
- `Update()` icinde allocation YASAK: new, string concat, LINQ kacinilmali
- `[SerializeField]` tercih et: `public` field yerine private + SerializeField
- async/await tercih et (Unity 2023+): Coroutine yerine modern async pattern
- ScriptableObject: Data ve event'ler icin kullan, MonoBehaviour degil
- Object pooling: Instantiate/Destroy yerine pool pattern
- DI: Zenject veya VContainer ile dependency injection
