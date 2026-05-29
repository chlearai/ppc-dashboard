import { useEffect, useMemo, useState } from 'react';
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
  Target,
  LogOut,
  Users,
} from 'lucide-react';
import { chatPrompts } from '../data/strategy';
import { api, AiAgentBrainConfig, Approval, Chat, ChatMessage, ChatMode, Connector, Project, User } from '../lib/api';

type RevenueChatProps = {
  aiAgentBrain: AiAgentBrainConfig;
  currentUser: User;
  onLogout: () => void;
  onOpenArchitect: () => void;
  onOpenIntelligence: () => void;
  onOpenProjects: () => void;
  onOpenUsers: () => void;
};

export function RevenueChat({
  aiAgentBrain,
  currentUser,
  onLogout,
  onOpenArchitect,
  onOpenIntelligence,
  onOpenProjects,
  onOpenUsers,
}: RevenueChatProps) {
  const [mode, setMode] = useState<ChatMode>('Ask');
  const [draft, setDraft] = useState(chatPrompts[0].prompt);
  const [showSetup, setShowSetup] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [campaignBookNotice, setCampaignBookNotice] = useState<string>();
  const [apiStatus, setApiStatus] = useState<'loading' | 'live' | 'error'>('loading');
  const [workspaceError, setWorkspaceError] = useState<string>();

  const selectedProject = projects.find((project) => project.id === selectedProjectId) || null;
  const userMessage = messages.find((message) => message.role === 'user');
  const assistantMessage = messages.find((message) => message.role === 'assistant');
  const activeConnectors = connectors;

  const connectorIconMap = useMemo(
    () => ({
      google_ads: DatabaseZap,
      ai_agent_brain: Sparkles,
      meta_ads: DatabaseZap,
      meta_ads_mcp: Settings,
      website: Globe,
      mcp_api: Settings,
    }),
    [],
  );

  function formatStatus(status: string) {
    return status.replace(/_/g, ' ');
  }

  function openProjectSetup() {
    setShowSetup(true);
  }

  function startNewChat() {
    setMode('Ask');
    setDraft(chatPrompts[0].prompt);
    setShowSetup(false);
    setCampaignBookNotice(undefined);
  }

  useEffect(() => {
    let ignore = false;

    async function loadWorkspace() {
      try {
        const projectResponse = await api.getProjects();

        if (ignore) return;

        const firstProject = projectResponse.projects[0] || null;
        setProjects(projectResponse.projects);
        setSelectedProjectId(firstProject?.id || '');

        if (!firstProject) {
          setChats([]);
          setConnectors([]);
          setMessages([]);
          setApprovals([]);
          setApiStatus('error');
          setWorkspaceError('No projects are configured in the backend.');
          return;
        }

        const [chatResponse, connectorResponse, messageResponse, approvalResponse] = await Promise.all([
          api.getChats(firstProject.id),
          api.getConnectors(firstProject.id),
          api.getMessages(),
          api.getApprovals(firstProject.id),
        ]);

        if (ignore) return;

        setChats(chatResponse.chats);
        setConnectors(connectorResponse.connectors);
        setMessages(messageResponse.messages);
        setApprovals(approvalResponse.approvals);
        setApiStatus('live');
        setWorkspaceError(undefined);
      } catch {
        if (ignore) return;
        setApiStatus('error');
        setWorkspaceError('Unable to load chat data from the backend.');
      }
    }

    loadWorkspace();

    return () => {
      ignore = true;
    };
  }, []);

  async function selectProject(projectId: string) {
    const previousProjectId = selectedProjectId;
    setSelectedProjectId(projectId);
    setCampaignBookNotice(undefined);

    try {
      const [chatResponse, connectorResponse, approvalResponse] = await Promise.all([
        api.getChats(projectId),
        api.getConnectors(projectId),
        api.getApprovals(projectId),
      ]);
      setChats(chatResponse.chats);
      setConnectors(connectorResponse.connectors);
      setApprovals(approvalResponse.approvals);
      setApiStatus('live');
      setWorkspaceError(undefined);
    } catch {
      setSelectedProjectId(previousProjectId);
      setApiStatus('error');
      setWorkspaceError('Unable to switch projects from the backend.');
    }
  }

  async function approveAndSaveCampaignBook() {
    if (!selectedProject) return;

    const approvedActions =
      approvals.length > 0
        ? approvals.map((approval) => approval.title)
        : [
            'Add 14 negative keywords to Google Search.',
            'Reduce fatigued Meta ad set budget by 12%.',
            'Create a new creative test with proof, comparison, and objection hooks.',
          ];

    try {
      await api.saveCampaignBook({
        projectId: selectedProjectId,
        title: `${selectedProject.name} campaign book`,
        summary: 'Approved from Act mode',
        approvedBy: currentUser.name,
        approvedByRole: currentUser.role,
        approvedActions,
        source: 'Act mode',
        agentProvider: aiAgentBrain.selectedProvider,
      });
      setCampaignBookNotice('Campaign book saved');
      setApiStatus('live');
    } catch {
      setCampaignBookNotice('Campaign book save failed');
      setApiStatus('error');
      setWorkspaceError('Unable to save the campaign book to the backend.');
    }
  }

  async function sendMessage() {
    const currentDraft = draft.trim();

    if (!currentDraft) return;

    setMessages((current) => [
      ...current.filter((message) => message.role !== 'user'),
      { id: `msg_user_${Date.now()}`, role: 'user', content: currentDraft },
    ]);

    try {
      const response = await api.sendMessage(currentDraft, mode, selectedProjectId);
      setMessages((current) => [
        ...current.filter((message) => message.role !== 'assistant'),
        {
          id: `msg_assistant_${Date.now()}`,
          role: 'assistant',
          mode: response.mode,
          agentProvider: response.agentProvider,
          content: response.content,
          table: response.table,
        },
      ]);

      if (response.proposedActions) {
        setApprovals(response.proposedActions);
      }

      setApiStatus('live');
      setWorkspaceError(undefined);
    } catch {
      setApiStatus('error');
      setWorkspaceError('Unable to send messages to the backend.');
    }
  }

  if (!selectedProject) {
    return (
      <main className="chatgpt-shell">
        <section className="chatgpt-main">
          <div className="assistant-intro">
            <div className="assistant-orb">
              <Sparkles size={24} />
            </div>
            <h1>Loading workspace</h1>
            <p>{workspaceError || 'Fetching project and connector state from the backend.'}</p>
          </div>
        </section>
      </main>
    );
  }

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

        <button className="new-chat-button" onClick={startNewChat} type="button">
          <MessageSquarePlus size={17} />
          New chat
        </button>

        <button className="sidebar-nav-button" onClick={onOpenUsers} type="button">
          <Users size={17} />
          Users
        </button>

        <button className="sidebar-nav-button" onClick={onOpenIntelligence} type="button">
          <DatabaseZap size={17} />
          Campaign intelligence
        </button>

        <button className="sidebar-nav-button" onClick={onOpenArchitect} type="button">
          <Target size={17} />
          Campaign Architect
        </button>

        <button className="sidebar-nav-button" onClick={onOpenProjects} type="button">
          <Settings size={17} />
          Projects & connectors
        </button>

        <section className="sidebar-section">
          <div className="sidebar-section-title">
            <span>Projects</span>
            <button type="button" aria-label="Create project">
              <Plus size={15} />
            </button>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <button
                className={selectedProjectId === project.id ? 'project-item active' : 'project-item'}
                key={project.id}
                onClick={() => selectProject(project.id)}
                type="button"
              >
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
              <button
                key={chat.id}
                onClick={() => {
                  setMode('Ask');
                  setDraft(chat.title);
                  setShowSetup(false);
                }}
                type="button"
              >
                {chat.title}
              </button>
            ))}
          </div>
        </section>

        <section className="sidebar-account" aria-label="Signed in user">
          <div>
            <strong>{currentUser.name}</strong>
            <span>{currentUser.role}</span>
          </div>
          <button onClick={onLogout} type="button" aria-label="Logout">
            <LogOut size={16} />
          </button>
        </section>
      </aside>

      <section className="chatgpt-main">
        <header className="chatgpt-header">
          <button className="project-selector" onClick={openProjectSetup} type="button">
            {selectedProject.name}
            <ChevronDown size={16} />
          </button>

          <div className="mode-switch">
            {(['Ask', 'Act'] as ChatMode[]).map((item) => (
              <button className={mode === item ? 'active' : ''} key={item} onClick={() => setMode(item)} type="button">
                {item}
              </button>
            ))}
          </div>

          <span className="user-role-badge">{currentUser.role}</span>

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
          {activeConnectors.map((tool) => {
            const Icon = connectorIconMap[tool.id as keyof typeof connectorIconMap] || Settings;
            const selectedProvider = aiAgentBrain?.selectedProvider;
            const toolStatus =
              tool.id === 'ai_agent_brain'
                ? selectedProvider
                  ? `Configured with ${selectedProvider}`
                  : aiAgentBrain?.status || 'Not configured'
                : formatStatus(tool.status);

            return (
              <span key={tool.id}>
                <Icon size={15} />
                {tool.label}
                <em>{toolStatus}</em>
              </span>
            );
          })}
          <span>
            <Settings size={15} />
            API
            <em>{apiStatus}</em>
          </span>
        </div>

        {showSetup && (
          <section className="project-setup-panel" aria-label="Project setup">
            <div className="project-setup-head">
              <div>
                <p>Project setup</p>
                <h2>Connect tools for {selectedProject.name}</h2>
                <span>Each project keeps its own Google Ads, Meta Ads, MCP, API, website, and context settings.</span>
              </div>
              <button
                onClick={() => {
                  openProjectSetup();
                  onOpenProjects();
                }}
                type="button"
              >
                Create new project
                <Plus size={16} />
              </button>
            </div>

            <div className="connector-grid">
              {activeConnectors.map((tool) => {
                const Icon = connectorIconMap[tool.id as keyof typeof connectorIconMap] || Settings;

                return (
                  <article key={tool.id}>
                    <div>
                      <Icon size={18} />
                      <strong>{tool.label}</strong>
                    </div>
                    <span>{formatStatus(tool.status)}</span>
                    <p>{tool.detail}</p>
                    <button
                      className="ghost-button"
                      onClick={() => {
                        openProjectSetup();
                        onOpenProjects();
                      }}
                      type="button"
                    >
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
            <div className="message-card user-card">{userMessage?.content || draft}</div>
          </div>

          <div className="message-row assistant-row">
            <div className="avatar">
              <Sparkles size={17} />
            </div>
            <div className="message-card assistant-card">
              <div className="mode-line">
                <span>{mode} mode</span>
                {assistantMessage?.agentProvider && <em>{assistantMessage.agentProvider}</em>}
                {mode === 'Act' && <em>Final approval required</em>}
              </div>

              {mode === 'Ask' ? (
                <>
                  <p>
                    {assistantMessage?.content ||
                      'I checked connected Google Ads and Meta Ads data. The largest issue is wasted spend from low-intent search terms, followed by Meta prospecting creative fatigue.'}
                  </p>
                  {(assistantMessage?.table || []).length > 0 && (
                    <table className="answer-table">
                      <thead>
                        <tr>
                          <th>Finding</th>
                          <th>Evidence</th>
                          <th>Suggestion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(assistantMessage?.table || []).map((row) => (
                          <tr key={row.finding}>
                            <td>{row.finding}</td>
                            <td>{row.evidence}</td>
                            <td>{row.suggestion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div className="response-actions">
                    <button onClick={() => setMode('Act')} type="button">
                      Switch to Act mode
                    </button>
                    <button className="ghost-button" onClick={onOpenIntelligence} type="button">
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
                      {(approvals.length > 0
                        ? approvals.map((approval) => approval.title)
                        : [
                            'Add 14 negative keywords to Google Search.',
                            'Reduce fatigued Meta ad set budget by 12%.',
                            'Create a new creative test with proof, comparison, and objection hooks.',
                          ]
                      ).map((approval) => (
                        <li key={approval}>{approval}</li>
                      ))}
                    </ul>
                    <button onClick={() => setMode('Act')} type="button">
                      <Check size={16} />
                      Review final approval
                    </button>
                    <button className="secondary" onClick={approveAndSaveCampaignBook} type="button">
                      Approve and save campaign book
                    </button>
                    {campaignBookNotice && <p className="campaign-book-notice">{campaignBookNotice}</p>}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <footer className="composer-area">
          <div className="suggestion-row">
            {chatPrompts.slice(0, 4).map((prompt) => (
              <button
                key={prompt.label}
                onClick={() => {
                  setMode('Ask');
                  setDraft(prompt.prompt);
                }}
                type="button"
              >
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
            <button onClick={sendMessage} type="button" aria-label="Send message">
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
