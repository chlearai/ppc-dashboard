import { CalendarDays, Filter, LineChart, Target } from 'lucide-react';
import { CampaignTable } from './components/CampaignTable';
import { MetricCard } from './components/MetricCard';
import { PerformanceChart } from './components/PerformanceChart';
import { campaigns } from './data/campaigns';
import { formatCurrency, formatNumber, formatPercent } from './lib/format';

function App() {
  const totals = campaigns.reduce(
    (acc, campaign) => ({
      spend: acc.spend + campaign.spend,
      revenue: acc.revenue + campaign.revenue,
      clicks: acc.clicks + campaign.clicks,
      conversions: acc.conversions + campaign.conversions,
      impressions: acc.impressions + campaign.impressions,
    }),
    { spend: 0, revenue: 0, clicks: 0, conversions: 0, impressions: 0 },
  );

  const roas = totals.revenue / totals.spend;
  const conversionRate = (totals.conversions / totals.clicks) * 100;

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">Paid marketing command center</p>
          <h1>PPC Dashboard</h1>
        </div>

        <div className="toolbar">
          <button type="button">
            <CalendarDays size={18} />
            Last 7 days
          </button>
          <button type="button">
            <Filter size={18} />
            Filters
          </button>
        </div>
      </header>

      <section className="metrics-grid" aria-label="PPC summary metrics">
        <MetricCard label="Ad spend" value={formatCurrency(totals.spend)} change="+8.4% vs last week" />
        <MetricCard
          label="Revenue"
          value={formatCurrency(totals.revenue)}
          change="+14.2% vs last week"
          tone="positive"
        />
        <MetricCard label="ROAS" value={`${roas.toFixed(2)}x`} change="+0.32x improvement" tone="positive" />
        <MetricCard
          label="Conversion rate"
          value={formatPercent(conversionRate)}
          change={`${formatNumber(totals.conversions)} conversions`}
        />
      </section>

      <section className="content-grid">
        <PerformanceChart />

        <aside className="panel insights-panel">
          <div className="panel-heading">
            <div>
              <p>Focus</p>
              <h2>Optimization queue</h2>
            </div>
          </div>

          <div className="insight-list">
            <article>
              <Target size={20} />
              <div>
                <h3>Scale brand search</h3>
                <p>ROAS is above target with stable volume. Increase budget cap by 12%.</p>
              </div>
            </article>
            <article>
              <LineChart size={20} />
              <div>
                <h3>Review LinkedIn CPC</h3>
                <p>High spend with low conversion density. Refresh audience and creative tests.</p>
              </div>
            </article>
          </div>
        </aside>
      </section>

      <CampaignTable campaigns={campaigns} />
    </main>
  );
}

export default App;
