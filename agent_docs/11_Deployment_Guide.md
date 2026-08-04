# Deployment Guide

## Environment variables

| Variable | Location | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Render secret | Atlas connection string; never client-exposed. |
| `NODE_ENV` | Render | `production` enables production policy. |
| `PORT` | Render-provided | HTTP listening port; do not hard-code. |
| `CORS_ORIGIN` | Render env | Exact Vercel production origin; optionally comma-separated approved origins. |
| `PUBLIC_BASE_URL` | Render env | Canonical API/short-link origin used to form `shortUrl`. |
| `VITE_API_BASE_URL` | Vercel env | Public API base URL, baked into frontend build. |
| `LOG_LEVEL` | Render env | Production logging threshold. |

## Atlas

Create a least-privilege application database user limited to the project database. Configure network access for Render (prefer supported private/network integration; otherwise tightly manage allowed egress according to platform capability). Enable TLS, backups, alerts, and a unique `shortCode` index. Store the URI only in Render secrets.

## Render backend

1. Connect the repository and select the backend root directory.
2. Set build/start commands according to the committed package scripts; start must bind `process.env.PORT` on `0.0.0.0`.
3. Configure the variables above and health check `/health`.
4. Deploy, inspect structured logs, then test health, `POST`, list, and redirect using the Render URL.

## Vercel frontend

1. Import the same repository, selecting the frontend root.
2. Use the Vite build output configuration and set `VITE_API_BASE_URL` for each environment.
3. Deploy and add the resulting production origin to Render `CORS_ORIGIN`.
4. Smoke test from the real Vercel origin; CORS cannot be validated with curl alone.

## Production configuration and CI

Use separate Atlas databases and variables for preview/staging/production. Rotate compromised secrets, never commit `.env`, and keep `.env.example` value-free. CI should install locked dependencies, lint, test, build frontend/backend, and optionally deploy only after protected-branch checks. Post-deploy smoke tests should create a disposable link and resolve it; avoid using a real customer URL.
