const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken'); // ADICIONEI

const app = express();
app.use(cors());
app.use(express.json());

// Em produção (Render/Railway), o HTTPS já é feito pelo proxy.
// Se quiser forçar redirect, ligue por env: FORCE_HTTPS=true
app.enable('trust proxy');
if (process.env.FORCE_HTTPS === 'true') {
  app.use((req, res, next) => {
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    if (isHttps) return next();
    const host = req.headers.host;
    return res.redirect(301, `https://${host}${req.originalUrl}`);
  });
}

// HSTS só quando HTTPS estiver sendo usado
app.use((req, res, next) => {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  if (isHttps) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Middlewares
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
  { id: 1, username: 'admin@empresa.com', password: 'admin123', role: 'ADMIN', name: 'Administrador', profiles: ['FUNCIONARIO','RH'] },
  { id: 2, username: 'rh@empresa.com', password: 'rh123', role: 'RH', name: 'Departamento RH', profiles: ['RH'] }
];

const pendingEmployees = [];
const employees = [];

// ========== ROTAS ==========

// Login RH/Admin (com senha)
app.post('/api/auth/login', (req, res) => {
  console.log('📥 POST /api/auth/login', req.body);
  const { username, password } = req.body || {};
  const norm = String(username || '').trim().toLowerCase();
  
  const user = users.find(u => 
    u.username === norm && 
    u.password === password && 
    (u.role === 'RH' || u.role === 'ADMIN')
  );
  
  if (!user) {
    console.log('❌ Credenciais inválidas');
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
  
  const token = jwt.sign(
    { id: user.id, role: user.role, username: user.username }, 
    JWT_SECRET, 
    { expiresIn: '8h' }
  );
  
  console.log('✅ Login RH/Admin OK:', user.username);
  return res.json({ 
    token, 
    user: { 
      id: user.id, 
      role: user.role, 
      username: user.username, 
      name: user.name, 
      profiles: user.profiles || [user.role] 
    } 
  });
});

// Login Funcionário (só e-mail, auto-cria)
app.post('/api/auth/employee-start', (req, res) => {
  console.log('📥 POST /api/auth/employee-start', req.body);
  const { email } = req.body || {};
  const norm = String(email || '').trim().toLowerCase();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!norm) {
    console.log('❌ Email vazio');
    return res.status(400).json({ message: 'Email é obrigatório' });
  }
  
  if (!re.test(norm)) {
    console.log('❌ Email inválido:', norm);
    return res.status(400).json({ message: 'Email inválido' });
  }

  let user = users.find(u => u.username === norm);
  
  if (!user) {
    user = { 
      id: users.length + 1, 
      username: norm, 
      password: null, 
      role: 'FUNCIONARIO', 
      name: '', 
      profiles: ['FUNCIONARIO'] 
    };
    users.push(user);
    console.log('✅ Novo funcionário criado:', norm);
  } else {
    console.log('✅ Funcionário existente:', norm);
  }
  
  const token = jwt.sign(
    { id: user.id, role: user.role, username: user.username }, 
    JWT_SECRET, 
    { expiresIn: '8h' }
  );
  
  return res.json({ 
    token, 
    user: { 
      id: user.id, 
      role: user.role, 
      username: user.username, 
      name: user.name || norm, 
      profiles: user.profiles || [user.role] 
    } 
  });
});

// Funcionário envia dados (vai para pendentes)
app.post('/api/employee/self-data', authenticateToken, authorizeRole('FUNCIONARIO','ADMIN'), (req, res) => {
  console.log('📥 POST /api/employee/self-data', req.body);
  const { name, email, cpf } = req.body || {};
  
  if (!name || !email || !cpf) {
    return res.status(400).json({ message: 'Nome, Email e CPF são obrigatórios' });
  }
  
  const cpfClean = String(cpf).replace(/\D/g, '');
  if (cpfClean.length !== 11) {
    return res.status(400).json({ message: 'CPF inválido' });
  }
  
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return res.status(400).json({ message: 'Email inválido' });
  }
  
  const id = pendingEmployees.length + employees.length + 1;
  const payload = { 
    id, 
    userId: req.user.id,
    ...req.body,
    cpf: cpfClean,
    // Garantir campos de trabalho
    salary: req.body.salario || req.body.salary || '',
    position: req.body.cargo || req.body.position || '',
    admissionDate: req.body.dataAdmissao || req.body.admissionDate || '',
    corporateEmail: req.body.corporateEmail || '',
    status: 'PENDENTE',
    createdAt: new Date().toISOString()
  };
  
  pendingEmployees.push(payload);
  console.log('✅ Funcionário adicionado aos pendentes:', payload);
  return res.status(201).json(payload);
});

// RH lista pendentes
app.get('/api/rh/pending-employees', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  console.log('📥 GET /api/rh/pending-employees');
  return res.json(pendingEmployees);
});

// RH aprova pendente -> move para aprovados
app.post('/api/rh/approve-employee/:id', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  console.log('📥 POST /api/rh/approve-employee/:id', req.params.id);
  const id = Number(req.params.id);
  const idx = pendingEmployees.findIndex(e => e.id === id);
  
  if (idx === -1) {
    return res.status(404).json({ message: 'Funcionário não encontrado' });
  }
  
  const approved = { 
    ...pendingEmployees[idx], 
    status: 'APROVADO',
    approvedAt: new Date().toISOString(),
    // Garantir campos de trabalho existem
    salary: pendingEmployees[idx].salary || pendingEmployees[idx].salario || '',
    position: pendingEmployees[idx].position || pendingEmployees[idx].cargo || '',
    admissionDate: pendingEmployees[idx].admissionDate || pendingEmployees[idx].dataAdmissao || '',
    corporateEmail: pendingEmployees[idx].corporateEmail || ''
  };
  
  pendingEmployees.splice(idx, 1);
  employees.push(approved);
  
  console.log('✅ Funcionário aprovado:', approved);
  return res.json({ 
    message: 'Funcionário aprovado com sucesso', 
    employee: approved 
  });
});

// Lista de aprovados (aba Funcionários)
app.get('/api/employees', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  console.log('📥 GET /api/employees');
  return res.json(employees);
});

// Editar funcionário aprovado (rota existente - PUT completo)
app.put('/api/employees/:id', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  console.log('📥 PUT /api/employees/:id', req.params.id, req.body);
  const id = Number(req.params.id);
  const idx = employees.findIndex(e => e.id === id);
  
  if (idx === -1) {
    return res.status(404).json({ message: 'Funcionário não encontrado' });
  }
  
  employees[idx] = { 
    ...employees[idx], 
    ...req.body, 
    id,
    updatedAt: new Date().toISOString() 
  };
  
  console.log('✅ Funcionário editado:', employees[idx]);
  return res.json({ message: 'Funcionário editado com sucesso', employee: employees[idx] });
});

// NOVA ROTA: Atualizar apenas dados trabalhistas (cargo, salário, email corporativo)
app.patch('/api/employees/:id/employment-data', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  console.log('📥 PATCH /api/employees/:id/employment-data', req.params.id, req.body);
  const id = Number(req.params.id);
  const { salary, position, corporateEmail, admissionDate } = req.body || {};
  const idx = employees.findIndex(e => e.id === id);
  
  if (idx === -1) {
    console.log('❌ Funcionário não encontrado, ID:', id);
    return res.status(404).json({ message: 'Funcionário não encontrado' });
  }
  
  // Atualizar apenas campos fornecidos
  if (salary !== undefined) employees[idx].salary = salary;
  if (position !== undefined) employees[idx].position = position;
  if (corporateEmail !== undefined) employees[idx].corporateEmail = corporateEmail;
  if (admissionDate !== undefined) employees[idx].admissionDate = admissionDate;
  
  employees[idx].updatedAt = new Date().toISOString();
  
  console.log('✅ Dados trabalhistas atualizados:', employees[idx].name, '- Cargo:', position, '- Salário:', salary);
  return res.json({ message: 'Dados atualizados com sucesso', employee: employees[idx] });
});

// Deletar funcionário aprovado
app.delete('/api/employees/:id', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  console.log('📥 DELETE /api/employees/:id', req.params.id);
  const id = Number(req.params.id);
  const idx = employees.findIndex(e => e.id === id);
  
  if (idx === -1) {
    console.log('❌ Funcionário não encontrado, ID:', id);
    return res.status(404).json({ message: 'Funcionário não encontrado' });
  }
  
  const deleted = employees.splice(idx, 1)[0];
  console.log('✅ Funcionário deletado:', deleted.name, '- ID:', deleted.id);
  return res.json({ message: 'Funcionário deletado com sucesso', employee: deleted });
});

// Vincular contrato (URL ou upload base64)
app.post('/api/employees/:id/contract', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  console.log('📥 POST /api/employees/:id/contract', req.params.id);
  const id = Number(req.params.id);
  const { contractUrl, contractFile, contractFileName } = req.body || {};
  const idx = employees.findIndex(e => e.id === id);
  
  if (idx === -1) {
    return res.status(404).json({ message: 'Funcionário não encontrado' });
  }
  
  // Validar se tem URL ou arquivo
  if (!contractUrl && !contractFile) {
    return res.status(400).json({ message: 'Forneça URL ou arquivo do contrato' });
  }
  
  employees[idx] = {
    ...employees[idx],
    contractUrl: contractUrl || '',
    contractFile: contractFile || '', // base64
    contractFileName: contractFileName || 'contrato.pdf',
    contractUploadedAt: new Date().toISOString()
  };
  
  console.log('✅ Contrato vinculado:', employees[idx].name, contractFileName ? `(Arquivo: ${contractFileName})` : '(URL)');
  return res.json({ message: 'Contrato vinculado com sucesso', employee: employees[idx] });
});

// Download de contrato (se for base64)
app.get('/api/employees/:id/contract/download', authenticateToken, authorizeRole('RH','ADMIN','FUNCIONARIO'), (req, res) => {
  const id = Number(req.params.id);
  const emp = employees.find(e => e.id === id);
  
  if (!emp) {
    return res.status(404).json({ message: 'Funcionário não encontrado' });
  }
  
  if (!emp.contractFile) {
    return res.status(404).json({ message: 'Contrato não encontrado' });
  }
  
  // Converter base64 para buffer
  const buffer = Buffer.from(emp.contractFile.split(',')[1], 'base64');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${emp.contractFileName || 'contrato.pdf'}"`);
  res.send(buffer);
});

// Atualizar dados do funcionário (salário, cargo, email corporativo)
app.patch('/api/employees/:id/employment-data', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  console.log('📥 PATCH /api/employees/:id/employment-data', req.params.id);
  const id = Number(req.params.id);
  const { salary, position, corporateEmail, admissionDate } = req.body || {};
  const idx = employees.findIndex(e => e.id === id);
  
  if (idx === -1) {
    return res.status(404).json({ message: 'Funcionário não encontrado' });
  }
  
  employees[idx] = {
    ...employees[idx],
    salary: salary || employees[idx].salary || '',
    position: position || employees[idx].position || '',
    corporateEmail: corporateEmail || employees[idx].corporateEmail || '',
    admissionDate: admissionDate || employees[idx].admissionDate || '',
    updatedAt: new Date().toISOString()
  };
  
  console.log('✅ Dados trabalhistas atualizados:', employees[idx].name);
  return res.json({ message: 'Dados atualizados', employee: employees[idx] });
});

// Calcular rescisão
app.post('/api/employees/:id/calculate-termination', authenticateToken, authorizeRole('RH','ADMIN'), (req, res) => {
  console.log('📥 POST /api/employees/:id/calculate-termination', req.params.id);
  const id = Number(req.params.id);
  const { terminationType, terminationDate, hasNotice, workedNotice } = req.body || {};
  const emp = employees.find(e => e.id === id);
  
  if (!emp) {
    return res.status(404).json({ message: 'Funcionário não encontrado' });
  }
  
  if (!emp.salary || !emp.admissionDate) {
    return res.status(400).json({ message: 'Funcionário sem salário ou data de admissão cadastrados' });
  }
  
  const salary = parseFloat(emp.salary);
  const admission = new Date(emp.admissionDate);
  const termination = terminationDate ? new Date(terminationDate) : new Date();
  
  // Calcular tempo de trabalho
  const diffTime = Math.abs(termination - admission);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = diffDays / 30;
  const years = Math.floor(diffMonths / 12);
  const months = Math.floor(diffMonths % 12);
  
  // Cálculos base
  const salarioProporcional = (salary / 30) * (diffDays % 30);
  const decimoTerceiroProp = (salary / 12) * (diffMonths % 12);
  const feriasProporcionais = ((salary + salary / 3) / 12) * (diffMonths % 12);
  const feriasVencidas = (years > 0) ? (salary + salary / 3) * years : 0;
  const avisoPrevoIndenizado = hasNotice && !workedNotice ? salary : 0;
  const multaFGTS = terminationType === 'SEM_JUSTA_CAUSA' ? (salary * diffMonths * 0.08 * 0.4) : 0;
  const saldoFGTS = salary * diffMonths * 0.08;
  
  const calculation = {
    employeeId: id,
    employeeName: emp.name, // <-- correção
    workedMonths: diffMonths.toFixed(0),
    years,
    months,
    salary: salary.toFixed(2),
    proportionalSalary: salarioProporcional.toFixed(2),
    thirteenthSalary: decimoTerceiroProp.toFixed(2),
    vacationPay: feriasProporcionais.toFixed(2),
    overdueVacation: feriasVencidas.toFixed(2),
    noticePay: avisoPrevoIndenizado.toFixed(2),
    fgtsFine: multaFGTS.toFixed(2),
    fgtsBalance: saldoFGTS.toFixed(2),
    total: (
      salarioProporcional + 
      decimoTerceiroProp + 
      feriasProporcionais + 
      feriasVencidas + 
      avisoPrevoIndenizado + 
      multaFGTS + 
      saldoFGTS
    ).toFixed(2),
    calculatedAt: new Date().toISOString()
  };
  
  console.log('✅ Rescisão calculada:', emp.name, '- Total:', calculation.total);
  return res.json(calculation);
});

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Servir o build do React (same-origin)
const staticDir = path.join(__dirname, 'app-juridico/react-frontend/build');
if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Not found' });
    return res.sendFile(path.join(staticDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API+WEB online na porta ${PORT}`);
});