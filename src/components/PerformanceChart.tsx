import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { trend } from '../data/campaigns';
import { formatCurrency } from '../lib/format';

export function PerformanceChart() {
  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <p>Weekly trend</p>
          <h2>Spend vs revenue</h2>
        </div>
      </div>

      <div className="chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
            <defs>
              <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="spend" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#c2410c" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#c2410c" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis axisLine={false} dataKey="day" tickLine={false} />
            <YAxis
              axisLine={false}
              tickFormatter={(value) => `₹${Number(value) / 1000}k`}
              tickLine={false}
            />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Area
              dataKey="revenue"
              fill="url(#revenue)"
              isAnimationActive={false}
              name="Revenue"
              stroke="#0f766e"
              strokeWidth={2}
              type="monotone"
            />
            <Area
              dataKey="spend"
              fill="url(#spend)"
              isAnimationActive={false}
              name="Spend"
              stroke="#c2410c"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
