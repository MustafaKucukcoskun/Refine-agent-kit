---
description: Create and manage Unity scenes. Scene setup, lighting, navigation, and optimization.
---

# /scene - Unity Scene Management

$ARGUMENTS

---

## Purpose

Create, configure, and optimize Unity scenes with proper setup for lighting, navigation, cameras, and game objects.

---

## Sub-commands

```
/scene create [name]     - Create new scene with standard setup
/scene optimize          - Optimize current scene (batching, LOD, occlusion)
/scene lighting          - Setup or bake lighting
/scene nav               - Generate NavMesh
/scene audit             - Check scene for common issues
```

---

## Behavior

### Create Scene

1. **Create scene file** in `Assets/Scenes/`
2. **Standard setup:**
   - Main Camera with proper clear flags
   - Directional Light with shadows
   - EventSystem (if UI needed)
   - Scene-specific manager (GameManager, LevelManager)
3. **Add to Build Settings** if needed

### Optimize Scene

1. **Static batching** — Mark non-moving objects as Static
2. **LOD Groups** — Setup for complex meshes
3. **Occlusion Culling** — Bake for indoor/complex scenes
4. **Light Probes** — Place for dynamic objects
5. **Draw call analysis** — Frame Debugger check

### Scene Audit

| Check | What | Fix |
|-------|------|-----|
| Missing references | Null component refs | Reconnect or remove |
| Unoptimized meshes | High poly count | LOD or simplify |
| Shadow casters | Too many realtime | Bake or reduce |
| Canvas overdraw | Overlapping UI | Flatten hierarchy |
| Physics layers | Missing collision matrix | Configure properly |

---

## Output Format

````markdown
## Scene: [Scene Name]

### Setup
- **Path:** Assets/Scenes/[name].unity
- **Type:** [Gameplay / Menu / Loading]
- **Objects:** [count]

### Optimization
- Draw calls: [count]
- Triangles: [count]
- Batches: [static/dynamic]
- Lighting: [Realtime / Mixed / Baked]

### Issues
| # | Severity | Description | Fix |
|---|----------|-------------|-----|
````
