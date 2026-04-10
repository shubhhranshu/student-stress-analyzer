import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEPARTMENTS = ['Computer Science', 'Mechanical Engineering', 'Electronics', 'Business', 'Medicine', 'Arts & Humanities', 'Law', 'Psychology'];
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

const SLIDERS = [
  { key: 'sleep_hours', label: 'Sleep Hours / Day', min: 1, max: 12, step: 0.5, hint: 'Average hours of sleep per night', lowLabel: '1h', highLabel: '12h' },
  { key: 'study_hours', label: 'Study Hours / Day', min: 0, max: 14, step: 0.5, hint: 'Hours spent studying daily', lowLabel: '0h', highLabel: '14h' },
  { key: 'screen_time', label: 'Screen Time / Day', min: 0, max: 14, step: 0.5, hint: 'Non-study screen time (social media, gaming)', lowLabel: '0h', highLabel: '14h' },
  { key: 'physical_activity', label: 'Physical Activity (hrs/wk)', min: 0, max: 14, step: 0.5, hint: 'Exercise or sports per week', lowLabel: '0h', highLabel: '14h' },
  { key: 'social_support', label: 'Social Support', min: 1, max: 10, step: 1, hint: 'Rating: 1 = very isolated, 10 = strong support network', lowLabel: '1', highLabel: '10' },
  { key: 'financial_stress', label: 'Financial Stress', min: 1, max: 10, step: 1, hint: 'Rating: 1 = no financial concerns, 10 = severe stress', lowLabel: '1', highLabel: '10' },
  { key: 'academic_pressure', label: 'Academic Pressure', min: 1, max: 10, step: 1, hint: 'Rating: 1 = very relaxed, 10 = extremely pressured', lowLabel: '1', highLabel: '10' },
  { key: 'self_reported_stress', label: 'Self-Reported Stress Level', min: 1, max: 10, step: 1, hint: 'Overall stress rating right now', lowLabel: '1', highLabel: '10' },
];

const INITIAL = {
  name: '', age: 20, gender: 'Male', department: 'Computer Science', semester: 1, cgpa: 7.5,
  sleep_hours: 6, study_hours: 5, screen_time: 4, physical_activity: 3,
  social_support: 5, financial_stress: 5, academic_pressure: 5, self_reported_stress: 5,
};

export default function AddStudentPage() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { showToast('Please enter a student name.', 'error'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add student');
      showToast('Student added successfully! 🎉');
      setTimeout(() => navigate('/analysis'), 1200);
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setForm(INITIAL); };

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <div className="mb-8 animate-fade-up">
        <h1 className="section-title" style={{ fontSize: '1.8rem' }}>Add Student Record</h1>
        <p className="section-subtitle">Fill in the student's behavioral and academic details for stress analysis.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="card animate-fade-up mb-6">
          <h2 className="chart-title" style={{ marginBottom: 20 }}>👤 Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name *</label>
              <input id="name" className="form-input" placeholder="e.g. Priya Sharma" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="age">Age</label>
              <input id="age" type="number" className="form-input" min={15} max={40} value={form.age} onChange={(e) => set('age', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gender">Gender</label>
              <select id="gender" className="form-select" value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                {GENDERS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="department">Department</label>
              <select id="department" className="form-select" value={form.department} onChange={(e) => set('department', e.target.value)}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="semester">Semester</label>
              <input id="semester" type="number" className="form-input" min={1} max={10} value={form.semester} onChange={(e) => set('semester', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cgpa">CGPA (out of 10)</label>
              <input id="cgpa" type="number" className="form-input" min={0} max={10} step={0.1} value={form.cgpa} onChange={(e) => set('cgpa', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Behavioral Sliders */}
        <div className="card animate-fade-up mb-6">
          <h2 className="chart-title" style={{ marginBottom: 20 }}>🎛️ Behavioral Indicators</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {SLIDERS.map(({ key, label, min, max, step, hint, lowLabel, highLabel }) => (
              <div key={key} className="slider-group">
                <div className="flex-between">
                  <label className="form-label">{label}</label>
                  <span className="form-hint">{hint}</span>
                </div>
                <div className="slider-row">
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 28 }}>{lowLabel}</span>
                  <input
                    type="range" min={min} max={max} step={step}
                    value={form[key]}
                    onChange={(e) => set(key, parseFloat(e.target.value))}
                    style={{ '--val': ((form[key] - min) / (max - min)) * 100 + '%' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 28 }}>{highLabel}</span>
                  <span className="slider-val">{form[key]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? '⏳ Saving...' : '✅ Save Student'}
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={handleReset}>
            🔄 Reset
          </button>
        </div>
      </form>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  );
}
