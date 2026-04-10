export function clusterBadgeClass(label) {
  if (!label) return 'badge-info';
  const l = label.toLowerCase();
  if (l.includes('low')) return 'badge-low';
  if (l.includes('moderate')) return 'badge-moderate';
  if (l.includes('high')) return 'badge-high';
  return 'badge-info';
}

export function clusterColor(label) {
  if (!label) return '#8b5cf6';
  const l = label.toLowerCase();
  if (l.includes('low')) return '#34d399';
  if (l.includes('moderate')) return '#fbbf24';
  if (l.includes('high')) return '#f87171';
  return '#8b5cf6';
}

export const FEATURE_LABELS = {
  sleep_hours: 'Sleep',
  study_hours: 'Study',
  screen_time: 'Screen',
  physical_activity: 'Exercise',
  social_support: 'Social',
  financial_stress: 'Financial',
  academic_pressure: 'Academic',
};
