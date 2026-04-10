import { useState } from 'react';
import { clusterBadgeClass, clusterColor } from './utils';

const PAGE_SIZE = 10;

export default function StudentTable({ students, onDelete }) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState(1);
  const [filter, setFilter] = useState('');

  const filtered = students.filter((s) =>
    !filter || s.clusterLabel?.toLowerCase().includes(filter.toLowerCase()) || s.department?.toLowerCase().includes(filter.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const va = a[sortKey] ?? '';
    const vb = b[sortKey] ?? '';
    return typeof va === 'number' ? (va - vb) * sortDir : String(va).localeCompare(String(vb)) * sortDir;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => -d);
    else { setSortKey(key); setSortDir(1); }
    setPage(1);
  };

  const SortIcon = ({ k }) => (
    <span style={{ color: sortKey === k ? 'var(--purple-light)' : 'var(--text-muted)', marginLeft: 4 }}>
      {sortKey === k ? (sortDir === 1 ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div>
      <div className="flex-between mb-4" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="section-title">📋 Student Records</div>
          <div className="section-subtitle">{filtered.length} students • click headers to sort</div>
        </div>
        <input
          className="form-input"
          style={{ maxWidth: 220 }}
          placeholder="🔍  Filter by cluster / dept…"
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
        />
      </div>

      {paged.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No results found</div>
          <p className="empty-text">Try a different filter</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort('name')}>Name <SortIcon k="name" /></th>
                <th onClick={() => toggleSort('department')}>Department <SortIcon k="department" /></th>
                <th onClick={() => toggleSort('age')}>Age <SortIcon k="age" /></th>
                <th onClick={() => toggleSort('cgpa')}>CGPA <SortIcon k="cgpa" /></th>
                <th onClick={() => toggleSort('academic_pressure')}>Academic P. <SortIcon k="academic_pressure" /></th>
                <th onClick={() => toggleSort('sleep_hours')}>Sleep <SortIcon k="sleep_hours" /></th>
                <th onClick={() => toggleSort('self_reported_stress')}>Stress <SortIcon k="self_reported_stress" /></th>
                <th onClick={() => toggleSort('clusterLabel')}>Cluster <SortIcon k="clusterLabel" /></th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{s.department}</td>
                  <td>{s.age}</td>
                  <td>{s.cgpa}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, minWidth: 60 }}>
                        <div style={{ width: `${s.academic_pressure * 10}%`, height: '100%', borderRadius: 3, background: 'var(--purple)' }} />
                      </div>
                      {s.academic_pressure}
                    </div>
                  </td>
                  <td>{s.sleep_hours}h</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, minWidth: 60 }}>
                        <div style={{ width: `${s.self_reported_stress * 10}%`, height: '100%', borderRadius: 3, background: clusterColor(s.clusterLabel) }} />
                      </div>
                      {s.self_reported_stress}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${clusterBadgeClass(s.clusterLabel)}`}>
                      {s.clusterLabel || '—'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(s.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination mt-4">
          <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹ Prev</button>
          <span className="pagination-info">Page {page} of {totalPages}</span>
          <button className="btn btn-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next ›</button>
        </div>
      )}
    </div>
  );
}
