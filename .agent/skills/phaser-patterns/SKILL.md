# Phaser Patterns Skill

## 1. Scene Mimarisi

- Her ekranı/bölümü (Preload, MainMenu, Game, GameOver) ayrı Phaser `Scene` sınıflarına ayırın.
- Scene'ler arası geçiş yaparken mevcut scene'i tamamen durdurup diğerine geçmek için `this.scene.start('GameScene')` kullanın.
- Durdurmadan üst üste ekran (ör. UI Overlay, Pause Menüsü) koymak için `this.scene.launch('UI')` kullanın.

## 2. Asset Pipeline

- Verimli asset yüklemesi için daima özel bir Boot/Preload Scene yazın:
  ```javascript
  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.atlas('sprites', 'assets/sprites.png', 'assets/sprites.json'); // Çoklu resim yerine Texture Atlas best-practice'dir.
  }
  ```
- Asla oyun ortasında (create veya update içinde) dosya sistemi çağrısı ile asset yüklemeyin.

## 3. Performans: Object Pooling

- Ekranda sürekli belirip kaybolan mermi, düşman gibi objeler (Geniş alan RPG, Bullet Hell vs.) varsa her seferinde `sprite.destroy()` ve `new Sprite()` **YAPMAYIN**. Garbage collection yüzünden oyun takılır.
- Bunun yerine `Phaser.GameObjects.Group` veya `Physics.Arcade.Group` oluşturup ölümü gerçekleşen nesneyi `setActive(false).setVisible(false)` yapın, yeni mermi atılacağı zaman o gruptan pasif olanı `getFirstDead()` ile çekip geri aktifleştirin.

## 4. Physics (Arcade vs Matter)

- 2D Platformer, Top-down shooter gibi projelerin %90'ı için `Arcade` fizik motoru mükemmeldir (AABB collision kullanır, inanılmaz performanslıdır). Karmaşık poligonlu hitbox'lar, zincir mekanizmaları, sürtünme bazlı araba fizikleri gerekliyse `Matter.js` seçin.

## 5. Input ve Hareket

- Basit hareketlerde Update metodu içinde `if (cursors.left.isDown)` mantığını kullanın ama physics ile hareket ediyorsanız sprite'ın x,y koordinatını direk manipüle etmeyin (`sprite.x += 1`), bunun yerine motora yön verin: `sprite.setVelocityX(-200)`.
- Koordinat manipülasyonu wall(duvar) collision'larını bozar ve kameranın içinden geçmesine yol açar.
