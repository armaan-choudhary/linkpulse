# Testing Strategy

## Test layers

| Layer | Scope | Suggested tools |
| --- | --- | --- |
| Unit | URL validator, code generator, DTO formatter, service branching | Vitest/Jest |
| API integration | Express routes, middleware, status/header/body contracts | Supertest + isolated MongoDB/Testcontainers or mongodb-memory-server |
| Frontend component | Form behavior, states, list rendering, accessibility | Vitest + React Testing Library |
| End-to-end smoke | Browser create → copy → visit redirect → count appears | Playwright |

Do not unit-test Express or Mongoose internals. Test our contracts: validation decisions, atomic service operation selection, response mapping, and UI behavior users can observe.

## API matrix

| Scenario | Expected result |
| --- | --- |
| Valid https URL | `201`, code, zero clicks, canonical short URL. |
| Valid http URL | `201`. |
| Missing/non-string/relative URL | `400`; no document. |
| `javascript:`, `data:`, `file:` URL | `400`; no document. |
| whitespace around valid URL | accepted after normalization. |
| known code | `302`, exact Location, count +1. |
| repeated/concurrent redirects | count equals successful requests. |
| missing/malformed code | `404`, count unchanged. |
| list with none/many | `200`, empty/non-empty newest-first array. |
| generated collision | retry and ultimately unique result. |
| database error | safe `5xx`, request ID, no stack. |

## Mocking and isolation

Use real ephemeral MongoDB for route integration tests so indexes and `$inc` behavior are proven. Mock only nondeterministic edges—time, random code generation, fetch/clipboard, and logging sinks. Seed each test independently; never depend on execution order. Browser E2E runs against a disposable environment or explicitly tagged data.

## Quality gates

Target 80% line/branch coverage overall and 100% coverage of redirect, validation, error-mapping, and code-collision branches. Coverage is a signal, not acceptance: require all matrix scenarios, lint, type/static checks if adopted, and a production-like smoke test in CI.
