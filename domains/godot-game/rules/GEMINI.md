# GEMINI.md — Antigravity Agent System (godot-game)

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
| **GAME DESIGN** | "scene", "node", "mechanic", "level", "enemy" | `{task-slug}.md` + game-developer |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: GODOT GAME KOD KURALLARI

### Primary Agent: `game-developer`
### Supporting: `performance-optimizer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | godot-gdscript-patterns, game-development |
| **P1** | game-development/2d-games, game-development/game-art |
| **P2** | testing-patterns |

### GDScript-Specific Rules

- **Static typing ZORUNLU:** `var speed: float = 10.0`, `func move(delta: float) -> void:`
- **Signals sinif basinda:** `signal health_changed(new_health: int)` — tum signal'lar class top'da.
- **_ready() setup, _process() frame logic:** Lifecycle fonksiyonlarini karistirma.
- **Composition over inheritance:** Node composition tercih et. Derin inheritance zincirleri YASAK (max 3 level).
- **Autoload sadece global:** GameManager, AudioManager, EventBus gibi gercekten global olanlar.
- **Resource data objeleri icin:** `class_name ItemData extends Resource` — data class'lar icin Resource kullan.
- **Testing:** GUT (Godot Unit Test) framework. Her system icin test.

@./gemini-modes.md

### Final Checklist

Sira: **Static Typing Check → Scene Organization → GUT Tests → Performance Profile → Export Test**

---

## TIER 2: GODOT ARCHITECTURE & GAME DESIGN KURALLARI

### Scene Architecture

- One scene, one responsibility: Her scene tek bir amaca hizmet etmeli
- Scene inheritance: Base scene + variant pattern
- PackedScene: Prefab gibi kullan, `instance()` ile olustur
- Scene tree organization: Logical grouping (Entities/, UI/, Environment/)

### Node Patterns

- `@export` ile Inspector'dan degistirilebilir parametreler
- `@onready` ile lazy initialization: `@onready var sprite: Sprite2D = $Sprite2D`
- Group system: `add_to_group("enemies")` ile toplu islem
- Node references: `$ChildNode` veya `get_node()`, hard-coded path'lerden kacin

### Physics & Movement

- `_physics_process()` fizik islemleri icin, `_process()` gorsel icin
- CharacterBody2D/3D: `move_and_slide()` pattern
- Area2D/3D: Trigger zone'lar icin, collision layer/mask dogru ayarla
- Delta time: Her zaman `delta` carpani kullan

### Performance

- Object pooling: Mermi, particle gibi sik olusturulan objeler icin
- Visibility: `VisibleOnScreenNotifier` ile off-screen objeleri deaktive et
- Signal vs polling: `_process()` yerine signal-driven tasarim tercih et
- GDScript profiler: Darbogazlari bulmak icin Godot profiler kullan

---

@./agents-reference.md

**Key Skills:** godot-gdscript-patterns, game-development, game-development/2d-games, game-development/game-art

**Workflows:** /create, /debug, /verify, /code-review, /scene, /export

---
