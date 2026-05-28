# Planning Engine Integrations

## Product Goal

The Campaign Architect module should create a media plan, campaign architecture, forecast summary, creative brief, build checklist, and campaign book for Google Ads and Meta Ads.

The user should not need campaign knowledge. The system asks business questions, gathers platform data, creates a plan, explains the logic, and prepares a team-ready build document.

## Required Data Sources

### Google Ads

Use the Google Ads MCP server or direct Google Ads API connector.

Required capabilities:

- List accessible customers and account metadata.
- Query existing campaigns, ad groups, keywords, assets, search terms, conversions, and performance.
- Generate keyword ideas.
- Generate keyword historical metrics.
- Generate keyword forecast metrics for Search planning.
- Use ReachPlanService for reach planning where the account is allowlisted.

Useful official references:

- Google Ads MCP: https://github.com/googleads/google-ads-mcp
- Keyword Planning overview: https://developers.google.com/google-ads/api/docs/keyword-planning/overview
- Forecast metrics: https://developers.google.com/google-ads/api/docs/keyword-planning/generate-forecast-metrics
- Reach planning: https://developers.google.com/google-ads/api/docs/reach-forecasting/media-plan

### Meta Ads

Use a Meta Marketing API connector or a vetted Meta Ads MCP server.

Required capabilities:

- Read ad accounts, campaigns, ad sets, ads, creatives, insights, pixels, custom audiences, and activity logs.
- Estimate audience size and delivery where Meta API permissions allow.
- Inspect creative fatigue through frequency, CTR, CPM, CPA, and conversion rate trends.
- Draft campaigns, ad sets, ads, and creative tests for approval.

Planning references:

- Meta OptiMate for reach and frequency prediction workflows: https://fbsamples.github.io/OptiMate/

## AI Planning Workflow

1. Intake
   - Business model
   - Offer
   - Audience
   - Geography
   - Budget
   - Objective
   - Funnel and conversion event
   - Creative inventory
   - Existing platform data availability

2. Research
   - Website and landing page crawl
   - Platform account history
   - Keyword and audience discovery
   - Category and competitor research
   - Historical benchmark extraction

3. Architecture
   - Google campaign types, ad groups, keyword clusters, match types, assets, and negatives.
   - Meta campaign objective, ad set split, audience logic, creative angles, placements, and retargeting.
   - Budget split by platform, funnel stage, and confidence.

4. Simulation
   - Google Search forecast from KeywordPlanIdeaService forecast metrics.
   - Google reach forecast from ReachPlanService only when available.
   - Meta audience and delivery estimates where the account and endpoint support it.
   - AI benchmark estimates only when platform forecasts are missing.

5. Review
   - Show assumptions.
   - Show confidence level.
   - Show risks.
   - Show expected first 14-day optimization rules.
   - Require human approval before write actions.

6. Export
   - Campaign book
   - Media plan
   - Creative brief
   - Build checklist
   - Tracking checklist
   - QA checklist

## Confidence Model

- High confidence: connected account data plus platform forecast.
- Medium confidence: platform estimate plus account or category benchmark.
- Low confidence: AI/category assumptions without account or platform estimate.

The UI must never present low-confidence forecasts as guaranteed results.

## Execution Model

Native setup remains inside Google Ads and Meta Ads. The app prepares and reviews plans, then the team builds inside native dashboards or uses approved API write actions later.

Recommended control path:

`AI intake -> data connectors -> plan generator -> simulation panel -> review editor -> approval queue -> campaign book export`

## Project Workspace Model

The app should behave like a chat workspace. Each project owns its own context and tool connections.

Project-level settings:

- AI Agent Brain provider configuration for the intelligence layer that powers Ask mode, Act mode, Campaign Architect, Campaign Intelligence, and approval reasoning.
- Google Ads connector or Google Ads MCP server.
- Meta Ads connector or Meta Marketing API credentials.
- Website URL and landing page crawl settings.
- Optional MCP tools or custom APIs.
- Brand, offer, product, and campaign history context.
- Approval rules for Act mode.

The AI Agent Brain should be treated as the orchestration layer, not a campaign-data connector. It can use Codex, Claude, OpenAI, Gemini, or a custom agent endpoint later, but the UI should clearly show whether it is in configured mode or demo fallback mode. It should combine agent reasoning with MCP and connector data before answering in Ask mode or drafting approval-safe changes in Act mode.

The chat UI should expose connected tools near the project selector, with a small project setup panel for configuring connectors. This keeps the main interaction simple while making it clear which data the assistant can access.

## AI Revenue Chat

The chat interface should feel like a simple ChatGPT-style assistant for campaigns, with two modes:

- Ask mode: read-only. Fetch information from connected campaigns and explain what is happening.
- Act mode: write-capable only after final approval. Draft exact changes, show risk and expected impact, then ask the user to approve before executing.

Required behavior:

- Fetch Google Ads and Meta Ads context before answering.
- Show evidence, source, confidence, and assumptions.
- Separate facts from AI interpretation.
- Convert strong answers into approval queue actions.
- Convert strategy answers into campaign book sections.
- Never execute Act mode changes without explicit final approval.
- Support questions about waste, scaling, CPA spikes, creative fatigue, search intent, landing pages, competitor angles, budget split, and forecast confidence.

High-value revenue features:

- Revenue leak scanner.
- Budget reallocation engine.
- Creative intelligence loop.
- Search intent expansion.
- Landing page friction audit.
- Incrementality guardrails.
- Weekly strategist review generated from account data.

## Future Build Notes

- Store finalized campaign books as versioned plan records.
- Add audit logs for every AI recommendation and human approval.
- Add source citations for platform metrics and research claims.
- Add direct PDF generation after the print-ready export is validated.
- Keep write actions disabled until approval workflow, permissions, and rollback rules are implemented.
