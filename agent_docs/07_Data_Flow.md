# Data Flow

## Create short URL

```mermaid
sequenceDiagram
  participant U as User
  participant F as Form
  participant A as API
  participant DB as Atlas
  U->>F: Submit long URL
  F->>F: client required/format feedback
  F->>A: POST /api/v1/links
  A->>A: normalize and validate
  loop collision only
    A->>DB: insert generated code
  end
  DB-->>A: link
  A-->>F: 201 Link DTO
  F->>F: prepend row, clear draft, announce success
```

The client may give immediate usability feedback but the server is the security and persistence authority. A collision is retried internally and is not exposed as a user error unless retries are exhausted.

## Load homepage / fetch links

On initial render, the page enters `Loading`, requests `GET /api/v1/links`, then displays sorted data, an empty state, or a retryable error. The server applies newest-first sort. This prevents client-side ordering drift and keeps a future pagination contract natural.

## Redirect and increment

```mermaid
sequenceDiagram
  participant V as Visitor browser
  participant E as Express
  participant M as MongoDB
  V->>E: GET /aB3k9Q
  E->>E: validate path token
  E->>M: findOneAndUpdate + $inc clickCount
  alt match
    M-->>E: document
    E-->>V: 302 Location destination
    V->>V: navigate destination
  else no match
    M-->>E: null
    E-->>V: 404
  end
```

The increment occurs before the response. Thus a reported click means the service resolved the link, not that the visitor's destination fully loaded. That definition must remain explicit in product copy.
