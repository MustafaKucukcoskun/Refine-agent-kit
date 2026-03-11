# unity-game Domain Rules

## Activation Condition

Assets/ directory AND ProjectSettings/ directory present at project root.

## Primary Agent

game-developer

## MCP Requirements

- Unity Editor must be open for unity-mcp to be active (HTTP localhost:8080)
- Python 3.10+ and uv must be installed

## Code Style

- MonoBehaviour: Awake() for initialization, Start() for dependency setup
- Do not allocate inside Update() (GC overhead)
- Prefer SerializeField, do not use public fields
- async/await instead of Coroutine (Unity 2023+)

## Architectural Preferences

- ScriptableObject: for data and event channels
- Object pooling: instead of frequent instantiate/destroy
- Dependency injection: Zenject/VContainer (large projects)

## Test

Unity Test Framework (Edit Mode + Play Mode)
