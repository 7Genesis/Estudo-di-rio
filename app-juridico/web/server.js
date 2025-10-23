const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// Lead simples
const leads = [];
app.post('/api/marketing/leads', (req, res) => {
  const { name, email, phone, company, source = 'landing' } = req.body || {};
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
  if (!name || !emailOk) return res.status(400).json({ message: 'Nome e email válidos são obrigatórios' });
  const id = (leads.at(-1)?.id || 0) + 1;
  leads.push({ id, name, email, phone: phone || '', company: company || '', source, createdAt: new Date().toISOString() });
  res.status(201).json({ message: 'Lead recebido', leadId: id });
});

// Debug do build (ajuda em produção)
app.get('/api/__debug-build', (_req, res) => {
  const staticDir = path.join(__dirname, '../react-frontend/build');
  const exists = fs.existsSync(staticDir);
  const indexExists = fs.existsSync(path.join(staticDir, 'index.html'));
  res.json({ staticDir, exists, indexExists });
});

// Servir o React (depois das rotas /api)
const staticDir = path.join(__dirname, '../react-frontend/build');
if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
}
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Not found' });
  if (!fs.existsSync(path.join(staticDir, 'index.html'))) {
    return res.status(500).send('Build do frontend não encontrado.');
  }
  return res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Online: http://localhost:${PORT}`));