import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, LabelList,
} from 'recharts';
import { clusterColor } from './utils';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(13,16,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
      <strong style={{ color: clusterColor(payload[0]?.payload?.label) }}>{payload[0]?.payload?.label}</strong>
      <div style={{ color: '#f1f5f9', marginTop: 4 }}>{payload[0]?.value} Students</div>
    </div>
  );
};

export default function StressBar({ clusterCounts }) {
  if (!clusterCounts) return null;
  const data = Object.entries(clusterCounts).map(([label, count]) => ({ label, count }));

  return (
    <div className="card chart-card">
      <div className="chart-title">📊 Students per Stress Level</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
        Distribution of students across the three stress clusters.
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }} barSize={56}>
          <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={clusterColor(entry.label)} fillOpacity={0.9} />
            ))}
            <LabelList dataKey="count" position="top" style={{ fill: '#f1f5f9', fontSize: 13, fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
