---
name: async-javascript-patterns
description: Async JavaScript/TypeScript patterns — Promise composition, async/await correctness, cancellation (AbortController), concurrency limits, error propagation, race conditions, streams. Use when writing async code in Node.js or browser, debugging "unhandled rejection", dealing with timeouts, parallelizing I/O, or migrating callback/Promise code to async/await. Keywords: async, await, Promise, AbortController, concurrency, cancel, race condition, Promise.all, Promise.race, unhandled rejection, setTimeout, stream.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Async JavaScript/TypeScript Patterns

> Correct async is harder than it looks. Every pattern here exists because the naive version burns production.

## When to Use vs. Related Skills

| You want to… | Use |
|---|---|
| Async JS/TS patterns | **async-javascript-patterns** (this) |
| Async Python (asyncio) | `async-python-patterns` |
| Rate limiting / retry | **this** + `error-handling-patterns` |
| Worker threads, streams | **this** (streams section) |
| General JS quality | `nodejs-best-practices` |

---

## 1. Promise Composition — Choose the Right Primitive

| You want… | Use | Fails if |
|---|---|---|
| All complete, fail fast | `Promise.all` | Any rejects → whole thing rejects |
| All complete, collect successes AND failures | `Promise.allSettled` | Never rejects; inspect each result |
| First success, ignore losers | `Promise.any` | All reject → `AggregateError` |
| First to settle (success OR failure) | `Promise.race` | Whichever settles first wins |

```ts
// Fan-out with partial failure tolerance
const results = await Promise.allSettled(urls.map(fetchJson));
const ok = results.filter((r): r is PromiseFulfilledResult<User> => r.status === "fulfilled");
const failed = results.filter((r) => r.status === "rejected");
log.warn({ failed: failed.length }, "some fetches failed");
return ok.map((r) => r.value);
```

## 2. Cancellation with AbortController

Long-running fetches MUST be cancellable. Browsers, React effects, and Node servers all need this.

```ts
// Request with timeout
export async function fetchWithTimeout(url: string, ms = 5000): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(new Error("timeout")), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

// React effect with cleanup
useEffect(() => {
  const ctrl = new AbortController();
  fetch("/api/data", { signal: ctrl.signal })
    .then((r) => r.json())
    .then(setData)
    .catch((e) => {
      if (e.name !== "AbortError") throw e;
    });
  return () => ctrl.abort();
}, []);
```

## 3. Concurrency Limits (avoid unbounded fan-out)

`Promise.all(items.map(slow))` with 10,000 items = 10,000 concurrent requests = death.

```ts
// Hand-rolled concurrency limiter (no dep)
export async function pLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  async function run() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await worker(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return out;
}

// Usage
const users = await pLimit(userIds, 10, fetchUser);
```

Production alternatives: `p-limit`, `p-map`, `p-queue` (npm).

## 4. Error Propagation — Top 3 Bugs

### Bug: Unhandled rejection from fire-and-forget

```ts
// ❌ no .catch → Node crashes or browser logs unhandled rejection
doBackground();

// ✅
doBackground().catch((e) => log.error({ err: e }, "background failed"));
```

### Bug: Errors lost inside `.forEach`

```ts
// ❌ forEach ignores async callbacks
items.forEach(async (x) => await save(x)); // fires in parallel, ignores errors

// ✅
for (const x of items) await save(x); // sequential
// OR
await Promise.all(items.map(save)); // parallel
```

### Bug: Rethrowing drops stack trace (pre-ES2022)

```ts
// ✅ ES2022+: preserve cause
try {
  await risky();
} catch (e) {
  throw new Error("save failed", { cause: e });
}
```

## 5. Race Condition: Stale Response

```ts
// ❌ old request response may overwrite newer state
function search(q: string) {
  fetch(`/api/search?q=${q}`).then((r) => r.json()).then(setResults);
}

// ✅ track latest, ignore stale
let latest = 0;
function search(q: string) {
  const me = ++latest;
  fetch(`/api/search?q=${q}`).then((r) => r.json()).then((d) => {
    if (me === latest) setResults(d);
  });
}
```

## 6. `async` Without `await` = Hidden Bug

```ts
// ❌ function marked async but no await — wraps return in Promise needlessly
async function getName() { return user.name; }

// ✅ if no async work, don't mark async
function getName() { return user.name; }
```

## 7. Streams Over `await response.json()` for Large Payloads

```ts
// Process large NDJSON without loading all in memory
const res = await fetch("/api/export");
const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
let buf = "";
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  buf += value;
  const lines = buf.split("\n");
  buf = lines.pop()!;
  for (const line of lines) if (line) process(JSON.parse(line));
}
```

## 8. Retry with Exponential Backoff

```ts
export async function retry<T>(
  fn: () => Promise<T>,
  { maxAttempts = 3, baseMs = 200, maxMs = 5000 } = {},
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (attempt === maxAttempts) break;
      const ms = Math.min(baseMs * 2 ** (attempt - 1), maxMs);
      await new Promise((r) => setTimeout(r, ms + Math.random() * ms));
    }
  }
  throw lastErr;
}
```

## Anti-Patterns

| Anti-pattern | Why bad | Fix |
|---|---|---|
| `new Promise((res) => { result = await x; res(result); })` | `new Promise` + async is always a bug | Just `return x` |
| `Promise.all(items.map(async (x) => { ... }))` with no limit | Unbounded concurrency | Use concurrency limiter |
| `try { ... } catch (e) { console.log(e); }` | Swallows, can't recover upstream | Log AND rethrow, or handle properly |
| `await` in `.forEach` | forEach doesn't wait | Use `for...of` or `Promise.all` |
| Not passing `signal` to fetch | Can't cancel | Always pass AbortSignal |
| Mutating shared state inside parallel tasks | Race condition | Use local state, aggregate at end |

## Pre-Commit Checklist

- [ ] Every `async` function has at least one `await` (or returns a Promise)
- [ ] Every fire-and-forget promise has `.catch`
- [ ] No unbounded `Promise.all` over user-supplied arrays
- [ ] Long-running fetches pass AbortSignal
- [ ] No shared-state mutation inside parallel tasks
- [ ] Sequential loops use `for...of`, not `.forEach` with async

## Related Skills

- `error-handling-patterns` — retry, fallback, circuit breaker
- `nodejs-best-practices` — Node-specific async
- `react-best-practices` — effect cleanup, stale closures
- `systematic-debugging` — when async misbehaves
