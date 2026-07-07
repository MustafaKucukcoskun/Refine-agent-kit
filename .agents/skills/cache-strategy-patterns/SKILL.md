---
name: cache-strategy-patterns
description: Cache strategy patterns — read-through, write-through, write-behind, cache-aside, TTL, stale-while-revalidate, cache invalidation, key design, Redis/Memcached patterns, HTTP caching, CDN edge caching, browser cache, stampede prevention. Use when designing cache layer, debugging stale data, planning CDN strategy, picking Redis eviction policy, or preventing cache stampede. Keywords: cache, caching, Redis, Memcached, CDN, HTTP cache, stale, invalidation, TTL, stampede, thundering herd, cache-aside.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Cache Strategy Patterns

> "There are only two hard things in computer science: cache invalidation and naming things." — Phil Karlton

## When to Use vs. Related Skills

| You want to… | Use |
|---|---|
| Design cache layer | **cache-strategy-patterns** (this) |
| Next.js App Router cache | `nextjs-react-expert` + this |
| Database query optimization | `database-design` + this |
| CDN / edge caching | this (HTTP + CDN section) |
| API response caching | this + `api-patterns` |

---

## 1. Five Cache Strategies (pick one per cache layer)

### Cache-Aside (Lazy Loading) — Most common
App reads from cache; on miss, reads DB, then fills cache.

```ts
async function getUser(id: string) {
  const cached = await cache.get(`user:${id}`);
  if (cached) return JSON.parse(cached);
  const user = await db.user.findUnique({ where: { id } });
  await cache.set(`user:${id}`, JSON.stringify(user), "EX", 300);
  return user;
}
```
**Pros:** simple, resilient (cache failure = slow, not broken)
**Cons:** first request slow; stale data if DB changes without invalidation

### Read-Through — Cache library owns reads
Cache library fetches from DB on miss. App only talks to cache.

**Pros:** cleaner app code
**Cons:** couples app to cache-aware library

### Write-Through — Write to cache AND DB synchronously
```ts
async function updateUser(id: string, data: UserUpdate) {
  const user = await db.user.update({ where: { id }, data });
  await cache.set(`user:${id}`, JSON.stringify(user), "EX", 300);
  return user;
}
```
**Pros:** cache always consistent with DB
**Cons:** write latency = DB + cache

### Write-Behind (Write-Back) — Write to cache, flush to DB async
**Pros:** fast writes
**Cons:** data loss risk on cache crash; complex consistency

### Refresh-Ahead — Pre-refresh before expiry
Cache refreshes popular entries before TTL hits zero.
**Pros:** no latency spike on expiry
**Cons:** wasted work on unpopular keys

**Rule:** Default to **cache-aside** unless you have a specific reason.

---

## 2. Cache Key Design

Bad keys cause bugs more than bad values. Rules:

| Rule | Example |
|---|---|
| Include version prefix | `v2:user:123` (flush old version by changing prefix) |
| Include all query params | `search:q=foo&sort=desc&page=1` |
| Use colons as delimiter (Redis convention) | `tenant:42:user:123:profile` |
| Include user ID for user-specific data | `user:123:cart` not `cart` |
| Never include secrets | NOT `user:123:apikey:abc` |
| Normalize casing/whitespace | lowercase query strings |

```ts
function cacheKey(parts: Record<string, string | number>): string {
  return "v1:" + Object.entries(parts).sort().map(([k, v]) => `${k}=${v}`).join(":");
}
```

---

## 3. TTL Selection

| Data type | Suggested TTL |
|---|---|
| User session | 1–24 hours (match session length) |
| User profile | 5 min – 1 hour |
| Public static list (countries, tags) | 1 day+ |
| Search results | 30 sec – 5 min |
| Rate limit counter | Window duration |
| Page render (SSG) | Infinite + invalidate on mutation |

**Never use `EX 0` or no TTL.** Always set a ceiling — otherwise one bug fills memory forever.

---

## 4. Invalidation Strategies

| Strategy | When |
|---|---|
| **TTL-only** | Data can be stale briefly |
| **Event-driven** | On mutation, delete/update key |
| **Version prefix bump** | Global flush (deploy time) |
| **Tag-based** | Related entries (`tag:article:42`) — needs support |
| **Stale-while-revalidate** | Serve stale, refresh in background |

```ts
// Event-driven on update
async function updateUser(id: string, data: UserUpdate) {
  const user = await db.user.update({ where: { id }, data });
  await cache.del(`user:${id}`);   // or set fresh
  return user;
}

// Stale-while-revalidate
async function getWithSWR(key: string, fetcher: () => Promise<any>, ttl = 60) {
  const entry = await cache.get(key);
  if (entry) {
    const { value, exp } = JSON.parse(entry);
    if (Date.now() < exp) return value;
    // Stale — return but refresh in background
    fetcher().then((fresh) => cache.set(key, JSON.stringify({ value: fresh, exp: Date.now() + ttl * 1000 })));
    return value;
  }
  const fresh = await fetcher();
  await cache.set(key, JSON.stringify({ value: fresh, exp: Date.now() + ttl * 1000 }));
  return fresh;
}
```

---

## 5. Cache Stampede (Thundering Herd)

Problem: hot key expires → 1000 requests all hit DB simultaneously.

### Mitigation 1: Probabilistic Early Expiration (XFetch)
```ts
// Re-compute before actual expiry, probabilistically, based on age
```

### Mitigation 2: Single-Flight Lock
```ts
const inflight = new Map<string, Promise<any>>();

async function getSingleFlight<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key);
  if (existing) return existing;
  const promise = fetcher().finally(() => inflight.delete(key));
  inflight.set(key, promise);
  return promise;
}
```

### Mitigation 3: Redis Lock
```ts
// SET key value NX EX 10  — only one worker refreshes, others wait
```

---

## 6. Eviction Policies (Redis)

| Policy | When |
|---|---|
| `allkeys-lru` | General-purpose cache (default recommendation) |
| `volatile-lru` | Mix of cache + persistent data with TTL |
| `allkeys-lfu` | Access patterns very skewed |
| `noeviction` | Cache MUST never drop (will OOM) — rarely right |

Set via `maxmemory-policy` in redis.conf.

---

## 7. HTTP Caching

```http
# Static assets (hashed filenames)
Cache-Control: public, max-age=31536000, immutable

# API responses that are public and can be stale briefly
Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=3600

# User-specific
Cache-Control: private, max-age=0, must-revalidate

# Never cache
Cache-Control: no-store
```

## 8. Next.js App Router Cache Notes

| Cache | Scope | Invalidate |
|---|---|---|
| `fetch()` Data Cache | Per-request | `revalidate`, `revalidateTag`, `revalidatePath` |
| Full Route Cache | Per-route | Deploy, `revalidatePath` |
| Router Cache | Per-session client | Soft navigation, TTL |

```ts
// Revalidate by tag
const data = await fetch(url, { next: { tags: ["posts"] } });
// Later, after mutation:
revalidateTag("posts");
```

See `nextjs-react-expert/3-server-server-side-performance.md` for deep detail.

---

## Anti-Patterns

| Anti-pattern | Why bad | Fix |
|---|---|---|
| Caching user-specific data without user-ID in key | Data leak across users | Include user/tenant ID in key |
| No TTL on any entry | Memory leak over time | Always set TTL, even long ones |
| Cache invalidation via "delete all keys" | Downtime spike | Prefer targeted delete or version bump |
| Caching the error response | All users see error until TTL | Check status before caching |
| Reading cache twice per request | Round-trip waste | Cache result in local var per request |
| Ignoring cache miss metrics | Can't tell if cache helps | Track hit/miss ratio |

## Pre-Ship Checklist

- [ ] Every key has a TTL
- [ ] Invalidation strategy documented
- [ ] Stampede mitigation for hot keys
- [ ] Hit/miss metrics exposed
- [ ] Eviction policy set explicitly
- [ ] No secrets in keys or values
- [ ] User-specific data keyed by user ID
- [ ] Graceful fallback if cache is down

## Related Skills

- `nextjs-react-expert` — Next.js-specific cache layers
- `database-design` — when to cache vs. fix query
- `api-patterns` — HTTP caching headers
- `observability-patterns` — cache metrics
- `performance-profiling` — measure actual impact
