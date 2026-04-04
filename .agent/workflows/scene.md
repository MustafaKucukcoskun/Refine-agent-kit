---
description: Game scene creation wizard for Godot and Phaser. Generates scene structure with nodes/objects, scripts, physics setup, and signal wiring. Use for level design, UI screens, player/enemy creation, or menu systems.
---

# /scene - Game Scene Creation

$ARGUMENTS

---

## Purpose

Guides the creation of game scenes across Godot (`.tscn`) and Phaser (TypeScript/JavaScript). Handles node/object hierarchy, script attachment, physics and collision setup, and signal/event wiring.

---

## Engine Detection

> **GATE:** Detect engine before proceeding. Instructions differ significantly.

| Signal | Engine | Scene Format |
|--------|--------|-------------|
| `project.godot` exists | Godot 4.x | `.tscn` (text) / `.scn` (binary) |
| `package.json` has `phaser` | Phaser 3.x | TypeScript/JavaScript class |
| Both or neither | ASK user | — |

---

## Scene Type Selection

> **GATE:** ASK user which scene type to create. Do not auto-decide.

| Type | Godot Root Node | Phaser Scene | Contains |
|------|----------------|-------------|----------|
| **Level/World** | Node2D / Node3D | gameplay scene | Tilemap, spawners, triggers, camera |
| **Player** | CharacterBody2D/3D | player class | Sprite, collision, state machine |
| **Enemy** | CharacterBody2D/3D | enemy class | Sprite, AI behavior, collision |
| **UI Screen** | Control | UI scene | Buttons, labels, panels, layout |
| **Main Menu** | Control | menu scene | Play, Settings, Quit buttons |
| **HUD** | CanvasLayer | HUD overlay | Health bar, score, minimap |

---

## Godot Scene Creation

### Step 1: Node Hierarchy

```
# Example: Player scene
CharacterBody2D (root)
├── AnimatedSprite2D
├── CollisionShape2D
├── Camera2D (optional - for followed player)
├── Area2D (hitbox)
│   └── CollisionShape2D
└── RayCast2D (ground detection)
```

**Key rules:**
- Root node type determines scene behavior (CharacterBody for movement, Area for triggers, Control for UI)
- CollisionShape2D/3D must be direct child of physics body
- AnimationPlayer should be at root level for easy access

### Step 2: Script Attachment

```gdscript
# player.gd - attached to root CharacterBody2D
extends CharacterBody2D

@export var speed := 300.0
@export var jump_velocity := -400.0

func _physics_process(delta: float) -> void:
    # Gravity
    if not is_on_floor():
        velocity += get_gravity() * delta

    # Jump
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_velocity

    # Movement
    var direction := Input.get_axis("move_left", "move_right")
    velocity.x = direction * speed if direction else move_toward(velocity.x, 0, speed)

    move_and_slide()
```

### Step 3: Collision Layers

| Layer | Purpose | Example |
|-------|---------|---------|
| 1 | Environment | Ground, walls, platforms |
| 2 | Player | Player body |
| 3 | Enemies | Enemy bodies |
| 4 | Projectiles | Bullets, spells |
| 5 | Pickups | Coins, power-ups |
| 6 | Triggers | Checkpoints, doors |

> Set collision layer = "what I am", collision mask = "what I collide with"

### Step 4: Signal Wiring

```gdscript
# Connect signals in _ready()
func _ready() -> void:
    $Area2D.body_entered.connect(_on_hitbox_entered)
    $AnimatedSprite2D.animation_finished.connect(_on_animation_finished)
```

> Prefer code-based signal connections over editor connections — they survive scene restructuring.

---

## Phaser Scene Creation

### Step 1: Scene Class

```typescript
// scenes/GameScene.ts
import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void {
    this.load.spritesheet("player", "assets/player.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.tilemapTiledJSON("level1", "assets/maps/level1.json");
  }

  create(): void {
    // Tilemap
    const map = this.make.tilemap({ key: "level1" });
    const tileset = map.addTilesetImage("tiles", "tileset");
    const ground = map.createLayer("Ground", tileset!);
    ground?.setCollisionByExclusion([-1]);

    // Player
    this.player = this.physics.add.sprite(100, 100, "player");
    this.player.setCollideWorldBounds(true);

    // Collision
    if (ground) this.physics.add.collider(this.player, ground);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update(): void {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body?.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}
```

### Step 2: Scene Registration

```typescript
// main.ts
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { gravity: { x: 0, y: 300 }, debug: false },
  },
  scene: [BootScene, GameScene, UIScene],
};
```

> **CRITICAL:** Scene lifecycle is `init → preload → create → update`. Skipping preload causes null asset references.

### Step 3: Scene Transitions

```typescript
// Switch scene
this.scene.start("GameOverScene", { score: this.score });

// Overlay scene (HUD on top of game)
this.scene.launch("HUDScene");

// Pass data between scenes
this.scene.get("HUDScene").events.emit("updateScore", score);
```

---

## Output Format

````markdown
## 🎬 Scene Created

**Engine:** [Godot 4.x / Phaser 3.x]
**Scene type:** [Level/Player/Enemy/UI/Menu/HUD]
**File:** [path]

### Structure
```
[Node/object hierarchy]
```

### Components
- [ ] Root node/class configured
- [ ] Sprite/visual attached
- [ ] Collision/physics setup
- [ ] Script attached with core logic
- [ ] Signals/events wired
- [ ] Input handling configured

### Testing Checklist
- [ ] Scene loads without errors
- [ ] Physics interactions work
- [ ] Animations play correctly
- [ ] Z-ordering/layer sorting correct
- [ ] No null reference errors
````

---

## Key Principles

- **Godot:** `.tscn` is text-based (version controllable), `.scn` is binary — prefer `.tscn` for source control
- **Godot:** Node paths break on reparenting — use `%UniqueNodeName` syntax or signals instead of `$path/to/node`
- **Phaser:** Scene lifecycle order is strict — assets loaded in `preload` are only available in `create`
- **Both engines:** Z-ordering/layer sorting must be set explicitly or visuals layer incorrectly
- **Collision layers are not optional** — without proper layer/mask setup, everything collides with everything
