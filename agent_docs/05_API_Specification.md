# 05. API Specification

## Base URL
`/api/v1`

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description"
  }
}
```

---

## Endpoints

### 1. Health Check
- **Endpoint**: `GET /health` or `GET /api/v1/health`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "connected",
    "uptime": 342,
    "timestamp": "2026-08-04T16:20:00.000Z"
  }
}
```

---

### 2. Create Short Link
- **Endpoint**: `POST /api/v1/links`
- **Request Body**:
```json
{
  "url": "https://example.com/target-destination"
}
```
- **Response (New Created)**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "66b0abc123...",
    "originalUrl": "https://example.com/target-destination",
    "shortCode": "aB3k9Q",
    "shortUrl": "http://localhost:5000/aB3k9Q",
    "clickCount": 0,
    "createdAt": "2026-08-04T16:20:00.000Z",
    "isExisting": false
  },
  "message": "Short URL created successfully."
}
```
- **Response (Deduplicated Existing)**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "66b0abc123...",
    "originalUrl": "https://example.com/target-destination",
    "shortCode": "aB3k9Q",
    "shortUrl": "http://localhost:5000/aB3k9Q",
    "clickCount": 4,
    "createdAt": "2026-08-04T16:10:00.000Z",
    "isExisting": true
  },
  "message": "Existing short link retrieved."
}
```

---

### 3. List Recent Links
- **Endpoint**: `GET /api/v1/links`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "66b0abc123...",
      "originalUrl": "https://example.com/target-destination",
      "shortCode": "aB3k9Q",
      "shortUrl": "http://localhost:5000/aB3k9Q",
      "clickCount": 4,
      "createdAt": "2026-08-04T16:10:00.000Z"
    }
  ],
  "message": "Links retrieved successfully."
}
```

---

### 4. Redirect Short Link
- **Endpoint**: `GET /:shortCode`
- **Response**: `302 Found` (Redirects to original destination URL & increments `clickCount`).
