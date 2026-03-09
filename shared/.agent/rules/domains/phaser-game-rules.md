# phaser-game Domain Kuralları

## Aktif Olma Koşulu

package.json içinde "phaser" dependency mevcut.

## Primary Agent

game-developer

## Phaser Versiyonu

Phaser 3.x (aksi belirtilmedikçe)

## Mimari

- Scene-based yapı: her ekran ayrı Scene class
- Scene geçişi: this.scene.start() / this.scene.launch() (overlay)
- Asset yönetimi: preload() içinde yükle, create()'te kullan
- Physics: Arcade (basit, hızlı) veya Matter.js (kompleks)

## Performans

- Object pooling: sık create/destroy yerine
- Texture atlas kullan (ayrı spriteler yerine)
- Camera bounds dışındaki nesneleri setActive(false) yap
