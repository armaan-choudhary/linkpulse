# 03. Backend Architecture Specification

## Overview

The backend is built as a RESTful Express service implementing a layered architecture with strict separation of concerns:

- **Routes (`src/routes/`)**: Map HTTP verbs & endpoints to controller actions.
- **Controllers (`src/controllers/`)**: Thin handlers parsing HTTP request parameters and invoking services. Wrapped in `asyncHandler` middleware.
- **Services (`src/services/`)**: Core business logic, URL deduplication check (`Link.findOne({ originalUrl })`), short code generation, collision handling, and data transformation.
- **Models (`src/models/`)**: Mongoose schema with `timestamps: true`, unique `shortCode` index, and `originalUrl` index.
- **Middleware (`src/middleware/`)**: Global error handling (`errorHandler`) and async Promise wrapping (`asyncHandler`).
- **Validators (`src/validators/`)**: Input validation utilizing native `URL` parsing.
- **Utils (`src/utils/`)**: `ApiError` custom error class and code generator algorithms.

---

## Centralized Error Handling

All controller routes delegate errors to `next(err)`. The global error middleware intercepts errors and formats them into a predictable JSON structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "URL scheme must be http or https"
  }
}
```

---

## Database Indexing Strategy

1. `shortCode` (`unique: true`, `index: true`): Enables `O(1)` constant-time lookup during link redirection (`GET /:shortCode`).
2. `originalUrl` (`index: true`): Enables fast deduplication lookups when creating short links (`POST /api/v1/links`).
3. `createdAt` (`sort: -1`): Default index for sorting recent link listings.
