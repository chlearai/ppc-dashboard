import http from 'node:http';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 8787);

const demoTokenPrefix = 'demo-session';

const users = [
  {
    id: 'user_admin',
    name: 'Shailesh Kumar',
    email: 'admin@adops.test',
    role: 'Workspace Admin',
    status: 'Active',
    lastActive: 'Today',
    projectAccess: ['Crystal Hues PPC', 'Demo Ecommerce', 'Lead Gen Test'],
    password: 'demo123',
  },
  {
    id: 'user_media_buyer',
    name: 'Aarav Mehta',
    email: 'buyer@adops.test',
    role: 'Media Buyer',
    status: 'Active',
    lastActive: 'Yesterday',
    projectAccess: ['Crystal Hues PPC', 'Demo Ecommerce'],
    password: 'demo123',
  },
  {
    id: 'user_analyst',
    name: 'Nisha Rao',
    email: 'analyst@adops.test',
    role: 'Analyst',
    status: 'Invited',
    lastActive: 'Invitation pending',
    projectAccess: ['Crystal Hues PPC'],
    password: 'demo123',
  },
];

const projects = [
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
        id: 'meta_ads',
        label: 'Meta Ads',
        status: 'connected',
        detail: 'Read + draft actions',
        mode: 'read_write_with_approval',
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
        detail: 'Google Ads MCP, Meta API, custom tools',
        mode: 'configured_per_project',
      },
    ],
  },
  {
    id: 'project_demo_ecommerce',
    name: 'Demo Ecommerce',
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

const chats = [
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

const messages = [
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

const approvals = [
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

function jsonResponse(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://127.0.0.1:5173',
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

  if (!token.startsWith(demoTokenPrefix)) {
    return null;
  }

  const userId = token.replace(`${demoTokenPrefix}-`, '');
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
    jsonResponse(response, 200, { projects });
    return;
  }

  if (request.method === 'POST' && requestUrl.pathname === '/api/auth/login') {
    const body = await parseBody(request);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const user = users.find((candidate) => candidate.email === email && candidate.password === password);

    if (!user) {
      jsonResponse(response, 401, { error: 'Invalid demo credentials' });
      return;
    }

    jsonResponse(response, 200, {
      token: `${demoTokenPrefix}-${user.id}`,
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
    jsonResponse(response, 200, { connectors: project.connectors });
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

  if (request.method === 'POST' && requestUrl.pathname === '/api/chat') {
    const body = await parseBody(request);
    const mode = body.mode === 'Act' ? 'Act' : 'Ask';

    if (mode === 'Act') {
      jsonResponse(response, 200, {
        mode,
        content: 'I can prepare these changes. I will not execute anything until you approve the final list.',
        approvalRequired: true,
        proposedActions: approvals,
      });
      return;
    }

    jsonResponse(response, 200, {
      mode,
      content:
        'I checked connected Google Ads and Meta Ads data. The largest issue is wasted spend from low-intent search terms, followed by Meta prospecting creative fatigue.',
      table: messages[1].table,
    });
    return;
  }

  jsonResponse(response, 404, { error: 'Not found' });
});

server.listen(PORT, HOST, () => {
  console.log(`PPC Dashboard backend running on http://${HOST}:${PORT}`);
});
