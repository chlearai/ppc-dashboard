import { useEffect, useState } from 'react';
import { CampaignArchitect } from './components/CampaignArchitect';
import { CampaignIntelligenceModule } from './components/CampaignIntelligenceModule';
import { LoginScreen } from './components/LoginScreen';
import { ProjectConnectorModule } from './components/ProjectConnectorModule';
import { RevenueChat } from './components/RevenueChat';
import { UserModule } from './components/UserModule';
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_TOKEN, fallbackCurrentUser, fallbackUsers } from './data/demoAuth';
import { getFallbackIntelligence } from './data/demoIntelligence';
import { fallbackProjects, getFallbackAiAgentBrain } from './data/demoProjects';
import { api, AiAgentBrainConfig, CampaignIntelligence, Project, User } from './lib/api';

const SESSION_STORAGE_KEY = 'ppc-dashboard-demo-session';

type DemoSession = {
  token: string;
  user: User;
};

function App() {
  const [session, setSession] = useState<DemoSession | null>(() => {
    const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!storedSession) return null;

    try {
      return JSON.parse(storedSession) as DemoSession;
    } catch {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  });
  const [users, setUsers] = useState<User[]>(fallbackUsers);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(fallbackProjects[0].id);
  const [intelligence, setIntelligence] = useState<CampaignIntelligence>(getFallbackIntelligence(fallbackProjects[0].id));
  const [aiAgentBrains, setAiAgentBrains] = useState<Record<string, AiAgentBrainConfig>>(
    () =>
      Object.fromEntries(
        fallbackProjects.map((project) => [project.id, getFallbackAiAgentBrain(project.id)]),
      ) as Record<string, AiAgentBrainConfig>,
  );
  const [activeModule, setActiveModule] = useState<'chat' | 'architect' | 'intelligence' | 'projects' | 'users'>('chat');
  const [loginError, setLoginError] = useState<string>();
  const sessionToken = session?.token;
  const selectedProject = projects.find((project) => project.id === selectedProjectId) || projects[0];
  const aiAgentBrain = aiAgentBrains[selectedProjectId] || getFallbackAiAgentBrain(selectedProjectId);

  useEffect(() => {
    const activeToken = sessionToken;

    if (!activeToken) return;

    let ignore = false;

    async function loadUsers(token: string) {
      try {
        const [currentUserResponse, usersResponse, projectsResponse, intelligenceResponse, brainResponse] = await Promise.all([
          api.getCurrentUser(token),
          api.getUsers(token),
          api.getProjects(),
          api.getCampaignIntelligence(selectedProjectId),
          api.getAiAgentBrain(selectedProjectId),
        ]);

        if (ignore) return;

        const freshSession = { token, user: currentUserResponse.user };
        setSession(freshSession);
        setUsers(usersResponse.users);
        setProjects(projectsResponse.projects);
        setIntelligence(intelligenceResponse.intelligence);
        setAiAgentBrains((current) => ({
          ...current,
          [brainResponse.brain.projectId]: brainResponse.brain,
        }));
        setSelectedProjectId(
          (current) =>
            projectsResponse.projects.find((project) => project.id === current)?.id ||
            projectsResponse.projects[0]?.id ||
            fallbackProjects[0].id,
        );
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(freshSession));
      } catch {
        if (ignore) return;
        setUsers(fallbackUsers);
        setProjects(fallbackProjects);
        setIntelligence(getFallbackIntelligence(selectedProjectId));
      }
    }

    loadUsers(activeToken);

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
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const fallbackSession = { token: DEMO_TOKEN, user: fallbackCurrentUser };

        setSession(fallbackSession);
        setUsers(fallbackUsers);
        setProjects(fallbackProjects);
        setIntelligence(getFallbackIntelligence(fallbackProjects[0].id));
        setActiveModule('chat');
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(fallbackSession));
        return;
      }

      setLoginError('Use the demo account shown below to enter this workspace.');
    }
  }

  function handleLogout() {
    setSession(null);
    setActiveModule('chat');
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  async function handleBrainProviderChange(selectedProvider: string | null) {
    const optimisticBrain = {
      ...(aiAgentBrains[selectedProjectId] || getFallbackAiAgentBrain(selectedProjectId)),
      selectedProvider,
      status: selectedProvider ? `Configured with ${selectedProvider}` : 'Demo fallback active',
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

  if (!session) {
    return <LoginScreen error={loginError} onLogin={handleLogin} />;
  }

  if (activeModule === 'users') {
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
    return (
      <CampaignArchitect
        currentUser={session.user}
        projectId={selectedProjectId}
        projectName={selectedProject.name}
        onBack={() => setActiveModule('chat')}
        onLogout={handleLogout}
      />
    );
  }

  if (activeModule === 'projects') {
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
