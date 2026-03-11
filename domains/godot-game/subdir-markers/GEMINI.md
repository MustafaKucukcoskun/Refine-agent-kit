# Domain: Godot Game

> This directory contains a Godot game engine project.
> Agent routing: The following rules apply to files in this directory.

## Agent Routing

- **Primary:** `game-developer` — Game architecture, scene design, GDScript patterns
- **Supporting:** `performance-optimizer` — Frame budget, draw calls, memory

## Skill Priority

| P0 (Critical) | P1 (Important) | P2 (Supporting) |
|-------------|-------------|-------------|
| godot-gdscript-patterns | game-development/2d-games | testing-patterns |
| game-development | game-development/game-art | |

## Tech Stack

- Engine: Godot 4.x
- Language: GDScript / C#
- Testing: GUT (Godot Unit Test)

## Godot-Specific Rules

- Static typing MANDATORY in GDScript: `var speed: float = 10.0`
- Define signals at the top of the class: `signal health_changed(new_health: int)`
- `_ready()` for setup, `_process()` for frame logic
- Composition over inheritance: Prefer node composition
- Autoload only for truly global items: GameManager, AudioManager
- Resource for data objects: `class_name ItemData extends Resource`
