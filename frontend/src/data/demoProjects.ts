import { Project } from '../lib/api';

export const fallbackProjects: Project[] = [
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
      { id: 'website', label: 'Website', status: 'connected', detail: 'Landing page context', mode: 'read_only' },
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
