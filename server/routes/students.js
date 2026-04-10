const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/students.json');

function readStudents() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw || '[]');
}

function writeStudents(students) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
}

// GET /api/students
router.get('/', (req, res) => {
  const students = readStudents();
  res.json(students);
});

// POST /api/students
router.post('/', (req, res) => {
  const {
    name, age, gender, department, semester, cgpa,
    sleep_hours, study_hours, screen_time, physical_activity,
    social_support, financial_stress, academic_pressure, self_reported_stress,
  } = req.body;

  const student = {
    id: uuidv4(),
    name: name || 'Unknown',
    age: Number(age) || 20,
    gender: gender || 'Prefer not to say',
    department: department || 'General',
    semester: Number(semester) || 1,
    cgpa: Number(cgpa) || 7.0,
    sleep_hours: Number(sleep_hours) || 6,
    study_hours: Number(study_hours) || 5,
    screen_time: Number(screen_time) || 4,
    physical_activity: Number(physical_activity) || 3,
    social_support: Number(social_support) || 5,
    financial_stress: Number(financial_stress) || 5,
    academic_pressure: Number(academic_pressure) || 5,
    self_reported_stress: Number(self_reported_stress) || 5,
    timestamp: new Date().toISOString(),
  };

  const students = readStudents();
  students.push(student);
  writeStudents(students);
  res.status(201).json(student);
});

// DELETE /api/students/:id
router.delete('/:id', (req, res) => {
  let students = readStudents();
  const before = students.length;
  students = students.filter((s) => s.id !== req.params.id);
  if (students.length === before) return res.status(404).json({ error: 'Not found' });
  writeStudents(students);
  res.json({ success: true });
});

module.exports = router;
