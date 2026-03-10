---
description: Create and manage Phaser scenes. Scene lifecycle, transitions, and asset management.
---

# /scene - Phaser Scene Management

$ARGUMENTS

---

## Purpose

Create, configure, and manage Phaser 3 scenes with proper lifecycle, transitions, and asset loading.

---

## Sub-commands

```
/scene create [name]     - Create new scene class
/scene list              - List all scenes in the project
/scene transition        - Setup scene transitions
/scene audit             - Check scenes for common issues
```

---

## Behavior

### Create Scene

1. **Determine scene type:**
   - **Boot** — Preload essential assets, show loading
   - **Preloader** — Load all game assets with progress bar
   - **Menu** — Title screen, settings, credits
   - **Gameplay** — Main game logic
   - **HUD** — Overlay scene (launched, not started)
   - **GameOver** — Results, retry, quit

2. **Generate scene class:**
   ```typescript
   import Phaser from 'phaser';

   export class GameScene extends Phaser.Scene {
     constructor() {
       super({ key: 'GameScene' });
     }

     preload(): void {
       // Load scene-specific assets only
     }

     create(): void {
       // Setup game objects, physics, input
     }

     update(time: number, delta: number): void {
       // Game loop logic
     }
   }
   ```

3. **Register in game config:**
   ```typescript
   const config: Phaser.Types.Core.GameConfig = {
     scene: [BootScene, PreloaderScene, MenuScene, GameScene, HUDScene],
   };
   ```

### Scene Transitions

```typescript
// Hard transition (destroys current)
this.scene.start('GameScene', { level: 1 });

// Overlay (both active)
this.scene.launch('HUDScene');

// Pause + resume
this.scene.pause('GameScene');
this.scene.resume('GameScene');
```

### Scene Audit

| Check | Issue | Fix |
|-------|-------|-----|
| Assets in create() | Loading in wrong phase | Move to preload() |
| No cleanup | Memory leaks | Add shutdown/destroy handlers |
| Heavy update() | Too much per frame | Throttle, use events |
| Missing key | Scene not registered | Add to game config |
| Circular transition | A→B→A loop | Add state management |

---

## Output Format

````markdown
## Scene: [Scene Name]

### Setup
- **Key:** '[SceneKey]'
- **Type:** [Boot/Preloader/Menu/Gameplay/HUD/GameOver]
- **File:** src/scenes/[Name]Scene.ts

### Lifecycle
- preload(): [assets loaded]
- create(): [objects created]
- update(): [logic description]

### Transitions
| From | To | Method | Data |
|------|----|--------|------|

### Assets Used
| Key | Type | Source |
|-----|------|--------|
````
