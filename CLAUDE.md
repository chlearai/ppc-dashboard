# CLAUDE.md

## Project Overview

**PPC Dashboard** — AI-powered PPC campaign planning workspace for Google Ads and Meta Ads.

- **Frontend**: React 18 + TypeScript + Vite + CSS (no Tailwind)
- **Backend**: Node.js server (`server.js`)
- **Testing**: Playwright for e2e tests in `frontend/e2e/`
- **Auth**: Workspace-based credential system (demo auth)

## Key Files

- `frontend/src/App.tsx` — Main application shell
- `frontend/src/components/LoginScreen.tsx` — Homepage + login panel
- `frontend/src/components/RevenueChat.tsx` — AI chat workspace
- `frontend/src/components/CampaignIntelligenceModule.tsx` — Intelligence dashboard
- `frontend/src/components/CampaignArchitect.tsx` — Campaign planning module
- `frontend/src/components/ProjectConnectorModule.tsx` — Project/connector management
- `frontend/src/data/workspaceAuth.ts` — Demo credentials

## Workflow Skills

Use these skills for proper discipline:

- `brainstorming` — Before creative work or feature changes
- `systematic-debugging` — For bugs and test failures
- `test-driven-development` — Before writing implementation code
- `verification-before-completion` — Before committing or claiming work done
- `subagent-driven-development` — For executing multi-step plans

## Conventions

1. Always use TDD: write failing test first, then implement
2. Check `docs/superpowers/plans/` for implementation plans before starting tasks
3. Keep working tree clean — commit incrementally with clear messages
4. Run `npm run lint` and tests before claiming completion

## Recent Commits

```
9e0f38b feat: expand campaign intelligence drilldowns
d76295f feat: persist runtime state in postgres
e14380e feat: add enterprise homepage login
23de3b4 feat: add live intelligence citations
0789e24 feat: redesign intelligence and architect modules
```