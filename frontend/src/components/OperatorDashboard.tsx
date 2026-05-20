import { approvalActions, kpiCards, recommendations, sourceHealth } from '../data/strategy';

function toneClass(value: string) {
  return value.toLowerCase();
}

export function OperatorDashboard() {
  return (
    <>
      <section className="kpi-strip" aria-label="SaaS command metrics">
        {kpiCards.map((card) => {
          const Icon = card.icon;

          return (
            <article className="kpi-tile" key={card.label}>
              <Icon size={20} />
              <div>
                <p>{card.label}</p>
                <strong>{card.value}</strong>
                <span>{card.note}</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="workspace-grid">
        <div className="work-surface">
          <div className="section-heading">
            <div>
              <p>AI operator</p>
              <h2>Today&apos;s decisions</h2>
            </div>
            <button type="button">Review all</button>
          </div>

          <div className="recommendation-list">
            {recommendations.map((item) => (
              <article className="recommendation-row" key={item.id}>
                <div className={`platform-dot ${item.platform === 'Google Ads' ? 'google' : 'meta'}`} />
                <div>
                  <div className="row-title">
                    <h3>{item.title}</h3>
                    <span>{item.platform}</span>
                  </div>
                  <p>{item.reason}</p>
                  <div className="action-line">
                    <strong>Action</strong>
                    <span>{item.action}</span>
                  </div>
                  <div className="pill-row">
                    <span className="pill">Impact: {item.impact}</span>
                    <span className={`pill risk-${toneClass(item.risk)}`}>Risk: {item.risk}</span>
                    <span className={`pill confidence-${toneClass(item.confidence)}`}>
                      Confidence: {item.confidence}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="side-panel">
          <div className="section-heading compact">
            <div>
              <p>Setup</p>
              <h2>Connector readiness</h2>
            </div>
          </div>

          <div className="source-list">
            {sourceHealth.map((source) => {
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

          <div className="approval-box">
            <p>Approval queue</p>
            <h3>4 pending actions</h3>
            <ul>
              {approvalActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
