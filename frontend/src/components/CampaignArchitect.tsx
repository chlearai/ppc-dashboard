import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Target } from 'lucide-react';
import {
  architectureRows,
  capabilityCards,
  executionChecklist,
  intelligenceMetrics,
  intakeQuestions,
  planSections,
  strategyRationale,
} from '../data/strategy';
import { api, AuditLog, CampaignBookVersion, User } from '../lib/api';

type CampaignArchitectProps = {
  currentUser?: User;
  projectId?: string;
  projectName?: string;
  onBack?: () => void;
  onLogout?: () => void;
};

function CampaignArchitectContent({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [campaignBooks, setCampaignBooks] = useState<CampaignBookVersion[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const activeQuestion = intakeQuestions[selectedQuestion];

  const confidenceSummary = useMemo(
    () => [
      { label: 'Search forecast', value: 'High', detail: 'Google Keyword Forecast Metrics' },
      { label: 'Meta conversion forecast', value: 'Medium', detail: 'Account data plus audience estimate' },
      { label: 'Creative fatigue estimate', value: 'Medium', detail: 'Historical frequency and CTR decay' },
      { label: 'Category assumptions', value: 'Low', detail: 'Used only when account data is missing' },
    ],
    [],
  );

  useEffect(() => {
    let ignore = false;

    async function loadRecords() {
      try {
        const [bookResponse, auditResponse] = await Promise.all([
          api.getCampaignBooks(projectId),
          api.getAuditLogs(projectId),
        ]);

        if (ignore) return;

        setCampaignBooks(bookResponse.campaignBooks);
        setAuditLogs(auditResponse.auditLogs);
      } catch {
        if (ignore) return;
        setCampaignBooks([]);
        setAuditLogs([]);
      }
    }

    loadRecords();

    return () => {
      ignore = true;
    };
  }, [projectId]);

  function exportCampaignBook() {
    window.print();
  }

  return (
    <section className="architect-grid">
      <section className="dashboard-hero architect-hero">
        <div className="dashboard-hero-copy">
          <p>Campaign Architect</p>
          <h1>{projectName}</h1>
          <span>
            Strategy an expert can trust. Execution a junior operator can follow. Built as a planning workspace with
            versioned campaign books, approval traceability, and clear forecast confidence.
          </span>
          <div className="hero-chip-row">
            <span>{campaignBooks.length} saved versions</span>
            <span>{auditLogs.length} audit events</span>
            <span>{intakeQuestions.length} intake prompts</span>
          </div>
        </div>

        <div className="dashboard-score-card">
          <p>Plan readiness</p>
          <strong>87%</strong>
          <span>Strong enough for launch review after the remaining data gaps are resolved.</span>
        </div>
      </section>

      <div className="planner-main">
        <div className="module-hero">
          <div>
            <p>Planning surface</p>
            <h2>Turn account signals into a build-ready campaign book.</h2>
            <span>
              Use the intake, forecast, and architecture tables to turn connected data into a clear plan for Google
              Ads and Meta Ads.
            </span>
            <div className="hero-actions">
              <button type="button">Start guided intake</button>
              <button className="secondary" onClick={exportCampaignBook} type="button">
                Export campaign book
              </button>
            </div>
          </div>

          <div className="strategy-score-card">
            <p>Strategy score</p>
            <strong>87%</strong>
            <span>Strong enough for launch review after 3 data gaps are resolved.</span>
          </div>
        </div>

        <section className="planning-metrics">
          <article>
            <p>Version history</p>
            <strong>{campaignBooks.length}</strong>
            <span>Saved campaign books</span>
          </article>
          <article>
            <p>Approval trail</p>
            <strong>{auditLogs.length}</strong>
            <span>Logged AI and human decisions</span>
          </article>
          <article>
            <p>Confidence gate</p>
            <strong>High</strong>
            <span>Forecast backed by connected data</span>
          </article>
          <article>
            <p>Export status</p>
            <strong>Ready</strong>
            <span>Print-ready campaign book layout</span>
          </article>
        </section>

        <section className="record-traceability">
          <div className="record-card">
            <div className="section-heading">
              <div>
                <p>Saved records</p>
                <h2>Saved campaign books</h2>
              </div>
              <span className="progress-pill">{campaignBooks.length} versions</span>
            </div>

            {campaignBooks.length > 0 ? (
              <div className="record-list">
                {campaignBooks.map((book) => (
                  <article className="record-item" key={book.id}>
                    <div className="record-item-head">
                      <strong>Version {book.version}</strong>
                      <span>{book.status}</span>
                    </div>
                    <h3>{book.title}</h3>
                    <p>{book.summary}</p>
                    <small>
                      Approved by {book.approvedBy}
                      {book.approvedByRole ? ` (${book.approvedByRole})` : ''}
                    </small>
                    <small>{book.source}</small>
                    <ul>
                      {book.approvedActions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-records">No saved campaign books yet.</p>
            )}
          </div>

          <div className="record-card">
            <div className="section-heading">
              <div>
                <p>Traceability</p>
                <h2>Audit trail</h2>
              </div>
            </div>

            {auditLogs.length > 0 ? (
              <div className="audit-list">
                {auditLogs.slice(0, 6).map((log) => (
                  <article className="audit-item" key={log.id}>
                    <div className="record-item-head">
                      <strong>{log.title}</strong>
                      <span>{log.eventType}</span>
                    </div>
                    <p>{log.detail}</p>
                    <small>
                      {log.actor}
                      {log.provider ? ` · ${log.provider}` : ''}
                    </small>
                    <small>{log.createdAt.replace('T', ' ').replace('Z', '')}</small>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-records">No audit events yet.</p>
            )}
          </div>
        </section>

        <section className="intelligence-grid" aria-label="Strategy intelligence summary">
          {intelligenceMetrics.map((metric) => (
            <article className={`intelligence-card grade-${metric.grade.toLowerCase()}`} key={metric.label}>
              <div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
              </div>
              <span>{metric.detail}</span>
              <em>{metric.grade}</em>
            </article>
          ))}
        </section>

        <section className="rationale-grid">
          {strategyRationale.map((item) => (
            <article key={item.label}>
              <p>{item.label}</p>
              <h3>{item.text}</h3>
            </article>
          ))}
        </section>

        <div className="intake-panel">
          <div className="section-heading">
            <div>
              <p>AI intake</p>
              <h2>Questions before planning</h2>
            </div>
            <span className="progress-pill">{selectedQuestion + 1} of {intakeQuestions.length}</span>
          </div>

          <div className="question-board">
            <div className="question-list">
              {intakeQuestions.map((question, index) => (
                <button
                  className={selectedQuestion === index ? 'question active' : 'question'}
                  key={question}
                  onClick={() => setSelectedQuestion(index)}
                  type="button"
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="question-detail">
              <p>Current question</p>
              <h3>{activeQuestion}</h3>
              <textarea
                aria-label="Answer current planning question"
                placeholder="Type the client answer or let AI fill from connected data..."
              />
            </div>
          </div>
        </div>

        <div className="architecture-panel">
          <div className="section-heading">
            <div>
              <p>Campaign architecture</p>
              <h2>Build-ready structure with expert logic</h2>
            </div>
          </div>

          <div className="architecture-table">
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Campaign</th>
                  <th>Objective</th>
                  <th>Structure</th>
                  <th>Targeting</th>
                  <th>Creative</th>
                  <th>Budget</th>
                </tr>
              </thead>
              <tbody>
                {architectureRows.map((row) => (
                  <tr key={`${row.platform}-${row.campaign}`}>
                    <td>{row.platform}</td>
                    <td>{row.campaign}</td>
                    <td>{row.objective}</td>
                    <td>{row.structure}</td>
                    <td>{row.targeting}</td>
                    <td>{row.creative}</td>
                    <td>{row.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <section className="execution-panel">
          <div className="section-heading">
            <div>
              <p>Operator handoff</p>
              <h2>Junior-safe execution steps</h2>
            </div>
          </div>
          <ol>
            {executionChecklist.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </div>

      <aside className="planner-side">
        <div className="capability-stack">
          {capabilityCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title}>
                <Icon size={18} />
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="forecast-box">
          <p>Simulation readiness</p>
          <h2>Forecast confidence</h2>
          {confidenceSummary.map((item) => (
            <div className="confidence-row" key={item.label}>
              <div>
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </div>
              <em>{item.value}</em>
            </div>
          ))}
        </div>
      </aside>

      <section className="campaign-book">
        <div className="section-heading">
          <div>
            <p>Final deliverable</p>
            <h2>Campaign book sections</h2>
          </div>
        </div>
        <div className="book-grid">
          {planSections.map((section) => (
            <article key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.summary}</p>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export function CampaignArchitect({ currentUser, projectId, projectName, onBack, onLogout }: CampaignArchitectProps) {
  const activeProjectId = projectId || 'project_crystal_hues';
  const activeProjectName = projectName || 'Campaign Architect';

  if (!currentUser || !onBack || !onLogout) {
    return <CampaignArchitectContent projectId={activeProjectId} projectName={activeProjectName} />;
  }

  return (
    <main className="intelligence-shell">
      <aside className="users-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark-small">
            <Target size={18} />
          </div>
          <div>
            <strong>AdOps Intelligence</strong>
            <span>Campaign planning</span>
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
        <CampaignArchitectContent projectId={activeProjectId} projectName={activeProjectName} />
      </section>
    </main>
  );
}
