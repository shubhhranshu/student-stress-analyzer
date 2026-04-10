const express = require('express');
const cors = require('cors');
const path = require('path');

const studentsRouter = require('./routes/students');
const analysisRouter = require('./routes/analysis');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/students', studentsRouter);
app.use('/api/analysis', analysisRouter);

// ── Production: serve the React build ──────────────────────────────────────
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

// Catch-all: SPA routing — send index.html for any non-API route
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});
// ────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  Server running at http://localhost:${PORT}`);
});
