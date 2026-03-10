# Domain: Phaser Web Game

> Bu dizin Phaser HTML5 oyun projesi icerir.
> Agent routing: Bu dizindeki dosyalar icin asagidaki kurallar gecerlidir.

## Agent Routing

- **Primary:** `game-developer` — Game design, Phaser patterns, scene management
- **Supporting:** `performance-optimizer` — Object pooling, texture atlas, rendering
- **Test:** `test-engineer` — Vitest, game logic testing

## Skill Priority

| P0 (Kritik) | P1 (Onemli) | P2 (Destek) |
|-------------|-------------|-------------|
| game-development | phaser-patterns | testing-patterns |

## Tech Stack

- Engine: Phaser 3.x
- Language: TypeScript/JavaScript
- Physics: Arcade (simple) / Matter.js (complex)
- Build: Vite / Webpack
- Testing: Vitest

## Phaser-Specific Rules

- Scene-based architecture: her ekran ayri Scene class
- Asset management: preload() icinde yukle, create()'te kullan
- Object pooling: sik create/destroy yerine pool kullan
- Texture atlas: ayri spriteler yerine atlas tercih et
- Camera bounds disindaki nesneleri setActive(false) yap
