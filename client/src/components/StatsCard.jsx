export default function StatsCard({ icon, value, label, accent }) {
  return (
    <div className="stat-card" style={{ '--accent': accent || 'linear-gradient(90deg, #8b5cf6, #2dd4bf)' }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
