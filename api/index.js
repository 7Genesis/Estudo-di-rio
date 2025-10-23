const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-123';

// Helpers
const authenticateToken = (req, res, next) => {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

const authorizeRole = (...roles) => (req, res, next) => {
  if (req.user?.role === 'ADMIN') return next();
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  next();
};

// Dados em memória
const users = [
  { id: 1, username: 'admin@empresa.com', password: 'admin123', role: 'ADMIN', name: 'Admin', profiles: ['FUNCIONARIO','RH'] },
  { id: 2, username: 'rh@empresa.com', password: 'rh123', role: 'RH', name: 'RH', profiles: ['RH'] }
];
const pendingEmployees = [];
const employees = [];

// Rotas
app.get('/', (req, res) => res.send('Hub Evoluti 360° Online'));
app.get('/api', (req, res) => res.json({ message: 'API Online', version: '1.0' }));
app.get('/api/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users.find(u => u.username === username && u.password === password && ['RH','ADMIN'].includes(u.role));
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });
  const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
  return res.json({ token, user: { id: user.id, role: user.role, username: user.username, name: user.name, profiles: user.profiles } });
});

app.post('/api/auth/employee-start', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: 'Email obrigatório' });
  let user = users.find(u => u.username === email);
  if (!user) {
    user = { id: users.length + 1, username: email, password: null, role: 'FUNCIONARIO', name: '', profiles: ['FUNCIONARIO'] };
    users.push(user);
  }
  const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
  return res.json({ token, user: { id: user.id, role: user.role, username: user.username, name: user.name, profiles: user.profiles } });
});

app.post('/api/employees/submit', authenticateToken, (req, res) => {
  const data = req.body;
  const newEmp = { id: pendingEmployees.length + 1, ...data, status: 'PENDING', submittedAt: new Date().toISOString(), submittedBy: req.user.username };
  pendingEmployees.push(newEmp);
  return res.json({ message: 'Ficha enviada', employee: newEmp });
});

app.get('/api/employees/pending', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  return res.json(pendingEmployees.filter(e => e.status === 'PENDING'));
});

app.patch('/api/employees/pending/:id/approve', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  const id = Number(req.params.id);
  const idx = pendingEmployees.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Não encontrado' });
  pendingEmployees[idx].status = 'APPROVED';
  pendingEmployees[idx].approvedAt = new Date().toISOString();
  pendingEmployees[idx].approvedBy = req.user.username;
  const approved = { ...pendingEmployees[idx], id: employees.length + 1 };
  employees.push(approved);
  return res.json({ message: 'Aprovado', employee: approved });
});

app.get('/api/employees', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  return res.json(employees);
});

app.delete('/api/employees/:id', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  const id = Number(req.params.id);
  const idx = employees.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Não encontrado' });
  employees.splice(idx, 1);
  return res.json({ message: 'Removido' });
});

app.post('/api/marketing/leads', (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Nome e email válidos obrigatórios' });
  }
  // Em produção, salvar no DB
  res.status(201).json({ message: 'Lead recebido' });
});

module.exports = app;
