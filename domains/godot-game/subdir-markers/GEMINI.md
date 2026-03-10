# Domain: Godot Game

> Bu dizin Godot oyun motoru projesi icerir.
> Agent routing: Bu dizindeki dosyalar icin asagidaki kurallar gecerlidir.

## Agent Routing

- **Primary:** `game-developer` — Game architecture, scene design, GDScript patterns
- **Supporting:** `performance-optimizer` — Frame budget, draw calls, memory

## Skill Priority

| P0 (Kritik) | P1 (Onemli) | P2 (Destek) |
|-------------|-------------|-------------|
| godot-gdscript-patterns | game-development/2d-games | testing-patterns |
| game-development | game-development/game-art | |

## Tech Stack

- Engine: Godot 4.x
- Language: GDScript / C#
- Testing: GUT (Godot Unit Test)

## Godot-Specific Rules

- Static typing ZORUNLU GDScript'te: `var speed: float = 10.0`
- Signals sinif basinda tanimla: `signal health_changed(new_health: int)`
- `_ready()` setup icin, `_process()` frame logic icin
- Composition over inheritance: Node composition tercih et
- Autoload sadece gercekten global olanlar icin: GameManager, AudioManager
- Resource data objeleri icin: `class_name ItemData extends Resource`
