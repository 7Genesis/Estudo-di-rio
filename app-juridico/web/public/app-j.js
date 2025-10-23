const express = require('express');
const app = express();
app.use(express.json());

let employees = [
  { id: 1, name: 'João', position: 'Analista', salary: 3500, status: 'Ativo' },
  { id: 2, name: 'Maria', position: 'Gerente', salary: 7500, status: 'Ativo' },
  { id: 3, name: 'Pedro', position: 'Estagiário', salary: 1500, status: 'Inativo' }
];

// Rota GET /api/dashboard
app.get('/api/dashboard', (req, res) => {
  const total = employees.length;
  const salaries = employees.map(e => e.salary);
  const media = salaries.reduce((a,b) => a+b, 0) / (total || 1);
  const max = Math.max(...salaries);
  const min = Math.min(...salaries);

  const byStatus = employees.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  const top = employees.slice().sort((a,b) => b.salary - a.salary).slice(0, 3);

  res.json({ total, media, max, min, byStatus, top });
});

// Rota GET /api/employees
app.get('/api/employees', (req, res) => {
  res.json(employees);
});

// Rota POST /api/employees
app.post('/api/employees', (req, res) => {
  const { name, position, salary, status } = req.body;
  if (!name || !position || !salary || !status) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }
  const id = employees.length ? (Math.max(...employees.map(e => e.id)) + 1) : 1;
  const newEmployee = { id, name, position, salary, status };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// Rota DELETE /api/employees/:id
app.delete('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex(e => e.id === id);
  if (index < 0) return res.status(404).json({ error: 'Funcionário não encontrado' });
  employees.splice(index, 1);
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));

module.exports = app;
