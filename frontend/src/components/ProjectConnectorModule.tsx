import { ArrowLeft, CheckCircle2, ExternalLink, PlugZap, Plus, Settings } from 'lucide-react';
import { AiAgentBrainConfig, Connector, Project, User } from '../lib/api';

type ProjectConnectorModuleProps = {
  brain: AiAgentBrainConfig;
  currentUser: User;
  onBack: () => void;
  onLogout: () => void;
  onSelectProject: (projectId: string) => void;
  onUpdateBrainProvider: (selectedProvider: string | null) => void;
  projects: Project[];
  selectedProject: Project;
};

function formatStatus(status: string) {
  return status.replace(/_/g, ' ');
}

function countConnectors(project: Project) {
  return project.connectors?.length || 0;
}

function ProjectConnectorCard({
  brain,
  connector,
  onUpdateBrainProvider,
}: {
  brain: AiAgentBrainConfig;
  connector: Connector;
  onUpdateBrainProvider: (selectedProvider: string | null) => void;
}) {
  const isBrainConnector = connector.id === 'ai_agent_brain';
  const selectedProvider = brain.selectedProvider;
  const currentStatus = isBrainConnector && selectedProvider ? `Configured with ${selectedProvider}` : connector.status;
  const detail = isBrainConnector ? connector.detail : connector.detail;

  return (
    <article className="project-connector-card">
      <div>
        <PlugZap size={18} />
        <strong>{connector.label}</strong>
      </div>
      <span>{formatStatus(currentStatus)}</span>
      <p>{detail}</p>
      <em>{formatStatus(connector.mode)}</em>
      {isBrainConnector && (
        <div className="brain-provider-picker" aria-label="AI Agent Brain provider options">
          <div className="brain-provider-current">
            <strong>Current provider</strong>
            <span>{selectedProvider || 'No provider selected'}</span>
          </div>
          <div className="brain-provider-grid">
            {brain.providerOptions.map((provider) => (
              <button
                aria-pressed={selectedProvider === provider}
                className={selectedProvider === provider ? 'brain-provider-button active' : 'brain-provider-button'}
                key={provider}
                onClick={() => onUpdateBrainProvider(provider)}
                type="button"
              >
                {provider}
              </button>
            ))}
            <button
              aria-pressed={selectedProvider === null}
              className={selectedProvider === null ? 'brain-provider-button active' : 'brain-provider-button'}
              onClick={() => onUpdateBrainProvider(null)}
              type="button"
            >
              Demo fallback
            </button>
          </div>
        </div>
      )}
      <button className="ghost-button" type="button">
        Configure
        <ExternalLink size={15} />
      </button>
    </article>
  );
}

export function ProjectConnectorModule({
  brain,
  currentUser,
  onBack,
  onLogout,
  onSelectProject,
  onUpdateBrainProvider,
  projects,
  selectedProject,
}: ProjectConnectorModuleProps) {
  const selectedConnectors = selectedProject.connectors || [];
  const connectedConnectorCount = projects.reduce((total, project) => total + countConnectors(project), 0);

  return (
    <main className="projects-shell">
      <aside className="users-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark-small">
            <Settings size={18} />
          </div>
          <div>
            <strong>AdOps Intelligence</strong>
            <span>Project setup</span>
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

      <section className="projects-main">
        <header className="users-header">
          <div>
            <p>Workspace setup</p>
            <h1>Project & Connector Management</h1>
          </div>
          <button type="button">
            <Plus size={16} />
            Create project
          </button>
        </header>

        <div className="project-summary-grid">
          <article>
            <CheckCircle2 size={18} />
            <span>Projects</span>
            <strong>{projects.length}</strong>
          </article>
          <article>
            <PlugZap size={18} />
            <span>Configured connectors</span>
            <strong>{connectedConnectorCount}</strong>
          </article>
          <article>
            <Settings size={18} />
            <span>Needs setup</span>
            <strong>{projects.filter((project) => countConnectors(project) === 0).length}</strong>
          </article>
        </div>

        <section className="project-management-grid">
          <div className="project-directory" aria-label="Projects">
            <div className="users-table-head">
              <div>
                <p>Client workspaces</p>
                <h2>Projects</h2>
              </div>
              <span>{projects.length} projects</span>
            </div>

            <div className="project-management-list">
              {projects.map((project) => (
                <button
                  className={selectedProject.id === project.id ? 'management-project active' : 'management-project'}
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  type="button"
                >
                  <strong>{project.name}</strong>
                  <span>{project.status}</span>
                  <small>{project.health}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="connector-management-panel" aria-label="Connector management">
            <div className="users-table-head">
              <div>
                <p>{selectedProject.status}</p>
                <h2>{selectedProject.name} connectors</h2>
              </div>
              <span>{countConnectors(selectedProject)} connectors</span>
            </div>

            <div className="project-meta-strip">
              <span>Owner: {selectedProject.owner}</span>
              <span>Spend: {selectedProject.monthlySpend}</span>
              <span>Health: {selectedProject.health}</span>
            </div>

            {selectedConnectors.length > 0 ? (
              <div className="project-connector-grid">
                {selectedConnectors.map((connector) => (
                  <ProjectConnectorCard
                    brain={brain}
                    connector={connector}
                    key={connector.id}
                    onUpdateBrainProvider={onUpdateBrainProvider}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-connectors">
                <PlugZap size={22} />
                <strong>No connectors configured</strong>
                <p>Add Google Ads, Meta Ads, website context, or MCP/API tools before AI actions can run.</p>
                <button type="button">
                  <Plus size={16} />
                  Add connector
                </button>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
