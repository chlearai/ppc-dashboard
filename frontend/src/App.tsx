import { useEffect, useState } from 'react';
import { CampaignArchitect } from './components/CampaignArchitect';
import { CampaignIntelligenceModule } from './components/CampaignIntelligenceModule';
import { LoginScreen } from './components/LoginScreen';
import { ProjectConnectorModule } from './components/ProjectConnectorModule';
import { RevenueChat } from './components/RevenueChat';
import { UserModule } from './components/UserModule';
import { api, AiAgentBrainConfig, CampaignIntelligence, Project, User } from './lib/api';

const SESSION_STORAGE_KEY = 'ppc-dashboard-workspace-session';

type WorkspaceSession = {
  token: string;
  user: User;
};

function App() {
  const [session, setSession] = useState<WorkspaceSession | null>(() => {
    const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!storedSession) return null;

    try {
      return JSON.parse(storedSession) as WorkspaceSession;
    } catch {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  });
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [intelligence, setIntelligence] = useState<CampaignIntelligence | null>(null);
  const [aiAgentBrains, setAiAgentBrains] = useState<Record<string, AiAgentBrainConfig>>({});
  const [activeModule, setActiveModule] = useState<'chat' | 'architect' | 'intelligence' | 'projects' | 'users'>('chat');
  const [loginError, setLoginError] = useState<string>();
  const [workspaceError, setWorkspaceError] = useState<string>();
  const sessionToken = session?.token;
  const selectedProject = selectedProjectId ? projects.find((project) => project.id === selectedProjectId) || null : null;
  const aiAgentBrain = selectedProjectId ? aiAgentBrains[selectedProjectId] || null : null;

  useEffect(() => {
    const activeToken = sessionToken;

    if (!activeToken) {
      setUsers([]);
      setProjects([]);
      setSelectedProjectId(null);
      setIntelligence(null);
      setAiAgentBrains({});
      setWorkspaceError(undefined);
      return;
    }

    let ignore = false;

    async function loadWorkspace(token: string) {
      try {
        const [currentUserResponse, usersResponse, projectsResponse] = await Promise.all([
          api.getCurrentUser(token),
          api.getUsers(token),
          api.getProjects(),
        ]);

        if (ignore) return;

        const firstProject = projectsResponse.projects[0] || null;
        const freshSession = { token, user: currentUserResponse.user };

        setSession(freshSession);
        setUsers(usersResponse.users);
        setProjects(projectsResponse.projects);
        setSelectedProjectId((current) => {
          if (current && projectsResponse.projects.some((project) => project.id === current)) {
            return current;
          }

          return firstProject?.id || null;
        });
        setWorkspaceError(undefined);
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(freshSession));
      } catch {
        if (ignore) return;
        setWorkspaceError('Unable to load workspace data from the backend.');
      }
    }

    loadWorkspace(activeToken);

    return () => {
      ignore = true;
    };
  }, [sessionToken]);

  useEffect(() => {
    if (!sessionToken || !selectedProjectId) return;

    let ignore = false;

    async function loadProjectWorkspace(projectId: string) {
      try {
        const [intelligenceResponse, brainResponse] = await Promise.all([
          api.getCampaignIntelligence(projectId),
          api.getAiAgentBrain(projectId),
        ]);

        if (ignore) return;

        setIntelligence(intelligenceResponse.intelligence);
        setAiAgentBrains((current) => ({
          ...current,
          [brainResponse.brain.projectId]: brainResponse.brain,
        }));
        setWorkspaceError(undefined);
      } catch {
        if (ignore) return;
        setWorkspaceError('Unable to load project data from the backend.');
      }
    }

    loadProjectWorkspace(selectedProjectId);

    return () => {
      ignore = true;
    };
  }, [selectedProjectId, sessionToken]);

  async function handleLogin(email: string, password: string) {
    setLoginError(undefined);

    try {
      const loginResponse = await api.login(email, password);
      const freshSession = { token: loginResponse.token, user: loginResponse.user };

      setSession(freshSession);
      setActiveModule('chat');
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(freshSession));
      return;
    } catch {
      setLoginError('Use the workspace account shown below to enter this workspace.');
    }
  }

  function handleLogout() {
    setSession(null);
    setActiveModule('chat');
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  async function handleBrainProviderChange(selectedProvider: string | null) {
    if (!selectedProjectId) return;

    const optimisticBrain = {
      ...(aiAgentBrains[selectedProjectId] || {
        projectId: selectedProjectId,
        id: 'ai_agent_brain',
        label: 'AI Agent Brain',
        status: 'Not configured',
        providerMode: 'provider_config_required',
        selectedProvider: null,
        providerOptions: ['Codex', 'Claude', 'OpenAI', 'Gemini', 'Custom agent endpoint'],
        responsibilities: [
          'MCP and connector data orchestration',
          'Ask mode campaign diagnosis',
          'Act mode action drafting',
          'Campaign Architect planning',
          'Campaign Intelligence explanations',
          'Approval queue reasoning and risk summaries',
        ],
      }),
      selectedProvider,
      status: selectedProvider ? `Configured with ${selectedProvider}` : 'Not configured',
    };

    setAiAgentBrains((current) => ({
      ...current,
      [selectedProjectId]: optimisticBrain,
    }));

    try {
      const response = await api.updateAiAgentBrain(selectedProjectId, selectedProvider);
      setAiAgentBrains((current) => ({
        ...current,
        [response.brain.projectId]: response.brain,
      }));
    } catch {
      // Keep the optimistic local update when the backend is unavailable.
    }
  }

  if (workspaceError && !selectedProjectId && sessionToken) {
    return (
      <main className="login-shell">
        <section className="login-panel" aria-label="Workspace loading error">
          <div className="login-copy">
            <h2>Workspace unavailable</h2>
            <p>{workspaceError}</p>
          </div>
          <button
            className="secondary"
            onClick={() => window.location.reload()}
            type="button"
          >
            Retry
          </button>
        </section>
      </main>
    );
  }

  if (!session) {
    return <LoginScreen error={loginError} onLogin={handleLogin} />;
  }

  if (activeModule === 'users') {
    if (users.length === 0) {
      return (
        <main className="login-shell">
          <section className="login-panel" aria-label="Workspace loading">
            <div className="login-copy">
              <h2>Loading workspace</h2>
              <p>{workspaceError || 'Fetching users from the backend.'}</p>
            </div>
          </section>
        </main>
      );
    }

    return (
      <UserModule
        currentUser={session.user}
        onBack={() => setActiveModule('chat')}
        onLogout={handleLogout}
        users={users}
      />
    );
  }

  if (activeModule === 'intelligence') {
    if (!intelligence) {
      return (
        <main className="login-shell">
          <section className="login-panel" aria-label="Workspace loading">
            <div className="login-copy">
              <h2>Loading workspace</h2>
              <p>{workspaceError || 'Fetching campaign intelligence from the backend.'}</p>
            </div>
          </section>
        </main>
      );
    }

    return (
      <CampaignIntelligenceModule
        currentUser={session.user}
        intelligence={intelligence}
        onBack={() => setActiveModule('chat')}
        onLogout={handleLogout}
      />
    );
  }

  if (activeModule === 'architect') {
    if (!selectedProject) {
      return (
        <main className="login-shell">
          <section className="login-panel" aria-label="Workspace loading">
            <div className="login-copy">
              <h2>Loading workspace</h2>
              <p>{workspaceError || 'Fetching project context from the backend.'}</p>
            </div>
          </section>
        </main>
      );
    }

    return (
      <CampaignArchitect
        currentUser={session.user}
        projectId={selectedProject.id}
        projectName={selectedProject.name}
        onBack={() => setActiveModule('chat')}
        onLogout={handleLogout}
      />
    );
  }

  if (activeModule === 'projects') {
    if (!selectedProject || !aiAgentBrain) {
      return (
        <main className="login-shell">
          <section className="login-panel" aria-label="Workspace loading">
            <div className="login-copy">
              <h2>Loading workspace</h2>
              <p>{workspaceError || 'Fetching connector state from the backend.'}</p>
            </div>
          </section>
        </main>
      );
    }

    return (
      <ProjectConnectorModule
        currentUser={session.user}
        brain={aiAgentBrain}
        onBack={() => setActiveModule('chat')}
        onLogout={handleLogout}
        onSelectProject={setSelectedProjectId}
        onUpdateBrainProvider={handleBrainProviderChange}
        projects={projects}
        selectedProject={selectedProject}
      />
    );
  }

  if (!selectedProject || !aiAgentBrain) {
    return (
      <main className="login-shell">
        <section className="login-panel" aria-label="Workspace loading">
          <div className="login-copy">
            <h2>Loading workspace</h2>
            <p>{workspaceError || 'Fetching project state from the backend.'}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <RevenueChat
      aiAgentBrain={aiAgentBrain}
      currentUser={session.user}
      onLogout={handleLogout}
      onOpenArchitect={() => setActiveModule('architect')}
      onOpenIntelligence={() => setActiveModule('intelligence')}
      onOpenProjects={() => setActiveModule('projects')}
      onOpenUsers={() => setActiveModule('users')}
    />
  );
}

export default App;
