import { useMemo, useState } from 'react';
import {
  architectureRows,
  capabilityCards,
  intakeQuestions,
  planSections,
} from '../data/strategy';

export function CampaignArchitect() {
  const [selectedQuestion, setSelectedQuestion] = useState(0);

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

  function exportCampaignBook() {
    window.print();
  }

  return (
    <section className="architect-grid">
      <div className="planner-main">
        <div className="module-hero">
          <p>Campaign Architect</p>
          <h2>Build a media plan and campaign book before launch</h2>
          <span>
            The AI asks for business context, pulls platform data where available, then creates a build-ready plan for
            Google Ads and Meta Ads.
          </span>
          <div className="hero-actions">
            <button type="button">Start guided intake</button>
            <button className="secondary" onClick={exportCampaignBook} type="button">
              Export PDF
            </button>
          </div>
        </div>

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
              <h2>Recommended platform structure</h2>
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
