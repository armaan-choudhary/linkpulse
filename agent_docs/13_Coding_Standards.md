# Coding Standards

## Naming and files

- Use `camelCase` for variables/functions, `PascalCase` for React components/classes, `UPPER_SNAKE_CASE` for immutable environment/config constants, and kebab-case route path segments.
- Name files after their primary export: `LinkTable.jsx`, `linksApi.js`, `link.service.js` (choose and document one backend suffix convention; do not mix).
- Keep folder names lowercase and purpose-based. Avoid catch-all `helpers`/`common` directories.
- Prefer descriptive domain names (`originalUrl`, `shortCode`) over abbreviations (`url2`, `code`).

## React conventions

Components are small, accessible, and primarily presentational; put request/state orchestration in hooks/API modules. Do not fetch inside arbitrary leaf components. Use controlled form input, stable keys from link `id`, semantic elements, and `aria-live` only for meaningful dynamic messages. CSS classes describe component/state, not incidental appearance.

## Express conventions

Routes declare middleware order. Controllers remain thin and call services. Services return domain records/known errors, never Express response objects. Convert Mongoose documents to explicit DTOs. Use `async`/`await` with centralized error propagation; never leave rejected promises unhandled.

## Error, logging, and documentation

Throw/return only typed application errors for expected conditions. Status codes and error codes are contract, prose is not. Add JSDoc/type annotations where a boundary or non-obvious invariant benefits; avoid comments that restate syntax. Update API/database docs whenever a public field, endpoint, or behavior changes.

## Git and review

Use Conventional Commits, e.g. `feat(api): add link creation endpoint`, `fix(redirect): increment clicks atomically`. Keep commits cohesive, no unrelated formatting churn. Pull requests state intent, contract/migration impact, tests run, deployment/config changes, and screenshots only for visual changes. Reviewers prioritize security boundaries, error paths, data invariants, accessibility, and backward compatibility.
