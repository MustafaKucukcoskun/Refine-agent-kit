# Domain: Unity Game

> This directory contains a Unity game engine project.
> Agent routing: The following rules apply to files in this directory.

## Agent Routing

- **Primary:** `game-developer` — Game architecture, ECS patterns, Unity lifecycle
- **Supporting:** `performance-optimizer` — Draw calls, GC allocation, profiling

## Skill Priority

| P0 (Critical) | P1 (Important) | P2 (Supporting) |
|-------------|-------------|-------------|
| unity-developer | game-development/3d-games | testing-patterns |
| game-development | game-development/game-art | |

## Tech Stack

- Engine: Unity 2023+
- Language: C#
- Rendering: Universal Render Pipeline (URP)
- Testing: Unity Test Framework (Edit + Play Mode)

## Unity-Specific Rules

- `Awake()` for initialization, `Start()` for setup: Lifecycle order matters
- Allocation in `Update()` FORBIDDEN: Avoid new, string concat, LINQ
- Prefer `[SerializeField]`: Use private + SerializeField instead of `public` field
- Prefer async/await (Unity 2023+): Modern async pattern instead of coroutines
- ScriptableObject: Use for data and events, not MonoBehaviour
- Object pooling: Pool pattern instead of Instantiate/Destroy
- DI: Dependency injection with Zenject or VContainer
