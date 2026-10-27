# TimesMed Triage API — Project Overview

## Summary
This repository contains the Triage API (internal name: `triage-api`) — a Node.js + TypeScript backend built with Express and Sequelize (Postgres). It provides multiple clinical triage endpoints (trauma, burns, poisonings, stroke, etc.), authentication/authorization, Swagger docs, DB scripts, and Postman collections for testing.

## Key information
- Package name: `triage-api` (see `package.json`).
- Language: TypeScript
- Runtime: Node.js (tested with Node 18 in Dockerfile)
- ORM: `sequelize` + `sequelize-typescript` (Postgres dialect)
- Auth: JWT + `express-jwt` with custom `authenticate`/`authorize` middlewares
- API docs: Swagger UI at `/api-docs` (configured in `src/config/swagger.ts`)

## Repository layout (top-level)
- `src/` — application source
  - `config/` — DB, swagger, env
  - `controllers/` — route handlers for triage domains
  - `routes/` — route wiring (notable file: `src/routes/Routes.ts`)
  - `models/` — Sequelize models (many domain models & lookup models)
  - `middlewares/` — authentication, authorization, error handling
  - `services/`, `repositories/`, `utils/` — helpers and business logic
  - `server.ts` — app bootstrap (CORS, middleware, swagger, DB, listen)
- `db_Scripts/` — SQL scripts grouped by domain (e.g., `Stroke.sql`, `Burns.sql`, `Trauma.sql`, `Dashboard/`, `PostDeploymentScripts/`, etc.)
- `postman/` — many Postman collections (multiple dated exports and `TAEI.postman_collection.json`)
- `Dockerfile` — image using `node:18-slim`, exposes `3001` and runs `npm start`
- `ecs-task-def.json` — AWS ECS task definition (Fargate) configured to use port `3001` and ECR image

## Important files
- `package.json` — scripts: `dev` (ts-node-dev), `build` (tsc), `start` (node dist/server.js)
- `tsconfig.json` — TypeScript compile settings (outDir: `dist`)
- `src/server.ts` — Express bootstrap and main routes mounting
- `src/config/db.ts` — Sequelize setup with replication/read-write and registered models
- `src/routes/Routes.ts` — mounts domain routes under `/api/*` paths and enforces `authenticate` + `authorize`
- `src/config/swagger.ts` — Swagger setup, Swagger UI served at `/api-docs`

## Route overview (mounted in `src/routes/Routes.ts`)
These routes are mounted under `/api` (see `server.ts`):
- `/triage`
- `/emotriage`
- `/trauma`
- `/burns`
- `/poisons`
- `/bitesStings`
- `/hanging`
- `/stroke`
- `/prem`
- `/stemi`
- `/drowning`
- `/api108` (mount for 108 integration)
- `/summary`
- `/dashboard`

Each domain route uses `authenticate` and `authorize` middleware except `api108` which is mounted without those checks in `Routes.ts`.

## Environment variables (used or expected)
- DB: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_READ_HOST`, `DB_READ_USER`
- App: `PORT`, `NODE_ENV`
- Any other secrets likely set in `.env` and loaded by `src/env` (see `src/config/db.ts` and `src/env` import)

## How to run (development)
1. Install dependencies:

```powershell
npm install
```

2. Start in dev mode (auto-reload):

```powershell
npm run dev
```

This uses `ts-node-dev` and runs `src/server.ts` directly.

## How to build & run (production)
1. Build TypeScript: `npm run build` (outputs to `dist/`)
2. Start: `npm start` (runs `node dist/server.js`)

Note: Dockerfile exposes `3001` and `CMD ["npm","start"]`. Ensure `PORT` env var and ECS ports are properly set when deploying (server defaults to `process.env.PORT || 5000`, while Dockerfile/ECS use `3001`).

## Docker / ECS notes
- `Dockerfile` uses `node:18-slim`, runs `npm install` and `npm start` and sets `EXPOSE 3001`.
- `ecs-task-def.json` configures container/host port `3001` and expects an ECR image `taei-nodejs:latest`.
- Verify that when running inside container / ECS you pass `PORT=3001` (or change Dockerfile/ecs to match server default) so the service binds to the expected port for health checks/load balancer.

## DB and models
- DB is Postgres with replication configured (write/read separation) in `src/config/db.ts`.
- Models are registered with Sequelize and include both domain models and lookup models (see `src/models/*` and `src/models/lookup/*`).

## Testing & API exploration
- Swagger UI: `http://<host>:<port>/api-docs`
- Postman: collections in `postman/` (use `TAEI.postman_collection.json` or dated exports)

## Notable implementation details & TODOs
- Responses are post-processed to format dates via `formatDatesInResponse` wrapper in `server.ts`.
- CORS is currently permissive (`origin: "*"`) — review for production.
- Authorization is role-based via `authorize("<RoleName>")` middleware (see `src/middlewares/authorize` and how `Routes.ts` assigns roles per domain).
- There is a small port mismatch: server default is `5000` but Dockerfile/ECS expect `3001` — ensure env `PORT` is set consistently.

## Where to look next (quick pointers)
- Start: `src/server.ts`
- DB & models: `src/config/db.ts`, `src/models/`
- Routes wiring: `src/routes/Routes.ts` and each domain route under `src/routes/`
- Controllers: `src/controllers/` (actual endpoints and swagger comments)
- SQL migrations / scripts: `db_Scripts/`
- Postman exports: `postman/`

---
Generated by an automated repo scan on Dec 6, 2025. If you want, I can:
- Expand this with an architecture diagram and sequence of common flows,
- Create a `README.md` using this content, or
- Run the app locally (install/build/run) and verify swagger availability.

