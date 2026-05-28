import { CampaignIntelligence } from '../lib/api';

export const workspaceIntelligence: Record<string, CampaignIntelligence> = {
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

export function getWorkspaceIntelligence(projectId: string) {
  return workspaceIntelligence[projectId] || workspaceIntelligence.project_crystal_hues;
}
