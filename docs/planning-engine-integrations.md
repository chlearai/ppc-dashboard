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

## Future Build Notes

- Store finalized campaign books as versioned plan records.
- Add audit logs for every AI recommendation and human approval.
- Add source citations for platform metrics and research claims.
- Add direct PDF generation after the print-ready export is validated.
- Keep write actions disabled until approval workflow, permissions, and rollback rules are implemented.
