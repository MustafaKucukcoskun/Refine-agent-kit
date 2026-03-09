---
description: Security-focused code review. OWASP Top 10, credentials, auth, input validation, dependency CVEs.
---

# /security-review - Security Code Review

$ARGUMENTS

---

## Purpose

Perform a security-focused review covering OWASP Top 10, credentials, authentication, authorization, and dependency vulnerabilities.

---

## Behavior

When `/security-review` is triggered:

1. **Scan for credentials**
   - [ ] Hardcoded API keys, passwords, tokens
   - [ ] `.env` files committed to git
   - [ ] Secrets in logs or error messages

2. **Input validation**
   - [ ] User input sanitized before use
   - [ ] SQL queries parameterized (no string concat)
   - [ ] HTML output escaped (XSS prevention)
   - [ ] File upload validation (type, size, path)

3. **OWASP Top 10 check**
   - [ ] A01: Broken Access Control (IDOR, missing auth checks)
   - [ ] A02: Security Misconfiguration (debug mode, default creds)
   - [ ] A03: Supply Chain (outdated deps, no lock file)
   - [ ] A05: Injection (SQL, command, XSS)
   - [ ] A07: Auth Failures (weak tokens, no expiry)

4. **Authentication & Authorization**
   - [ ] Token expiry configured
   - [ ] Scope/role checks on every endpoint
   - [ ] Session management secure

5. **Dependencies**
   - [ ] Lock file present and committed
   - [ ] Known CVEs in dependencies
   - [ ] Unnecessary dependencies

6. **Sensitive data handling**
   - [ ] PII not logged
   - [ ] HTTPS enforced
   - [ ] Sensitive headers not exposed in CORS

---

## Output Format

```markdown
## 🔒 Security Review: [Scope]

### Findings

| #   | Severity    | Category    | File:Line       | Description           | Fix                     |
| --- | ----------- | ----------- | --------------- | --------------------- | ----------------------- |
| 1   | 🔴 Critical | Credentials | config.ts:15    | API key hardcoded     | Move to env             |
| 2   | 🟠 High     | Injection   | api/users.ts:42 | SQL concat            | Use parameterized query |
| 3   | 🟡 Medium   | Auth        | middleware.ts:8 | No token expiry check | Add exp validation      |
| 4   | 🟢 Low      | Headers     | server.ts:3     | Missing CSP header    | Add helmet()            |

### Summary

- Critical: X | High: X | Medium: X | Low: X
- Overall risk: [HIGH / MEDIUM / LOW]

### Recommendations

1. [Priority fix 1]
2. [Priority fix 2]
```

---

## Examples

```
/security-review src/api/
/security-review authentication flow
/security-review entire project
```

---

## Key Principles

- **Assume breach** — think like an attacker
- **Evidence-based** — show the vulnerable code
- **Prioritize** — critical first, informational last
- **Fix suggestions** — don't just report, suggest solutions
