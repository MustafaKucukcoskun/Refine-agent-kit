---
description: Unity prefab and asset creation. Generates prefab structure with components, materials, physics, and proper asset organization. Use for game entity creation, reusable components, prefab variants, or asset pipeline setup.
---

# /prefab - Unity Prefab Creation

$ARGUMENTS

---

## Purpose

Guides the creation of Unity prefabs — reusable game object templates with proper component setup, material assignment, physics configuration, and asset folder organization. Handles both base prefabs and prefab variants.

---

## Pre-flight

> **GATE:** Verify Unity project structure.

```
Assets/
├── Prefabs/           # Must exist
│   ├── Characters/
│   ├── Environment/
│   ├── UI/
│   ├── VFX/
│   └── Pickups/
├── Scripts/
├── Materials/
├── Textures/
└── Animations/
```

> Create missing directories before prefab creation. Consistent folder structure prevents asset management chaos.

---

## Prefab Type Selection

> **GATE:** ASK user which prefab type to create.

| Type | Root Component | Common Children | Example |
|------|---------------|----------------|---------|
| **Character** | Rigidbody + Collider | Mesh/Sprite, Animator, AudioSource | Player, Enemy, NPC |
| **Environment** | Static MeshRenderer | Collider (static), LODGroup | Tree, Rock, Building |
| **UI Element** | RectTransform | Canvas children, TMP_Text, Image | HealthBar, Button, Panel |
| **VFX** | ParticleSystem | Sub-emitters, Light | Explosion, Trail, Ambient |
| **Pickup/Item** | Rigidbody + Trigger | MeshRenderer, Rotate script | Coin, PowerUp, Key |
| **Projectile** | Rigidbody + Collider | TrailRenderer, VFX | Bullet, Arrow, Spell |

---

## Step 1: GameObject Hierarchy

### Character Prefab Example
```
Player (Empty GameObject)
├── Model (MeshRenderer / SpriteRenderer)
│   └── Animator
├── Collider (CapsuleCollider / BoxCollider2D)
├── GroundCheck (Empty - positioned at feet)
├── AttackPoint (Empty - positioned at weapon)
├── Audio (AudioSource)
├── VFX
│   ├── DustParticles (ParticleSystem)
│   └── HitFlash (SpriteRenderer)
└── UI
    └── HealthBar (Canvas - World Space)
```

### Environment Prefab Example
```
Tree_Oak_01 (Empty GameObject)
├── Mesh (MeshFilter + MeshRenderer)
├── Collider (CapsuleCollider - static)
├── LODGroup (for distance-based quality)
└── WindZone (optional)
```

---

## Step 2: Component Setup

### Physics Configuration

| Prefab Type | Rigidbody | Collider | Is Trigger | Layer |
|-------------|-----------|----------|-----------|-------|
| Player | Dynamic | Capsule/Box | No | Player |
| Enemy | Dynamic | Capsule/Box | No | Enemy |
| Projectile | Dynamic (no gravity) | Sphere | Yes | Projectile |
| Pickup | Kinematic | Sphere | Yes | Pickup |
| Environment | None (static) | Mesh/Box | No | Environment |
| Trigger Zone | None | Box | Yes | Trigger |

> **Layer setup is mandatory.** Edit → Project Settings → Tags and Layers. Then configure Physics collision matrix.

### Script Attachment

```csharp
// Scripts/Characters/PlayerController.cs
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [Header("Movement")]
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float jumpForce = 10f;

    [Header("Ground Check")]
    [SerializeField] private Transform groundCheck;
    [SerializeField] private float groundRadius = 0.2f;
    [SerializeField] private LayerMask groundLayer;

    private Rigidbody2D rb;
    private bool isGrounded;

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    private void FixedUpdate()
    {
        isGrounded = Physics2D.OverlapCircle(
            groundCheck.position, groundRadius, groundLayer);

        float moveInput = Input.GetAxisRaw("Horizontal");
        rb.linearVelocity = new Vector2(moveInput * moveSpeed, rb.linearVelocity.y);
    }

    private void Update()
    {
        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
        }
    }
}
```

> Use `[SerializeField]` for inspector-configurable values. Avoid `public` fields.

---

## Step 3: Material & Visual Setup

```
Materials/
├── Characters/
│   ├── M_Player.mat
│   └── M_Enemy_Slime.mat
├── Environment/
│   ├── M_Ground.mat
│   └── M_Tree_Bark.mat
└── VFX/
    └── M_Particle_Glow.mat
```

**Naming convention:** `M_` prefix for materials, `T_` for textures, `A_` for animations.

> Assign materials in prefab, not in scene instances — ensures consistency across all instances.

---

## Step 4: Prefab Creation

1. Build GameObject hierarchy in scene
2. Configure all components
3. Drag from Hierarchy → `Assets/Prefabs/[Category]/`
4. Delete scene instance (prefab now lives in Assets)

### Prefab Variants

```
Prefabs/Characters/
├── Enemy_Base.prefab          ← Base prefab
├── Enemy_Slime.prefab         ← Variant (inherits Base)
├── Enemy_Skeleton.prefab      ← Variant (inherits Base)
└── Enemy_Boss_Dragon.prefab   ← Variant (overrides more)
```

> **Variants inherit from base.** Modifying base propagates to all variants. Override only what differs.

> **CRITICAL:** Right-click base prefab → Create → Prefab Variant. Do NOT duplicate — duplicates don't inherit.

---

## Step 5: Verify Prefab

| Check | Action |
|-------|--------|
| Drag into empty scene | Prefab instantiates correctly |
| No missing references | Inspector shows no "Missing" warnings |
| Components configured | Physics, layers, scripts all present |
| `.meta` files committed | Version control includes `.meta` alongside prefab |
| No scene overrides | Blue override indicators only where intended |

> **CRITICAL:** `.meta` files MUST be committed to version control. Without them, all references (materials, scripts, textures) break on other machines.

---

## Output Format

````markdown
## 🧱 Unity Prefab Created

**Prefab:** [name]
**Type:** [Character/Environment/UI/VFX/Pickup/Projectile]
**Path:** Assets/Prefabs/[Category]/[Name].prefab
**Variant of:** [base prefab or "Base"]

### Hierarchy
```
[GameObject tree]
```

### Components
| Component | Configuration |
|-----------|--------------|
| [component] | [key settings] |

### Checklist
- [ ] Hierarchy complete
- [ ] Physics configured (Rigidbody, Collider, Layer)
- [ ] Scripts attached with serialized fields
- [ ] Materials assigned
- [ ] Prefab saved to correct folder
- [ ] .meta files committed
- [ ] Variant overrides minimal
- [ ] Instantiation tested in clean scene
````

---

## Key Principles

- **Prefab overrides are fragile** — always "Apply" changes to the right prefab level (base vs variant)
- **Nested prefabs** (prefab inside prefab) require careful override management — test after changes
- **`.meta` files = references** — deleting or not committing `.meta` breaks all connections
- **ScriptableObjects** referenced by prefabs must be included in build — check Resources or Addressables
- **Naming convention** — enforce team-wide naming: `Player_Warrior.prefab`, `M_Skin_Default.mat`, `A_Walk.anim`
- **Never use `Find()` in scripts** — use serialized references or dependency injection instead
