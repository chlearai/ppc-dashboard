import http from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCampaignIntelligence, getIntegrationConfig } from './liveIntegrations.js';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 8787);
const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const STATE_FILE = join(DATA_DIR, 'runtime-state.json');

const workspaceSessionPrefix = 'workspace-session';

let users = [
  {
    id: 'user_admin',
    name: 'Shailesh Kumar',
    email: 'admin@adops.test',
    role: 'Workspace Admin',
    status: 'Active',
    lastActive: 'Today',
    projectAccess: ['Crystal Hues PPC', 'Ecommerce Growth', 'Lead Gen Test'],
    password: 'adops123!',
  },
  {
    id: 'user_media_buyer',
    name: 'Aarav Mehta',
    email: 'buyer@adops.test',
    role: 'Media Buyer',
    status: 'Active',
    lastActive: 'Yesterday',
    projectAccess: ['Crystal Hues PPC', 'Ecommerce Growth'],
    password: 'adops123!',
  },
  {
    id: 'user_analyst',
    name: 'Nisha Rao',
    email: 'analyst@adops.test',
    role: 'Analyst',
    status: 'Invited',
    lastActive: 'Invitation pending',
    projectAccess: ['Crystal Hues PPC'],
    password: 'adops123!',
  },
];

let projects = [
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
      {
        id: 'website',
        label: 'Website',
        status: 'connected',
        detail: 'Landing page context',
        mode: 'read_only',
      },
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

let chats = [
  {
    id: 'chat_cpa_increase',
    projectId: 'project_crystal_hues',
    title: 'Why did CPA increase this week?',
  },
  {
    id: 'chat_wasted_spend',
    projectId: 'project_crystal_hues',
    title: 'Find wasted spend',
  },
  {
    id: 'chat_scale_winners',
    projectId: 'project_crystal_hues',
    title: 'Scale winning campaigns',
  },
  {
    id: 'chat_campaign_plan',
    projectId: 'project_crystal_hues',
    title: 'Create campaign plan',
  },
];

let messages = [
  {
    id: 'msg_user_1',
    role: 'user',
    content: 'Where are we wasting spend and what exact actions will recover revenue this week?',
  },
  {
    id: 'msg_assistant_1',
    role: 'assistant',
    mode: 'Ask',
    content:
      'I checked connected Google Ads and Meta Ads data. The largest issue is wasted spend from low-intent search terms, followed by Meta prospecting creative fatigue.',
    table: [
      {
        finding: 'Search waste',
        evidence: '₹42.8k spend pool with weak conversion signal',
        suggestion: 'Add negatives and isolate buying-intent ad groups',
      },
      {
        finding: 'Meta fatigue',
        evidence: 'Frequency rising while CTR falls',
        suggestion: 'Refresh proof and comparison creatives',
      },
    ],
  },
];

let approvals = [
  {
    id: 'approval_negative_keywords',
    projectId: 'project_crystal_hues',
    title: 'Add 14 negative keywords to Google Search',
    status: 'draft',
    risk: 'low',
    expectedImpact: 'Reduce wasted search spend this week',
  },
  {
    id: 'approval_meta_budget',
    projectId: 'project_crystal_hues',
    title: 'Reduce fatigued Meta ad set budget by 12%',
    status: 'draft',
    risk: 'medium',
    expectedImpact: 'Stop compounding CPA increase while new creatives are tested',
  },
];

const aiAgentBrainProviderOptions = ['Codex', 'Claude', 'OpenAI', 'Gemini', 'Custom agent endpoint'];
const aiAgentBrainResponsibilities = [
  'MCP and connector data orchestration',
  'Ask mode campaign diagnosis',
  'Act mode action drafting',
  'Campaign Architect planning',
  'Campaign Intelligence explanations',
  'Approval queue reasoning and risk summaries',
];

let auditLogsByProject = Object.fromEntries(projects.map((project) => [project.id, []]));
let campaignBooksByProject = Object.fromEntries(projects.map((project) => [project.id, []]));
let aiAgentBrainStateByProject = Object.fromEntries(
  projects.map((project) => [
    project.id,
    {
      projectId: project.id,
      id: 'ai_agent_brain',
      label: 'AI Agent Brain',
      selectedProvider: null,
      providerMode: 'provider_config_required',
      providerOptions: aiAgentBrainProviderOptions,
      responsibilities: aiAgentBrainResponsibilities,
    },
  ]),
);

function snapshotState() {
  return {
    users,
    projects,
    chats,
    messages,
    approvals,
    aiAgentBrainStateByProject,
    auditLogsByProject,
    campaignBooksByProject,
  };
}

function persistState() {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(snapshotState(), null, 2));
}

function hydrateState(nextState) {
  users = nextState.users || users;
  projects = nextState.projects || projects;
  chats = nextState.chats || chats;
  messages = nextState.messages || messages;
  approvals = nextState.approvals || approvals;
  aiAgentBrainStateByProject = nextState.aiAgentBrainStateByProject || aiAgentBrainStateByProject;
  auditLogsByProject = nextState.auditLogsByProject || auditLogsByProject;
  campaignBooksByProject = nextState.campaignBooksByProject || campaignBooksByProject;
}

function decorateConnector(project, connector) {
  const config = getIntegrationConfig();

  if (connector.id === 'ai_agent_brain') {
    const provider = aiAgentBrainStateByProject[project.id]?.selectedProvider;
    const configured = Boolean(provider || config.aiAgentEndpointUrl);

    return {
      ...connector,
      status: configured ? `Configured${provider ? ` with ${provider}` : ''}` : 'Not configured',
      detail: configured
        ? 'Agent orchestration is wired to the persisted project provider configuration'
        : 'Configure a provider or custom endpoint before AI actions can run',
    };
  }

  if (connector.id === 'google_ads') {
    const configured = Boolean(config.googleAdsMcpUrl || config.googleAdsApiConfigured || config.googleAdsLiveConfigured);

    return {
      ...connector,
      status: configured ? 'Configured' : 'Not configured',
      detail: config.googleAdsMcpUrl
        ? 'Google Ads MCP endpoint connected'
        : config.googleAdsApiConfigured || config.googleAdsLiveConfigured
          ? 'Google Ads API credentials configured'
          : 'Connect Google Ads MCP or API credentials',
    };
  }

  if (connector.id === 'meta_ads') {
    const configured = Boolean(config.metaAdsApiConfigured || config.metaAdsLiveConfigured);

    return {
      ...connector,
      status: configured ? 'Configured' : 'Not configured',
      detail: configured ? 'Meta Marketing API credentials configured' : 'Connect Meta Marketing API credentials',
    };
  }

  if (connector.id === 'meta_ads_mcp') {
    const configured = Boolean(config.metaAdsMcpUrl);

    return {
      ...connector,
      status: configured ? 'Configured' : 'Not configured',
      detail: configured ? 'Meta Ads MCP endpoint connected' : 'Connect a vetted Meta Ads MCP endpoint',
    };
  }

  if (connector.id === 'website') {
    const configured = Boolean(config.websiteCrawlUrl);

    return {
      ...connector,
      status: configured ? 'Configured' : 'Not configured',
      detail: configured ? 'Website crawl endpoint configured' : 'Add a crawl endpoint for live landing page context',
    };
  }

  if (connector.id === 'mcp_api') {
    const configured = Boolean(
      config.googleAdsMcpUrl ||
        config.googleAdsApiConfigured ||
        config.googleAdsLiveConfigured ||
        config.metaAdsApiConfigured ||
        config.metaAdsLiveConfigured ||
        config.metaAdsMcpUrl,
    );

    return {
      ...connector,
      status: configured ? 'Configured' : 'Not configured',
      detail: configured
        ? 'MCP/API tooling connected'
        : 'Configure Google Ads, Meta Ads, or a custom tool endpoint',
    };
  }

  return connector;
}

function decorateProject(project) {
  return {
    ...project,
    connectors: (project.connectors || []).map((connector) => decorateConnector(project, connector)),
  };
}

if (existsSync(STATE_FILE)) {
  try {
    hydrateState(JSON.parse(readFileSync(STATE_FILE, 'utf8')));
  } catch {
    persistState();
  }
} else {
  persistState();
}

function nowIso() {
  return new Date().toISOString();
}

function getAuditLogs(projectId) {
  return auditLogsByProject[projectId] || auditLogsByProject[projects[0].id];
}

function recordAuditLog(entry) {
  const projectId = entry.projectId || projects[0].id;
  const auditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    projectId,
    eventType: entry.eventType,
    title: entry.title,
    detail: entry.detail,
    actor: entry.actor,
    provider: entry.provider || null,
    relatedCampaignBookId: entry.relatedCampaignBookId || null,
    createdAt: nowIso(),
  };

  getAuditLogs(projectId).unshift(auditLog);
  persistState();
  return auditLog;
}

function getCampaignBooks(projectId) {
  return campaignBooksByProject[projectId] || campaignBooksByProject[projects[0].id];
}

function createCampaignBook(entry) {
  const projectId = entry.projectId || projects[0].id;
  const books = getCampaignBooks(projectId);
  const campaignBook = {
    id: `campaign_book_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    projectId,
    version: books.length + 1,
    title: entry.title,
    summary: entry.summary,
    approvedBy: entry.approvedBy,
    approvedByRole: entry.approvedByRole,
    approvedActions: entry.approvedActions,
    source: entry.source,
    agentProvider: entry.agentProvider || null,
    status: 'approved',
    createdAt: nowIso(),
  };

  books.unshift(campaignBook);
  persistState();
  return campaignBook;
}

function getAiAgentBrain(projectId) {
  const brain = aiAgentBrainStateByProject[projectId] || aiAgentBrainStateByProject[projects[0].id];
  const configured = Boolean(brain.selectedProvider || getIntegrationConfig().aiAgentEndpointUrl);
  const status = configured ? `Configured${brain.selectedProvider ? ` with ${brain.selectedProvider}` : ''}` : 'Not configured';

  return {
    ...brain,
    status,
  };
}

function updateAiAgentBrain(projectId, selectedProvider) {
  const brain = aiAgentBrainStateByProject[projectId] || aiAgentBrainStateByProject[projects[0].id];
  const provider = selectedProvider || null;

  if (provider && !brain.providerOptions.includes(provider)) {
    return null;
  }

  const previousProvider = brain.selectedProvider;
  brain.selectedProvider = provider;

  if (previousProvider !== provider) {
    recordAuditLog({
      projectId,
      eventType: 'brain_provider_updated',
      title: 'AI Agent Brain provider updated',
      detail: provider ? `Configured with ${provider}` : 'Cleared provider configuration',
      actor: 'Workspace admin',
      provider: provider || null,
    });
  }

  persistState();
  return getAiAgentBrain(projectId);
}

const campaignIntelligence = {
  project_crystal_hues: {
    projectId: 'project_crystal_hues',
    projectName: 'Crystal Hues PPC',
    summary: 'ROAS dropped because Meta prospecting fatigue increased while branded search stayed efficient.',
    metrics: [
      { label: 'Spend', value: '₹12.4L', delta: '+8.2% vs last week', status: 'watch' },
      { label: 'Revenue', value: '₹41.7L', delta: '-3.4% vs last week', status: 'risk' },
      { label: 'ROAS', value: '3.36x', delta: '-0.42x vs last week', status: 'risk' },
      { label: 'CPL', value: '₹1,420', delta: '+18.6% vs last week', status: 'risk' },
      { label: 'Leads', value: '874', delta: '-9.8% vs last week', status: 'watch' },
      { label: 'Conv. rate', value: '4.8%', delta: '-0.7 pts vs last week', status: 'watch' },
    ],
    platforms: [
      { platform: 'Google Ads', spend: '₹7.1L', roas: '4.08x', cpl: '₹1,060', signal: 'Brand search is carrying efficiency' },
      { platform: 'Meta Ads', spend: '₹5.3L', roas: '2.41x', cpl: '₹1,940', signal: 'Prospecting fatigue is raising acquisition cost' },
    ],
    campaigns: [
      {
        id: 'campaign_brand_search_india',
        name: 'Brand Search - India',
        platform: 'Google Ads',
        status: 'Efficient',
        spend: '₹1.8L',
        cpa: '₹820',
        roas: '6.2x',
        issue: 'Protect budget and impression share',
      },
      {
        id: 'campaign_competitor_search',
        name: 'Competitor Search',
        platform: 'Google Ads',
        status: 'Watch',
        spend: '₹2.4L',
        cpa: '₹1,760',
        roas: '2.4x',
        issue: 'High CPC with weak assisted revenue',
      },
      {
        id: 'campaign_meta_prospecting',
        name: 'Meta Prospecting - Founders',
        platform: 'Meta Ads',
        status: 'Risk',
        spend: '₹3.2L',
        cpa: '₹2,240',
        roas: '1.9x',
        issue: 'Creative fatigue and falling CTR',
      },
    ],
    insight: {
      title: 'Why performance changed',
      detail: 'ROAS dropped because Meta prospecting fatigue increased and competitor search absorbed more spend without matching conversion quality.',
    },
    alerts: [
      { label: 'High CPL alert', severity: 'high', detail: 'Meta prospecting CPL is 37% above account target.' },
      { label: 'Falling ROAS', severity: 'medium', detail: 'Blended ROAS fell from 3.78x to 3.36x in seven days.' },
      { label: 'Wasted spend', severity: 'medium', detail: 'Search terms with low buying intent consumed ₹42.8k.' },
    ],
  },
};

function jsonResponse(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type',
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(payload));
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function getAuthorizedUser(request) {
  const authorization = request.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : '';

  if (!token.startsWith(workspaceSessionPrefix)) {
    return null;
  }

  const userId = token.replace(`${workspaceSessionPrefix}-`, '');
  return users.find((user) => user.id === userId) || users[0];
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function getProject(requestUrl) {
  const projectId = requestUrl.searchParams.get('projectId') || projects[0].id;
  return projects.find((project) => project.id === projectId) || projects[0];
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host}`);

  if (request.method === 'OPTIONS') {
    jsonResponse(response, 204, {});
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/health') {
    jsonResponse(response, 200, { ok: true, service: 'ppc-dashboard-backend' });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/projects') {
    jsonResponse(response, 200, { projects: projects.map(decorateProject) });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/integrations') {
    jsonResponse(response, 200, { integrations: getIntegrationConfig() });
    return;
  }

  if (
    request.method === 'GET' &&
    (requestUrl.pathname === '/api/ai-agent-brain' || requestUrl.pathname === '/api/llm-brain')
  ) {
    const project = getProject(requestUrl);
    jsonResponse(response, 200, { brain: getAiAgentBrain(project.id) });
    return;
  }

  if (request.method === 'POST' && requestUrl.pathname === '/api/ai-agent-brain') {
    const body = await parseBody(request);
    const projectId = typeof body.projectId === 'string' ? body.projectId : projects[0].id;
    const selectedProvider = typeof body.selectedProvider === 'string' ? body.selectedProvider : null;
    const brain = updateAiAgentBrain(projectId, selectedProvider);

    if (!brain) {
      jsonResponse(response, 400, { error: 'Invalid AI Agent Brain provider' });
      return;
    }

    jsonResponse(response, 200, { brain });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/campaign-intelligence') {
    const project = getProject(requestUrl);
    const intelligence = await buildCampaignIntelligence(project, campaignIntelligence);
    jsonResponse(response, 200, { intelligence });
    return;
  }

  if (request.method === 'POST' && requestUrl.pathname === '/api/auth/login') {
    const body = await parseBody(request);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const user = users.find((candidate) => candidate.email === email && candidate.password === password);

    if (!user) {
      jsonResponse(response, 401, { error: 'Invalid credentials' });
      return;
    }

    jsonResponse(response, 200, {
      token: `${workspaceSessionPrefix}-${user.id}`,
      user: publicUser(user),
    });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/auth/me') {
    const user = getAuthorizedUser(request);

    if (!user) {
      jsonResponse(response, 401, { error: 'Unauthorized' });
      return;
    }

    jsonResponse(response, 200, { user: publicUser(user) });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/users') {
    const user = getAuthorizedUser(request);

    if (!user) {
      jsonResponse(response, 401, { error: 'Unauthorized' });
      return;
    }

    jsonResponse(response, 200, { users: users.map(publicUser) });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/chats') {
    const project = getProject(requestUrl);
    jsonResponse(response, 200, { chats: chats.filter((chat) => chat.projectId === project.id) });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/connectors') {
    const project = getProject(requestUrl);
    jsonResponse(response, 200, { connectors: decorateProject(project).connectors });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/messages') {
    jsonResponse(response, 200, { messages });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/approvals') {
    const project = getProject(requestUrl);
    jsonResponse(response, 200, { approvals: approvals.filter((approval) => approval.projectId === project.id) });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/audit-logs') {
    const project = getProject(requestUrl);
    jsonResponse(response, 200, { auditLogs: getAuditLogs(project.id) });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/campaign-books') {
    const project = getProject(requestUrl);
    jsonResponse(response, 200, { campaignBooks: getCampaignBooks(project.id) });
    return;
  }

  if (request.method === 'POST' && requestUrl.pathname === '/api/campaign-books') {
    const body = await parseBody(request);
    const projectId = typeof body.projectId === 'string' ? body.projectId : projects[0].id;
    const approvedActions = Array.isArray(body.approvedActions) ? body.approvedActions.filter((item) => typeof item === 'string') : [];
    const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim() : 'Campaign book';
    const summary = typeof body.summary === 'string' && body.summary.trim() ? body.summary.trim() : 'Approved from Act mode';
    const approvedBy = typeof body.approvedBy === 'string' && body.approvedBy.trim() ? body.approvedBy.trim() : 'Workspace admin';
    const approvedByRole = typeof body.approvedByRole === 'string' && body.approvedByRole.trim() ? body.approvedByRole.trim() : 'Workspace Admin';
    const source = typeof body.source === 'string' && body.source.trim() ? body.source.trim() : 'Act mode';
    const agentProvider = typeof body.agentProvider === 'string' && body.agentProvider.trim() ? body.agentProvider.trim() : null;

    const campaignBook = createCampaignBook({
      projectId,
      title,
      summary,
      approvedBy,
      approvedByRole,
      approvedActions,
      source,
      agentProvider,
    });

    const auditLog = recordAuditLog({
      projectId,
      eventType: 'campaign_book_saved',
      title: 'Campaign book saved',
      detail: `${approvedBy} approved and saved the campaign book from ${source}`,
      actor: approvedBy,
      provider: agentProvider || null,
      relatedCampaignBookId: campaignBook.id,
    });

    jsonResponse(response, 200, { campaignBook, auditLog });
    return;
  }

  if (request.method === 'POST' && requestUrl.pathname === '/api/chat') {
    const body = await parseBody(request);
    const mode = body.mode === 'Act' ? 'Act' : 'Ask';
    const projectId = typeof body.projectId === 'string' ? body.projectId : projects[0].id;
    const brain = getAiAgentBrain(projectId);
    const agentProvider = brain.selectedProvider || 'Not configured';

    if (mode === 'Act') {
      recordAuditLog({
        projectId,
        eventType: 'act_plan_drafted',
        title: 'Act mode plan drafted',
        detail: `Prepared ${approvals.length} approval-safe changes`,
        actor: 'AI Agent Brain',
        provider: agentProvider,
      });

      jsonResponse(response, 200, {
        mode,
        agentProvider,
        content: 'I can prepare these changes. I will not execute anything until you approve the final list.',
        approvalRequired: true,
        proposedActions: approvals,
      });
      return;
    }

    jsonResponse(response, 200, {
      mode,
      agentProvider,
      content:
        'I checked connected Google Ads and Meta Ads data. The largest issue is wasted spend from low-intent search terms, followed by Meta prospecting creative fatigue.',
      table: messages[1].table,
    });

    recordAuditLog({
      projectId,
      eventType: 'ask_insight_generated',
      title: 'Ask mode answer generated',
      detail: 'AI Agent Brain summarized connected account data',
      actor: 'AI Agent Brain',
      provider: agentProvider,
    });
    return;
  }

  jsonResponse(response, 404, { error: 'Not found' });
});

server.listen(PORT, HOST, () => {
  console.log(`PPC Dashboard backend running on http://${HOST}:${PORT}`);
});
