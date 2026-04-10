import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { clusterColor } from './utils';

// Simple PCA-like projection: project onto 2 principal axes using fixed weights
function project(s) {
  const x = s.academic_pressure * 0.5 + s.financial_stress * 0.3 + s.screen_time * 0.2 - s.sleep_hours * 0.4;
  const y = s.study_hours * 0.4 + s.academic_pressure * 0.3 - s.physical_activity * 0.3 - s.social_support * 0.2;
  return { x: +x.toFixed(2), y: +y.toFixed(2), name: s.name, label: s.clusterLabel };
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background: 'rgba(13,16,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
      <strong style={{ color: clusterColor(d?.label) }}>{d?.label}</strong>
      <div style={{ color: '#94a3b8', marginTop: 4 }}>{d?.name}</div>
      <div style={{ color: '#f1f5f9', marginTop: 2 }}>
        Stress axis: ({d?.x}, {d?.y})
      </div>
    </div>
  );
};

export default function ClusterChart({ students }) {
  if (!students?.length) return null;

  const groups = {};
  students.forEach((s) => {
    const label = s.clusterLabel || 'Unknown';
    if (!groups[label]) groups[label] = [];
    groups[label].push(project(s));
  });

  return (
    <div className="card chart-card">
      <div className="chart-title">🔵 Cluster Scatter Plot</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
        Each dot = one student. Axes are linear projections of stress-related features.
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <XAxis dataKey="x" name="Stress X" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis dataKey="y" name="Stress Y" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <ZAxis range={[60, 160]} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
          {Object.entries(groups).map(([label, data]) => (
            <Scatter key={label} name={label} data={data} fill={clusterColor(label)} fillOpacity={0.85} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
