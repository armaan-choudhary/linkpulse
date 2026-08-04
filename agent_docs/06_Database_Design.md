# Database Design

## Collection: `links`

```js
{
  _id: ObjectId("..."),
  shortCode: "aB3k9Q",
  originalUrl: "https://www.example.com/products?q=bag",
  clickCount: 12,
  createdAt: ISODate("2026-08-04T10:00:00.000Z"),
  updatedAt: ISODate("2026-08-04T10:04:00.000Z")
}
```

| Field | Type | Rules and rationale |
| --- | --- | --- |
| `_id` | ObjectId | Atlas primary identifier; do not expose as a dependency to clients. |
| `shortCode` | String | Required, immutable, URL-safe, unique; public lookup key. |
| `originalUrl` | String | Required canonical destination; max 2048; private only to the degree the user treats it as such. |
| `clickCount` | Number | Required non-negative integer, default `0`; updated atomically with `$inc`. |
| timestamps | Date | Mongoose-managed audit fields; `createdAt` supports list ordering. |

## Indexes

1. **Unique ascending `{ shortCode: 1 }`** — required for correctness and fast redirects. The application retries a new generated code on duplicate-key collision; the database remains final authority.
2. **Descending `{ createdAt: -1 }`** — supports newest-first management listing. It can be deferred for tiny datasets but should exist before production load.

There are no relationships in v1. A link is self-contained; embedding avoids joins and matches the access pattern. Do not add an index on `originalUrl` until a product feature queries it, as unused indexes increase write/storage cost.

## Schema validation

Mongoose validation is defense in depth, not the primary HTTP UX. Enforce required fields, trimmed strings, code regex/length, URL length, and `clickCount >= 0`. Service validation must happen first so invalid input produces a useful `400`. Atlas schema validation may be added later to protect against non-application writers.

## Scalability and migrations

The collection grows approximately one document per creation. The redirect path is one indexed atomic update. At higher read volume, cache destinations with a clear counter strategy; at high list volume, introduce opaque cursor pagination using `(createdAt, _id)`. Treat migrations as versioned, idempotent scripts with dry-run metrics, backups, batching, and a rollback plan. Add new fields as nullable/defaulted first, deploy readers that tolerate both forms, backfill, then enforce required constraints.
