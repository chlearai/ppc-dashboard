export type ChatMode = 'Ask' | 'Act';

export type Project = {
  id: string;
  name: string;
  status: string;
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
  getProjects: () => request<{ projects: Project[] }>('/api/projects'),
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
