# GEMINI.md — Antigravity Agent System (phaser-game)

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
| **GAME DESIGN** | "scene", "physics", "sprite", "level" | `{task-slug}.md` + game-developer |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: PHASER GAME CODE RULES

### Primary Agent: `game-developer`
### Supporting: `performance-optimizer`

### Skill Priority

| Priority | Skills |
|----------|--------|
| **P0** | game-development, phaser-patterns |
| **P1** | clean-code |
| **P2** | testing-patterns |

### Phaser-Specific Rules

- **Scene architecture:** Each screen is a separate Scene class. Scene transitions: `this.scene.start()` / `this.scene.launch()` (overlay)
- **Asset management:** Load in `preload()`, use in `create()`
- **Physics:** Arcade (simple, fast) or Matter.js (complex physics)
- **Object pooling:** Use pools instead of frequent create/destroy
- **Texture atlas:** Prefer atlas over individual sprites (performance)
- **Camera bounds:** Deactivate objects outside bounds with `setActive(false)`
- **TypeScript:** Prefer TypeScript for type safety

@./gemini-modes.md

### Final Checklist

Order: **Performance → Physics → Rendering → Tests → Build**

---

## TIER 2: PHASER ARCHITECTURE RULES

### Scene Management

- Boot Scene: Asset preloading, progress bar
- Menu Scene: Main menu, settings, credits
- Game Scene: Main game loop
- UI Scene: Overlay HUD, score, health bar

### Game Loop

- `update(time, delta)`: Frame-based logic, use delta
- Event-driven: `this.events.emit()` / `this.events.on()` pattern
- State machine: FSM pattern for game states

### Input Handling

- Keyboard: `this.input.keyboard.createCursorKeys()` pattern
- Touch/Mouse: Pointer events, drag & drop
- Gamepad: `this.input.gamepad` support

### Performance

- Texture atlases: Optimize with TexturePacker
- Object pooling: `this.add.group({ classType, maxSize })` pattern
- Camera culling: Do not render outside viewport
- WebGL: Prefer WebGL over Canvas fallback

---

@./agents-reference.md

**Key Skills:** game-development, phaser-patterns, clean-code, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /scene

---
