# PPC Dashboard

AI PPC Operator is a workspace-style SaaS prototype for PPC planning, campaign diagnosis, and approval-gated Google Ads and Meta Ads actions.

## Scripts

- `npm install` installs workspace dependencies.
- `npm run dev` starts the frontend workspace.
- `npm run dev:frontend -- --host 127.0.0.1` starts Vite with an explicit local host.
- `npm run dev:backend` starts the local API on `http://127.0.0.1:8787`.
- `npm run build` type-checks and builds the frontend, then syntax-checks the backend.
- `npm run lint` runs frontend ESLint and backend syntax checks.
- `npm run test:e2e` runs the Playwright browser regression tests.

## Project Structure

- `frontend/src/App.tsx` mounts the AI Revenue Chat workspace.
- `frontend/src/components` contains the revenue chat and campaign architecture UI.
- `frontend/src/data` contains starter campaign strategy and chat prompt data.
- `frontend/src/lib/api.ts` contains the frontend API client.
- `backend/src/server.js` provides the local project, connector, chat, message, and approval API.
- `docs/planning-engine-integrations.md` captures the Google Ads, Meta Ads, MCP/API, Ask mode, Act mode, and approval workflow requirements.

## Runtime Notes

The frontend falls back to fixture data if the backend is unavailable, but live QA should run both services:

```bash
npm run dev:backend
npm run dev:frontend -- --host 127.0.0.1
```
