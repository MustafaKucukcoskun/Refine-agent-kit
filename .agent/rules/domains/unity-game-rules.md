# unity-game Domain Kuralları

## Aktif Olma Koşulu

Proje kökünde Assets/ dizini VE ProjectSettings/ dizini mevcut.

## Primary Agent

game-developer

## MCP Gereksinimleri

- unity-mcp aktif olabilmesi için Unity Editor açık olmalı (HTTP localhost:8080)
- Python 3.10+ ve uv kurulu olmalı

## Kod Stili

- MonoBehaviour: Awake() başlatma, Start() bağımlılık kurma
- Update() içinde allocation yapma (GC yükü)
- SerializeField tercih et, public field kullanma
- Coroutine yerine async/await (Unity 2023+)

## Mimari Tercihleri

- ScriptableObject: data ve event channel için
- Object pooling: sık instantiate/destroy yerine
- Dependency injection: Zenject/VContainer (büyük projeler)

## Test

Unity Test Framework (Edit Mode + Play Mode)
