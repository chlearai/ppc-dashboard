import { useEffect, useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { RevenueChat } from './components/RevenueChat';
import { UserModule } from './components/UserModule';
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_TOKEN, fallbackCurrentUser, fallbackUsers } from './data/demoAuth';
import { api, User } from './lib/api';

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
  const [activeModule, setActiveModule] = useState<'chat' | 'users'>('chat');
  const [loginError, setLoginError] = useState<string>();
  const sessionToken = session?.token;

  useEffect(() => {
    const activeToken = sessionToken;

    if (!activeToken) return;

    let ignore = false;

    async function loadUsers(token: string) {
      try {
        const [currentUserResponse, usersResponse] = await Promise.all([
          api.getCurrentUser(token),
          api.getUsers(token),
        ]);

        if (ignore) return;

        const freshSession = { token, user: currentUserResponse.user };
        setSession(freshSession);
        setUsers(usersResponse.users);
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(freshSession));
      } catch {
        if (ignore) return;
        setUsers(fallbackUsers);
      }
    }

    loadUsers(activeToken);

    return () => {
      ignore = true;
    };
  }, [sessionToken]);

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

  return (
    <RevenueChat currentUser={session.user} onLogout={handleLogout} onOpenUsers={() => setActiveModule('users')} />
  );
}

export default App;
