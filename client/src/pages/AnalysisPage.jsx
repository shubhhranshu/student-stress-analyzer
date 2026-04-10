import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import ClusterChart from '../components/ClusterChart';
import StressBar from '../components/StressBar';
import RadarChartComp from '../components/RadarChartComp';
import StudentTable from '../components/StudentTable';
import { clusterColor } from '../components/utils';

export default function AnalysisPage() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [clusterRes, statsRes] = await Promise.all([
        fetch('/api/analysis/clusters'),
        fetch('/api/analysis/stats'),
      ]);
      const clusterData = await clusterRes.json();
      const statsData = await statsRes.json();
      setData(clusterData);
      setStats(statsData);
    } catch (err) {
      showToast('Failed to load analysis data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/analysis/seed');
      const d = await res.json();
      if (d.success) {
        showToast(`✨ Seeded ${d.count} sample students!`);
        fetchData();
      }
    } catch {
      showToast('Failed to seed data', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Student removed.');
      fetchData();
    } catch {
      showToast('Failed to delete student', 'error');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="spinner" />
          <p>Running K-Means clustering…</p>
        </div>
      </div>
    );
  }

  const students = data?.students || [];
  const centroids = data?.centroids || [];
  const isEmpty = students.length === 0;

  return (
    <div className="page page-wide">
      {/* Header */}
      <div className="flex-between mb-8 animate-fade-up" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.8rem' }}>Stress Level Analysis</h1>
          <p className="section-subtitle">K-Means clustering (k=3) on {students.length} student records</p>
        </div>
        <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={fetchData}>🔄 Refresh</button>
          <button className="btn btn-secondary" onClick={handleSeed} disabled={seeding}>
            {seeding ? '⏳ Seeding…' : '🌱 Seed Sample Data'}
          </button>
          <Link to="/add" className="btn btn-primary">✏️ Add Student</Link>
        </div>
      </div>

      {isEmpty ? (
        <div className="empty-state animate-fade-up">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No Student Data Yet</div>
          <p className="empty-text">Add students manually or seed sample data to see the analysis.</p>
          <div className="flex gap-3 mt-4" style={{ justifyContent: 'center' }}>
            <button className="btn btn-teal" onClick={handleSeed} disabled={seeding}>
              🌱 Seed 50 Sample Students
            </button>
            <Link to="/add" className="btn btn-primary">✏️ Add Manually</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Cluster Legend */}
          <div className="cluster-legend animate-fade-up">
            {centroids.map((c) => (
              <div key={c.label} className="legend-item">
                <div className="legend-dot" style={{ background: clusterColor(c.label) }} />
                <span>{c.label}</span>
                <span style={{ color: 'var(--text-muted)' }}>({c.count} students)</span>
              </div>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="stats-grid animate-fade-up">
            <StatsCard
              icon="👥" value={stats?.total ?? 0} label="Total Students"
              accent="linear-gradient(90deg, #8b5cf6, #a78bfa)"
            />
            <StatsCard
              icon="🟢" value={stats?.clusterCounts?.['Low Stress'] ?? 0} label="Low Stress"
              accent="linear-gradient(90deg, #34d399, #059669)"
            />
            <StatsCard
              icon="🟡" value={stats?.clusterCounts?.['Moderate Stress'] ?? 0} label="Moderate Stress"
              accent="linear-gradient(90deg, #fbbf24, #d97706)"
            />
            <StatsCard
              icon="🔴" value={stats?.clusterCounts?.['High Stress'] ?? 0} label="High Stress"
              accent="linear-gradient(90deg, #f87171, #dc2626)"
            />
            <StatsCard
              icon="😟" value={stats?.avgStress ?? '—'} label="Avg Reported Stress"
              accent="linear-gradient(90deg, #f472b6, #ec4899)"
            />
            <StatsCard
              icon="💤" value={stats?.avgFeatures?.sleep_hours ?? '—'} label="Avg Sleep (hrs)"
              accent="linear-gradient(90deg, #2dd4bf, #0d9488)"
            />
          </div>

          {/* Charts */}
          <div className="charts-grid animate-fade-up">
            <ClusterChart students={students} />
            <StressBar clusterCounts={stats?.clusterCounts} />
          </div>

          <div className="charts-grid animate-fade-up">
            <RadarChartComp centroids={centroids} />

            {/* Centroid summary table */}
            <div className="card chart-card">
              <div className="chart-title">📌 Cluster Centroids</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                Average feature values per cluster.
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Cluster</th>
                      <th>Sleep</th>
                      <th>Study</th>
                      <th>Screen</th>
                      <th>Exercise</th>
                      <th>Social</th>
                      <th>Financial</th>
                      <th>Academic</th>
                    </tr>
                  </thead>
                  <tbody>
                    {centroids.map((c) => (
                      <tr key={c.label}>
                        <td>
                          <span className="legend-item">
                            <span className="legend-dot" style={{ background: clusterColor(c.label) }} />
                            <strong style={{ color: clusterColor(c.label) }}>{c.label}</strong>
                          </span>
                        </td>
                        <td>{c.sleep_hours}</td>
                        <td>{c.study_hours}</td>
                        <td>{c.screen_time}</td>
                        <td>{c.physical_activity}</td>
                        <td>{c.social_support}</td>
                        <td>{c.financial_stress}</td>
                        <td>{c.academic_pressure}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Student Table */}
          <div className="animate-fade-up">
            <StudentTable students={students} onDelete={handleDelete} />
          </div>
        </>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  );
}
