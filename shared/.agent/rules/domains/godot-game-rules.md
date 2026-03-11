# godot-game Domain Rules

## Activation Condition

project.godot file present at project root.

## Primary Agent

game-developer

## MCP Requirements

- godot-mcp: stdio transport, GODOT_PATH env var must be defined
- Using the original 14-tool version (NOT the 149-tool fork)

## Language Preference

- GDScript: rapid prototyping and small-medium projects
- C#: performance-critical, large team, or Unity experience

## Code Style (GDScript)

- Static typing mandatory: always specify type instead of var
- Define signals at the top of the class
- _ready() → dependency setup, _process() → per-frame logic

## Architectural Preferences

- Composition over inheritance: Node hierarchy
- Autoload: only for truly global things
- Resource: for data objects (ScriptableObject equivalent)

## Test

GUT (Godot Unit Test) framework
