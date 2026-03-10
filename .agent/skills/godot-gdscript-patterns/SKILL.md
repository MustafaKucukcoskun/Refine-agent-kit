---
name: godot-gdscript-patterns
description: GDScript 4.x patterns — static typing, signals, scene/node composition, Resource, autoload, CharacterBody, GDExtension, scene instancing. Use when building Godot 4 games.
version: 1.0.0
domain: godot-game
triggers: godot, gdscript, signal, scene, node, autoload
---

# Godot GDScript 4.x Patterns

> Production-ready Godot 4 patterns. Composition-first, signal-driven.

---

## 1. GDScript 4.x Syntax

### Static Typing

```gdscript
# ✅ Always use static typing
var health: int = 100
var speed: float = 200.0
var player_name: String = "Hero"
var items: Array[Item] = []
var position: Vector2 = Vector2.ZERO

# Type inference
var damage := 25  # inferred as int

# Function signatures
func take_damage(amount: int) -> void:
    health -= amount

func get_health() -> int:
    return health
```

### Lambdas

```gdscript
var filtered := items.filter(func(item: Item) -> bool: return item.is_active)
var sorted := enemies.sort_custom(func(a, b): return a.distance < b.distance)
```

### @export Annotations

```gdscript
@export var speed: float = 200.0
@export var health: int = 100
@export_range(0.0, 1.0) var volume: float = 0.8
@export_enum("Warrior", "Mage", "Rogue") var player_class: String
@export var weapon_scene: PackedScene
@export_group("Combat")
@export var attack_damage: int = 10
@export var attack_range: float = 50.0
```

---

## 2. Node & Scene Composition

### Composition over Inheritance

```
# ❌ Deep inheritance
Enemy → FlyingEnemy → FlyingBossEnemy

# ✅ Composition
Enemy (CharacterBody2D)
├── HealthComponent
├── MovementComponent (Resource: ground/flying/swimming)
├── AttackComponent
└── LootDropComponent
```

```gdscript
# health_component.gd
class_name HealthComponent
extends Node

signal died
signal health_changed(new_health: int)

@export var max_health: int = 100
var current_health: int

func _ready() -> void:
    current_health = max_health

func take_damage(amount: int) -> void:
    current_health = maxi(current_health - amount, 0)
    health_changed.emit(current_health)
    if current_health == 0:
        died.emit()
```

---

## 3. Signal System (Observer Pattern)

```gdscript
# Declare signal
signal health_changed(new_value: int)
signal item_collected(item: Item)
signal game_over

# Emit
func take_damage(amount: int) -> void:
    health -= amount
    health_changed.emit(health)
    if health <= 0:
        game_over.emit()

# Connect — in code
func _ready() -> void:
    # Modern callable syntax
    player.health_changed.connect(_on_health_changed)
    player.game_over.connect(_on_game_over)

    # One-shot connection
    door.opened.connect(_on_door_opened, CONNECT_ONE_SHOT)

func _on_health_changed(new_health: int) -> void:
    health_bar.value = new_health

# Disconnect
func _exit_tree() -> void:
    if player.health_changed.is_connected(_on_health_changed):
        player.health_changed.disconnect(_on_health_changed)
```

### Connect via Editor

Right-click node → "Node" tab → double-click signal → select receiver method.

---

## 4. Resource System

### preload vs load

| Method                                   | When                       | Performance |
| ---------------------------------------- | -------------------------- | ----------- |
| `preload("res://...")`                   | Compile-time, small assets | ✅ Instant  |
| `load("res://...")`                      | Runtime, dynamic paths     | ❌ Blocking |
| `ResourceLoader.load_threaded_request()` | Large assets               | ✅ Async    |

### Custom Resource

```gdscript
# weapon_stats.gd
class_name WeaponStats
extends Resource

@export var name: String
@export var damage: int
@export var fire_rate: float
@export var projectile_scene: PackedScene
```

Create in editor: "New Resource" → Select `WeaponStats` → Save as `.tres`

```gdscript
# Usage
@export var weapon: WeaponStats

func attack() -> void:
    var projectile := weapon.projectile_scene.instantiate()
    projectile.damage = weapon.damage
    get_tree().current_scene.add_child(projectile)
```

---

## 5. Autoload (Singleton)

### When to Use

| ✅ Use            | ❌ Don't Use                     |
| ----------------- | -------------------------------- |
| Global game state | Scene-specific data              |
| Audio manager     | Individual enemy logic           |
| Scene transitions | Component that belongs to a node |
| Save/Load system  | Temporary UI state               |

```gdscript
# game_manager.gd (set as Autoload in Project Settings)
extends Node

signal score_changed(new_score: int)

var score: int = 0:
    set(value):
        score = value
        score_changed.emit(score)

var current_level: int = 1

func reset() -> void:
    score = 0
    current_level = 1

func change_scene(path: String) -> void:
    get_tree().change_scene_to_file(path)
```

Project → Project Settings → Autoload → Add `game_manager.gd` as "GameManager"

---

## 6. GDScript vs C# Selection

| Factor             | GDScript          | C#                              |
| ------------------ | ----------------- | ------------------------------- |
| **Learning curve** | Low (Python-like) | Medium (typed, verbose)         |
| **Prototyping**    | ✅ Fast           | ❌ More boilerplate             |
| **Performance**    | Good for gameplay | ✅ Better for heavy computation |
| **Tooling**        | Built-in editor   | VSCode + OmniSharp              |
| **Team size**      | Solo/small        | Large teams with C# experience  |
| **Libraries**      | Godot-only        | Full .NET ecosystem             |

**Rule:** Start with GDScript unless you NEED C# performance or .NET libraries.

---

## 7. Godot 4 Features

### CharacterBody2D / CharacterBody3D

```gdscript
extends CharacterBody2D

const SPEED := 300.0
const JUMP_VELOCITY := -400.0
var gravity: float = ProjectSettings.get_setting("physics/2d/default_gravity")

func _physics_process(delta: float) -> void:
    # Gravity
    if not is_on_floor():
        velocity.y += gravity * delta

    # Jump
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = JUMP_VELOCITY

    # Movement
    var direction := Input.get_axis("move_left", "move_right")
    velocity.x = direction * SPEED if direction else move_toward(velocity.x, 0, SPEED)

    move_and_slide()
```

### GDExtension

For performance-critical code in C/C++/Rust without recompiling engine:

```
project/
├── src/           # C++ source
├── SConstruct     # Build
├── extension.gdextension  # Registration
└── project.godot
```

---

## 8. Scene Instancing

```gdscript
# Preload scene
const BulletScene: PackedScene = preload("res://scenes/bullet.tscn")

func shoot() -> void:
    var bullet := BulletScene.instantiate() as Bullet
    bullet.global_position = muzzle.global_position
    bullet.direction = (get_global_mouse_position() - global_position).normalized()
    get_tree().current_scene.add_child(bullet)
```

### Scene organization

```
scenes/
├── main.tscn           # Entry point
├── ui/
│   ├── hud.tscn
│   └── pause_menu.tscn
├── characters/
│   ├── player.tscn
│   └── enemy.tscn
├── levels/
│   ├── level_1.tscn
│   └── level_2.tscn
└── components/          # Reusable
    ├── health_component.tscn
    └── hitbox.tscn
```

---

## Quick Reference

| Task         | Pattern                                        |
| ------------ | ---------------------------------------------- |
| Static type  | `var x: Type = value` or `var x := value`      |
| Signals      | `signal name(args)` → `.emit()` → `.connect()` |
| Composition  | Components as child nodes                      |
| Data         | Custom `Resource` (.tres files)                |
| Global state | Autoload singleton                             |
| Physics char | `CharacterBody2D` + `move_and_slide()`         |
| Instantiate  | `preload` + `.instantiate()` + `add_child()`   |
| Export       | `@export var` for inspector                    |
