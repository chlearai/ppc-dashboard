import { AiAgentBrainConfig, Project } from '../lib/api';

const aiAgentBrainProviderOptions = ['Codex', 'Claude', 'OpenAI', 'Gemini', 'Custom agent endpoint'];
const aiAgentBrainResponsibilities = [
  'MCP and connector data orchestration',
  'Ask mode campaign diagnosis',
  'Act mode action drafting',
  'Campaign Architect planning',
  'Campaign Intelligence explanations',
  'Approval queue reasoning and risk summaries',
];

export function getWorkspaceAiAgentBrain(projectId: string): AiAgentBrainConfig {
  return {
    projectId,
    id: 'ai_agent_brain',
    label: 'AI Agent Brain',
    status: 'Not configured',
    providerMode: 'provider_config_required',
    selectedProvider: null,
    providerOptions: aiAgentBrainProviderOptions,
    responsibilities: aiAgentBrainResponsibilities,
  };
}

export const workspaceProjects: Project[] = [
  {
    id: 'project_crystal_hues',
    name: 'Crystal Hues PPC',
    status: 'Google + Meta connected',
    health: 'Ready for AI actions',
    monthlySpend: '₹12.4L',
    owner: 'Shailesh Kumar',
    connectors: [
      {
        id: 'google_ads',
        label: 'Google Ads',
        status: 'connected',
        detail: 'Read + draft actions',
        mode: 'read_write_with_approval',
      },
      {
        id: 'ai_agent_brain',
        label: 'AI Agent Brain',
        status: 'Not configured',
        detail: 'Configure a provider or custom endpoint before AI actions can run',
        mode: 'provider_config_required',
      },
      {
        id: 'meta_ads',
        label: 'Meta Ads',
        status: 'connected',
        detail: 'Read + draft actions',
        mode: 'read_write_with_approval',
      },
      {
        id: 'meta_ads_mcp',
        label: 'Meta Ads MCP',
        status: 'Not configured',
        detail: 'Connect a vetted Meta Ads MCP endpoint',
        mode: 'configured_per_project',
      },
      { id: 'website', label: 'Website', status: 'connected', detail: 'Landing page context', mode: 'read_only' },
      {
        id: 'mcp_api',
        label: 'MCP/API',
        status: 'project_scoped',
        detail: 'Google Ads MCP, Meta Marketing API, custom tools',
        mode: 'configured_per_project',
      },
    ],
  },
  {
    id: 'project_ecommerce_growth',
    name: 'Ecommerce Growth',
    status: 'Meta connected',
    health: 'Needs Google Ads connection',
    monthlySpend: '₹4.8L',
    owner: 'Aarav Mehta',
    connectors: [
      {
        id: 'meta_ads',
        label: 'Meta Ads',
        status: 'connected',
        detail: 'Read + draft actions',
        mode: 'read_write_with_approval',
      },
      {
        id: 'ai_agent_brain',
        label: 'AI Agent Brain',
        status: 'Not configured',
        detail: 'Configure a provider or custom endpoint before AI actions can run',
        mode: 'provider_config_required',
      },
      {
        id: 'meta_ads_mcp',
        label: 'Meta Ads MCP',
        status: 'Not configured',
        detail: 'Connect a vetted Meta Ads MCP endpoint',
        mode: 'configured_per_project',
      },
    ],
  },
  {
    id: 'project_lead_gen_test',
    name: 'Lead Gen Test',
    status: 'Needs connectors',
    health: 'Setup incomplete',
    monthlySpend: 'Not synced',
    owner: 'Nisha Rao',
    connectors: [],
  },
];
