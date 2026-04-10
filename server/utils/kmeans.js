/**
 * K-Means Clustering Utility
 * Features used: sleep_hours, study_hours, screen_time,
 *                physical_activity, social_support,
 *                financial_stress, academic_pressure
 */

const FEATURE_KEYS = [
  'sleep_hours',
  'study_hours',
  'screen_time',
  'physical_activity',
  'social_support',
  'financial_stress',
  'academic_pressure',
];

function minMaxNormalize(students) {
  const mins = {};
  const maxs = {};

  FEATURE_KEYS.forEach((key) => {
    const vals = students.map((s) => Number(s[key]) || 0);
    mins[key] = Math.min(...vals);
    maxs[key] = Math.max(...vals);
  });

  return students.map((s) => {
    const normalized = {};
    FEATURE_KEYS.forEach((key) => {
      const range = maxs[key] - mins[key];
      normalized[key] = range === 0 ? 0 : (Number(s[key]) - mins[key]) / range;
    });
    return { ...normalized, _id: s.id };
  });
}

function distance(a, b) {
  return Math.sqrt(
    FEATURE_KEYS.reduce((sum, key) => sum + Math.pow((a[key] || 0) - (b[key] || 0), 2), 0)
  );
}

function assignClusters(points, centroids) {
  return points.map((p) => {
    let minDist = Infinity;
    let cluster = 0;
    centroids.forEach((c, i) => {
      const d = distance(p, c);
      if (d < minDist) {
        minDist = d;
        cluster = i;
      }
    });
    return cluster;
  });
}

function recalcCentroids(points, assignments, k) {
  return Array.from({ length: k }, (_, i) => {
    const members = points.filter((_, idx) => assignments[idx] === i);
    if (members.length === 0) return points[Math.floor(Math.random() * points.length)];
    const centroid = {};
    FEATURE_KEYS.forEach((key) => {
      centroid[key] = members.reduce((s, p) => s + p[key], 0) / members.length;
    });
    return centroid;
  });
}

function stressScore(centroid) {
  // Higher academic_pressure, financial_stress, screen_time → more stress
  // Higher sleep, social_support, physical_activity → less stress
  return (
    centroid.academic_pressure +
    centroid.financial_stress +
    centroid.screen_time -
    centroid.sleep_hours -
    centroid.social_support -
    centroid.physical_activity
  );
}

function labelClusters(centroids) {
  const scored = centroids.map((c, i) => ({ i, score: stressScore(c) }));
  scored.sort((a, b) => a.score - b.score);
  const labels = {};
  const labelNames = ['Low Stress', 'Moderate Stress', 'High Stress'];
  scored.forEach((s, rank) => {
    labels[s.i] = labelNames[rank] || `Cluster ${s.i}`;
  });
  return labels;
}

function kmeans(students, k = 3, maxIter = 100) {
  if (students.length < k) {
    return students.map((s) => ({ ...s, cluster: 0, clusterLabel: 'Insufficient Data' }));
  }

  const normalized = minMaxNormalize(students);

  // Initialize centroids randomly
  const shuffled = [...normalized].sort(() => Math.random() - 0.5);
  let centroids = shuffled.slice(0, k).map((p) => {
    const c = {};
    FEATURE_KEYS.forEach((key) => (c[key] = p[key]));
    return c;
  });

  let assignments = new Array(normalized.length).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    const newAssignments = assignClusters(normalized, centroids);
    const changed = newAssignments.some((a, i) => a !== assignments[i]);
    assignments = newAssignments;
    if (!changed) break;
    centroids = recalcCentroids(normalized, assignments, k);
  }

  const clusterLabels = labelClusters(centroids);

  return students.map((s, i) => ({
    ...s,
    cluster: assignments[i],
    clusterLabel: clusterLabels[assignments[i]],
  }));
}

module.exports = { kmeans, FEATURE_KEYS };
