## Purpose
This file gives Copilot/AI agents quick, actionable context for working in this repository (a small MERN app).

## Key commands
- Install (root): `npm install`
- Run backend in dev: `npm run dev` (runs `nodemon api/index.js`)
- Run backend production: `npm start` (runs `node api/index.js`)
- Build full project: `npm run build` (installs client deps and builds client)
- Client dev: see `client/package.json` (use `npm install` then `npm run dev` inside `/client` when needed)

## Project layout (high level)
- `api/` — Express backend (controllers, routes, models, utils). Entry: `api/index.js`.
- `client/` — Frontend built with Vite + React. Source in `client/src/`.
- Root `package.json` has convenience scripts that invoke backend and client build.

## Conventions & expectations for agents
- Link, don't embed: prefer linking to relevant docs or files rather than copying large sections.
- Small, focused edits: make minimal, well-scoped changes and run tests or dev scripts where possible.
- Environment: runtime config (ports, DB URI, secrets) lives in `.env` (not checked in). Do not hardcode secrets.
- Separate backend/frontend concerns: when modifying frontend files, prefer `client/` scope; backend changes go under `api/`.

## Common developer tasks
- Start backend dev server: `npm run dev`
- Build client only: `npm install --prefix client && npm run build --prefix client`
- Lint/format: none enforced in repo — ask before adding tooling.

## Docs & references
- See [client/README.md](client/README.md) for frontend-specific notes.

## When creating or updating this file
- Preserve any existing, valuable content. If behavior differs between backend and frontend, consider using applyTo patterns to scope instructions.

## Example prompts for this workspace
- "Find and fix the bug preventing user signup in `api/controllers/auth.controller.js`. Run backend locally and validate the route."
- "Add a new Redux slice for listings in `client/src/redux` and wire it into `App.jsx`."

## Suggested next agent customizations
- `create-agent:frontend-helper` — focused on Vite/React tasks (scaffold components, fix styling, run client dev).
- `create-agent:backend-helper` — focused on Express/Mongoose tasks (routes, controllers, migration helpers).

If you want, I can: run the dev server, add CI config, or create applyTo-specific instructions for `api/` and `client/`.
