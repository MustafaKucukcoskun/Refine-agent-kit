---
description: Test generation and test running command. Creates and executes tests for code. Adapts to project domain automatically.
---

# /test - Test Generation and Execution

$ARGUMENTS

---

## Purpose

This command generates tests, runs existing tests, or checks test coverage.
Automatically detects the project's tech stack and uses the correct test framework.

---

## Sub-commands

```
/test                - Run all tests
/test [file/feature] - Generate tests for specific target
/test coverage       - Show test coverage report
/test watch          - Run tests in watch mode
```

---

## Domain Adaptation

**MANDATORY:** Detect the project type FIRST, then use the matching framework and patterns.

| Domain | Framework | Run Command | Config File | Test File Pattern |
|--------|-----------|-------------|-------------|-------------------|
| next-web | Jest / Vitest | `npm test` | jest.config.ts / vitest.config.ts | `*.test.ts`, `*.spec.ts` |
| python-backend | pytest | `pytest` | pyproject.toml / pytest.ini | `test_*.py`, `*_test.py` |
| python-ml | pytest | `pytest` | pyproject.toml | `test_*.py` |
| python-data | pytest + hypothesis | `pytest` | pyproject.toml | `test_*.py` |
| mobile-flutter | flutter_test | `flutter test` | pubspec.yaml | `*_test.dart` |
| mobile-rn | Jest (React Native) | `npm test` | jest.config.js | `*.test.tsx`, `*.spec.tsx` |
| electron-desktop | Vitest / Jest | `npm test` | vitest.config.ts | `*.test.ts` |
| chrome-extension | Vitest / Jest | `npm test` | vitest.config.ts | `*.test.ts` |
| cli-tool | Jest / pytest | `npm test` or `pytest` | varies | varies |
| csharp-backend | xUnit / NUnit | `dotnet test` | *.csproj | `*Tests.cs`, `*Test.cs` |
| godot-game | GUT / GdUnit4 | Godot Editor → Run Tests | addons/gut/ | `test_*.gd` |
| unity-game | Unity Test Framework | Unity Editor → Test Runner | Assembly Definition | `*Tests.cs` |
| phaser-game | Vitest | `npm test` | vitest.config.ts | `*.test.ts` |

**Detection order:**
1. Check `pubspec.yaml` → Flutter
2. Check `*.csproj` → C#
3. Check `project.godot` → Godot
4. Check `pyproject.toml` / `requirements.txt` → Python
5. Check `package.json` → Node.js (then check for Next, RN, Electron, Phaser, etc.)

---

## Behavior

### Generate Tests

When asked to test a file or feature:

1. **Detect project domain** (see Domain Adaptation table)
2. **Analyze the code**
   - Identify functions, methods, classes
   - Find edge cases and error paths
   - Detect dependencies to mock/stub
3. **Generate test cases**
   - Happy path tests
   - Error cases
   - Edge cases (null, empty, boundary values)
   - Integration tests (if needed)
4. **Write tests using domain framework**
   - Follow existing test patterns in the project
   - Use the project's test runner and assertion style
   - Mock external dependencies appropriately

---

## Output Format

### For Test Generation

````markdown
## Test Plan: [Target]

| Test Case | Type | Coverage |
|-----------|------|----------|
| Should handle valid input | Unit | Happy path |
| Should reject invalid input | Unit | Validation |
| Should handle error case | Unit | Error path |

### Generated Tests

`[test file path]`

```[language]
[Code block with tests in domain-appropriate language]
```

Run with: `[domain-appropriate run command]`
````

### For Test Execution

```
Running tests...

[Pass] test_auth.py::test_login_success (or auth.test.ts, etc.)
[Pass] test_auth.py::test_invalid_password
[Fail] test_order.py::test_calculate_discount
    Expected: 90
    Received: 100

Total: 15 tests (14 passed, 1 failed)
```

---

## Test Pattern Examples

### JavaScript/TypeScript (Jest/Vitest)

```typescript
describe('AuthService', () => {
  it('should return token for valid credentials', async () => {
    const credentials = { email: 'test@test.com', password: 'pass123' };
    const result = await authService.login(credentials);
    expect(result.token).toBeDefined();
  });
});
```

### Python (pytest)

```python
def test_login_success(auth_service, mock_db):
    result = auth_service.login("test@test.com", "pass123")
    assert result.token is not None
    mock_db.get_user.assert_called_once()

@pytest.mark.parametrize("email,expected", [
    ("valid@test.com", True),
    ("invalid", False),
    ("", False),
])
def test_email_validation(email, expected):
    assert validate_email(email) == expected
```

### Flutter (flutter_test)

```dart
testWidgets('LoginPage shows error on invalid credentials', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: LoginPage()));
  await tester.enterText(find.byKey(Key('email')), 'invalid');
  await tester.tap(find.byKey(Key('submit')));
  await tester.pumpAndSettle();
  expect(find.text('Invalid email'), findsOneWidget);
});
```

### C# (xUnit)

```csharp
[Fact]
public async Task Login_ValidCredentials_ReturnsToken()
{
    var service = new AuthService(_mockDb.Object);
    var result = await service.LoginAsync("test@test.com", "pass123");
    Assert.NotNull(result.Token);
}

[Theory]
[InlineData("valid@test.com", true)]
[InlineData("invalid", false)]
public void ValidateEmail_ReturnsExpected(string email, bool expected)
{
    Assert.Equal(expected, EmailValidator.IsValid(email));
}
```

### GDScript (GUT)

```gdscript
func test_player_takes_damage():
    var player = Player.new()
    player.health = 100
    player.take_damage(30)
    assert_eq(player.health, 70, "Player health should decrease by damage amount")

func test_player_dies_at_zero_health():
    var player = Player.new()
    player.health = 10
    player.take_damage(20)
    assert_true(player.is_dead, "Player should be dead when health <= 0")
```

---

## Key Principles

- **Test behavior not implementation**
- **One assertion per test** (when practical)
- **Descriptive test names** (in domain convention)
- **Arrange-Act-Assert pattern** (AAA / Given-When-Then)
- **Mock external dependencies** (DB, API, filesystem)
- **Use domain-appropriate tools** — never force npm on a Python project
