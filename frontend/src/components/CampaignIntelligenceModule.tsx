import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Bell,
  ExternalLink,
  Radar,
  ShieldCheck,
  TrendingDown,
  TriangleAlert,
} from 'lucide-react';
import { recommendations, sourceHealth } from '../data/strategy';
import {
  CampaignIntelligence,
  IntelligenceAnalysisBlock,
  IntelligenceChannelSummary,
  User,
} from '../lib/api';

type CampaignIntelligenceModuleProps = {
  currentUser: User;
  intelligence: CampaignIntelligence;
  onBack: () => void;
  onLogout: () => void;
};

type IntelligenceViewKey = 'overview' | 'google' | 'meta' | 'campaigns' | 'diagnostics' | 'evidence';
type CampaignScope = 'all' | 'google_ads' | 'meta_ads';

const viewTabs: Array<{
  key: IntelligenceViewKey;
  label: string;
  title: string;
  subtitle: string;
}> = [
  {
    key: 'overview',
    label: 'Overview',
    title: 'Channel comparison',
    subtitle: 'View the blended account story, then compare the channel signals side by side.',
  },
  {
    key: 'google',
    label: 'Google Ads',
    title: 'Google Ads view',
    subtitle: 'Search intent and budget allocation',
  },
  {
    key: 'meta',
    label: 'Meta Ads',
    title: 'Meta Ads view',
    subtitle: 'Creative and audience diagnostics',
  },
  {
    key: 'campaigns',
    label: 'Campaigns',
    title: 'Campaigns view',
    subtitle: 'Filter, scan, and compare the current campaign rows.',
  },
  {
    key: 'diagnostics',
    label: 'Diagnostics',
    title: 'Decision diagnostics',
    subtitle: 'Read the cross-channel issues that should shape the next move.',
  },
  {
    key: 'evidence',
    label: 'Evidence',
    title: 'Source citations',
    subtitle: 'Trace every claim back to the live source or planning reference.',
  },
];

function getCampaignScope(platform: string): CampaignScope {
  if (platform === 'Google Ads') return 'google_ads';
  if (platform === 'Meta Ads') return 'meta_ads';
  return 'all';
}

function buildFallbackChannelSummaries(intelligence: CampaignIntelligence): IntelligenceChannelSummary[] {
  const googlePlatform = intelligence.platforms.find((platform) => platform.platform === 'Google Ads');
  const metaPlatform = intelligence.platforms.find((platform) => platform.platform === 'Meta Ads');
  const googleCampaigns = intelligence.campaigns.filter((campaign) => campaign.platform === 'Google Ads');
  const metaCampaigns = intelligence.campaigns.filter((campaign) => campaign.platform === 'Meta Ads');

  return [
    {
      key: 'google_ads',
      platform: 'Google Ads',
      title: 'Search demand and intent quality',
      summary:
        'Brand search is carrying efficiency. Non-brand demand needs separate budgets, clearer negatives, and a tighter forecast loop.',
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
      sourceHref: 'https://developers.google.com/google-ads/api/rest/common/search',
    },
    {
      key: 'meta_ads',
      platform: 'Meta Ads',
      title: 'Creative fatigue and audience pressure',
      summary:
        'Prospecting fatigue is the first thing to check. Frequency, CTR decay, and audience overlap decide whether Meta should scale or refresh.',
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
      sourceHref: 'https://developers.facebook.com/docs/marketing-api/insights/',
    },
    {
      key: 'combined',
      platform: 'Combined',
      title: 'Budget balance and blended performance',
      summary:
        'Use the blended view to decide where the next rupee goes, while keeping Google search efficiency and Meta creative health visible separately.',
      spend: intelligence.metrics.find((metric) => metric.label === 'Spend')?.value || 'n/a',
      roas: intelligence.metrics.find((metric) => metric.label === 'ROAS')?.value || 'n/a',
      cpl: intelligence.metrics.find((metric) => metric.label === 'CPL')?.value || 'n/a',
      clicks: intelligence.metrics.find((metric) => metric.label === 'Clicks')?.value || 'n/a',
      conversions: intelligence.metrics.find((metric) => metric.label === 'Revenue')?.value || 'n/a',
      campaignCount: intelligence.campaigns.length,
      signal: 'Compare channels before shifting spend or changing creative.',
      focus: ['Budget split', 'Blended ROAS', 'Cross-channel prioritization'],
      watchouts: ['Blend can hide channel-specific waste', 'One winning channel can mask the other channel’s fatigue'],
      opportunities: ['Move spend toward the channel with the cleaner evidence trail'],
      sourceLabel: 'Blended performance model',
      sourceHref: 'https://developers.google.com/google-ads/api/rest/common/search',
    },
  ];
}

function buildFallbackAnalysisBlocks(intelligence: CampaignIntelligence): IntelligenceAnalysisBlock[] {
  const googlePlatform = intelligence.platforms.find((platform) => platform.platform === 'Google Ads');
  const metaPlatform = intelligence.platforms.find((platform) => platform.platform === 'Meta Ads');

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
      sourceHref: 'https://developers.google.com/google-ads/api/rest/common/search',
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
      sourceHref: 'https://developers.facebook.com/docs/marketing-api/insights/',
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
      sourceHref: 'https://developers.google.com/google-ads/api/rest/common/search',
    },
    {
      key: 'conversion-quality',
      title: 'Conversion quality',
      channel: 'Combined',
      status: 'good',
      summary:
        'The account already has enough signal to distinguish waste from real performance. The next step is to show the underlying dimensions more clearly.',
      evidence: [intelligence.insight.detail, 'Evidence and citations are available across the dashboard.'],
      action: 'Expose more diagnostics for audience, creative, search terms, and landing page fit.',
      sourceLabel: 'Evidence and planning model',
      sourceHref: 'https://developers.google.com/google-ads/api/docs/keyword-planning/overview',
    },
  ];
}

function ChannelSummaryCard({ summary }: { summary: IntelligenceChannelSummary }) {
  return (
    <article className="channel-summary-card">
      <div className="channel-summary-head">
        <div>
          <p>{summary.platform}</p>
          <h3>{summary.title}</h3>
        </div>
        <span>{summary.campaignCount} campaigns</span>
      </div>

      <p className="channel-summary-copy">{summary.summary}</p>

      <dl className="channel-summary-metrics">
        <div>
          <dt>Spend</dt>
          <dd>{summary.spend}</dd>
        </div>
        <div>
          <dt>ROAS</dt>
          <dd>{summary.roas}</dd>
        </div>
        <div>
          <dt>CPL</dt>
          <dd>{summary.cpl}</dd>
        </div>
        <div>
          <dt>Clicks</dt>
          <dd>{summary.clicks}</dd>
        </div>
        <div>
          <dt>Conversions</dt>
          <dd>{summary.conversions}</dd>
        </div>
        <div>
          <dt>Signal</dt>
          <dd>{summary.signal}</dd>
        </div>
      </dl>

      <div className="tag-row">
        {summary.focus.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="view-notes">
        <div>
          <strong>Watchouts</strong>
          <ul>
            {summary.watchouts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Opportunities</strong>
          <ul>
            {summary.opportunities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function AnalysisBlockCard({ block }: { block: IntelligenceAnalysisBlock }) {
  return (
    <article className={`analysis-card ${block.status}`}>
      <div className="analysis-card-head">
        <span>{block.channel}</span>
        <em>{block.status}</em>
      </div>

      <h3>{block.title}</h3>
      <p>{block.summary}</p>

      <div className="analysis-evidence">
        {block.evidence.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="action-line">
        <strong>Action</strong>
        <span>{block.action}</span>
      </div>

      {block.sourceLabel && (
        <small className="source-note">
          Source: {block.sourceHref ? <a href={block.sourceHref}>{block.sourceLabel}</a> : block.sourceLabel}
        </small>
      )}
    </article>
  );
}

function CampaignTable({
  campaigns,
}: {
  campaigns: CampaignIntelligence['campaigns'];
}) {
  return (
    <div className="users-table-wrap">
      <table className="users-table">
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Platform</th>
            <th>Status</th>
            <th>Spend</th>
            <th>CPA</th>
            <th>ROAS</th>
            <th>Issue</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td data-label="Campaign">
                <strong>{campaign.name}</strong>
              </td>
              <td data-label="Platform">{campaign.platform}</td>
              <td data-label="Status">
                <em className={`campaign-status ${campaign.status.toLowerCase()}`}>{campaign.status}</em>
              </td>
              <td data-label="Spend">{campaign.spend}</td>
              <td data-label="CPA">{campaign.cpa}</td>
              <td data-label="ROAS">{campaign.roas}</td>
              <td data-label="Issue">{campaign.issue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CampaignIntelligenceModule({ currentUser, intelligence, onBack, onLogout }: CampaignIntelligenceModuleProps) {
  const [selectedView, setSelectedView] = useState<IntelligenceViewKey>('overview');
  const [campaignScope, setCampaignScope] = useState<CampaignScope>('all');

  const channelSummaries = useMemo(
    () => intelligence.channelSummaries || buildFallbackChannelSummaries(intelligence),
    [intelligence],
  );
  const analysisBlocks = useMemo(
    () => intelligence.analysisBlocks || buildFallbackAnalysisBlocks(intelligence),
    [intelligence],
  );
  const visibleCampaigns = useMemo(
    () =>
      campaignScope === 'all'
        ? intelligence.campaigns
        : intelligence.campaigns.filter((campaign) => getCampaignScope(campaign.platform) === campaignScope),
    [campaignScope, intelligence.campaigns],
  );
  const selectedTab = viewTabs.find((tab) => tab.key === selectedView) || viewTabs[0];
  const googleSummary = channelSummaries.find((summary) => summary.platform === 'Google Ads');
  const metaSummary = channelSummaries.find((summary) => summary.platform === 'Meta Ads');
  const overviewBlocks = analysisBlocks.slice(0, 4);
  const googleBlocks = analysisBlocks.filter((block) => block.channel === 'Google Ads' || block.channel === 'Combined');
  const metaBlocks = analysisBlocks.filter((block) => block.channel === 'Meta Ads' || block.channel === 'Combined');
  const diagnosticsBlocks = analysisBlocks;
  const evidenceItems = intelligence.citations || [];

  return (
    <main className="intelligence-shell">
      <aside className="users-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark-small">
            <BarChart3 size={18} />
          </div>
          <div>
            <strong>AdOps Intelligence</strong>
            <span>Campaign health</span>
          </div>
        </div>

        <button className="new-chat-button" onClick={onBack} type="button">
          <ArrowLeft size={17} />
          Back to AI chat
        </button>

        <div className="sidebar-user-card">
          <span>{currentUser.role}</span>
          <strong>{currentUser.name}</strong>
          <small>{currentUser.email}</small>
        </div>

        <button className="sidebar-logout" onClick={onLogout} type="button">
          Logout
        </button>
      </aside>

      <section className="intelligence-main">
        <section className="dashboard-hero intelligence-hero">
          <div className="dashboard-hero-copy">
            <p>{intelligence.projectName}</p>
            <h1>Campaign Intelligence</h1>
            <span>{intelligence.summary}</span>
            <div className="hero-chip-row">
              <span>Last 30 days</span>
              <span>{intelligence.liveDataMode ? 'Live data' : 'Strategy fallback'}</span>
              <span>{channelSummaries.length} channel views</span>
              <span>{intelligence.campaigns.length} campaigns</span>
            </div>
          </div>

          <div className="dashboard-score-card">
            <p>Decision coverage</p>
            <strong>{intelligence.metrics[0]?.value || '87%'}</strong>
            <span>{intelligence.metrics[1]?.label || 'Cross-channel analysis'}</span>
          </div>
        </section>

        <div className="intelligence-kpi-grid">
          {intelligence.metrics.map((metric) => (
            <article className={`intelligence-kpi ${metric.status}`} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.delta}</small>
            </article>
          ))}
        </div>

        <div className="intelligence-tabs" role="tablist" aria-label="Campaign intelligence views">
          {viewTabs.map((tab) => (
            <button
              className={selectedView === tab.key ? 'intelligence-tab active' : 'intelligence-tab'}
              key={tab.key}
              onClick={() => setSelectedView(tab.key)}
              role="tab"
              aria-selected={selectedView === tab.key}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="intelligence-view-layout">
          <article className="intelligence-view-main">
            <div className="view-heading">
              <div>
                <p>{selectedTab.label}</p>
                <h2>{selectedTab.title}</h2>
              </div>
              <span>{selectedTab.subtitle}</span>
            </div>

            {selectedView === 'overview' && (
              <>
                <section className="channel-comparison-grid" aria-label="Channel comparison">
                  {channelSummaries.map((summary) => (
                    <ChannelSummaryCard key={summary.key} summary={summary} />
                  ))}
                </section>

                <section className="campaign-table-panel" aria-label="Campaign preview">
                  <div className="users-table-head">
                    <div>
                      <p>Campaign diagnostics</p>
                      <h2>Campaign performance</h2>
                    </div>
                    <span>{intelligence.campaigns.length} campaigns</span>
                  </div>
                  <CampaignTable campaigns={intelligence.campaigns.slice(0, 6)} />
                </section>

                <section className="analysis-grid" aria-label="Decision highlights">
                  {overviewBlocks.map((block) => (
                    <AnalysisBlockCard block={block} key={block.key} />
                  ))}
                </section>
              </>
            )}

            {selectedView === 'google' && (
              <>
                <section className="channel-focus-card">
                  <div className="channel-focus-head">
                    <div>
                      <p>Google Ads view</p>
                      <h3>Search intent and budget allocation</h3>
                    </div>
                    <span>{googleSummary?.campaignCount || 0} campaigns</span>
                  </div>
                  <p>{googleSummary?.summary || 'Google Ads is not configured, so the view falls back to strategy guidance.'}</p>
                  <div className="tag-row">
                    {(googleSummary?.focus || []).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </section>

                <section className="analysis-grid" aria-label="Google diagnostics">
                  {googleBlocks.map((block) => (
                    <AnalysisBlockCard block={block} key={block.key} />
                  ))}
                </section>

                <section className="campaign-table-panel" aria-label="Google campaigns">
                  <div className="users-table-head">
                    <div>
                      <p>Google Ads</p>
                      <h2>Campaign rows</h2>
                    </div>
                    <span>{intelligence.campaigns.filter((campaign) => campaign.platform === 'Google Ads').length} rows</span>
                  </div>
                  <CampaignTable campaigns={intelligence.campaigns.filter((campaign) => campaign.platform === 'Google Ads')} />
                </section>
              </>
            )}

            {selectedView === 'meta' && (
              <>
                <section className="channel-focus-card">
                  <div className="channel-focus-head">
                    <div>
                      <p>Meta Ads view</p>
                      <h3>Creative and audience diagnostics</h3>
                    </div>
                    <span>{metaSummary?.campaignCount || 0} campaigns</span>
                  </div>
                  <p>{metaSummary?.summary || 'Meta Ads is not configured, so the view falls back to strategy guidance.'}</p>
                  <div className="tag-row">
                    {(metaSummary?.focus || []).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </section>

                <section className="analysis-grid" aria-label="Meta diagnostics">
                  {metaBlocks.map((block) => (
                    <AnalysisBlockCard block={block} key={block.key} />
                  ))}
                </section>

                <section className="campaign-table-panel" aria-label="Meta campaigns">
                  <div className="users-table-head">
                    <div>
                      <p>Meta Ads</p>
                      <h2>Campaign rows</h2>
                    </div>
                    <span>{intelligence.campaigns.filter((campaign) => campaign.platform === 'Meta Ads').length} rows</span>
                  </div>
                  <CampaignTable campaigns={intelligence.campaigns.filter((campaign) => campaign.platform === 'Meta Ads')} />
                </section>
              </>
            )}

            {selectedView === 'campaigns' && (
              <>
                <section className="channel-focus-card">
                  <div className="channel-focus-head">
                    <div>
                      <p>Campaigns view</p>
                      <h3>Filter and compare the active campaign rows</h3>
                    </div>
                    <span>{visibleCampaigns.length} visible</span>
                  </div>
                  <p>Use channel filters to review spend, CPA, and ROAS without flattening the channel-specific story.</p>
                  <div className="scope-switch" aria-label="Campaign scope filters">
                    <button className={campaignScope === 'all' ? 'active' : ''} onClick={() => setCampaignScope('all')} type="button">
                      All
                    </button>
                    <button className={campaignScope === 'google_ads' ? 'active' : ''} onClick={() => setCampaignScope('google_ads')} type="button">
                      Google Ads
                    </button>
                    <button className={campaignScope === 'meta_ads' ? 'active' : ''} onClick={() => setCampaignScope('meta_ads')} type="button">
                      Meta Ads
                    </button>
                  </div>
                </section>

                <section className="campaign-table-panel" aria-label="Campaign diagnostics table">
                  <div className="users-table-head">
                    <div>
                      <p>Campaign diagnostics</p>
                      <h2>Campaign performance</h2>
                    </div>
                    <span>{visibleCampaigns.length} campaigns</span>
                  </div>
                  <CampaignTable campaigns={visibleCampaigns} />
                </section>
              </>
            )}

            {selectedView === 'diagnostics' && (
              <>
                <section className="analysis-grid diagnostics-grid" aria-label="Decision diagnostics">
                  {diagnosticsBlocks.map((block) => (
                    <AnalysisBlockCard block={block} key={block.key} />
                  ))}
                </section>

                <section className="campaign-table-panel" aria-label="Diagnostics table">
                  <div className="users-table-head">
                    <div>
                      <p>Campaign diagnostics</p>
                      <h2>Campaign performance</h2>
                    </div>
                    <span>{intelligence.campaigns.length} campaigns</span>
                  </div>
                  <CampaignTable campaigns={intelligence.campaigns.slice(0, 6)} />
                </section>
              </>
            )}

            {selectedView === 'evidence' && (
              <>
                <section className="evidence-grid">
                  <div className="citation-list evidence-panel" aria-label="Evidence sources">
                    <div className="users-table-head compact">
                      <div>
                        <p>Evidence</p>
                        <h2>Source citations</h2>
                      </div>
                    </div>

                    {(evidenceItems.length > 0 ? evidenceItems : []).map((citation) => (
                      <article className="citation-item" key={citation.label}>
                        <ExternalLink size={16} />
                        <div>
                          <a href={citation.href} rel="noreferrer" target="_blank">
                            {citation.label}
                          </a>
                          <span>{citation.detail}</span>
                        </div>
                        <em>{citation.kind}</em>
                      </article>
                    ))}
                  </div>

                  <div className="source-list evidence-panel">
                    {(intelligence.sources && intelligence.sources.length > 0
                      ? intelligence.sources
                      : sourceHealth.map((source) => ({
                          source: source.label,
                          detail: source.status,
                          available: source.status !== 'Not configured',
                        }))
                    ).map((source) => {
                      const sourceIcon =
                        source.source === 'Google Ads MCP'
                          ? BarChart3
                          : source.source === 'Meta Marketing API'
                            ? Radar
                            : source.source === 'Forecast confidence'
                              ? TriangleAlert
                              : ShieldCheck;
                      const Icon = sourceIcon;

                      return (
                        <article key={source.source}>
                          <Icon size={18} />
                          <div>
                            <strong>{source.source}</strong>
                            <span>{source.available ? source.detail : 'Unavailable'}</span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </article>

          <aside className="intelligence-view-rail">
            <div className="insight-card">
              <TrendingDown size={18} />
              <h2>{intelligence.insight.title}</h2>
              <p>{intelligence.insight.detail}</p>
              <span>Current view: {selectedTab.title}</span>
            </div>

            <div className="alert-list" aria-label="Campaign alerts">
              {intelligence.alerts.map((alert) => (
                <article className={`campaign-alert ${alert.severity}`} key={alert.label}>
                  <Bell size={16} />
                  <div>
                    <strong>{alert.label}</strong>
                    <p>{alert.detail}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="recommendation-band compact-band">
              <div className="users-table-head">
                <div>
                  <p>Next moves</p>
                  <h2>Recommended actions</h2>
                </div>
                <span>{recommendations.length} actions</span>
              </div>

              <div className="recommendation-list compact-recommendation-list">
                {recommendations.map((item) => (
                  <article className="recommendation-row" key={item.id}>
                    <div className={`platform-dot ${item.platform === 'Google Ads' ? 'google' : 'meta'}`} />
                    <div>
                      <div className="row-title">
                        <strong>{item.title}</strong>
                        <span>{item.risk} risk</span>
                      </div>
                      <p>{item.reason}</p>
                      <div className="action-line">
                        <strong>Action</strong>
                        <span>{item.action}</span>
                      </div>
                      <div className="pill-row">
                        <span className={`confidence-${item.confidence.toLowerCase()}`}>{item.confidence} confidence</span>
                        <span>{item.impact}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="source-list">
              {(intelligence.sources && intelligence.sources.length > 0
                ? intelligence.sources
                : sourceHealth.map((source) => ({
                    source: source.label,
                    detail: source.status,
                    available: source.status !== 'Not configured',
                  }))
              ).map((source) => {
                const Icon = source.source === 'Google Ads MCP' ? BarChart3 : source.source === 'Meta Marketing API' ? Radar : TriangleAlert;

                return (
                  <article key={source.source}>
                    <Icon size={18} />
                    <div>
                      <strong>{source.source}</strong>
                      <span>{source.available ? source.detail : 'Unavailable'}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
