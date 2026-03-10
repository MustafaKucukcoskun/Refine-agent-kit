# GEMINI.md — Antigravity Agent System (phaser-game)

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
| **GAME DESIGN** | "scene", "physics", "sprite", "level" | `{task-slug}.md` + game-developer |
| **SLASH CMD** | /create, /debug, /verify, /code-review | Command flow |

---

@./routing-protocol.md

---

@./file-dependency.md

---

## TIER 1: PHASER GAME KOD KURALLARI

### Primary Agent: `game-developer`
### Supporting: `performance-optimizer`

### Skill Priority

| Oncelik | Skill'ler |
|---------|-----------|
| **P0** | game-development, phaser-patterns |
| **P1** | clean-code |
| **P2** | testing-patterns |

### Phaser-Specific Rules

- **Scene architecture:** Her ekran ayri Scene class. Scene gecisi: `this.scene.start()` / `this.scene.launch()` (overlay)
- **Asset management:** `preload()` icinde yukle, `create()`'te kullan
- **Physics:** Arcade (basit, hizli) veya Matter.js (kompleks fizik)
- **Object pooling:** Sik create/destroy yerine pool kullan
- **Texture atlas:** Ayri spriteler yerine atlas tercih et (performans)
- **Camera bounds:** Disindaki nesneleri `setActive(false)` yap
- **TypeScript:** Tip guvenligi icin TypeScript tercih et

@./gemini-modes.md

### Final Checklist

Sira: **Performance → Physics → Rendering → Tests → Build**

---

## TIER 2: PHASER ARCHITECTURE KURALLARI

### Scene Management

- Boot Scene: Asset preloading, progress bar
- Menu Scene: Ana menu, ayarlar, credits
- Game Scene: Ana oyun dongusu
- UI Scene: Overlay olarak HUD, score, health bar

### Game Loop

- `update(time, delta)`: Frame-based logic, delta kullan
- Event-driven: `this.events.emit()` / `this.events.on()` pattern
- State machine: Oyun durumlari icin FSM pattern

### Input Handling

- Keyboard: `this.input.keyboard.createCursorKeys()` pattern
- Touch/Mouse: Pointer events, drag & drop
- Gamepad: `this.input.gamepad` destegi

### Performance

- Texture atlases: TexturePacker ile optimize
- Object pooling: `this.add.group({ classType, maxSize })` pattern
- Camera culling: Viewport disini render etme
- WebGL: Canvas fallback yerine WebGL tercih et

---

@./agents-reference.md

**Key Skills:** game-development, phaser-patterns, clean-code, testing-patterns

**Workflows:** /create, /debug, /verify, /code-review, /scene

---
