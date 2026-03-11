# Domain: Phaser Web Game

> This directory contains a Phaser HTML5 game project.
> Agent routing: The following rules apply to files in this directory.

## Agent Routing

- **Primary:** `game-developer` — Game design, Phaser patterns, scene management
- **Supporting:** `performance-optimizer` — Object pooling, texture atlas, rendering
- **Test:** `test-engineer` — Vitest, game logic testing

## Skill Priority

| P0 (Critical) | P1 (Important) | P2 (Supporting) |
|-------------|-------------|-------------|
| game-development | phaser-patterns | testing-patterns |

## Tech Stack

- Engine: Phaser 3.x
- Language: TypeScript/JavaScript
- Physics: Arcade (simple) / Matter.js (complex)
- Build: Vite / Webpack
- Testing: Vitest

## Phaser-Specific Rules

- Scene-based architecture: Each screen is a separate Scene class
- Asset management: Load in preload(), use in create()
- Object pooling: Use pools instead of frequent create/destroy
- Texture atlas: Prefer atlas over individual sprites
- Deactivate objects outside camera bounds with setActive(false)
