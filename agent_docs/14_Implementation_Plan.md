# Implementation Plan

## Phase 0 — repository and contracts

**Objective:** establish frontend/backend boundaries, environment templates, tooling, and this specification as the source of truth. **Files:** package manifests, `.gitignore`, `.env.example`, lint/format/test config, docs. **Dependencies:** none. **Acceptance:** fresh clone can install and run empty client/API shells without secret leakage. **Checklist:** [ ] roots chosen [ ] scripts documented [ ] env names match deployment guide [ ] CI baseline defined.

## Phase 1 — backend foundation

**Objective:** create Express app assembly, config validation, Atlas connection lifecycle, health route, request ID/logger, terminal 404/error middleware. **Files:** `backend/src/{app,server,config,middleware,utils}`. **Dependencies:** Phase 0 and development Atlas/test database. **Acceptance:** service fails clearly on invalid config, health responds, unhandled errors use the standard envelope. **Checklist:** [ ] graceful shutdown [ ] body cap [ ] Helmet [ ] CORS config [ ] logs redacted.

## Phase 2 — link domain and API

**Objective:** implement schema/indexes, validator, generator, service, controllers/routes, and API tests. **Files:** `models`, `validators`, `services`, `controllers`, `routes`, backend tests. **Dependencies:** Phase 1. **Acceptance:** create/list/redirect contracts and edge matrix pass; redirect increment is atomic. **Checklist:** [ ] unique index [ ] collision retry [ ] DTO mapping [ ] newest-first list [ ] 302/404 verified.

## Phase 3 — frontend behavior

**Objective:** implement one accessible page, API adapter, form/list states, and component tests. **Files:** `frontend/src` components/hooks/api/styles/tests. **Dependencies:** API contract from Phase 2. **Acceptance:** user can create, copy, view, and recover from errors using keyboard. **Checklist:** [ ] loading/empty/error states [ ] responsive list [ ] status announcements [ ] API base URL config.

## Phase 4 — integration, deployment, and handoff

**Objective:** deploy Atlas/Render/Vercel, configure CORS/secrets, run smoke and E2E tests, finalize README. **Files:** deployment/CI config and README updates. **Dependencies:** Phases 1–3. **Acceptance:** production URL works end-to-end, health/logging work, secrets are absent from repository. **Checklist:** [ ] Render health green [ ] Vercel CORS proven [ ] create/redirect/count smoke test [ ] rollback owner identified.

This order minimizes refactoring by freezing data/API semantics before UI composition and validating the redirect invariant before deployment.
