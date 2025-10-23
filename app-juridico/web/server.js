const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// Leads
const leads = [];
app.post('/api/marketing/leads', (req, res) => {
  const { name, email, phone = '', company = '', source = 'landing' } = req.body || {};
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
  if (!name || !emailOk) return res.status(400).json({ message: 'Nome e email válidos são obrigatórios' });
  const id = (leads.at(-1)?.id || 0) + 1;
  leads.push({ id, name, email, phone, company, source, createdAt: new Date().toISOString() });
  res.status(201).json({ message: 'Lead recebido', leadId: id });
});

// Debug
app.get('/api/__debug-build', (_req, res) => {
  const dir = path.join(__dirname, '../react-frontend/build');
  res.json({
    staticDir: dir,
    exists: fs.existsSync(dir),
    indexExists: fs.existsSync(path.join(dir, 'index.html')),
    env: { PORT: process.env.PORT }
  });
});

// 404 APIs
app.all('/api/*', (_req, res) => res.status(404).json({ message: 'Not found' }));

// Servir React
const staticDir = path.join(__dirname, '../react-frontend/build');
if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
}

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Not found' });
  const indexPath = path.join(staticDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(500).send('Build não encontrado. Rode: npm run build:fe');
  }
  return res.sendFile(indexPath);
});

// IMPORTANTE: usar a PORT do Railway ou 5000 local
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server online na porta ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});