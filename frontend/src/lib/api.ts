export type ChatMode = 'Ask' | 'Act';

export type Project = {
  id: string;
  name: string;
  status: string;
  health?: string;
  monthlySpend?: string;
  owner?: string;
  connectors?: Connector[];
};

export type Connector = {
  id: string;
  label: string;
  status: string;
  detail: string;
  mode: string;
};

export type Chat = {
  id: string;
  projectId: string;
  title: string;
};

export type CampaignFinding = {
  finding: string;
  evidence: string;
  suggestion: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  mode?: ChatMode;
  content: string;
  table?: CampaignFinding[];
};

export type Approval = {
  id: string;
  projectId: string;
  title: string;
  status: string;
  risk: string;
  expectedImpact: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  projectAccess: string[];
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type IntelligenceMetric = {
  label: string;
  value: string;
  delta: string;
  status: 'good' | 'watch' | 'risk';
};

export type PlatformMetric = {
  platform: string;
  spend: string;
  roas: string;
  cpl: string;
  signal: string;
};

export type CampaignRow = {
  id: string;
  name: string;
  platform: string;
  status: string;
  spend: string;
  cpa: string;
  roas: string;
  issue: string;
};

export type CampaignInsight = {
  title: string;
  detail: string;
};

export type CampaignAlert = {
  label: string;
  severity: 'high' | 'medium' | 'low';
  detail: string;
};

export type CampaignIntelligence = {
  projectId: string;
  projectName: string;
  summary: string;
  metrics: IntelligenceMetric[];
  platforms: PlatformMetric[];
  campaigns: CampaignRow[];
  insight: CampaignInsight;
  alerts: CampaignAlert[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8787';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) =>
    request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getCurrentUser: (token: string) =>
    request<{ user: User }>('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getUsers: (token: string) =>
    request<{ users: User[] }>('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getProjects: () => request<{ projects: Project[] }>('/api/projects'),
  getCampaignIntelligence: (projectId: string) =>
    request<{ intelligence: CampaignIntelligence }>(`/api/campaign-intelligence?projectId=${projectId}`),
  getChats: (projectId: string) => request<{ chats: Chat[] }>(`/api/chats?projectId=${projectId}`),
  getConnectors: (projectId: string) => request<{ connectors: Connector[] }>(`/api/connectors?projectId=${projectId}`),
  getMessages: () => request<{ messages: ChatMessage[] }>('/api/messages'),
  getApprovals: (projectId: string) =>
    request<{ approvals: Approval[] }>(`/api/approvals?projectId=${projectId}`),
  sendMessage: (message: string, mode: ChatMode) =>
    request<{
      mode: ChatMode;
      content: string;
      table?: CampaignFinding[];
      approvalRequired?: boolean;
      proposedActions?: Approval[];
    }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, mode }),
    }),
};
