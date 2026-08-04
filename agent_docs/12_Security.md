# Security

## Threat model and controls

URL shorteners redirect users to untrusted destinations. The product cannot make every destination safe, but it must not amplify avoidable risks or permit server-side execution.

| Risk | Control |
| --- | --- |
| Script/file URI injection | Parse URL server-side; accept only `http:` and `https:`. |
| Mongo/operator injection | Validate typed body; never pass raw request objects as queries; use Mongoose strict schemas. |
| Code enumeration/abuse | Opaque sufficiently large random codes, rate limiting, monitoring. |
| Redirect counter abuse | Per-IP rate limits; document clicks as redirect requests, not humans. |
| Header/XSS weaknesses | Helmet, safe JSON output, React escaping, CSP considered after asset needs are known. |
| Cross-origin abuse | Explicit allowlist CORS; no wildcard when production policy needs control. |
| Secret disclosure | Environment secrets, redacted logging, least-privilege Atlas user. |
| Resource exhaustion | Body-size cap, URL length cap, timeouts, connection-pool limits, request rate limits. |

## Required launch posture

Use Helmet with a reviewed configuration, disable framework fingerprinting where appropriate, enforce HTTPS via platforms, cap JSON body size, and use a production-ready rate limiter on creation and redirect paths. In multi-instance Render deployments, rate limiting needs a shared store; in-memory counters are only best-effort. Return generic errors and do not log credentials/tokens.

Validate destination URLs with the platform parser rather than regex alone. Normalization must not silently rewrite a hostname or weaken the allowed-scheme policy. Blocking private network targets is not required for ordinary browser redirects because the server does not fetch them; it becomes required if a future preview/metadata-fetch feature is introduced to prevent SSRF.

## Future authentication

If ownership/editing arrives, use a proven identity provider or carefully designed session/JWT model, authorization checks in services, passwordless/secure credential flows, audit trails, and per-user rate limits. Do not retrofit authorization solely in the UI; link ownership must be persisted and enforced at every protected API route.
