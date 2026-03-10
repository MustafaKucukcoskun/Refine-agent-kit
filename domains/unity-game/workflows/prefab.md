---
description: Create and manage Unity prefabs. Prefab variants, nested prefabs, and component setup.
---

# /prefab - Unity Prefab Management

$ARGUMENTS

---

## Purpose

Create, organize, and optimize Unity prefabs with proper component setup and variant management.

---

## Sub-commands

```
/prefab create [name]     - Create new prefab with components
/prefab variant [base]    - Create prefab variant from base
/prefab audit             - Check prefabs for issues
/prefab optimize          - Optimize prefab hierarchy and components
```

---

## Behavior

### Create Prefab

1. **Determine type:**
   - Character (player, NPC, enemy)
   - Environment (prop, building, terrain piece)
   - UI (panel, button, dialog)
   - Effect (particle, audio, VFX)

2. **Standard component setup:**
   ```
   Character Prefab:
   ├── Root (Rigidbody, Collider, [Script])
   ├── Model (MeshRenderer, Animator)
   ├── UI (Canvas, HealthBar)
   └── Effects (AudioSource, ParticleSystem)
   ```

3. **Save to** `Assets/Prefabs/[Category]/[Name].prefab`

### Prefab Variants

- Create variants for different configurations (EnemyBase → EnemyFast, EnemyTank)
- Override only what changes
- Keep base prefab clean

### Prefab Audit

| Check | Issue | Fix |
|-------|-------|-----|
| Missing scripts | Deleted MonoBehaviour | Remove or replace |
| Broken references | Null asset refs | Reconnect |
| Excessive nesting | >5 levels deep | Flatten hierarchy |
| Unused components | Disabled forever | Remove |
| Large textures | >2K on small objects | Resize or atlas |

---

## Output Format

````markdown
## Prefab: [Name]

### Structure
```
[Name] (Root)
├── [Child 1] — [Components]
├── [Child 2] — [Components]
└── [Child 3] — [Components]
```

### Components
| Component | Settings |
|-----------|----------|

### Variants
| Variant | Overrides |
|---------|-----------|

### Path
`Assets/Prefabs/[Category]/[Name].prefab`
````
