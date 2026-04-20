---
name: error-handling-patterns
description: Cross-language error handling — error type design, retry with backoff, circuit breaker, graceful degradation, error boundaries, rollback strategies, structured error responses, logging vs rethrowing, timeout strategies. Applies to Node.js, Python, Go, Rust, frontend, backend. Use when designing error types, building a retry/fallback strategy, writing an error boundary, choosing HTTP error response shape, or debugging "why did this silently fail". Keywords: error, exception, retry, backoff, circuit breaker, fallback, graceful degradation, error boundary, rollback, timeout.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Error Handling Patterns

> Errors are not failures — they are information. The question is whether your system knows what to do with them.

## When to Use vs. Related Skills

| You want to… | Use |
|---|---|
| General error strategy | **error-handling-patterns** (this) |
| Async-specific errors | `async-javascript-patterns` + this |
| Debug why something failed | `systematic-debugging` |
| Logging / metrics / traces | `observability-patterns` + this |
| API error response shape | `api-patterns` + this |

---

## 1. Error Type Hierarchy

Design a typed hierarchy. Never use bare `Error`.

```ts
// TypeScript
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly cause?: unknown,
    public readonly meta?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super("NOT_FOUND", `${resource} ${id} not found`);
  }
}

export class ValidationError extends AppError {
  constructor(field: string, reason: string) {
    super("VALIDATION", `${field}: ${reason}`);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, cause?: unknown) {
    super("EXTERNAL_SERVICE", `${service} unavailable`, cause);
  }
}
```

Same pattern in Python:

```python
class AppError(Exception):
    code: str = "APP_ERROR"
    def __init__(self, message: str, *, cause: Exception | None = None, **meta):
        super().__init__(message)
        self.cause = cause
        self.meta = meta

class NotFoundError(AppError):
    code = "NOT_FOUND"

class ValidationError(AppError):
    code = "VALIDATION"
```

---

## 2. Error Classification — 4 Categories

| Category | Examples | Action |
|---|---|---|
| **Programmer error** | undefined is not a function, type mismatch | Crash, page the dev |
| **User error** | Invalid input, missing auth | Return 4xx, clear message |
| **Expected operational** | Timeout, rate-limited, 503 from dep | Retry with backoff |
| **Unexpected operational** | DB connection lost, disk full | Alert, degrade gracefully |

Don't handle categories the same way. Crashing on programmer errors is CORRECT.

---

## 3. Retry with Exponential Backoff + Jitter

```ts
export async function retry<T>(
  fn: () => Promise<T>,
  {
    maxAttempts = 3,
    baseMs = 200,
    maxMs = 5000,
    shouldRetry = (e: unknown) => isTransient(e),
  } = {},
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (!shouldRetry(e) || attempt === maxAttempts) break;
      const ms = Math.min(baseMs * 2 ** (attempt - 1), maxMs);
      const jittered = ms * (0.5 + Math.random() * 0.5);
      await new Promise((r) => setTimeout(r, jittered));
    }
  }
  throw lastErr;
}

function isTransient(e: unknown): boolean {
  if (e instanceof ExternalServiceError) return true;
  if (e instanceof Error && "code" in e) {
    return ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED"].includes(e.code as string);
  }
  return false;
}
```

**Key rules:**
- Always add jitter — prevents synchronized retry storms
- Never retry user errors (wastes cycles, confuses user)
- Cap max attempts AND max total time

---

## 4. Circuit Breaker

Stop hammering a dead service. Three states: CLOSED (normal) → OPEN (rejecting) → HALF_OPEN (testing recovery).

```ts
export class CircuitBreaker {
  private failures = 0;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private openedAt = 0;

  constructor(
    private readonly threshold = 5,
    private readonly resetMs = 30_000,
  ) {}

  async exec<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.openedAt > this.resetMs) {
        this.state = "HALF_OPEN";
      } else {
        throw new ExternalServiceError("circuit open");
      }
    }
    try {
      const result = await fn();
      if (this.state === "HALF_OPEN") {
        this.state = "CLOSED";
        this.failures = 0;
      }
      return result;
    } catch (e) {
      this.failures++;
      if (this.failures >= this.threshold) {
        this.state = "OPEN";
        this.openedAt = Date.now();
      }
      throw e;
    }
  }
}
```

**Libraries:** `opossum` (Node), `pybreaker` (Python).

---

## 5. Graceful Degradation

When a non-critical dep fails, don't 500 the whole response. Return partial with a flag.

```ts
async function getPageData(userId: string) {
  const [profile, recommendations] = await Promise.allSettled([
    getProfile(userId),       // critical
    getRecommendations(userId), // nice-to-have
  ]);

  if (profile.status === "rejected") throw profile.reason;

  return {
    profile: profile.value,
    recommendations: recommendations.status === "fulfilled"
      ? recommendations.value
      : [],
    recommendationsAvailable: recommendations.status === "fulfilled",
  };
}
```

---

## 6. Frontend Error Boundaries (React)

```tsx
class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error({ error, info }, "boundary caught");
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// Wrap critical sections, not the whole app
<ErrorBoundary fallback={<InlineError />}>
  <Analytics />
</ErrorBoundary>
```

---

## 7. Structured HTTP Error Responses

```json
{
  "code": "VALIDATION",
  "message": "email: must be a valid email",
  "details": {
    "field": "email",
    "value": "not-an-email"
  },
  "requestId": "req_abc123"
}
```

**Rules:**
- Always include `code` (machine-readable) and `message` (human-readable)
- Include `requestId` for support traceability
- Never leak stack traces in production responses
- Use problem+json (RFC 7807) for public APIs

---

## 8. Timeout Strategies

Every I/O call needs a timeout. No exceptions.

```ts
// Always cap HTTP calls
const res = await fetch(url, {
  signal: AbortSignal.timeout(5000),
});

// DB pool timeout
const pool = new Pool({ connectionTimeoutMillis: 3000, idleTimeoutMillis: 10000 });

// Per-request server timeout (prevent hung workers)
app.use(timeout("30s"));
```

**Budget rule:** user request budget = sum of downstream timeouts + processing time.

---

## 9. Logging vs. Rethrowing

Two mistakes to avoid:

### Mistake 1: Log-and-swallow
```ts
// ❌ caller thinks it worked
try { await save(); } catch (e) { logger.error({ e }); }
```

### Mistake 2: Log at every level
```ts
// ❌ same error logged 5 times
try { ... } catch (e) { logger.error({ e }); throw e; }
```

### Right: log once at the boundary (HTTP handler, job runner)
```ts
// At the outermost handler
app.use((err, req, res, next) => {
  logger.error({ err, requestId: req.id }, "request failed");
  res.status(500).json({ code: "INTERNAL", requestId: req.id });
});

// Inside business logic: just throw
async function save(data) {
  const result = await db.save(data);
  if (!result) throw new AppError("SAVE_FAILED", "could not save");
  return result;
}
```

---

## 10. Rollback / Compensating Actions

For multi-step operations:

```ts
async function createUserWithStripe(data: UserData) {
  const customer = await stripe.customers.create({ email: data.email });
  try {
    return await db.user.create({ data: { ...data, stripeId: customer.id } });
  } catch (e) {
    // Compensating action — undo the Stripe customer
    await stripe.customers.del(customer.id).catch(() => {}); // best-effort
    throw e;
  }
}
```

For DB multi-step: use transactions. For distributed: saga pattern.

---

## Anti-Patterns

| Anti-pattern | Why bad | Fix |
|---|---|---|
| Empty `catch` block | Silent failure | Handle OR propagate with context |
| Catching `Error` catch-all at top of function | Hides programmer errors | Catch specific subclasses |
| Error message = "Something went wrong" | Unactionable | Include what/where/why |
| Retry on 4xx | Waste; never succeeds | Only retry 5xx and timeouts |
| No timeout on HTTP call | Hangs forever | Always pass AbortSignal/timeout |
| Throwing strings (`throw "bad"`) | No stack, no type | Always throw Error subclasses |
| Error response leaks stack trace | Security risk | Strip in prod; use requestId |
| Rethrow loses `cause` | Debugging harder | `new Error("...", { cause: e })` |

## Pre-Ship Checklist

- [ ] Typed error hierarchy exists
- [ ] Every I/O has timeout
- [ ] Retries only on transient errors, with jitter
- [ ] Circuit breaker around unreliable deps
- [ ] Graceful degradation for non-critical deps
- [ ] Error responses follow problem+json or documented shape
- [ ] Error logged once (at the boundary), not at every level
- [ ] Multi-step operations have rollback/compensation
- [ ] Stack traces not exposed in production responses

## Related Skills

- `async-javascript-patterns` — async-specific error propagation
- `observability-patterns` — error rate metrics, structured logs
- `systematic-debugging` — when errors don't match symptoms
- `testing-patterns` — testing the error paths
- `api-patterns` — HTTP error response design
