# Error Handling

## Principle

Expected operational failures become stable, safe client responses; unexpected failures become generic `500` responses plus rich server-side logs. Never leak stack traces, Mongo connection details, or unvalidated destination values.

| Situation | Server behavior | Client behavior |
| --- | --- | --- |
| Missing/malformed URL | `400 VALIDATION_ERROR` with field detail | Show inline error; retain draft. |
| Unsupported scheme | `400 VALIDATION_ERROR` | Explain only http/https is accepted. |
| Duplicate generated code | Retry generation a bounded number of times | Invisible on successful retry; generic failure if exhausted. |
| Unknown short code | `404 NOT_FOUND`; no counter update | Redirect visitor sees not-found page/message. |
| Rate limit | `429 RATE_LIMITED`, optional `Retry-After` | Tell user to retry later; do not auto-loop. |
| DB unavailable/timeout | Log cause; `503` if recognized transient, otherwise `500` | Preserve UI data/draft; offer retry. |
| API network failure | Browser has no response | Show connection failure; retry is user-controlled. |
| Unexpected exception | Log with request ID; `500 INTERNAL_ERROR` | Generic message with request ID when available. |

## Boundaries and fallback

Set explicit server/database timeouts and abort outbound work where applicable. A failed redirect must not emit a `Location` header or claim success. A list failure must not replace previously displayed data with an empty state. Frontend error parsing must tolerate malformed/non-JSON proxy error bodies and still provide a safe fallback message.

## Error contract

All API error paths use the common envelope documented in the API specification. The server maps Mongoose cast/validation errors, duplicate-key errors, and generic errors centrally; controllers do not each invent shapes. Log fields include request ID, route, status, duration, error class, and sanitized message.
