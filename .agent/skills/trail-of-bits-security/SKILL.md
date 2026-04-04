---
name: trail-of-bits-security
description: Security fundamentals inspired by Trail of Bits practices: input validation, secret hygiene, OWASP risks, and secure auth patterns.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Trail of Bits Security Principles

This skill is global and should be applied in every domain.

## 1. Input Validation

- Treat all data coming from outside the system (User, API Request, File) as "MALICIOUS" by default.
- Prefer Validation over Sanitization (e.g., `is_integer`, Pydantic strict types).
- Always perform path normalization (e.g., `os.path.abspath`) and prefix checks for file paths (`../../`) to prevent path traversal vulnerabilities.

## 2. Secrets Management

- Never hardcode secrets, tokens, or API/DB connection strings, even for testing purposes.
- Use `.env`, and always assume that prefixes considered safe like `EXPO_PUBLIC_` leak to the browser/mobile (do not put real secrets in them).
- Ensure critical keys remain outside source control (Git) (e.g., `.gitignore`).

## 3. OWASP Top 10 and Injection

- Always use Parameterized Queries or ORM for SQL data retrieval. String concatenation (`"SELECT * FROM users WHERE name = " + user_input`) is **strictly forbidden.**
- Do not render user input without HTML encoding for XSS protection.
- Ensure Security Headers like X-Frame-Options, CSP, HSTS are served from the API or Frontend server.

## 4. AuthZ (Authorization) and AuthN (Authentication)

- `Authentication` only identifies who the user is; it does not determine their permissions.
- `Authorization` must be independently checked at the beginning of every endpoint. (Checking permissions only at the root route is insufficient; pay attention to object/row-level permissions - Insecure Direct Object Reference (IDOR) risk).
- If using JWT or OAuth, do not create very long-lived Access Tokens without a Refresh Token.

## 5. Dependency and Log Security

- Regularly update third-party dependencies (consider tools like `npm audit`, `pip-audit`, snyk, or trivy in your project).
- When catching exceptions and writing to logs, never output user PII (Personal Identifiable Information), passwords, national IDs, Session IDs, or bearer token values in plaintext.
