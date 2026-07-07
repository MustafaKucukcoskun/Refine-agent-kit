---
name: observability-patterns
description: Observability patterns — structured logging, metrics (RED/USE), distributed tracing (OpenTelemetry), error tracking (Sentry), SLOs, golden signals, log levels, correlation IDs, trace/span context propagation, sampling strategies. Use when adding logging to new code, wiring metrics, setting up traces, defining SLOs, debugging a "we don't know what's happening in prod" moment, or picking between logs vs metrics vs traces. Keywords: logging, metrics, tracing, OpenTelemetry, Sentry, SLO, SLI, Prometheus, Grafana, structured logs, correlation ID, distributed tracing, observability, monitoring.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Observability Patterns

> Three pillars: logs (what happened), metrics (how much), traces (where time went). You need all three.

## When to Use vs. Related Skills

| You want to… | Use |
|---|---|
| Add logging / metrics / traces | **observability-patterns** (this) |
| Error handling itself | `error-handling-patterns` + this |
| Performance profiling locally | `performance-profiling` |
| Debug why something failed | `systematic-debugging` + this |
| Cache hit/miss metrics | `cache-strategy-patterns` + this |

---

## 1. The Three Pillars — Pick the Right One

| Need | Use | Example |
|---|---|---|
| "What exactly happened on request X?" | **Log** | `user_id=123 action=login outcome=success` |
| "How often / how fast overall?" | **Metric** | `http_requests_total`, `p99_latency_ms` |
| "Where did time go in request X?" | **Trace** | spans: auth→db-query→render, with durations |

**Rule:** Don't try to reconstruct metrics from logs. Don't use traces as logs. Each pillar has a job.

---

## 2. Structured Logging (always JSON in prod)

### Good log entry
```json
{
  "timestamp": "2026-04-20T14:30:15.123Z",
  "level": "error",
  "msg": "payment failed",
  "request_id": "req_abc123",
  "user_id": "user_42",
  "amount_cents": 9900,
  "provider": "stripe",
  "error_code": "card_declined"
}
```

### Bad log entry
```
[2026-04-20 14:30:15] ERROR: user 42 tried to pay but it failed lol
```

### Node.js — pino
```ts
import pino from "pino";
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: { service: "api", version: process.env.APP_VERSION },
});

// Usage
logger.info({ userId, action: "login" }, "user logged in");
logger.error({ err, requestId }, "payment failed");
```

### Python — structlog
```python
import structlog
logger = structlog.get_logger()
logger.info("user_logged_in", user_id=user_id)
logger.error("payment_failed", err=str(err), request_id=request_id)
```

### Log Levels — use them correctly

| Level | When | Volume |
|---|---|---|
| `error` | Something broke, needs attention | Low |
| `warn` | Unexpected but handled (retried, fell back) | Medium |
| `info` | Business events (request done, job finished) | High |
| `debug` | Detail for local/staging debugging | Very high (off in prod by default) |
| `trace` | Function entry/exit | Off in prod always |

### Never Log
- Passwords, tokens, API keys
- Full credit card numbers (last 4 OK)
- PII beyond what's necessary (email often OK; SSN never)
- Raw request bodies (may contain secrets)

---

## 3. Correlation IDs — Propagate Everything

Every request gets one ID; every log and span inherits it.

```ts
// Express middleware
app.use((req, res, next) => {
  req.id = req.header("x-request-id") ?? crypto.randomUUID();
  res.setHeader("x-request-id", req.id);
  next();
});

// Pass down through logger
const log = logger.child({ request_id: req.id });
log.info({ userId }, "handling request");

// Propagate to downstream services
await fetch(downstream, {
  headers: { "x-request-id": req.id },
});
```

---

## 4. Metrics — The Four Golden Signals

Google SRE book canon. Measure these for every service:

| Signal | Definition | Metric |
|---|---|---|
| **Latency** | How long requests take | p50, p95, p99 |
| **Traffic** | How many requests | requests/second |
| **Errors** | Failure rate | errors/total |
| **Saturation** | How full the system is | CPU, memory, queue depth |

### Prometheus-style
```ts
import { Counter, Histogram } from "prom-client";

const httpRequests = new Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
});

const httpLatency = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request latency",
  labelNames: ["method", "route"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

app.use((req, res, next) => {
  const end = httpLatency.startTimer({ method: req.method, route: req.route?.path });
  res.on("finish", () => {
    httpRequests.inc({ method: req.method, route: req.route?.path, status: res.statusCode });
    end();
  });
  next();
});
```

### RED vs USE
- **RED** (services): Rate, Errors, Duration
- **USE** (resources): Utilization, Saturation, Errors

Services track RED. Infrastructure tracks USE.

---

## 5. Distributed Tracing (OpenTelemetry)

```ts
import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("api");

async function processPayment(userId: string, amount: number) {
  return tracer.startActiveSpan("processPayment", async (span) => {
    span.setAttributes({ "user.id": userId, "amount.cents": amount });
    try {
      const result = await chargeCard(userId, amount);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: (err as Error).message });
      throw err;
    } finally {
      span.end();
    }
  });
}
```

**Key attributes to set:**
- `http.method`, `http.route`, `http.status_code`
- `db.system`, `db.statement` (redacted!)
- `user.id`, `tenant.id`
- `error` = true, `error.type` on failure

### Sampling Strategies
| Strategy | When |
|---|---|
| 100% sample | Low traffic services |
| 1–10% head sampling | High traffic, general observability |
| Tail sampling (keep errors + slow) | Best signal-to-cost ratio |
| Per-route sampling | Keep important routes 100%, bulk at 1% |

---

## 6. Error Tracking (Sentry / equivalent)

Logs + metrics don't give you aggregated error dashboards. Sentry does.

```ts
import * as Sentry from "@sentry/node";
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Scrub PII
    if (event.request?.data) delete event.request.data.password;
    return event;
  },
});

try {
  await risky();
} catch (err) {
  Sentry.captureException(err, {
    tags: { module: "payment" },
    user: { id: userId },
  });
  throw err;
}
```

---

## 7. SLIs, SLOs, SLAs

| Term | Meaning |
|---|---|
| **SLI** (Indicator) | Metric that matters — e.g., "% of requests faster than 500ms" |
| **SLO** (Objective) | Internal target — e.g., "99% of requests < 500ms over 30 days" |
| **SLA** (Agreement) | Contractual commitment to customer — usually laxer than SLO |

### Error Budget
If SLO = 99.9%, error budget = 0.1% = ~43 min/month downtime. Use it for deployments; if spent, freeze risky releases.

### Picking SLIs
- Request latency (p95, p99)
- Error rate (5xx / total)
- Availability (successful synthetic checks)
- Freshness (for async systems)

---

## 8. Alerting

**Alert on symptoms (user-facing), not causes (internal).**

✅ Good alert:
> p99 latency on /api/checkout > 2s for 5 minutes

❌ Bad alert:
> Redis memory > 80%
(Symptom-free if app has graceful degradation.)

### Alert Quality Checklist
- [ ] Actionable (not "CPU high", yes "checkout broken")
- [ ] Paged only if urgent (2am worthy)
- [ ] Has a runbook link
- [ ] Not flapping (hysteresis on thresholds)
- [ ] Severity correct (ERROR vs WARN)

---

## Anti-Patterns

| Anti-pattern | Why bad | Fix |
|---|---|---|
| `console.log` in prod | Unstructured, unsearchable | Use structured logger |
| `logger.info(err.stack)` | Loses structure | `logger.error({ err }, "msg")` |
| Logging every function entry/exit | Log flood, signal loss | Use tracing for flow |
| No correlation ID | Can't link logs across services | Propagate x-request-id |
| Metric cardinality explosion (labels=user_id) | Crashes Prometheus | Low-cardinality labels only |
| Alerting on CPU > 80% | Alert fatigue | Alert on user impact |
| Sampling 100% of prod traces | Cost explosion | Head + tail sample |
| Secrets in logs | Security incident | Redact before logging |
| No log retention policy | Cost spiral | Archive cold logs, delete after N days |
| Ignoring the costs | Surprise bill | Budget observability like infra |

## Pre-Ship Checklist

- [ ] Structured logs (JSON) with correlation ID
- [ ] Log level set appropriately (info in prod)
- [ ] No secrets / PII in logs
- [ ] RED metrics for every HTTP endpoint
- [ ] OpenTelemetry traces on critical paths
- [ ] Error tracking (Sentry or equivalent) wired
- [ ] At least one SLI with an SLO target
- [ ] Alerts fire on user-facing symptoms only
- [ ] Runbook exists for every alert

## Related Skills

- `error-handling-patterns` — what to log and when
- `performance-profiling` — local perf analysis before metrics
- `systematic-debugging` — using observability data to debug
- `api-patterns` — logging request/response shape
- `deployment-procedures` — wiring observability in deploy
