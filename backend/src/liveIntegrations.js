const DEFAULT_GOOGLE_ADS_API_VERSION = process.env.GOOGLE_ADS_API_VERSION || 'v22';
const DEFAULT_META_API_VERSION = process.env.META_API_VERSION || 'v22.0';
const GOOGLE_ADS_SEARCH_URL = 'https://developers.google.com/google-ads/api/rest/common/search';
const GOOGLE_ADS_KEYWORD_PLANNING_URL = 'https://developers.google.com/google-ads/api/docs/keyword-planning/overview';
const GOOGLE_ADS_FORECAST_URL = 'https://developers.google.com/google-ads/api/docs/keyword-planning/generate-forecast-metrics';
const GOOGLE_ADS_ACCOUNTS_URL = 'https://developers.google.com/google-ads/api/docs/account-management/listing-accounts';
const META_INSIGHTS_URL = 'https://developers.facebook.com/docs/marketing-api/insights/';

function normalizeCustomerId(value) {
  return value.replace(/-/g, '').trim();
}

function parseNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function toCurrency(amountMicros) {
  const amount = amountMicros / 1_000_000;
  return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: amount >= 10 ? 0 : 1,
    minimumFractionDigits: amount >= 10 ? 0 : 1,
  })}`;
}

function toCurrencyUnits(amount) {
  return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: amount >= 10 ? 0 : 1,
    minimumFractionDigits: amount >= 10 ? 0 : 1,
  })}`;
}

function toRatio(value) {
  return `${value.toFixed(2)}x`;
}

function compactCampaignName(name) {
  return name.length > 42 ? `${name.slice(0, 39)}...` : name;
}

function createFallbackChannelSummaries(fallback) {
  const googlePlatform = fallback.platforms?.find((platform) => platform.platform === 'Google Ads');
  const metaPlatform = fallback.platforms?.find((platform) => platform.platform === 'Meta Ads');
  const googleCampaigns = fallback.campaigns?.filter((campaign) => campaign.platform === 'Google Ads') || [];
  const metaCampaigns = fallback.campaigns?.filter((campaign) => campaign.platform === 'Meta Ads') || [];

  return [
    {
      key: 'google_ads',
      platform: 'Google Ads',
      title: 'Search demand and intent quality',
      summary:
        'Brand search is carrying efficiency. High-intent non-brand needs a separate budget, clearer negatives, and stronger forecast controls.',
      spend: googlePlatform?.spend || 'n/a',
      roas: googlePlatform?.roas || 'n/a',
      cpl: googlePlatform?.cpl || 'n/a',
      clicks: 'n/a',
      conversions: 'n/a',
      campaignCount: googleCampaigns.length,
      signal: googlePlatform?.signal || 'Use search terms, match types, and conversion quality to isolate waste.',
      focus: ['Brand vs non-brand separation', 'Search term leakage', 'Forecast-backed scaling'],
      watchouts: ['High-intent queries are not isolated enough yet', 'Negative keyword coverage should be expanded'],
      opportunities: googleCampaigns.slice(0, 3).map((campaign) => campaign.name),
      sourceLabel: 'Google Ads reporting',
      sourceHref: GOOGLE_ADS_SEARCH_URL,
    },
    {
      key: 'meta_ads',
      platform: 'Meta Ads',
      title: 'Creative fatigue and audience pressure',
      summary:
        'Prospecting fatigue is the first thing to check. Frequency, CTR decay, and audience overlap determine whether Meta should scale or refresh.',
      spend: metaPlatform?.spend || 'n/a',
      roas: metaPlatform?.roas || 'n/a',
      cpl: metaPlatform?.cpl || 'n/a',
      clicks: 'n/a',
      conversions: 'n/a',
      campaignCount: metaCampaigns.length,
      signal: metaPlatform?.signal || 'Watch frequency, CTR, and the creative mix before shifting more budget.',
      focus: ['Creative fatigue', 'Audience overlap', 'Budget pacing'],
      watchouts: ['Prospecting may saturate if creative rotation stays narrow', 'Retargeting can mask acquisition economics'],
      opportunities: metaCampaigns.slice(0, 3).map((campaign) => campaign.name),
      sourceLabel: 'Meta Marketing API insights',
      sourceHref: META_INSIGHTS_URL,
    },
    {
      key: 'combined',
      platform: 'Combined',
      title: 'Budget balance and blended performance',
      summary:
        'Use the blended view to decide where the next rupee goes, while keeping Google search efficiency and Meta creative health visible separately.',
      spend: fallback.metrics?.[0]?.value || 'n/a',
      roas: fallback.metrics?.find((metric) => metric.label === 'ROAS')?.value || 'n/a',
      cpl: fallback.metrics?.find((metric) => metric.label === 'CPL')?.value || 'n/a',
      clicks: fallback.metrics?.find((metric) => metric.label === 'Leads')?.value || 'n/a',
      conversions: fallback.metrics?.find((metric) => metric.label === 'Conv. rate')?.value || 'n/a',
      campaignCount: fallback.campaigns?.length || 0,
      signal: 'Compare channels before shifting spend or changing creative.',
      focus: ['Budget split', 'Blended ROAS', 'Cross-channel prioritization'],
      watchouts: ['Blend can hide channel-specific waste', 'One winning channel can mask the other channel’s fatigue'],
      opportunities: ['Move spend toward the channel with the cleaner evidence trail'],
      sourceLabel: 'Blended performance model',
      sourceHref: GOOGLE_ADS_SEARCH_URL,
    },
  ];
}

function createFallbackAnalysisBlocks(fallback) {
  const googlePlatform = fallback.platforms?.find((platform) => platform.platform === 'Google Ads');
  const metaPlatform = fallback.platforms?.find((platform) => platform.platform === 'Meta Ads');

  return [
    {
      key: 'search-intent',
      title: 'Search intent mix',
      channel: 'Google Ads',
      status: 'watch',
      summary:
        'Brand search is efficient, but the account should isolate non-brand demand and negative keywords before scaling.',
      evidence: [googlePlatform?.signal || 'Google performance should be split by intent class.', 'Campaign-level data is still the current reporting grain.'],
      action: 'Split brand, competitor, and non-brand search into separate budgets and review terms weekly.',
      sourceLabel: 'Google Ads reporting',
      sourceHref: GOOGLE_ADS_SEARCH_URL,
    },
    {
      key: 'creative-fatigue',
      title: 'Creative fatigue',
      channel: 'Meta Ads',
      status: 'risk',
      summary:
        'Meta prospecting needs a creative refresh before it is allowed to carry more scale. Frequency and CTR should drive the next refresh cycle.',
      evidence: [metaPlatform?.signal || 'Meta needs creative rotation and audience testing.', 'Prospecting fatigue is the current account story.'],
      action: 'Build fresh proof-led variants and keep a rotation schedule tied to frequency and CTR.',
      sourceLabel: 'Meta Marketing API insights',
      sourceHref: META_INSIGHTS_URL,
    },
    {
      key: 'budget-balance',
      title: 'Budget balance',
      channel: 'Combined',
      status: 'watch',
      summary:
        'The blended view is useful for budget decisions, but channel-specific signals must remain visible to avoid over-optimizing the average.',
      evidence: ['Budget allocation should not be decided from blended ROAS alone.', 'The dashboard now keeps channel views separate.'],
      action: 'Use the channel summary cards to decide the next budget move.',
      sourceLabel: 'Blended performance model',
      sourceHref: GOOGLE_ADS_SEARCH_URL,
    },
    {
      key: 'conversion-quality',
      title: 'Conversion quality',
      channel: 'Combined',
      status: 'good',
      summary:
        'The account already has enough signal to distinguish waste from real performance. The next step is to show the underlying dimensions more clearly.',
      evidence: [fallback.insight?.detail || 'Account-level diagnosis is present.', 'Evidence and citations are available across the dashboard.'],
      action: 'Expose more diagnostics for audience, creative, search terms, and landing page fit.',
      sourceLabel: 'Evidence and planning model',
      sourceHref: GOOGLE_ADS_KEYWORD_PLANNING_URL,
    },
  ];
}

function buildGoogleAdsConfig() {
  return {
    apiVersion: DEFAULT_GOOGLE_ADS_API_VERSION,
    accessToken: process.env.GOOGLE_ADS_ACCESS_TOKEN || null,
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || null,
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID || null,
    loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || null,
  };
}

function buildMetaConfig() {
  return {
    apiVersion: DEFAULT_META_API_VERSION,
    accessToken: process.env.META_ACCESS_TOKEN || null,
    adAccountId: process.env.META_AD_ACCOUNT_ID || null,
  };
}

export function getIntegrationConfig() {
  const googleAds = buildGoogleAdsConfig();
  const meta = buildMetaConfig();

  return {
    aiAgentProvider: process.env.AI_AGENT_PROVIDER || null,
    aiAgentEndpointUrl: process.env.AI_AGENT_ENDPOINT_URL || null,
    googleAdsMcpUrl: process.env.GOOGLE_ADS_MCP_URL || null,
    googleAdsApiConfigured: Boolean(
      googleAds.accessToken && googleAds.developerToken && googleAds.customerId,
    ),
    googleAdsLiveConfigured: Boolean(
      googleAds.accessToken && googleAds.developerToken && googleAds.customerId,
    ),
    metaAdsMcpUrl: process.env.META_ADS_MCP_URL || null,
    metaAdsApiConfigured: Boolean(meta.accessToken && meta.adAccountId),
    metaAdsLiveConfigured: Boolean(meta.accessToken && meta.adAccountId),
    websiteCrawlUrl: process.env.WEBSITE_CRAWL_URL || null,
  };
}

async function googleAdsFetch(path, options = {}) {
  const config = buildGoogleAdsConfig();

  if (!config.accessToken || !config.developerToken || !config.customerId) {
    return { ok: false, status: 400, json: async () => ({ error: 'Missing Google Ads credentials' }) };
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.accessToken}`,
    'developer-token': config.developerToken,
    ...options.headers,
  };

  if (config.loginCustomerId) {
    headers['login-customer-id'] = config.loginCustomerId;
  }

  return fetch(`https://googleads.googleapis.com/${config.apiVersion}/${path}`, {
    ...options,
    headers,
  });
}

async function metaFetch(path, options = {}) {
  const config = buildMetaConfig();

  if (!config.accessToken || !config.adAccountId) {
    return { ok: false, status: 400, json: async () => ({ error: 'Missing Meta credentials' }) };
  }

  const url = new URL(`https://graph.facebook.com/${config.apiVersion}/${path}`);

  if (options.searchParams) {
    for (const [key, value] of options.searchParams.entries()) {
      url.searchParams.set(key, value);
    }
  }

  url.searchParams.set('access_token', config.accessToken);

  return fetch(url, {
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body,
  });
}

async function fetchGoogleAdsSnapshot() {
  const config = buildGoogleAdsConfig();

  if (!config.accessToken || !config.developerToken || !config.customerId) {
    return {
      available: false,
      source: 'Google Ads',
      detail: 'Connect Google Ads access token, developer token, and customer ID',
    };
  }

  const customerId = normalizeCustomerId(config.customerId);
  const response = await googleAdsFetch(`customers/${customerId}/googleAds:searchStream`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
        SELECT
          customer.id,
          customer.descriptive_name,
          customer.currency_code,
          campaign.id,
          campaign.name,
          campaign.status,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.ctr,
          metrics.average_cpc
        FROM campaign
        WHERE segments.date DURING LAST_30_DAYS
          AND campaign.status != 'REMOVED'
      `,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return {
      available: false,
      source: 'Google Ads',
      detail: body?.error?.message || `Google Ads API responded with ${response.status}`,
    };
  }

  const payload = await response.json();
  const rows = Array.isArray(payload) ? payload.flatMap((chunk) => chunk.results || []) : [];

  if (rows.length === 0) {
    return {
      available: true,
      source: 'Google Ads',
      detail: 'Connected with no campaign rows returned for the selected period',
      account: null,
      metrics: {
        spendMicros: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        conversionValue: 0,
      },
      campaigns: [],
    };
  }

  const firstRow = rows[0];
  const summary = rows.reduce(
    (acc, row) => {
      const campaign = row.campaign || {};
      const metrics = row.metrics || {};
      const spendMicros = parseNumber(metrics.costMicros);
      const clicks = parseNumber(metrics.clicks);
      const impressions = parseNumber(metrics.impressions);
      const conversions = parseNumber(metrics.conversions);
      const conversionValue = parseNumber(metrics.conversionsValue);

      acc.spendMicros += spendMicros;
      acc.clicks += clicks;
      acc.impressions += impressions;
      acc.conversions += conversions;
      acc.conversionValue += conversionValue;
      acc.campaigns.push({
        id: String(campaign.id || `campaign_${acc.campaigns.length + 1}`),
        name: compactCampaignName(String(campaign.name || 'Untitled campaign')),
        status: String(campaign.status || 'UNKNOWN'),
        spendMicros,
        clicks,
        impressions,
        conversions,
        conversionValue,
        ctr: parseNumber(metrics.ctr),
        averageCpc: parseNumber(metrics.averageCpc),
      });
      return acc;
    },
    {
      spendMicros: 0,
      clicks: 0,
      impressions: 0,
      conversions: 0,
      conversionValue: 0,
      campaigns: [],
    },
  );

  summary.campaigns.sort((a, b) => b.spendMicros - a.spendMicros);

  return {
    available: true,
    source: 'Google Ads',
    detail: `Connected to ${firstRow.customer?.descriptiveName || 'Google Ads account'}`,
    account: {
      id: String(firstRow.customer?.id || customerId),
      name: String(firstRow.customer?.descriptiveName || 'Google Ads account'),
      currencyCode: String(firstRow.customer?.currencyCode || 'INR'),
    },
    metrics: summary,
  };
}

async function fetchMetaAdsSnapshot() {
  const config = buildMetaConfig();

  if (!config.accessToken || !config.adAccountId) {
    return {
      available: false,
      source: 'Meta Ads',
      detail: 'Connect Meta access token and ad account ID',
    };
  }

  const response = await metaFetch(`act_${config.adAccountId}/insights`, {
    searchParams: new URLSearchParams({
      level: 'campaign',
      date_preset: 'last_30d',
      limit: '25',
      fields: [
        'campaign_id',
        'campaign_name',
        'spend',
        'impressions',
        'clicks',
        'ctr',
        'cpm',
        'cpc',
        'frequency',
        'reach',
        'actions',
        'action_values',
      ].join(','),
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return {
      available: false,
      source: 'Meta Ads',
      detail: body?.error?.message || `Meta API responded with ${response.status}`,
    };
  }

  const payload = await response.json();
  const rows = Array.isArray(payload.data) ? payload.data : [];

  if (rows.length === 0) {
    return {
      available: true,
      source: 'Meta Ads',
      detail: 'Connected with no insights rows returned for the selected period',
      account: null,
      metrics: {
        spend: 0,
        impressions: 0,
        clicks: 0,
        reach: 0,
        frequency: 0,
      },
      campaigns: [],
    };
  }

  const summary = rows.reduce(
    (acc, row) => {
      const spend = parseNumber(row.spend);
      const impressions = parseNumber(row.impressions);
      const clicks = parseNumber(row.clicks);
      const reach = parseNumber(row.reach);
      const frequency = parseNumber(row.frequency);
      const ctr = parseNumber(row.ctr);
      const conversionValue = Array.isArray(row.action_values)
        ? row.action_values.reduce((total, item) => total + parseNumber(item.value), 0)
        : 0;

      acc.spend += spend;
      acc.impressions += impressions;
      acc.clicks += clicks;
      acc.reach = Math.max(acc.reach, reach);
      acc.frequency = Math.max(acc.frequency, frequency);
      acc.conversionValue += conversionValue;
      acc.campaigns.push({
        id: String(row.campaign_id || `campaign_${acc.campaigns.length + 1}`),
        name: compactCampaignName(String(row.campaign_name || 'Untitled campaign')),
        spend,
        impressions,
        clicks,
        ctr,
        cpm: parseNumber(row.cpm),
        cpc: parseNumber(row.cpc),
        frequency,
        reach,
      });
      return acc;
    },
    {
      spend: 0,
      impressions: 0,
      clicks: 0,
      reach: 0,
      frequency: 0,
      conversionValue: 0,
      campaigns: [],
    },
  );

  summary.campaigns.sort((a, b) => b.spend - a.spend);

  return {
    available: true,
    source: 'Meta Ads',
    detail: `Connected to ad account ${config.adAccountId}`,
    account: {
      id: config.adAccountId,
      name: `ad account ${config.adAccountId}`,
      currencyCode: 'INR',
    },
    metrics: summary,
  };
}

function buildFallbackSummary(project, fallbackIntelligence, sourceNotes = []) {
  const fallback = fallbackIntelligence[project.id] || fallbackIntelligence.project_crystal_hues;

  return {
    ...fallback,
    projectId: project.id,
    projectName: project.name,
    channelSummaries: createFallbackChannelSummaries(fallback),
    analysisBlocks: createFallbackAnalysisBlocks(fallback),
    sources: sourceNotes,
    liveDataMode: false,
    citations: [
      {
        label: 'Google Ads search reporting',
        detail: 'Reference for campaign reporting, keyword planning, and forecast-backed analysis.',
        href: GOOGLE_ADS_SEARCH_URL,
        kind: 'docs',
      },
      {
        label: 'Google Ads keyword planning',
        detail: 'Reference for keyword ideas and forecast metrics when Google Ads is connected.',
        href: GOOGLE_ADS_KEYWORD_PLANNING_URL,
        kind: 'docs',
      },
      {
        label: 'Meta Marketing API insights',
        detail: 'Reference for live Meta campaign insights, creative performance, and delivery trends.',
        href: META_INSIGHTS_URL,
        kind: 'docs',
      },
      ...sourceNotes.map((source) => ({
        label: source.source,
        detail: source.detail,
        href: source.source === 'Google Ads' ? GOOGLE_ADS_SEARCH_URL : META_INSIGHTS_URL,
        kind: 'live',
      })),
    ],
  };
}

export async function buildCampaignIntelligence(project, fallbackIntelligence) {
  const [googleAds, metaAds] = await Promise.all([fetchGoogleAdsSnapshot(), fetchMetaAdsSnapshot()]);
  const liveSources = [googleAds, metaAds].filter((source) => source.available);

  if (liveSources.length === 0) {
    return buildFallbackSummary(project, fallbackIntelligence, [googleAds, metaAds]);
  }

  const googleSummary = googleAds.available ? googleAds : null;
  const metaSummary = metaAds.available ? metaAds : null;

  const googleSpend = googleSummary?.metrics?.spendMicros || 0;
  const metaSpend = metaSummary?.metrics?.spend || 0;
  const googleSpendUnits = googleSpend / 1_000_000;
  const combinedSpendUnits = googleSpendUnits + metaSpend;
  const combinedRevenueUnits =
    (googleSummary?.metrics?.conversionValue || 0) + (metaSummary?.metrics?.conversionValue || 0);
  const googleClicks = googleSummary?.metrics?.clicks || 0;
  const metaClicks = metaSummary?.metrics?.clicks || 0;
  const googleConversions = googleSummary?.metrics?.conversions || 0;
  const googleCpa = googleConversions > 0 ? googleSpend / 1_000_000 / googleConversions : 0;
  const metaReach = metaSummary?.metrics?.reach || 0;
  const metaFrequency = metaSummary?.metrics?.frequency || 0;
  const googleCampaigns = googleSummary?.metrics?.campaigns || [];
  const metaCampaigns = metaSummary?.metrics?.campaigns || [];
  const combinedCampaignCount = googleCampaigns.length + metaCampaigns.length;
  const liveCampaigns = [
    ...googleCampaigns.slice(0, 3).map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      platform: 'Google Ads',
      status: campaign.status,
      spend: toCurrency(campaign.spendMicros),
      cpa: campaign.conversions > 0 ? toCurrency(campaign.spendMicros / campaign.conversions) : 'n/a',
      roas:
        campaign.conversionValue > 0 && campaign.spendMicros > 0
          ? toRatio(campaign.conversionValue / (campaign.spendMicros / 1_000_000))
          : 'n/a',
      issue:
        campaign.status === 'ENABLED'
          ? 'Active in live Google Ads data'
          : 'Check delivery and optimization status',
    })),
    ...metaCampaigns.slice(0, 3).map((campaign) => ({
      id: `meta_${campaign.id}`,
      name: campaign.name,
      platform: 'Meta Ads',
      status: 'Live',
      spend: toCurrencyUnits(campaign.spend),
      cpa: campaign.clicks > 0 ? toCurrencyUnits(campaign.spend / campaign.clicks) : 'n/a',
      roas: metaSpend > 0 ? toRatio(combinedRevenueUnits / metaSpend) : 'n/a',
      issue: `Frequency ${campaign.frequency.toFixed(1)}x on live Meta insights`,
    })),
  ];
  const channelSummaries = [
    {
      key: 'google_ads',
      platform: 'Google Ads',
      title: 'Search demand and intent quality',
      summary: googleSummary
        ? `Live Google Ads data is available, with ${googleCampaigns.length} campaigns and ${
            googleConversions > 0 ? `${googleConversions} conversions` : 'no tracked conversions yet'
          } in the current window.`
        : 'Google Ads is not connected, so the view falls back to strategy guidance.',
      spend: toCurrency(googleSpend),
      roas:
        googleSummary && googleSpend > 0 && googleSummary.metrics.conversionValue > 0
          ? toRatio(googleSummary.metrics.conversionValue / (googleSpend / 1_000_000))
          : 'n/a',
      cpl:
        googleSummary && googleConversions > 0
          ? toCurrencyUnits(googleSpendUnits / googleConversions)
          : 'n/a',
      clicks: String(googleClicks),
      conversions: String(googleConversions),
      campaignCount: googleCampaigns.length,
      signal: googleSummary
        ? 'Use search terms, negatives, and conversion quality to isolate waste.'
        : 'Separate brand and non-brand search before scaling budgets.',
      focus: ['Brand vs non-brand separation', 'Search term leakage', 'Forecast-backed scaling'],
      watchouts: [
        googleSummary ? 'Search traffic needs more intent separation before scaling' : 'Google Ads is still in strategy mode',
        googleConversions > 0 ? 'High CPA pockets should be isolated' : 'Conversion signal is still limited',
      ],
      opportunities: googleCampaigns.slice(0, 3).map((campaign) => campaign.name),
      sourceLabel: 'Google Ads SearchStream',
      sourceHref: GOOGLE_ADS_SEARCH_URL,
    },
    {
      key: 'meta_ads',
      platform: 'Meta Ads',
      title: 'Creative fatigue and audience pressure',
      summary: metaSummary
        ? `Live Meta insights show ${metaCampaigns.length} campaigns, ${
            metaReach > 0 ? `${metaReach.toLocaleString('en-IN')} reach` : 'reach still unavailable'
          }, and ${metaFrequency > 0 ? `${metaFrequency.toFixed(1)}x frequency` : 'frequency not available'}.`
        : 'Meta Ads is not connected, so the view falls back to strategy guidance.',
      spend: toCurrencyUnits(metaSpend),
      roas:
        combinedRevenueUnits > 0 && metaSpend > 0
          ? toRatio(combinedRevenueUnits / metaSpend)
          : 'n/a',
      cpl: metaClicks > 0 ? toCurrencyUnits(metaSpend / metaClicks) : 'n/a',
      clicks: String(metaClicks),
      conversions: metaSummary?.metrics?.conversionValue > 0 ? toCurrencyUnits(metaSummary.metrics.conversionValue) : 'n/a',
      campaignCount: metaCampaigns.length,
      signal: metaSummary
        ? 'Watch frequency, CTR, and creative rotation before moving more budget.'
        : 'Prospecting and retargeting need separate creative and audience controls.',
      focus: ['Creative fatigue', 'Audience overlap', 'Budget pacing'],
      watchouts: [
        metaSummary && metaFrequency >= 2 ? `Frequency is ${metaFrequency.toFixed(1)}x and may be fatiguing` : 'Creative rotation should remain visible',
        metaSummary ? 'Audience overlap should be reviewed before scaling' : 'Meta guidance is still strategic',
      ],
      opportunities: metaCampaigns.slice(0, 3).map((campaign) => campaign.name),
      sourceLabel: 'Meta Marketing API insights',
      sourceHref: META_INSIGHTS_URL,
    },
    {
      key: 'combined',
      platform: 'Combined',
      title: 'Budget balance and blended performance',
      summary:
        combinedRevenueUnits > 0
          ? `Blended revenue and spend are visible across ${liveSources.length} connected sources and ${combinedCampaignCount} campaign rows.`
          : `Blended view is available across ${liveSources.length} connected sources and ${combinedCampaignCount} campaign rows.`,
      spend: toCurrencyUnits(combinedSpendUnits),
      roas:
        combinedRevenueUnits > 0 && combinedSpendUnits > 0
          ? toRatio(combinedRevenueUnits / combinedSpendUnits)
          : 'n/a',
      cpl:
        googleConversions > 0
          ? toCurrencyUnits(googleSpendUnits / googleConversions)
          : metaClicks > 0
            ? toCurrencyUnits(metaSpend / metaClicks)
            : 'n/a',
      clicks: String(googleClicks + metaClicks),
      conversions: combinedRevenueUnits > 0 ? toCurrencyUnits(combinedRevenueUnits) : 'n/a',
      campaignCount: combinedCampaignCount,
      signal: 'Use the blended view to choose the next rupee, but keep channel-level evidence visible.',
      focus: ['Budget split', 'Blended ROAS', 'Cross-channel prioritization'],
      watchouts: ['Blend can hide channel-specific waste', 'One winning channel can mask the other channel’s fatigue'],
      opportunities: ['Move spend toward the channel with the cleaner evidence trail'],
      sourceLabel: 'Blended performance model',
      sourceHref: GOOGLE_ADS_SEARCH_URL,
    },
  ];
  const analysisBlocks = [
    {
      key: 'search-intent',
      title: 'Search intent mix',
      channel: 'Google Ads',
      status: googleSummary && googleConversions > 0 ? 'watch' : 'risk',
      summary: googleSummary
        ? 'Brand search is efficient, but the account should isolate non-brand demand and negative keywords before scaling.'
        : 'Google search strategy still needs intent separation and a cleaner budget split.',
      evidence: [
        googleSummary ? `${googleCampaigns.length} Google campaigns in the live feed` : 'Google Ads is not connected',
        googleSummary ? `Google conversions: ${googleConversions}` : 'Forecast-backed search work is still strategic',
      ],
      action: 'Split brand, competitor, and non-brand search into separate budgets and review terms weekly.',
      sourceLabel: 'Google Ads SearchStream',
      sourceHref: GOOGLE_ADS_SEARCH_URL,
    },
    {
      key: 'creative-fatigue',
      title: 'Creative fatigue',
      channel: 'Meta Ads',
      status: metaSummary && metaFrequency >= 2 ? 'risk' : 'watch',
      summary: metaSummary
        ? `Meta frequency is ${metaFrequency > 0 ? `${metaFrequency.toFixed(1)}x` : 'unavailable'}, so creative rotation should be refreshed before scale.`
        : 'Meta creative and audience diagnosis is still strategic.',
      evidence: [
        metaSummary ? `Meta frequency: ${metaFrequency.toFixed(1)}x` : 'Meta Insights is not connected',
        metaSummary ? `Meta reach: ${metaReach.toLocaleString('en-IN')}` : 'Creative fatigue is still a watch item',
      ],
      action: 'Refresh proof-led creative, rotate hooks, and keep a visible testing cadence.',
      sourceLabel: 'Meta Marketing API insights',
      sourceHref: META_INSIGHTS_URL,
    },
    {
      key: 'budget-balance',
      title: 'Budget balance',
      channel: 'Combined',
      status: 'watch',
      summary:
        'The blended view should drive allocation decisions, but channel-specific tabs must stay visible so the average does not hide waste.',
      evidence: [
        `Live sources: ${liveSources.length}`,
        `Campaign rows: ${combinedCampaignCount}`,
        combinedRevenueUnits > 0 ? `Tracked revenue: ${toCurrencyUnits(combinedRevenueUnits)}` : 'Tracked revenue is still directional',
      ],
      action: 'Use the Google and Meta tabs to move spend where the evidence is strongest.',
      sourceLabel: 'Blended performance model',
      sourceHref: GOOGLE_ADS_SEARCH_URL,
    },
    {
      key: 'conversion-quality',
      title: 'Conversion quality',
      channel: 'Combined',
      status: googleSummary && metaSummary ? 'good' : 'watch',
      summary:
        'The account now has enough information to separate live performance from strategy guidance and to expose the missing dimensions explicitly.',
      evidence: [
        googleSummary ? 'Google live data is available' : 'Google remains in strategic mode',
        metaSummary ? 'Meta live data is available' : 'Meta remains in strategic mode',
        'Diagnostics tabs expose what needs deeper review next',
      ],
      action: 'Use the diagnostics tab to identify the next decision bottleneck, then move into campaign build or budget shifts.',
      sourceLabel: 'Evidence and planning model',
      sourceHref: GOOGLE_ADS_KEYWORD_PLANNING_URL,
    },
  ];

  const platforms = [];

  if (googleSummary) {
    const googleSpendDisplay = toCurrency(googleSpend);
    platforms.push({
      platform: 'Google Ads',
      spend: googleSpendDisplay,
      roas:
        googleSummary.metrics.conversionValue > 0 && googleSpend > 0
          ? toRatio(googleSummary.metrics.conversionValue / (googleSpend / 1_000_000))
          : 'n/a',
      cpl:
        googleSummary.metrics.conversions > 0
          ? toCurrencyUnits(googleSpendUnits / googleSummary.metrics.conversions)
          : 'n/a',
      signal: `Live Google Ads data from ${googleSummary.account?.name || 'connected account'}`,
    });
  }

  if (metaSummary) {
    platforms.push({
      platform: 'Meta Ads',
      spend: toCurrencyUnits(metaSpend),
      roas:
        combinedRevenueUnits > 0 && metaSpend > 0
          ? toRatio(combinedRevenueUnits / metaSpend)
          : 'n/a',
      cpl: metaClicks > 0 ? toCurrencyUnits(metaSpend / metaClicks) : 'n/a',
      signal: `Live Meta insights from ad account ${metaSummary.account?.id || 'connected account'}`,
    });
  }

  const alerts = [];

  if (metaSummary && metaFrequency >= 2) {
    alerts.push({
      label: 'Creative fatigue watch',
      severity: 'medium',
      detail: `Meta frequency is ${metaFrequency.toFixed(1)}x in the last 30 days.`,
    });
  }

  if (googleSummary && googleConversions > 0 && googleCpa > 0) {
    alerts.push({
      label: 'Google efficiency signal',
      severity: 'low',
      detail: `Google CPA is running at ${toCurrencyUnits(googleCpa)} based on live conversions.`,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      label: 'Live data available',
      severity: 'low',
      detail: 'Connected Google Ads and Meta Ads data is now powering the intelligence view.',
    });
  }

  const summary = [
    googleSummary ? `Google Ads spend: ${toCurrency(googleSpend)} from live API data.` : null,
    metaSummary ? `Meta Ads spend: ${toCurrencyUnits(metaSpend)} from live insights.` : null,
    combinedRevenueUnits > 0 ? `Combined tracked revenue: ${toCurrencyUnits(combinedRevenueUnits)}.` : null,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    projectId: project.id,
    projectName: project.name,
    summary: summary || `Live Google Ads and Meta Ads data is connected for ${project.name}.`,
    metrics: [
      {
        label: 'Spend',
        value: toCurrencyUnits(combinedSpendUnits),
        delta: `${liveSources.length} live sources`,
        status: 'watch',
        sourceLabel: 'Live Google Ads and Meta Ads',
        sourceHref: GOOGLE_ADS_SEARCH_URL,
      },
      {
        label: 'Revenue',
        value: combinedRevenueUnits > 0 ? toCurrencyUnits(combinedRevenueUnits) : 'n/a',
        delta: 'Derived from live platform metrics',
        status: 'good',
        sourceLabel: 'Live Google Ads and Meta Ads',
        sourceHref: GOOGLE_ADS_SEARCH_URL,
      },
      {
        label: 'ROAS',
        value:
          combinedRevenueUnits > 0 && combinedSpendUnits > 0
            ? toRatio(combinedRevenueUnits / combinedSpendUnits)
            : 'n/a',
        delta: 'Computed from live source data',
        status: 'watch',
        sourceLabel: 'Live Google Ads and Meta Ads',
        sourceHref: META_INSIGHTS_URL,
      },
      {
        label: 'CPL',
        value:
          googleConversions > 0
            ? toCurrencyUnits(googleSpendUnits / googleConversions)
            : metaClicks > 0
              ? toCurrencyUnits(metaSpend / metaClicks)
              : 'n/a',
        delta: 'From connected account data',
        status: 'risk',
        sourceLabel: 'Live Google Ads and Meta Ads',
        sourceHref: GOOGLE_ADS_FORECAST_URL,
      },
      {
        label: 'Clicks',
        value: String(googleClicks + metaClicks),
        delta: 'Google Ads + Meta Ads',
        status: 'watch',
        sourceLabel: 'Google Ads SearchStream and Meta Insights',
        sourceHref: GOOGLE_ADS_SEARCH_URL,
      },
      {
        label: 'Reach',
        value: metaReach > 0 ? metaReach.toLocaleString('en-IN') : 'n/a',
        delta: 'Meta insights',
        status: 'good',
        sourceLabel: 'Meta Marketing API insights',
        sourceHref: META_INSIGHTS_URL,
      },
    ],
    platforms,
    campaigns: liveCampaigns.length > 0 ? liveCampaigns : buildFallbackSummary(project, fallbackIntelligence, liveSources).campaigns,
    insight: {
      title: 'Why performance changed',
      detail:
        liveSources.length > 0
          ? 'Live platform data is now driving the account diagnosis. Use the platform split and campaign diagnostics for the current account view.'
          : buildFallbackSummary(project, fallbackIntelligence, liveSources).insight.detail,
    },
    alerts,
    citations: [
      {
        label: 'Google Ads account access',
        detail: 'Accessible customers and authenticated account scope are resolved before reporting.',
        href: GOOGLE_ADS_ACCOUNTS_URL,
        kind: 'docs',
      },
      {
        label: 'Google Ads search reporting',
        detail: 'Live Google Ads campaign metrics are retrieved from SearchStream.',
        href: GOOGLE_ADS_SEARCH_URL,
        kind: 'live',
      },
      {
        label: 'Google Ads keyword planning',
        detail: 'Forecast and keyword expansion references for future planning stages.',
        href: GOOGLE_ADS_FORECAST_URL,
        kind: 'docs',
      },
      {
        label: 'Meta Marketing API insights',
        detail: 'Live Meta campaign metrics are retrieved from the Insights endpoint.',
        href: META_INSIGHTS_URL,
        kind: 'live',
      },
    ],
    sources: liveSources.map((source) => ({
      source: source.source,
      detail: source.detail,
      available: source.available,
    })),
    channelSummaries,
    analysisBlocks,
    liveDataMode: true,
  };
}
