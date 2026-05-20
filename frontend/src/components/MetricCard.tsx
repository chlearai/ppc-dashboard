type MetricCardProps = {
  label: string;
  value: string;
  change: string;
  tone?: 'positive' | 'warning' | 'neutral';
};

export function MetricCard({ label, value, change, tone = 'neutral' }: MetricCardProps) {
  return (
    <section className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span className={`metric-change ${tone}`}>{change}</span>
    </section>
  );
}
