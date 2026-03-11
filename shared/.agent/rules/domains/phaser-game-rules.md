# phaser-game Domain Rules

## Activation Condition

"phaser" dependency present in package.json.

## Primary Agent

game-developer

## Phaser Version

Phaser 3.x (unless otherwise specified)

## Architecture

- Scene-based structure: each screen is a separate Scene class
- Scene transition: this.scene.start() / this.scene.launch() (overlay)
- Asset management: load in preload(), use in create()
- Physics: Arcade (simple, fast) or Matter.js (complex)

## Performance

- Object pooling: instead of frequent create/destroy
- Use texture atlas (instead of separate sprites)
- setActive(false) for objects outside camera bounds
