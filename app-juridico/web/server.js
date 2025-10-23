const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// Captação de leads
const leads = []; // memória
app.post('/api/marketing/leads', (req, res) => {
  const { name, email, phone, company, source = 'landing' } = req.body || {};
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
  if (!name || !emailOk) return res.status(400).json({ message: 'Nome e email válidos são obrigatórios' });
  const id = (leads.at(-1)?.id || 0) + 1;
  leads.push({ id, name, email, phone: phone || '', company: company || '', source, createdAt: new Date().toISOString() });
  return res.status(201).json({ message: 'Lead recebido', leadId: id });
});

// Servir o build do React
const staticDir = path.join(__dirname, '../react-frontend/build');
app.use(express.static(staticDir));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Not found' });
  return res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Servindo site em http://localhost:${PORT}`));