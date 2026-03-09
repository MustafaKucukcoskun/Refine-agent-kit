# godot-game Domain Kuralları

## Aktif Olma Koşulu

Proje kökünde project.godot dosyası mevcut.

## Primary Agent

game-developer

## MCP Gereksinimleri

- godot-mcp: stdio transport, GODOT_PATH env var tanımlı olmalı
- Orijinal 14-tool sürümü kullanılıyor (149-tool fork DEĞİL)

## Dil Tercihi

- GDScript: hızlı prototip ve küçük-orta projeler
- C#: performans kritik, büyük ekip veya Unity deneyimi varsa

## Kod Stili (GDScript)

- Statik tip zorunlu: var yerine her zaman tip belirt
- Signal'leri sınıf başında tanımla
- \_ready() \u2192 bağımlılık kurma, \_process() \u2192 her frame mantık

## Mimari Tercihleri

- Composition over inheritance: Node hiyerarşisi
- Autoload: sadece gerçekten global olan şeyler için
- Resource: veri nesneleri için (ScriptableObject karşılığı)

## Test

GUT (Godot Unit Test) framework
