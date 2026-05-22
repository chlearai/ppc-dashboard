import { ArrowLeft, BarChart3, Bell, LineChart, Target, TrendingDown } from 'lucide-react';
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
        <header className="users-header">
          <div>
            <p>{intelligence.projectName}</p>
            <h1>Campaign Intelligence Dashboard</h1>
          </div>
          <span className="sync-pill">
            <LineChart size={15} />
            Last 7 days
          </span>
        </header>

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
          </aside>
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
