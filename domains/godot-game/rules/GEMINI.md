# GEMINI.md — Antigravity Agent System (godot-game)

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
| **GAME DESIGN** | "scene", "node", "mechanic", "level", "enemy" | `{task-slug}.md` + game-developer |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: GODOT GAME CODE RULES

### Primary Agent: `game-developer`
### Supporting: `performance-optimizer`

### Skill Priority

| Priority | Skills |
|----------|--------|
| **P0** | godot-gdscript-patterns, game-development |
| **P1** | game-development/2d-games, game-development/game-art |
| **P2** | testing-patterns |

### GDScript-Specific Rules

- **Static typing MANDATORY:** `var speed: float = 10.0`, `func move(delta: float) -> void:`
- **Signals at class top:** `signal health_changed(new_health: int)` — all signals defined at the top of the class.
- **_ready() setup, _process() frame logic:** Do not mix lifecycle functions.
- **Composition over inheritance:** Prefer node composition. Deep inheritance chains FORBIDDEN (max 3 levels).
- **Autoload only for globals:** Only truly global items like GameManager, AudioManager, EventBus.
- **Resource for data objects:** `class_name ItemData extends Resource` — use Resource for data classes.
- **Testing:** GUT (Godot Unit Test) framework. Test for every system.

@./gemini-modes.md

### Final Checklist

Order: **Static Typing Check → Scene Organization → GUT Tests → Performance Profile → Export Test**

---

## TIER 2: GODOT ARCHITECTURE & GAME DESIGN RULES

### Scene Architecture

- One scene, one responsibility: Each scene should serve a single purpose
- Scene inheritance: Base scene + variant pattern
- PackedScene: Use like prefabs, create with `instance()`
- Scene tree organization: Logical grouping (Entities/, UI/, Environment/)

### Node Patterns

- `@export` for Inspector-editable parameters
- `@onready` for lazy initialization: `@onready var sprite: Sprite2D = $Sprite2D`
- Group system: Batch operations with `add_to_group("enemies")`
- Node references: `$ChildNode` or `get_node()`, avoid hard-coded paths

### Physics & Movement

- `_physics_process()` for physics, `_process()` for visuals
- CharacterBody2D/3D: `move_and_slide()` pattern
- Area2D/3D: For trigger zones, configure collision layer/mask correctly
- Delta time: Always use `delta` multiplier

### Performance

- Object pooling: For frequently created objects like bullets, particles
- Visibility: Deactivate off-screen objects with `VisibleOnScreenNotifier`
- Signal vs polling: Prefer signal-driven design over `_process()` polling
- GDScript profiler: Use Godot profiler to find bottlenecks

---

@./agents-reference.md

**Key Skills:** godot-gdscript-patterns, game-development, game-development/2d-games, game-development/game-art

**Workflows:** /create, /debug, /verify, /code-review, /scene, /export

---
