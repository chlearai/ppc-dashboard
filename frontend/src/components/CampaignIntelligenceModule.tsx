import { ArrowLeft, BarChart3, Bell, ExternalLink, Target, TrendingDown } from 'lucide-react';
import { recommendations, sourceHealth } from '../data/strategy';
import { CampaignIntelligence, User } from '../lib/api';

type CampaignIntelligenceModuleProps = {
  currentUser: User;
  intelligence: CampaignIntelligence;
  onBack: () => void;
  onLogout: () => void;
};

export function CampaignIntelligenceModule({
  currentUser,
  intelligence,
  onBack,
  onLogout,
}: CampaignIntelligenceModuleProps) {
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
            <h1>Campaign Intelligence Dashboard</h1>
            <span>{intelligence.summary}</span>
            <div className="hero-chip-row">
              <span>Last 7 days</span>
              <span>{intelligence.metrics[0]?.value || '87%'} confidence</span>
              <span>{intelligence.platforms.length} active platforms</span>
              {intelligence.liveDataMode && <span>Live data</span>}
            </div>
          </div>

          <div className="dashboard-score-card">
            <p>Intelligence score</p>
            <strong>{intelligence.metrics[0]?.value || '87%'}</strong>
            <span>{intelligence.summary}</span>
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

        <section className="intelligence-layout">
          <div className="platform-panel">
            <div className="users-table-head">
              <div>
                <p>Spend mix</p>
                <h2>Platform split</h2>
              </div>
              <span>{intelligence.platforms.length} sources</span>
            </div>

            <div className="platform-split-grid">
            {intelligence.platforms.map((platform) => (
              <article key={platform.platform}>
                <div>
                  <Target size={18} />
                  <strong>{platform.platform}</strong>
                  </div>
                  <dl>
                    <div>
                      <dt>Spend</dt>
                      <dd>{platform.spend}</dd>
                    </div>
                    <div>
                      <dt>ROAS</dt>
                      <dd>{platform.roas}</dd>
                    </div>
                    <div>
                      <dt>CPL</dt>
                      <dd>{platform.cpl}</dd>
                    </div>
                  </dl>
                  <p>{platform.signal}</p>
                  {platform.sourceLabel && (
                    <small className="source-note">
                      Source: {platform.sourceHref ? <a href={platform.sourceHref}>{platform.sourceLabel}</a> : platform.sourceLabel}
                    </small>
                  )}
                </article>
              ))}
            </div>
          </div>

          <aside className="insight-panel">
            <div className="insight-card">
              <TrendingDown size={18} />
              <h2>{intelligence.insight.title}</h2>
              <p>{intelligence.insight.detail}</p>
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

            <div className="source-list">
              {intelligence.sources && intelligence.sources.length > 0
                ? intelligence.sources.map((source) => (
                    <article key={source.source}>
                      <BarChart3 size={18} />
                      <div>
                        <strong>{source.source}</strong>
                        <span>{source.available ? source.detail : 'Unavailable'}</span>
                      </div>
                    </article>
                  ))
                : sourceHealth.map((source) => {
                    const Icon = source.icon;

                    return (
                      <article key={source.label}>
                        <Icon size={18} />
                        <div>
                          <strong>{source.label}</strong>
                          <span>{source.status}</span>
                        </div>
                      </article>
                    );
                  })}
            </div>

            {intelligence.citations && intelligence.citations.length > 0 && (
              <div className="citation-list" aria-label="Source citations">
                <div className="users-table-head compact">
                  <div>
                    <p>Evidence</p>
                    <h2>Source citations</h2>
                  </div>
                </div>

                {intelligence.citations.map((citation) => (
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
            )}
          </aside>
        </section>

        <section className="recommendation-band">
          <div className="users-table-head">
            <div>
              <p>Next moves</p>
              <h2>Recommended actions</h2>
            </div>
            <span>{recommendations.length} actions</span>
          </div>

          <div className="recommendation-list">
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
                  {item.sources && item.sources.length > 0 && (
                    <div className="citation-row">
                      {item.sources.map((source) => (
                        <a href={source.href} key={source.label} rel="noreferrer" target="_blank">
                          {source.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="campaign-table-panel" aria-label="Campaign table">
          <div className="users-table-head">
            <div>
              <p>Campaign diagnostics</p>
              <h2>Campaign performance</h2>
            </div>
            <span>{intelligence.campaigns.length} campaigns</span>
          </div>

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
                {intelligence.campaigns.map((campaign) => (
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
        </section>
      </section>
    </main>
  );
}
