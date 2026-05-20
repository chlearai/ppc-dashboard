import { useState } from 'react';
import {
  Check,
  ChevronDown,
  DatabaseZap,
  ExternalLink,
  Globe,
  MessageSquarePlus,
  MoreHorizontal,
  Plus,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { chatPrompts } from '../data/strategy';

type ChatMode = 'Ask' | 'Act';

const projects = [
  { name: 'Crystal Hues PPC', status: 'Google + Meta connected' },
  { name: 'Demo Ecommerce', status: 'Meta connected' },
  { name: 'Lead Gen Test', status: 'Needs connectors' },
];

const chats = [
  'Why did CPA increase this week?',
  'Find wasted spend',
  'Scale winning campaigns',
  'Create campaign plan',
];

const tools = [
  { label: 'Google Ads', status: 'Connected', detail: 'Read + draft actions', icon: DatabaseZap },
  { label: 'Meta Ads', status: 'Connected', detail: 'Read + draft actions', icon: DatabaseZap },
  { label: 'Website', status: 'Connected', detail: 'Landing page context', icon: Globe },
  { label: 'MCP/API', status: 'Project scoped', detail: 'Google Ads MCP, Meta API, custom tools', icon: Settings },
];

export function RevenueChat() {
  const [mode, setMode] = useState<ChatMode>('Ask');
  const [draft, setDraft] = useState(chatPrompts[0].prompt);
  const [showSetup, setShowSetup] = useState(false);

  return (
    <main className="chatgpt-shell">
      <aside className="chatgpt-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark-small">
            <Sparkles size={18} />
          </div>
          <div>
            <strong>AdOps Intelligence</strong>
            <span>Campaign AI workspace</span>
          </div>
        </div>

        <button className="new-chat-button" type="button">
          <MessageSquarePlus size={17} />
          New chat
        </button>

        <section className="sidebar-section">
          <div className="sidebar-section-title">
            <span>Projects</span>
            <button type="button" aria-label="Create project">
              <Plus size={15} />
            </button>
          </div>

          <div className="project-list">
            {projects.map((project, index) => (
              <button className={index === 0 ? 'project-item active' : 'project-item'} key={project.name} type="button">
                <span>{project.name}</span>
                <small>{project.status}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="sidebar-section">
          <div className="sidebar-section-title">
            <span>Recent chats</span>
          </div>

          <div className="chat-history">
            {chats.map((chat) => (
              <button key={chat} type="button">
                {chat}
              </button>
            ))}
          </div>
        </section>
      </aside>

      <section className="chatgpt-main">
        <header className="chatgpt-header">
          <button className="project-selector" type="button">
            Crystal Hues PPC
            <ChevronDown size={16} />
          </button>

          <div className="mode-switch">
            {(['Ask', 'Act'] as ChatMode[]).map((item) => (
              <button className={mode === item ? 'active' : ''} key={item} onClick={() => setMode(item)} type="button">
                {item}
              </button>
            ))}
          </div>

          <button
            className={showSetup ? 'header-icon active' : 'header-icon'}
            onClick={() => setShowSetup((current) => !current)}
            type="button"
            aria-label="Project settings"
          >
            <MoreHorizontal size={18} />
          </button>
        </header>

        <div className="tool-strip" aria-label="Connected project tools">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <span key={tool.label}>
                <Icon size={15} />
                {tool.label}
                <em>{tool.status}</em>
              </span>
            );
          })}
        </div>

        {showSetup && (
          <section className="project-setup-panel" aria-label="Project setup">
            <div className="project-setup-head">
              <div>
                <p>Project setup</p>
                <h2>Connect tools for Crystal Hues PPC</h2>
                <span>Each project keeps its own Google Ads, Meta Ads, MCP, API, website, and context settings.</span>
              </div>
              <button type="button">
                Create new project
                <Plus size={16} />
              </button>
            </div>

            <div className="connector-grid">
              {tools.map((tool) => {
                const Icon = tool.icon;

                return (
                  <article key={tool.label}>
                    <div>
                      <Icon size={18} />
                      <strong>{tool.label}</strong>
                    </div>
                    <span>{tool.status}</span>
                    <p>{tool.detail}</p>
                    <button className="ghost-button" type="button">
                      Configure
                      <ExternalLink size={15} />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section className="conversation">
          <div className="assistant-intro">
            <div className="assistant-orb">
              <Sparkles size={24} />
            </div>
            <h1>How can I help with your campaigns?</h1>
            <p>
              Ask mode reads connected campaigns and explains what is happening. Act mode prepares changes and asks for
              final approval before touching Google Ads or Meta Ads.
            </p>
          </div>

          <div className="message-row user-row">
            <div className="message-card user-card">{draft}</div>
          </div>

          <div className="message-row assistant-row">
            <div className="avatar">
              <Sparkles size={17} />
            </div>
            <div className="message-card assistant-card">
              <div className="mode-line">
                <span>{mode} mode</span>
                {mode === 'Act' && <em>Final approval required</em>}
              </div>

              {mode === 'Ask' ? (
                <>
                  <p>
                    I checked connected Google Ads and Meta Ads data. The largest issue is wasted spend from low-intent
                    search terms, followed by Meta prospecting creative fatigue.
                  </p>
                  <table className="answer-table">
                    <thead>
                      <tr>
                        <th>Finding</th>
                        <th>Evidence</th>
                        <th>Suggestion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Search waste</td>
                        <td>₹42.8k spend pool with weak conversion signal</td>
                        <td>Add negatives and isolate buying-intent ad groups</td>
                      </tr>
                      <tr>
                        <td>Meta fatigue</td>
                        <td>Frequency rising while CTR falls</td>
                        <td>Refresh proof and comparison creatives</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="response-actions">
                    <button onClick={() => setMode('Act')} type="button">
                      Switch to Act mode
                    </button>
                    <button className="ghost-button" type="button">
                      Show more evidence
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>I can prepare these changes. I will not execute anything until you approve the final list.</p>
                  <div className="approval-card">
                    <div>
                      <ShieldCheck size={18} />
                      <strong>Proposed actions</strong>
                    </div>
                    <ul>
                      <li>Add 14 negative keywords to Google Search.</li>
                      <li>Reduce fatigued Meta ad set budget by 12%.</li>
                      <li>Create a new creative test with proof, comparison, and objection hooks.</li>
                    </ul>
                    <button type="button">
                      <Check size={16} />
                      Review final approval
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <footer className="composer-area">
          <div className="suggestion-row">
            {chatPrompts.slice(0, 4).map((prompt) => (
              <button key={prompt.label} onClick={() => setDraft(prompt.prompt)} type="button">
                {prompt.label}
              </button>
            ))}
          </div>

          <div className="composer">
            <textarea
              aria-label="Message campaign assistant"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Message AdOps Intelligence..."
              value={draft}
            />
            <button type="button" aria-label="Send message">
              <Send size={18} />
            </button>
          </div>

          <p className="composer-note">
            Project tools are scoped per project. Act mode always asks for final approval before campaign changes.
          </p>
        </footer>
      </section>
    </main>
  );
}
