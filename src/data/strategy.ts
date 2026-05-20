import {
  BarChart3,
  BookOpenCheck,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Gauge,
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

export type IntelligenceMetric = {
  label: string;
  value: string;
  detail: string;
  grade: 'Strong' | 'Review' | 'Limited';
};

export type ChatPrompt = {
  label: string;
  prompt: string;
};

export type GrowthLever = {
  title: string;
  upside: string;
  proof: string;
  nextStep: string;
};

export type AssistantCapability = {
  mode: 'Ask' | 'Act';
  title: string;
  description: string;
};

export const navItems = [
  { label: 'Strategy Console', icon: BarChart3 },
  { label: 'AI Revenue Chat', icon: Bot },
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
    campaign: 'M1 Prospecting | Broad Learning',
    objective: 'Conversions',
    structure: '1 campaign, 3 ad sets, 12 ads',
    targeting: 'Broad 25 to 54, value event optimized, exclusions for buyers and low-quality leads',
    creative: 'Problem hook, proof hook, founder story, offer-led comparison',
    budget: '45% of paid social budget until 50 conversions',
  },
  {
    platform: 'Meta Ads',
    campaign: 'M2 Retargeting | Proof and Objections',
    objective: 'Conversions',
    structure: '1 campaign, 2 ad sets, 8 ads',
    targeting: '7-day high intent, 30-day engaged users, lead form openers, pricing page visitors',
    creative: 'Testimonials, objection handling, comparison, case study carousel',
    budget: '15% with frequency guardrail at 3.2',
  },
  {
    platform: 'Google Ads',
    campaign: 'G1 Search | High Intent Non Brand',
    objective: 'Leads or purchases',
    structure: '1 campaign, 5 ad groups, 3 RSAs per ad group',
    targeting: 'Exact and phrase keywords grouped by commercial intent and landing page match',
    creative: 'Outcome-led RSA, proof RSA, comparison RSA, sitelinks by pain point',
    budget: '30% of Google budget with CPA cap',
  },
  {
    platform: 'Google Ads',
    campaign: 'G2 PMax | Controlled Expansion',
    objective: 'Incremental conversions',
    structure: '1 campaign, 3 asset groups',
    targeting: 'Converter signals, website visitors, competitor intent, in-market segments, brand exclusions where possible',
    creative: 'Asset group by persona with image, short video, headlines, descriptions, sitelinks',
    budget: '25% after search baseline proves stable',
  },
];

export const intelligenceMetrics: IntelligenceMetric[] = [
  {
    label: 'Strategy Confidence',
    value: '87%',
    detail: '12 account signals, keyword forecast, creative fatigue, funnel gaps',
    grade: 'Strong',
  },
  {
    label: 'Forecast Coverage',
    value: '64%',
    detail: 'Search forecast is strong. Meta conversion forecast remains directional.',
    grade: 'Review',
  },
  {
    label: 'Execution Complexity',
    value: 'Low',
    detail: '31 checklist steps, platform-native build, approval gates on changes',
    grade: 'Strong',
  },
  {
    label: 'Data Gaps',
    value: '3',
    detail: 'Need Meta pixel quality, lead value, and competitor CPC sample',
    grade: 'Limited',
  },
];

export const strategyRationale = [
  {
    label: 'Why this architecture wins',
    text: 'It separates brand protection, high-intent capture, learning exploration, and proof-led retargeting so each budget has a clear job.',
  },
  {
    label: 'What an expert will check',
    text: 'Budget learning velocity, conversion event quality, search term leakage, creative fatigue, audience overlap, and PMax cannibalization.',
  },
  {
    label: 'What a junior operator should do',
    text: 'Follow the campaign book, build each campaign in native Google and Meta dashboards, then return here for QA and approval.',
  },
];

export const executionChecklist = [
  'Create campaigns using the exact naming convention and objective.',
  'Build ad sets or ad groups from the architecture table without changing budget split.',
  'Add required exclusions, negatives, conversion event, and location settings.',
  'Upload creative by angle: problem, proof, comparison, objection handling.',
  'Run QA checklist, then submit the plan for strategist approval.',
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
    icon: Bot,
    title: 'Strategic Reasoning',
    text: 'Explains why the plan beats a normal platform setup.',
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
  { label: 'Strategy Score', value: '87%', note: 'Evidence-backed architecture quality', icon: Gauge },
];

export const approvalActions = [
  'Pause 4 low-quality search terms after review',
  'Move 12% budget from retargeting to high-intent search',
  'Launch Meta creative test with 4 hooks and 3 proof formats',
  'Save campaign book as final plan for team build',
];

export const chatPrompts: ChatPrompt[] = [
  {
    label: 'Find revenue leaks',
    prompt: 'Where are we wasting spend and what exact actions will recover revenue this week?',
  },
  {
    label: 'Scale winners',
    prompt: 'Which campaigns can safely scale, by how much, and what risk controls should we apply?',
  },
  {
    label: 'Explain CPA spike',
    prompt: 'Why did CPA increase this week across Google and Meta? Separate auction, creative, audience, and landing page causes.',
  },
  {
    label: 'Create test plan',
    prompt: 'Create a 14-day test plan to improve revenue without increasing total budget.',
  },
  {
    label: 'Competitor angle',
    prompt: 'What competitor and category angles should we test next based on search intent and Meta creative fatigue?',
  },
];

export const assistantCapabilities: AssistantCapability[] = [
  {
    mode: 'Ask',
    title: 'Campaign diagnosis',
    description: 'Fetch spend, CPA, ROAS, search terms, creatives, audiences, and conversion trends before answering.',
  },
  {
    mode: 'Ask',
    title: 'Plain-English explanation',
    description: 'Explain what changed, why it matters, and what confidence level the answer has.',
  },
  {
    mode: 'Ask',
    title: 'Opportunity discovery',
    description: 'Find wasted spend, scaling opportunities, creative fatigue, landing page friction, and keyword gaps.',
  },
  {
    mode: 'Act',
    title: 'Draft campaign changes',
    description: 'Prepare budget moves, pauses, negatives, creative tests, ad set changes, and campaign build steps.',
  },
  {
    mode: 'Act',
    title: 'Require final approval',
    description: 'Show the exact change, expected impact, risk, rollback rule, and ask for approval before execution.',
  },
  {
    mode: 'Act',
    title: 'Audit every action',
    description: 'Keep a log of who approved what, when, why, and which platform object changed.',
  },
];

export const growthLevers: GrowthLever[] = [
  {
    title: 'Revenue Leak Scanner',
    upside: 'Recover 8 to 18% of wasted budget',
    proof: 'Search terms with spend and no conversion, Meta ads with high frequency and falling CTR, weak landing page match.',
    nextStep: 'Generate a pause, negative keyword, and creative refresh queue.',
  },
  {
    title: 'Budget Reallocation Engine',
    upside: 'Move spend into marginal winners',
    proof: 'Compares CPA, ROAS, impression share, learning status, fatigue, and conversion lag by platform.',
    nextStep: 'Draft budget shifts with max daily change limits and rollback rules.',
  },
  {
    title: 'Creative Intelligence Loop',
    upside: 'Improve Meta and PMax learning speed',
    proof: 'Maps hooks, offers, proof points, formats, thumb-stop rate, CTR, CVR, and fatigue into next creative briefs.',
    nextStep: 'Create 10 new ad angles with rationale and expected role in funnel.',
  },
  {
    title: 'Search Intent Expansion',
    upside: 'Find profitable non-brand demand',
    proof: 'Uses Google keyword ideas, search term history, landing page themes, and competitor intent clusters.',
    nextStep: 'Create new ad groups, RSAs, negatives, and forecasted CPC ranges.',
  },
  {
    title: 'Landing Page Friction Audit',
    upside: 'Increase conversion rate without more ad spend',
    proof: 'Compares ad promise, keyword intent, page speed, form friction, proof density, and objection handling.',
    nextStep: 'Produce page fixes and match each fix to campaign or creative angle.',
  },
  {
    title: 'Incrementality Guardrails',
    upside: 'Prevent false scaling',
    proof: 'Flags brand cannibalization, retargeting over-credit, PMax overlap, and audience saturation.',
    nextStep: 'Add holdout checks, exclusions, and separate budget controls.',
  },
];
