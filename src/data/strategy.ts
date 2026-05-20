import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  LineChart,
  Megaphone,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';

export type Platform = 'Google Ads' | 'Meta Ads';

export type Recommendation = {
  id: number;
  platform: Platform;
  title: string;
  reason: string;
  action: string;
  impact: string;
  risk: 'Low' | 'Medium' | 'High';
  confidence: 'High' | 'Medium' | 'Low';
};

export type PlanSection = {
  title: string;
  summary: string;
  items: string[];
};

export type ArchitectureRow = {
  platform: Platform;
  campaign: string;
  objective: string;
  structure: string;
  targeting: string;
  creative: string;
  budget: string;
};

export const navItems = [
  { label: 'Command Center', icon: BarChart3 },
  { label: 'Campaign Architect', icon: BookOpenCheck },
  { label: 'Approval Queue', icon: ShieldCheck },
  { label: 'Research Library', icon: Radar },
];

export const intakeQuestions = [
  'What are you selling and what is the primary offer?',
  'Which locations, languages, and customer segments matter most?',
  'What monthly budget and lead or revenue target should the plan respect?',
  'Do you have existing Google or Meta campaign data to learn from?',
  'Which conversion event matters most: lead, purchase, call, booking, or app install?',
  'What creative assets are available today: videos, statics, testimonials, landing pages?',
];

export const recommendations: Recommendation[] = [
  {
    id: 1,
    platform: 'Google Ads',
    title: 'Split brand and high-intent search',
    reason: 'Brand terms are masking acquisition economics. High-intent non-brand queries need their own budget and ROAS target.',
    action: 'Create one Brand Search campaign and one High Intent Search campaign with separate budgets.',
    impact: 'Cleaner reporting and faster budget decisions',
    risk: 'Low',
    confidence: 'High',
  },
  {
    id: 2,
    platform: 'Meta Ads',
    title: 'Build a three-layer acquisition test',
    reason: 'The account needs audience learning without over-fragmenting spend. Broad, interest, and retargeting layers cover the main demand pools.',
    action: 'Create one acquisition campaign with three ad sets and four creatives per ad set.',
    impact: 'Better learning velocity with controlled creative testing',
    risk: 'Medium',
    confidence: 'Medium',
  },
  {
    id: 3,
    platform: 'Google Ads',
    title: 'Prepare negative keyword guardrails',
    reason: 'Generic research queries are likely to waste budget before conversion data stabilizes.',
    action: 'Add starter negatives for jobs, free, template, meaning, pdf, course, and support queries.',
    impact: 'Lower wasted spend in the first two weeks',
    risk: 'Low',
    confidence: 'Medium',
  },
];

export const architectureRows: ArchitectureRow[] = [
  {
    platform: 'Meta Ads',
    campaign: 'Prospecting | Advantage Sales',
    objective: 'Conversions',
    structure: '1 campaign, 3 ad sets, 12 ads',
    targeting: 'Broad 25 to 54, interest cluster, lookalike or engaged visitor retargeting',
    creative: 'Problem hook, proof hook, founder story, offer-led comparison',
    budget: '45% of paid social budget',
  },
  {
    platform: 'Meta Ads',
    campaign: 'Retargeting | Proof and Offer',
    objective: 'Conversions',
    structure: '1 campaign, 2 ad sets, 8 ads',
    targeting: 'Website visitors, video viewers, lead form openers, engaged Instagram users',
    creative: 'Testimonials, objection handling, limited-time offer, case study carousel',
    budget: '15% of paid social budget',
  },
  {
    platform: 'Google Ads',
    campaign: 'Search | High Intent',
    objective: 'Leads or purchases',
    structure: '1 campaign, 4 ad groups, 3 RSAs per ad group',
    targeting: 'Exact and phrase keywords grouped by buying intent',
    creative: 'Outcome-led RSA, price or proof RSA, competitor alternative RSA',
    budget: '30% of search budget',
  },
  {
    platform: 'Google Ads',
    campaign: 'PMax | Conversion Expansion',
    objective: 'Incremental conversions',
    structure: '1 campaign, 3 asset groups',
    targeting: 'Audience signals from converters, website visitors, competitor intent, in-market segments',
    creative: 'Asset group by persona with image, short video, headlines, descriptions, sitelinks',
    budget: '25% of Google budget after search baseline',
  },
];

export const planSections: PlanSection[] = [
  {
    title: 'Research Inputs',
    summary: 'The plan should combine connected account history, platform planner data, website analysis, and category research.',
    items: [
      'Google Ads: KeywordPlanIdeaService for keyword ideas, historical metrics, and forecast metrics.',
      'Google Ads: ReachPlanService for reach planning where the account is allowlisted.',
      'Meta Ads: Marketing API insights, creative history, audience estimates, and delivery diagnostics.',
      'External research: landing page crawl, competitor SERP review, category pain points, and offer analysis.',
    ],
  },
  {
    title: 'Simulation Logic',
    summary: 'The app should separate platform-backed forecasts from AI assumptions.',
    items: [
      'High confidence: connected account data plus Google keyword forecast.',
      'Medium confidence: platform estimate plus category benchmark.',
      'Low confidence: generic AI learning with no account or platform estimate.',
      'Every forecast should show assumptions, input source, and what would change confidence.',
    ],
  },
  {
    title: 'Campaign Book Output',
    summary: 'The final plan should be clear enough for a team member to build inside Google Ads and Meta Ads.',
    items: [
      'Campaign and ad set or ad group naming convention.',
      'Audience, keyword, budget, bid, creative, and landing page mapping.',
      'Build checklist, tracking checklist, QA checklist, and first 14-day optimization rules.',
      'Export as PDF using a print-ready campaign book layout.',
    ],
  },
];

export const capabilityCards = [
  {
    icon: BrainCircuit,
    title: 'AI Strategy Intake',
    text: 'Asks business questions before it creates a media plan.',
  },
  {
    icon: Search,
    title: 'Google Keyword Planning',
    text: 'Uses keyword ideas, historical volume, CPC, and forecasts where credentials allow.',
  },
  {
    icon: Megaphone,
    title: 'Meta Audience Logic',
    text: 'Plans broad, interest, lookalike, and retargeting layers with creative angles.',
  },
  {
    icon: FileText,
    title: 'Campaign Book',
    text: 'Turns strategy into a build-ready PDF for the execution team.',
  },
];

export const sourceHealth = [
  { label: 'Google Ads MCP', status: 'Ready to configure', icon: CheckCircle2 },
  { label: 'Meta Marketing API', status: 'Ready to configure', icon: CheckCircle2 },
  { label: 'Forecast confidence', status: 'Mixed by platform', icon: TriangleAlert },
  { label: 'AI approval gate', status: 'Required for writes', icon: ShieldCheck },
];

export const kpiCards = [
  { label: 'Optimization Actions', value: '18', note: '6 can be approved today', icon: Sparkles },
  { label: 'Wasted Spend Found', value: '₹42.8k', note: 'Search terms and fatigued creatives', icon: CircleDollarSign },
  { label: 'Plans in Review', value: '3', note: 'Google Search, Meta Prospecting, PMax', icon: FileText },
  { label: 'Forecast Quality', value: '72%', note: 'Improves after platform data sync', icon: LineChart },
];

export const approvalActions = [
  'Pause 4 low-quality search terms after review',
  'Move 12% budget from retargeting to high-intent search',
  'Launch Meta creative test with 4 hooks and 3 proof formats',
  'Save campaign book as final plan for team build',
];
