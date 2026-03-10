---
name: unity-developer
description: Unity C# patterns — MonoBehaviour lifecycle, ScriptableObject architecture, Input System, physics, coroutines vs async, object pooling, editor scripting, performance. Use when building Unity games.
version: 1.0.0
domain: unity-game
triggers: unity, monobehaviour, scriptableobject, input system, rigidbody
---

# Unity Developer Patterns

> Production-ready Unity C# patterns. Component-based, performance-aware.

---

## 1. MonoBehaviour Lifecycle

```
Initialization:
  Awake()           → Called once when object is created (before Start)
  OnEnable()        → Called when object becomes active
  Start()           → Called once before first Update (after Awake)

Game Loop:
  FixedUpdate()     → Physics (fixed timestep, default 0.02s)
  Update()          → Game logic (every frame, variable timestep)
  LateUpdate()      → Camera follow, post-processing (after all Updates)

Cleanup:
  OnDisable()       → When object becomes inactive
  OnDestroy()       → When object is destroyed
```

### Rules

| Use             | For                                                |
| --------------- | -------------------------------------------------- |
| `Awake()`       | Self-initialization, GetComponent caching          |
| `Start()`       | Cross-object references (other objects' Awake ran) |
| `FixedUpdate()` | Physics: Rigidbody forces, raycasts                |
| `Update()`      | Input polling, game logic, animations              |
| `LateUpdate()`  | Camera tracking, UI updates after movement         |

```csharp
public class PlayerController : MonoBehaviour
{
    private Rigidbody _rb;
    private PlayerInput _input;

    void Awake()
    {
        // Cache components in Awake — runs before Start
        _rb = GetComponent<Rigidbody>();
        _input = GetComponent<PlayerInput>();
    }

    void FixedUpdate()
    {
        // Physics in FixedUpdate
        _rb.AddForce(moveDirection * speed);
    }

    void LateUpdate()
    {
        // Camera follows after all movement is done
        UpdateCameraPosition();
    }
}
```

---

## 2. ScriptableObject Architecture

### Data Container

```csharp
[CreateAssetMenu(fileName = "WeaponData", menuName = "Game/Weapon Data")]
public class WeaponData : ScriptableObject
{
    public string weaponName;
    public float damage;
    public float fireRate;
    public GameObject projectilePrefab;
}
```

### Event Channel Pattern

```csharp
[CreateAssetMenu(menuName = "Events/Void Event")]
public class VoidEventChannel : ScriptableObject
{
    private readonly HashSet<Action> _listeners = new();

    public void Register(Action listener) => _listeners.Add(listener);
    public void Unregister(Action listener) => _listeners.Remove(listener);

    public void Raise()
    {
        foreach (var listener in _listeners)
            listener?.Invoke();
    }
}
```

```csharp
// Usage — decoupled communication
public class Player : MonoBehaviour
{
    [SerializeField] private VoidEventChannel onPlayerDeath;

    void Die() => onPlayerDeath.Raise();
}

public class GameUI : MonoBehaviour
{
    [SerializeField] private VoidEventChannel onPlayerDeath;

    void OnEnable() => onPlayerDeath.Register(ShowGameOver);
    void OnDisable() => onPlayerDeath.Unregister(ShowGameOver);
    void ShowGameOver() => gameOverPanel.SetActive(true);
}
```

---

## 3. Input System (New)

```csharp
using UnityEngine.InputSystem;

public class PlayerMovement : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    private Vector2 _moveInput;

    // Called by PlayerInput component (Send Messages / Invoke Events)
    public void OnMove(InputAction.CallbackContext ctx)
    {
        _moveInput = ctx.ReadValue<Vector2>();
    }

    void Update()
    {
        transform.Translate(new Vector3(_moveInput.x, 0, _moveInput.y) * moveSpeed * Time.deltaTime);
    }
}
```

---

## 4. Physics: Rigidbody vs CharacterController

| Feature                  | Rigidbody                             | CharacterController                  |
| ------------------------ | ------------------------------------- | ------------------------------------ |
| **Physics interactions** | ✅ Full (gravity, collisions, forces) | ❌ Manual only                       |
| **Slopes/Steps**         | Manual setup                          | ✅ Built-in (slopeLimit, stepOffset) |
| **Best for**             | Physics-driven objects, vehicles      | Humanoid characters, FPS             |
| **Movement**             | `AddForce / MovePosition`             | `Move / SimpleMove`                  |

---

## 5. Coroutine vs async/await

| Feature               | Coroutine                | async/await           |
| --------------------- | ------------------------ | --------------------- |
| Unity lifecycle aware | ✅ Stops on destroy      | ❌ Runs after destroy |
| Frame-based delays    | ✅ `yield return null`   | ❌ Needs wrapper      |
| Cancelable            | Stop via `StopCoroutine` | `CancellationToken`   |
| Best for              | Animations, sequences    | I/O, HTTP, file ops   |

```csharp
// Coroutine — animation sequence
IEnumerator FlashDamage()
{
    _renderer.material.color = Color.red;
    yield return new WaitForSeconds(0.1f);
    _renderer.material.color = _originalColor;
}

// async/await — web request
async Task<string> FetchLeaderboard(CancellationToken ct)
{
    using var request = UnityWebRequest.Get(url);
    await request.SendWebRequest().WithCancellation(ct);
    return request.downloadHandler.text;
}
```

---

## 6. Object Pooling

```csharp
public class BulletPool : MonoBehaviour
{
    [SerializeField] private GameObject bulletPrefab;
    [SerializeField] private int poolSize = 20;
    private Queue<GameObject> _pool;

    void Awake()
    {
        _pool = new Queue<GameObject>();
        for (int i = 0; i < poolSize; i++)
        {
            var bullet = Instantiate(bulletPrefab, transform);
            bullet.SetActive(false);
            _pool.Enqueue(bullet);
        }
    }

    public GameObject Get(Vector3 position, Quaternion rotation)
    {
        var bullet = _pool.Count > 0 ? _pool.Dequeue() : Instantiate(bulletPrefab, transform);
        bullet.transform.SetPositionAndRotation(position, rotation);
        bullet.SetActive(true);
        return bullet;
    }

    public void Return(GameObject bullet)
    {
        bullet.SetActive(false);
        _pool.Enqueue(bullet);
    }
}
```

---

## 7. Editor Scripting

```csharp
#if UNITY_EDITOR
using UnityEditor;

[CustomEditor(typeof(EnemySpawner))]
public class EnemySpawnerEditor : Editor
{
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();
        var spawner = (EnemySpawner)target;
        if (GUILayout.Button("Spawn Test Wave"))
            spawner.SpawnWave();
    }
}

// Menu item
public static class ToolsMenu
{
    [MenuItem("Tools/Clear Save Data")]
    static void ClearSaveData()
    {
        PlayerPrefs.DeleteAll();
        Debug.Log("Save data cleared");
    }
}
#endif
```

---

## 8. Performance

### Update() Optimization

```csharp
// ❌ Expensive in Update
void Update()
{
    var enemy = GameObject.FindWithTag("Enemy");    // Find every frame!
    var dist = Vector3.Distance(transform.position, enemy.transform.position);
}

// ✅ Cache + interval
private Transform _enemy;
private float _checkInterval = 0.5f;
private float _nextCheck;

void Start() => _enemy = GameObject.FindWithTag("Enemy").transform;

void Update()
{
    if (Time.time < _nextCheck) return;
    _nextCheck = Time.time + _checkInterval;
    var sqrDist = (transform.position - _enemy.position).sqrMagnitude; // No sqrt
}
```

### Key Rules

| ❌ Avoid                 | ✅ Instead                              |
| ------------------------ | --------------------------------------- |
| `Find*` in Update        | Cache in Awake/Start                    |
| `Vector3.Distance`       | `sqrMagnitude` (no sqrt)                |
| `Instantiate/Destroy`    | Object pooling                          |
| LINQ in hot path         | Manual loops                            |
| `GetComponent` per frame | Cache reference                         |
| String concat in UI      | `StringBuilder` / `TextMeshPro.SetText` |

---

## Quick Reference

| Task       | Pattern                              |
| ---------- | ------------------------------------ |
| Init       | `Awake` (self) → `Start` (cross-ref) |
| Physics    | `FixedUpdate` + `Rigidbody`          |
| Data       | `ScriptableObject` assets            |
| Events     | SO Event Channel (decoupled)         |
| Input      | New Input System + `PlayerInput`     |
| Pooling    | Queue-based pool                     |
| UI updates | `LateUpdate`                         |
