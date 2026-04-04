---
name: phaser-patterns
description: Phaser game development patterns for scene architecture, asset loading, pooling, physics, and input handling.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Phaser Patterns Skill

## 1. Scene Architecture

- Split each screen/section (Preload, MainMenu, Game, GameOver) into separate Phaser `Scene` classes.
- To fully stop the current scene and switch to another, use `this.scene.start('GameScene')`.
- To overlay screens without stopping (e.g., UI Overlay, Pause Menu), use `this.scene.launch('UI')`.

## 2. Asset Pipeline

- Always write a dedicated Boot/Preload Scene for efficient asset loading:
  ```javascript
  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.atlas('sprites', 'assets/sprites.png', 'assets/sprites.json'); // Texture Atlas is the best practice over multiple images.
  }
  ```
- Never load assets via file system calls in the middle of gameplay (inside create or update).

## 3. Performance: Object Pooling

- For objects that constantly appear and disappear on screen such as bullets and enemies (open-world RPG, Bullet Hell, etc.), do **NOT** `sprite.destroy()` and `new Sprite()` each time. Garbage collection will cause the game to stutter.
- Instead, create a `Phaser.GameObjects.Group` or `Physics.Arcade.Group`, set dead objects to `setActive(false).setVisible(false)`, and when a new bullet is needed, pull a passive one from the group with `getFirstDead()` and reactivate it.

## 4. Physics (Arcade vs Matter)

- For 90% of 2D Platformer, Top-down shooter projects, the `Arcade` physics engine is excellent (uses AABB collision, incredibly performant). Choose `Matter.js` if complex polygon hitboxes, chain mechanisms, or friction-based vehicle physics are required.

## 5. Input and Movement

- For simple movement, use `if (cursors.left.isDown)` logic inside the Update method, but if moving with physics, do not directly manipulate the sprite's x,y coordinates (`sprite.x += 1`). Instead, direct the engine: `sprite.setVelocityX(-200)`.
- Coordinate manipulation breaks wall collision detection and can cause objects to pass through the camera.
