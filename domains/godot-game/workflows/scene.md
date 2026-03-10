---
description: Create and manage Godot scenes. Scene setup, node hierarchy, signals, and optimization.
---

# /scene - Godot Scene Management

$ARGUMENTS

---

## Purpose

Create, configure, and optimize Godot scenes with proper node hierarchy, signals, and resource management.

---

## Sub-commands

```
/scene create [name]     - Create new scene with standard setup
/scene optimize          - Optimize current scene (visibility, processing)
/scene signals           - Map and audit signal connections
/scene audit             - Check scene for common issues
/scene tree              - Show scene tree hierarchy
```

---

## Behavior

### Create Scene

1. **Determine scene type:**
   - **Level/World** — Node2D/Node3D root, TileMap/GridMap, Camera, spawners
   - **UI Screen** — Control root, theme, navigation
   - **Character** — CharacterBody2D/3D, sprites, collision, state machine
   - **Autoload** — Manager/singleton pattern

2. **Standard node hierarchy:**
   ```
   Level (Node2D)
   ├── TileMap
   ├── Entities
   │   ├── Player
   │   └── Enemies
   ├── Items
   ├── Camera2D
   └── UI (CanvasLayer)
       ├── HUD
       └── PauseMenu
   ```

3. **Save to** `scenes/[category]/[name].tscn`

### Scene Optimization

| Check | Issue | Fix |
|-------|-------|-----|
| Offscreen nodes | Processing when invisible | `set_process(false)` when offscreen |
| Unused physics | CollisionShape on static objects | Remove or use StaticBody |
| Too many draw calls | Individual sprites | Use TileMap or atlas |
| Heavy _process | Math in every frame | Cache, use signals, timer |
| Scene tree depth | >10 levels | Flatten hierarchy |

### Signal Audit

Map all signal connections in the scene:
```
Player.health_changed → HUD._on_health_changed
Enemy.died → ScoreManager._on_enemy_died
```

---

## Output Format

````markdown
## Scene: [Scene Name]

### Setup
- **Path:** scenes/[category]/[name].tscn
- **Root:** [Node type]
- **Nodes:** [count]

### Node Tree
```
[Root]
├── [Child] — [type]
├── [Child] — [type]
└── [Child] — [type]
```

### Signals
| From | Signal | To | Method |
|------|--------|----|--------|

### Scripts
| Node | Script | Purpose |
|------|--------|---------|

### Issues
| # | Severity | Description | Fix |
|---|----------|-------------|-----|
````
