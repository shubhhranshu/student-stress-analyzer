import {
  RadarChart as ReRadar, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip,
} from 'recharts';
import { clusterColor, FEATURE_LABELS } from './utils';

const FEATURE_KEYS = Object.keys(FEATURE_LABELS);

export default function RadarChartComp({ centroids }) {
  if (!centroids?.length) return null;

  const radarData = FEATURE_KEYS.map((key) => {
    const entry = { feature: FEATURE_LABELS[key] };
    centroids.forEach((c) => {
      entry[c.label] = c[key] ?? 0;
    });
    return entry;
  });

  return (
    <div className="card chart-card">
      <div className="chart-title">🕸️ Cluster Feature Radar</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
        Centroid average for each behavioral feature per cluster.
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <ReRadar cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis dataKey="feature" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 14]} />
          <Tooltip
            contentStyle={{ background: 'rgba(13,16,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }}
            labelStyle={{ color: '#f1f5f9' }}
          />
          {centroids.map((c) => (
            <Radar
              key={c.label}
              name={c.label}
              dataKey={c.label}
              data={radarData}
              stroke={clusterColor(c.label)}
              fill={clusterColor(c.label)}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
        </ReRadar>
      </ResponsiveContainer>
    </div>
  );
}
