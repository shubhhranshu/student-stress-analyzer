const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { kmeans, FEATURE_KEYS } = require('../utils/kmeans');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/students.json');

function readStudents() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
}

function writeStudents(students) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
}

// GET /api/analysis/clusters
router.get('/clusters', (req, res) => {
  const students = readStudents();
  if (students.length === 0) return res.json({ students: [], centroids: [], labels: {} });

  const k = Math.min(3, students.length);
  const result = kmeans(students, k);

  // Build centroid averages per cluster label
  const labelGroups = {};
  result.forEach((s) => {
    if (!labelGroups[s.clusterLabel]) labelGroups[s.clusterLabel] = [];
    labelGroups[s.clusterLabel].push(s);
  });

  const centroids = Object.entries(labelGroups).map(([label, members]) => {
    const centroid = { label };
    FEATURE_KEYS.forEach((key) => {
      centroid[key] = +(members.reduce((s, m) => s + Number(m[key]), 0) / members.length).toFixed(2);
    });
    centroid.count = members.length;
    return centroid;
  });

  res.json({ students: result, centroids });
});

// GET /api/analysis/stats
router.get('/stats', (req, res) => {
  const students = readStudents();
  if (students.length === 0) return res.json({ total: 0, avgStress: 0, clusterCounts: {} });

  const k = Math.min(3, students.length);
  const result = kmeans(students, k);

  const clusterCounts = {};
  result.forEach((s) => {
    clusterCounts[s.clusterLabel] = (clusterCounts[s.clusterLabel] || 0) + 1;
  });

  const avgStress =
    result.reduce((sum, s) => sum + Number(s.self_reported_stress), 0) / result.length;

  const avgFeatures = {};
  FEATURE_KEYS.forEach((key) => {
    avgFeatures[key] = +(result.reduce((s, m) => s + Number(m[key]), 0) / result.length).toFixed(2);
  });

  res.json({
    total: students.length,
    avgStress: +avgStress.toFixed(2),
    clusterCounts,
    avgFeatures,
  });
});

// GET /api/analysis/seed  — populate 50 sample students
router.get('/seed', (req, res) => {
  const departments = ['Computer Science', 'Mechanical Eng', 'Business', 'Medicine', 'Arts', 'Law'];
  const genders = ['Male', 'Female', 'Non-binary'];

  const students = Array.from({ length: 50 }, (_, i) => ({
    id: uuidv4(),
    name: `Student ${i + 1}`,
    age: Math.floor(Math.random() * 6) + 18,
    gender: genders[Math.floor(Math.random() * genders.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    semester: Math.floor(Math.random() * 8) + 1,
    cgpa: +(Math.random() * 4 + 6).toFixed(1),
    sleep_hours: +(Math.random() * 6 + 3).toFixed(1),
    study_hours: +(Math.random() * 8 + 2).toFixed(1),
    screen_time: +(Math.random() * 8 + 1).toFixed(1),
    physical_activity: +(Math.random() * 7 + 0).toFixed(1),
    social_support: +(Math.random() * 9 + 1).toFixed(1),
    financial_stress: +(Math.random() * 9 + 1).toFixed(1),
    academic_pressure: +(Math.random() * 9 + 1).toFixed(1),
    self_reported_stress: +(Math.random() * 9 + 1).toFixed(1),
    timestamp: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
  }));

  writeStudents(students);
  res.json({ success: true, count: students.length });
});

module.exports = router;
