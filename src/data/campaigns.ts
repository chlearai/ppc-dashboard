export type Campaign = {
  id: number;
  name: string;
  channel: 'Google Ads' | 'Meta Ads' | 'LinkedIn Ads';
  spend: number;
  revenue: number;
  clicks: number;
  conversions: number;
  impressions: number;
  status: 'Scaling' | 'Stable' | 'Watch';
};

export const campaigns: Campaign[] = [
  {
    id: 1,
    name: 'Brand Search India',
    channel: 'Google Ads',
    spend: 18400,
    revenue: 126900,
    clicks: 4120,
    conversions: 184,
    impressions: 86100,
    status: 'Scaling',
  },
  {
    id: 2,
    name: 'Lead Gen Remarketing',
    channel: 'Meta Ads',
    spend: 14200,
    revenue: 68300,
    clicks: 6220,
    conversions: 91,
    impressions: 138400,
    status: 'Stable',
  },
  {
    id: 3,
    name: 'B2B Decision Makers',
    channel: 'LinkedIn Ads',
    spend: 22100,
    revenue: 74200,
    clicks: 1480,
    conversions: 37,
    impressions: 32900,
    status: 'Watch',
  },
  {
    id: 4,
    name: 'Competitor Search',
    channel: 'Google Ads',
    spend: 9600,
    revenue: 41100,
    clicks: 1840,
    conversions: 48,
    impressions: 45100,
    status: 'Stable',
  },
];

export const trend = [
  { day: 'Mon', spend: 7200, revenue: 28400 },
  { day: 'Tue', spend: 8100, revenue: 31200 },
  { day: 'Wed', spend: 7700, revenue: 33700 },
  { day: 'Thu', spend: 8900, revenue: 38400 },
  { day: 'Fri', spend: 9400, revenue: 43100 },
  { day: 'Sat', spend: 6800, revenue: 27600 },
  { day: 'Sun', spend: 6200, revenue: 24900 },
];
